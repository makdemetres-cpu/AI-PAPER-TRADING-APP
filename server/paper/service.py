import asyncio
import logging
from datetime import datetime, time, timedelta, timezone
from decimal import Decimal

from ..db import Database
from ..market.freshness import human_duration
from ..market.service import MarketService
from .engine import (
    HUNDRED,
    QTY_STEP,
    build_ledger,
    dec,
    fee_for,
    floor_qty,
    limit_fill_price,
    market_fill_price,
    market_reference,
    quantity_for_spend,
)
from .store import PaperStore

log = logging.getLogger(__name__)

MIN_ORDER_VALUE = Decimal(1)
MAX_PRICE_MOVE_PCT = Decimal(1)
FAR_LIMIT_PCT = Decimal(20)
CARRY_CLOSE_DAYS = 3


class TradeError(Exception):
    def __init__(self, message: str, status: int = 400, problems: list[str] | None = None):
        super().__init__(message)
        self.status = status
        self.problems = problems or []


def num(value: Decimal | None) -> float | None:
    return None if value is None else float(value)


def qty_text(value: Decimal) -> str:
    return format(value.quantize(QTY_STEP).normalize(), "f")


def money_text(value: Decimal, currency: str) -> str:
    symbol = "€" if currency == "EUR" else "$"
    return f"{symbol}{value:,.2f}"


def stamp(dt: datetime) -> str:
    """Fixed-width UTC timestamps, so comparing and sorting them as text is safe."""
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")


