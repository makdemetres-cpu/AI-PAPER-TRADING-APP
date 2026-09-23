"""Pure paper-trading math. Money and quantities are Decimals; nothing here touches the network or the database."""

from dataclasses import dataclass, field
from decimal import ROUND_DOWN, Decimal, InvalidOperation

QTY_STEP = Decimal("0.00000001")
HUNDRED = Decimal(100)


def dec(value) -> Decimal:
    try:
        result = Decimal(str(value))
    except (InvalidOperation, ValueError) as exc:
        raise ValueError(f"Not a number: {value!r}") from exc
    if not result.is_finite():
        raise ValueError(f"Not a finite number: {value!r}")
    return result


def floor_qty(value: Decimal) -> Decimal:
    return value.quantize(QTY_STEP, rounding=ROUND_DOWN)


@dataclass(frozen=True)
class Fill:
    order_id: int
    symbol: str
    side: str
    quantity: Decimal
    price: Decimal
    fee: Decimal
    filled_at: str

    @property
    def gross(self) -> Decimal:
        return self.quantity * self.price


@dataclass
class Position:
    symbol: str
    quantity: Decimal = Decimal(0)
    cost_basis: Decimal = Decimal(0)
    realized: Decimal = Decimal(0)

    @property
    def avg_cost(self) -> Decimal | None:
        return self.cost_basis / self.quantity if self.quantity > 0 else None


@dataclass
class Ledger:
    cash: Decimal
    positions: dict[str, Position] = field(default_factory=dict)
    fees_paid: Decimal = Decimal(0)

    @property
    def realized(self) -> Decimal:
        return sum((p.realized for p in self.positions.values()), Decimal(0))


def build_ledger(starting_cash: Decimal, fills: list[Fill]) -> Ledger:
    """Replays fills in order. Cost basis uses the average-cost method and includes buy fees."""
    ledger = Ledger(cash=starting_cash)
    for f in fills:
        pos = ledger.positions.setdefault(f.symbol, Position(f.symbol))
        ledger.fees_paid += f.fee
        if f.side == "buy":
            ledger.cash -= f.gross + f.fee
            pos.quantity += f.quantity
            pos.cost_basis += f.gross + f.fee
        else:
            avg = pos.avg_cost or Decimal(0)
            ledger.cash += f.gross - f.fee
            pos.realized += f.gross - f.fee - avg * f.quantity
            pos.cost_basis -= avg * f.quantity
            pos.quantity -= f.quantity
            if pos.quantity <= 0:
                pos.quantity = Decimal(0)
                pos.cost_basis = Decimal(0)
    return ledger


def market_reference(side: str, bid: Decimal | None, ask: Decimal | None, last: Decimal) -> tuple[Decimal, str]:
    """Buys look at the ask and sells at the bid; the last trade stands in when the exchange gave none."""
    if side == "buy":
        return (ask, "ask") if ask and ask > 0 else (last, "last trade")
    return (bid, "bid") if bid and bid > 0 else (last, "last trade")


def market_fill_price(side: str, bid: Decimal | None, ask: Decimal | None, last: Decimal, slippage_pct: Decimal) -> tuple[Decimal, str, Decimal]:
    """Returns (fill price, basis, reference price). Slippage always moves the price against you."""
    reference, basis = market_reference(side, bid, ask, last)
    slip = slippage_pct / HUNDRED
    return reference * (1 + slip if side == "buy" else 1 - slip), basis, reference


def limit_fill_price(side: str, limit: Decimal, bid: Decimal | None, ask: Decimal | None, last: Decimal, slippage_pct: Decimal) -> Decimal | None:
    """Returns the fill price if the limit can fill now, else None. A limit never fills worse than its limit."""
    price, _, reference = market_fill_price(side, bid, ask, last, slippage_pct)
    if side == "buy":
        return min(price, limit) if reference <= limit else None
    return max(price, limit) if reference >= limit else None


def fee_for(gross: Decimal, fee_pct: Decimal) -> Decimal:
    return gross * fee_pct / HUNDRED


def quantity_for_spend(amount: Decimal, price: Decimal, fee_pct: Decimal) -> Decimal:
    """How much you can buy when `amount` must cover both the coins and the fee."""
    return floor_qty(amount / (price * (1 + fee_pct / HUNDRED)))
