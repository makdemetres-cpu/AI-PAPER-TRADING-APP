from decimal import Decimal

from ..db import Database
from .engine import Fill, dec


def _account(row) -> dict | None:
    if row is None:
        return None
    return {
        "id": row["id"],
        "name": row["name"],
        "kind": row["kind"],
        "currency": row["currency"],
        "starting_cash": dec(row["starting_cash"]),
        "fee_pct": dec(row["fee_pct"]),
        "slippage_pct": dec(row["slippage_pct"]),
        "created_at": row["created_at"],
        "closed_at": row["closed_at"],
    }


def _order(row) -> dict:
    return {
        "id": row["id"],
        "account_id": row["account_id"],
        "symbol": row["symbol"],
        "side": row["side"],
        "type": row["type"],
        "quantity": dec(row["quantity"]),
        "limit_price": dec(row["limit_price"]) if row["limit_price"] is not None else None,
        "status": row["status"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "why": row["why"],
        "review": row["review"],
        "reviewed_at": row["reviewed_at"],
    }


class PaperStore:
    def __init__(self, db: Database):
        self.db = db

    def active_account(self, kind: str = "manual") -> dict | None:
        with self.db.lock:
            row = self.db.conn.execute(
                "SELECT * FROM paper_accounts WHERE kind = ? AND closed_at IS NULL ORDER BY id DESC LIMIT 1", (kind,)
            ).fetchone()
        return _account(row)

    def create_account(self, *, name: str, kind: str, currency: str, starting_cash: Decimal, fee_pct: Decimal,
                       slippage_pct: Decimal, now: str, close_previous: bool) -> dict:
        with self.db.lock, self.db.conn:
            if close_previous:
                self.db.conn.execute(
                    "UPDATE paper_accounts SET closed_at = ? WHERE kind = ? AND closed_at IS NULL", (now, kind)
                )
                self.db.conn.execute(
                    "UPDATE paper_orders SET status = 'cancelled', updated_at = ? "
                    "WHERE status = 'open' AND account_id IN (SELECT id FROM paper_accounts WHERE kind = ?)",
                    (now, kind),
                )
            cursor = self.db.conn.execute(
                "INSERT INTO paper_accounts (name, kind, currency, starting_cash, fee_pct, slippage_pct, created_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (name, kind, currency, str(starting_cash), str(fee_pct), str(slippage_pct), now),
            )
            row = self.db.conn.execute("SELECT * FROM paper_accounts WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return _account(row)

    def update_costs(self, account_id: int, fee_pct: Decimal, slippage_pct: Decimal) -> None:
        with self.db.lock, self.db.conn:
            self.db.conn.execute(
                "UPDATE paper_accounts SET fee_pct = ?, slippage_pct = ? WHERE id = ?",
                (str(fee_pct), str(slippage_pct), account_id),
            )

    def fills(self, account_id: int) -> list[dict]:
        with self.db.lock:
            rows = self.db.conn.execute(
                "SELECT * FROM paper_fills WHERE account_id = ? ORDER BY filled_at, id", (account_id,)
            ).fetchall()
        return [dict(r) for r in rows]

    def fill_objects(self, account_id: int) -> list[Fill]:
        return [
            Fill(r["order_id"], r["symbol"], r["side"], dec(r["quantity"]), dec(r["price"]), dec(r["fee"]), r["filled_at"])
            for r in self.fills(account_id)
        ]

    def orders(self, account_id: int, status: str | None = None) -> list[dict]:
        sql = "SELECT * FROM paper_orders WHERE account_id = ?"
        args: tuple = (account_id,)
        if status:
            sql += " AND status = ?"
            args += (status,)
        with self.db.lock:
            rows = self.db.conn.execute(sql + " ORDER BY created_at DESC, id DESC", args).fetchall()
        return [_order(r) for r in rows]

    def order(self, account_id: int, order_id: int) -> dict | None:
        with self.db.lock:
            row = self.db.conn.execute(
                "SELECT * FROM paper_orders WHERE id = ? AND account_id = ?", (order_id, account_id)
            ).fetchone()
        return _order(row) if row else None

    def insert_order(self, *, account_id: int, symbol: str, side: str, type_: str, quantity: Decimal,
                     limit_price: Decimal | None, status: str, why: str, now: str, fill: dict | None) -> int:
        with self.db.lock, self.db.conn:
            cursor = self.db.conn.execute(
                "INSERT INTO paper_orders (account_id, symbol, side, type, quantity, limit_price, status, "
                "created_at, updated_at, why) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (account_id, symbol, side, type_, str(quantity), None if limit_price is None else str(limit_price),
                 status, now, now, why),
            )
            order_id = cursor.lastrowid
            if fill:
                self._insert_fill(order_id, account_id, symbol, side, quantity, fill, now)
        return order_id

    def fill_open_order(self, order: dict, fill: dict, now: str) -> bool:
        with self.db.lock, self.db.conn:
            updated = self.db.conn.execute(
                "UPDATE paper_orders SET status = 'filled', updated_at = ? WHERE id = ? AND status = 'open'",
                (now, order["id"]),
            ).rowcount
            if not updated:
                return False
            self._insert_fill(order["id"], order["account_id"], order["symbol"], order["side"], order["quantity"], fill, now)
        return True

    def _insert_fill(self, order_id, account_id, symbol, side, quantity, fill: dict, now: str) -> None:
        self.db.conn.execute(
            "INSERT INTO paper_fills (order_id, account_id, symbol, side, quantity, price, fee, filled_at, price_basis, "
            "market_price, source, source_pair, observed_at, converted, fx_rate, fx_date) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (order_id, account_id, symbol, side, str(quantity), str(fill["price"]), str(fill["fee"]), now,
             fill["basis"], str(fill["market_price"]), fill["source"], fill["pair"], fill["observed_at"],
             1 if fill["converted"] else 0, fill["fx_rate"], fill["fx_date"]),
        )

    def cancel_order(self, account_id: int, order_id: int, now: str) -> bool:
        with self.db.lock, self.db.conn:
            return self.db.conn.execute(
                "UPDATE paper_orders SET status = 'cancelled', updated_at = ? "
                "WHERE id = ? AND account_id = ? AND status = 'open'",
                (now, order_id, account_id),
            ).rowcount > 0

    def update_journal(self, account_id: int, order_id: int, *, why: str | None, review: str | None, now: str) -> bool:
        sets, args = [], []
        if why is not None:
            sets.append("why = ?")
            args.append(why)
        if review is not None:
            sets += ["review = ?", "reviewed_at = ?"]
            args += [review, now]
        if not sets:
            return self.order(account_id, order_id) is not None
        with self.db.lock, self.db.conn:
            return self.db.conn.execute(
                f"UPDATE paper_orders SET {', '.join(sets)} WHERE id = ? AND account_id = ?",
                (*args, order_id, account_id),
            ).rowcount > 0

    def open_orders_all(self) -> list[dict]:
        with self.db.lock:
            rows = self.db.conn.execute(
                "SELECT o.* FROM paper_orders o JOIN paper_accounts a ON a.id = o.account_id "
                "WHERE o.status = 'open' AND a.closed_at IS NULL ORDER BY o.created_at, o.id"
            ).fetchall()
        return [_order(r) for r in rows]

    def account_by_id(self, account_id: int) -> dict | None:
        with self.db.lock:
            row = self.db.conn.execute("SELECT * FROM paper_accounts WHERE id = ?", (account_id,)).fetchone()
        return _account(row)