def parse_time(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


class PaperService:
    def __init__(self, db: Database, market: MarketService, clock=lambda: datetime.now(timezone.utc)):
        self.store = PaperStore(db)
        self.market = market
        self.clock = clock
        self.lock = asyncio.Lock()

    def _now(self) -> str:
        return stamp(self.clock())

    def _account(self) -> dict:
        account = self.store.active_account()
        if account is None:
            raise TradeError("You haven't started a practice account yet.", 404)
        return account

    @staticmethod
    def _account_view(account: dict) -> dict:
        return {
            "id": account["id"],
            "name": account["name"],
            "currency": account["currency"],
            "starting_cash": num(account["starting_cash"]),
            "fee_pct": num(account["fee_pct"]),
            "slippage_pct": num(account["slippage_pct"]),
            "created_at": account["created_at"],
        }

    def get_account(self) -> dict:
        account = self.store.active_account()
        return {"account": self._account_view(account) if account else None}

    def create_account(self, *, currency: str, starting_cash: Decimal, fee_pct: Decimal, slippage_pct: Decimal, reset: bool) -> dict:
        if self.store.active_account() and not reset:
            raise TradeError("You already have a practice account. Use Start over to replace it.", 409)
        account = self.store.create_account(
            name="Practice account", kind="manual", currency=currency, starting_cash=starting_cash,
            fee_pct=fee_pct, slippage_pct=slippage_pct, now=self._now(), close_previous=reset,
        )
        return self._account_view(account)

    def update_costs(self, fee_pct: Decimal, slippage_pct: Decimal) -> dict:
        account = self._account()
        self.store.update_costs(account["id"], fee_pct, slippage_pct)
        return self._account_view(self._account())

    def _reservations(self, account: dict) -> tuple[Decimal, dict[str, Decimal]]:
        cash = Decimal(0)
        qty: dict[str, Decimal] = {}
        for o in self.store.orders(account["id"], "open"):
            if o["side"] == "buy":
                cash += o["quantity"] * o["limit_price"] * (1 + account["fee_pct"] / HUNDRED)
            else:
                qty[o["symbol"]] = qty.get(o["symbol"], Decimal(0)) + o["quantity"]
        return cash, qty

    @staticmethod
    def _trade_problems(quote: dict) -> list[str]:
        problems = []
        if quote["price"] is None:
            problems.append(f"There's no price for {quote['symbol']} right now, so the app can't simulate a fair trade.")
        elif quote["freshness"]["status"] != "live":
            problems.append(
                f"The price is {quote['freshness']['label'].lower()}. {quote['freshness']['detail']} "
                "Paper trades need a live price so the practice is realistic."
            )
        if quote["cross_check"]["status"] == "disagree":
            problems.append("The exchanges disagree about the price right now. Wait until they match before trading.")
        return problems

    async def _build(self, req: dict) -> tuple[dict, dict]:
        account = self._account()
        currency = account["currency"]
        asset, _ = await self.market.asset(req["symbol"])
        symbol = asset.symbol
        quote = await self.market.quote_report(symbol, currency)
        problems = self._trade_problems(quote)
        warnings: list[str] = []

        preview: dict = {
            "symbol": symbol,
            "name": asset.name,
            "side": req["side"],
            "type": req["type"],
            "currency": currency,
            "quote": {
                "source": quote["source"],
                "freshness": quote["freshness"],
                "converted": quote["converted"],
                "fx": quote["fx"],
                "cross_check": quote["cross_check"]["status"],
            },
            "problems": problems,
            "warnings": warnings,
            "can_place": False,
        }
        if quote["price"] is None:
            return preview, {}

        p = quote["price"]
        last = dec(p["value"])
        bid = dec(p["bid"]) if p["bid"] else None
        ask = dec(p["ask"]) if p["ask"] else None
        fee_pct, slip = account["fee_pct"], account["slippage_pct"]
        side = req["side"]

        if req["type"] == "market":
            price, basis, market_price = market_fill_price(side, bid, ask, last, slip)
            fills_now = True
        else:
            limit = req["limit_price"]
            now_price = limit_fill_price(side, limit, bid, ask, last, slip)
            fills_now = now_price is not None
            price = now_price if fills_now else limit
            market_price, reference_basis = market_reference(side, bid, ask, last)
            basis = "limit, fills now" if fills_now else "your limit"
            gap = (limit / market_price - 1) * HUNDRED
            if not fills_now and abs(gap) >= FAR_LIMIT_PCT:
                warnings.append(
                    f"Your limit is {abs(gap):.0f}% {'below' if gap < 0 else 'above'} the current price. It may never fill."
                )

        if basis == "last trade" or (req["type"] == "limit" and reference_basis == "last trade"):
            warnings.append(f"{quote['source']['name']} gave no {'ask' if side == 'buy' else 'bid'}, so the last trade price is used.")
        if quote["converted"]:
            warnings.append("There's no euro market for this coin, so the price is converted from US dollars at the ECB rate.")

        if req.get("quantity") is not None:
            quantity = floor_qty(req["quantity"])
        elif side == "buy":
            quantity = quantity_for_spend(req["amount"], price, fee_pct)
        else:
            quantity = floor_qty(req["amount"] / price)

        ledger = build_ledger(account["starting_cash"], self.store.fill_objects(account["id"]))
        reserved_cash, reserved_qty = self._reservations(account)
        available_cash = ledger.cash - reserved_cash
        position = ledger.positions.get(symbol)
        holding = position.quantity if position else Decimal(0)
        available_qty = holding - reserved_qty.get(symbol, Decimal(0))

        gross = quantity * price
        fee = fee_for(gross, fee_pct)
        total = gross + fee if side == "buy" else gross - fee

        if quantity <= 0:
            problems.append(f"That's less than the smallest amount the app trades (0.00000001 {symbol}).")
        elif gross < MIN_ORDER_VALUE:
            problems.append(f"Orders must be worth at least {money_text(MIN_ORDER_VALUE, currency)}.")
        if side == "buy" and total > available_cash:
            problems.append(
                f"This costs {money_text(total, currency)} but you have {money_text(max(available_cash, Decimal(0)), currency)} available."
            )
        if side == "sell" and quantity > available_qty:
            held = f"You have {qty_text(max(available_qty, Decimal(0)))} {symbol} available to sell"
            if reserved_qty.get(symbol):
                held += f" ({qty_text(reserved_qty[symbol])} more is set aside for open sell orders)"
            problems.append(held + ".")

        if side == "buy":
            cash_after = available_cash - total
        else:
            cash_after = available_cash + total if fills_now else available_cash

        preview.update({
            "quantity": qty_text(quantity),
            "price": num(price),
            "price_basis": basis,
            "market_price": num(market_price),
            "limit_price": num(req.get("limit_price")),
            "fills_now": fills_now,
            "fee_pct": num(fee_pct),
            "slippage_pct": num(slip),
            "gross": num(gross),
            "fee": num(fee),
            "total": num(total),
            "cash_available": num(available_cash),
            "cash_after": num(cash_after),
            "holding": qty_text(holding),
            "holding_after": qty_text(holding + quantity if side == "buy" and fills_now else holding - quantity if fills_now else holding),
            "can_place": not problems,
        })
        fill = {
            "price": price,
            "fee": fee,
            "basis": basis,
            "market_price": market_price,
            "source": quote["source"]["id"],
            "pair": quote["source"]["pair"],
            "observed_at": quote["source"]["observed_at"],
            "converted": quote["converted"],
            "fx_rate": str(quote["fx"]["rate_usd_per_eur"]) if quote["fx"] else None,
            "fx_date": quote["fx"]["rate_date"] if quote["fx"] else None,
            "quantity": quantity,
            "account_id": account["id"],
        }
        return preview, fill

    async def preview(self, req: dict) -> dict:
        preview, _ = await self._build(req)
        return preview

    async def place(self, req: dict) -> dict:
        async with self.lock:
            preview, fill = await self._build(req)
            if not preview["can_place"]:
                raise TradeError("This order can't be placed.", 422, preview["problems"])
            expected = req.get("expected_price")
            if expected:
                moved = abs(dec(preview["price"]) / expected - 1) * HUNDRED
                if moved > MAX_PRICE_MOVE_PCT:
                    raise TradeError(
                        f"The price moved {moved:.1f}% since you reviewed this order. Review it again before placing it.",
                        409,
                    )
            order_id = self.store.insert_order(
                account_id=fill["account_id"],
                symbol=preview["symbol"],
                side=req["side"],
                type_=req["type"],
                quantity=fill["quantity"],
                limit_price=req.get("limit_price"),
                status="filled" if preview["fills_now"] else "open",
                why=req.get("why", "").strip(),
                now=self._now(),
                fill=fill if preview["fills_now"] else None,
            )
        return {"order_id": order_id, "status": "filled" if preview["fills_now"] else "open", "preview": preview}

    def cancel(self, order_id: int) -> None:
        account = self._account()
        if not self.store.cancel_order(account["id"], order_id, self._now()):
            raise TradeError("That order isn't open any more.", 404)

    async def check_limit_orders(self) -> int:
        open_orders = self.store.open_orders_all()
        if not open_orders:
            return 0
        filled = 0
        quotes: dict[tuple[str, str], dict] = {}
        async with self.lock:
            for order in open_orders:
                account = self.store.account_by_id(order["account_id"])
                key = (order["symbol"], account["currency"])
                if key not in quotes:
                    try:
                        quotes[key] = await self.market.quote_report(*key)
                    except Exception:
                        log.exception("Couldn't check limit order %s", order["id"])
                        continue
                quote = quotes[key]
                if self._trade_problems(quote):
                    continue
                p = quote["price"]
                bid = dec(p["bid"]) if p["bid"] else None
                ask = dec(p["ask"]) if p["ask"] else None
                last = dec(p["value"])
                price = limit_fill_price(order["side"], order["limit_price"], bid, ask, last, account["slippage_pct"])
                if price is None:
                    continue
                fee = fee_for(order["quantity"] * price, account["fee_pct"])
                fill = {
                    "price": price, "fee": fee, "basis": "limit",
                    "market_price": market_reference(order["side"], bid, ask, last)[0],
                    "source": quote["source"]["id"], "pair": quote["source"]["pair"],
                    "observed_at": quote["source"]["observed_at"], "converted": quote["converted"],
                    "fx_rate": str(quote["fx"]["rate_usd_per_eur"]) if quote["fx"] else None,
                    "fx_date": quote["fx"]["rate_date"] if quote["fx"] else None,
                }
                if self.store.fill_open_order(order, fill, self._now()):
                    filled += 1
        return filled

    async def portfolio(self) -> dict:
        account = self._account()
        currency = account["currency"]
        ledger = build_ledger(account["starting_cash"], self.store.fill_objects(account["id"]))
        reserved_cash, reserved_qty = self._reservations(account)
        held = [p for p in ledger.positions.values() if p.quantity > 0]
        quotes = await asyncio.gather(
            *(self.market.quote_report(p.symbol, currency) for p in held), return_exceptions=True
        )

        positions = []
        invested_value = Decimal(0)
        unpriced: list[str] = []
        for pos, quote in zip(held, quotes):
            entry = {
                "symbol": pos.symbol,
                "quantity": qty_text(pos.quantity),
                "reserved_quantity": qty_text(reserved_qty.get(pos.symbol, Decimal(0))),
                "avg_cost": num(pos.avg_cost),
                "cost_basis": num(pos.cost_basis),
                "realized": num(pos.realized),
                "name": pos.symbol,
                "price": None, "value": None, "unrealized": None, "unrealized_pct": None,
                "freshness": None, "source": None, "converted": False, "allocation_pct": None,
            }
            if isinstance(quote, dict):
                entry.update({"name": quote["name"], "freshness": quote["freshness"], "source": quote["source"],
                              "converted": quote["converted"]})
            if isinstance(quote, dict) and quote["price"]:
                price = dec(quote["price"]["value"])
                value = pos.quantity * price
                invested_value += value
                entry.update({
                    "price": num(price),
                    "value": num(value),
                    "unrealized": num(value - pos.cost_basis),
                    "unrealized_pct": num((value / pos.cost_basis - 1) * HUNDRED) if pos.cost_basis > 0 else None,
                })
            else:
                unpriced.append(pos.symbol)
            positions.append(entry)

        total = ledger.cash + invested_value
        for entry in positions:
            if entry["value"] is not None and total > 0:
                entry["allocation_pct"] = entry["value"] / float(total) * 100
        positions.sort(key=lambda e: e["value"] or 0, reverse=True)

        notices = []
        if unpriced:
            notices.append({
                "code": "unpriced", "level": "warning",
                "message": f"No price right now for {', '.join(unpriced)}, so the total leaves {'it' if len(unpriced) == 1 else 'them'} out.",
            })
        stale = [e["symbol"] for e in positions if e["freshness"] and e["freshness"]["status"] == "stale"]
        if stale:
            notices.append({
                "code": "stale", "level": "warning",
                "message": f"The price for {', '.join(stale)} is stale, so the total may be out of date.",
            })

        complete = not unpriced
        return {
            "account": self._account_view(account),
            "cash": num(ledger.cash),
            "cash_reserved": num(reserved_cash),
            "cash_available": num(ledger.cash - reserved_cash),
            "invested_value": num(invested_value),
            "total_value": num(total),
            "total_complete": complete,
            "profit": num(total - account["starting_cash"]) if complete else None,
            "profit_pct": num((total / account["starting_cash"] - 1) * HUNDRED) if complete else None,
            "realized": num(ledger.realized),
            "fees_paid": num(ledger.fees_paid),
            "positions": positions,
            "notices": notices,
            "checked_at": self._now(),
        }

    async def performance(self) -> dict:
        account = self._account()
        currency = account["currency"]
        start = account["starting_cash"]
        fills = self.store.fill_objects(account["id"])
        now = self.clock()
        created = parse_time(account["created_at"])
        points = [{"time": int(created.timestamp()), "value": num(start)}]
        notes: list[str] = []
        errors: list[dict] = []

        if not fills:
            points.append({"time": int(now.timestamp()), "value": num(start)})
            return {"currency": currency, "points": points, "sources": [], "notes": ["No trades yet, so the value hasn't changed."], "errors": []}

        symbols = sorted({f.symbol for f in fills})
        range_key = "1Y" if (now - created).days <= 360 else "5Y"
        reports = await asyncio.gather(
            *(self.market.candles_report(s, currency, range_key) for s in symbols), return_exceptions=True
        )
        closes: dict[str, dict[str, Decimal]] = {}
        sources = []
        for symbol, report in zip(symbols, reports):
            if not isinstance(report, dict) or not report["candles"]:
                notes.append(f"No daily prices for {symbol}, so days when you held it are left out.")
                closes[symbol] = {}
                continue
            errors.extend(report["errors"])
            closes[symbol] = {
                datetime.fromtimestamp(c["time"], tz=timezone.utc).date().isoformat(): dec(c["close"])
                for c in report["candles"]
            }
            sources.append({"symbol": symbol, "source": report["source"]["name"], "pair": report["source"]["pair"],
                            "converted": report["converted"]})

        def close_on(symbol: str, day) -> Decimal | None:
            for back in range(CARRY_CLOSE_DAYS + 1):
                value = closes[symbol].get((day - timedelta(days=back)).isoformat())
                if value is not None:
                    return value
            return None

        skipped = 0
        day = created.date()
        while day <= now.date():
            cutoff = min(datetime.combine(day + timedelta(days=1), time(0), tzinfo=timezone.utc), now)
            if cutoff > created:
                cutoff_iso = stamp(cutoff)
                ledger = build_ledger(start, [f for f in fills if f.filled_at < cutoff_iso])
                value = ledger.cash
                complete = True
                for pos in ledger.positions.values():
                    if pos.quantity <= 0:
                        continue
                    close = close_on(pos.symbol, day)
                    if close is None:
                        complete = False
                        break
                    value += pos.quantity * close
                if complete:
                    points.append({"time": int(cutoff.timestamp()), "value": num(value)})
                else:
                    skipped += 1
            day += timedelta(days=1)

        if skipped:
            notes.append(f"{skipped} day{'s' if skipped != 1 else ''} left out because a coin had no daily price.")
        notes.append(
            "Each point is your cash plus your coins at that day's closing price (days end at midnight UTC). "
            "Today's point uses the latest price."
        )
        return {"currency": currency, "points": points, "sources": sources, "notes": notes, "errors": errors}

    def _orders_with_fills(self, account: dict) -> list[dict]:
        fills = {f["order_id"]: f for f in self.store.fills(account["id"])}
        out = []
        for o in self.store.orders(account["id"]):
            f = fills.get(o["id"])
            out.append({
                "id": o["id"], "symbol": o["symbol"], "side": o["side"], "type": o["type"],
                "quantity": qty_text(o["quantity"]), "limit_price": num(o["limit_price"]), "status": o["status"],
                "created_at": o["created_at"], "updated_at": o["updated_at"],
                "why": o["why"], "review": o["review"], "reviewed_at": o["reviewed_at"],
                "fill": None if not f else {
                    "price": float(f["price"]), "fee": float(f["fee"]),
                    "gross": float(dec(f["quantity"]) * dec(f["price"])),
                    "filled_at": f["filled_at"], "price_basis": f["price_basis"],
                    "market_price": float(f["market_price"]), "source": f["source"], "pair": f["source_pair"],
                    "observed_at": f["observed_at"], "converted": bool(f["converted"]),
                    "fx_rate": f["fx_rate"], "fx_date": f["fx_date"],
                },
            })
        return out

    def orders(self) -> dict:
        account = self._account()
        return {"currency": account["currency"], "orders": self._orders_with_fills(account)}

    async def journal(self) -> dict:
        account = self._account()
        orders = self._orders_with_fills(account)
        symbols = sorted({o["symbol"] for o in orders if o["fill"]})
        quotes = await asyncio.gather(
            *(self.market.quote_report(s, account["currency"]) for s in symbols), return_exceptions=True
        )
        prices = {s: q for s, q in zip(symbols, quotes) if isinstance(q, dict) and q["price"]}
        now = self.clock()
        for o in orders:
            o["outcome"] = None
            q = prices.get(o["symbol"])
            if o["fill"] and q:
                current = q["price"]["value"]
                o["outcome"] = {
                    "current_price": current,
                    "change_pct": (current / o["fill"]["price"] - 1) * 100,
                    "since": human_duration((now - parse_time(o["fill"]["filled_at"])).total_seconds()),
                    "freshness": q["freshness"],
                }
        return {"currency": account["currency"], "entries": orders}

    def update_journal(self, order_id: int, why: str | None, review: str | None) -> None:
        account = self._account()
        if not self.store.update_journal(account["id"], order_id, why=why, review=review, now=self._now()):
            raise TradeError("That order doesn't exist.", 404)
