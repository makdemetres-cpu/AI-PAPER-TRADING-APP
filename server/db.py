import json
import sqlite3
import threading
from datetime import datetime, timezone
from pathlib import Path

MIGRATIONS = [
    """
    CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """,
    """
    CREATE TABLE watchlists (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    CREATE TABLE watchlist_items (
        watchlist_id INTEGER NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL,
        added_at TEXT NOT NULL,
        PRIMARY KEY (watchlist_id, symbol)
    );
    """,
    """
    CREATE TABLE paper_accounts (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        kind TEXT NOT NULL DEFAULT 'manual',
        currency TEXT NOT NULL,
        starting_cash TEXT NOT NULL,
        fee_pct TEXT NOT NULL,
        slippage_pct TEXT NOT NULL,
        created_at TEXT NOT NULL,
        closed_at TEXT
    );
    CREATE TABLE paper_orders (
        id INTEGER PRIMARY KEY,
        account_id INTEGER NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL,
        side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
        type TEXT NOT NULL CHECK (type IN ('market', 'limit')),
        quantity TEXT NOT NULL,
        limit_price TEXT,
        status TEXT NOT NULL CHECK (status IN ('open', 'filled', 'cancelled')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        why TEXT NOT NULL DEFAULT '',
        review TEXT NOT NULL DEFAULT '',
        reviewed_at TEXT
    );
    CREATE TABLE paper_fills (
        id INTEGER PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES paper_orders(id) ON DELETE CASCADE,
        account_id INTEGER NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL,
        side TEXT NOT NULL,
        quantity TEXT NOT NULL,
        price TEXT NOT NULL,
        fee TEXT NOT NULL,
        filled_at TEXT NOT NULL,
        price_basis TEXT NOT NULL,
        market_price TEXT NOT NULL,
        source TEXT NOT NULL,
        source_pair TEXT NOT NULL,
        observed_at TEXT,
        converted INTEGER NOT NULL DEFAULT 0,
        fx_rate TEXT,
        fx_date TEXT
    );
    CREATE INDEX paper_orders_account ON paper_orders(account_id, status);
    CREATE INDEX paper_fills_account ON paper_fills(account_id, filled_at);
    """,
]

DEFAULT_SETTINGS = {"currency": "USD"}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class Database:
    def __init__(self, path: Path | str):
        if str(path) != ":memory:":
            Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(str(path), check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.lock = threading.Lock()
        self._migrate()

    def _migrate(self) -> None:
        with self.lock, self.conn:
            version = self.conn.execute("PRAGMA user_version").fetchone()[0]
            for index, sql in enumerate(MIGRATIONS[version:], start=version + 1):
                self.conn.executescript(sql)
                self.conn.execute(f"PRAGMA user_version = {index}")

    def get_settings(self) -> dict:
        with self.lock:
            rows = self.conn.execute("SELECT key, value FROM settings").fetchall()
        stored = {row["key"]: json.loads(row["value"]) for row in rows}
        return {**DEFAULT_SETTINGS, **stored}

    def update_settings(self, values: dict) -> dict:
        with self.lock, self.conn:
            for key, value in values.items():
                self.conn.execute(
                    "INSERT INTO settings (key, value) VALUES (?, ?) "
                    "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                    (key, json.dumps(value)),
                )
        return self.get_settings()

    def list_watchlists(self) -> list[dict]:
        with self.lock:
            lists = self.conn.execute("SELECT id, name, created_at FROM watchlists ORDER BY id").fetchall()
            items = self.conn.execute(
                "SELECT watchlist_id, symbol, added_at FROM watchlist_items ORDER BY added_at, symbol"
            ).fetchall()
        by_list: dict[int, list[dict]] = {}
        for row in items:
            by_list.setdefault(row["watchlist_id"], []).append({"symbol": row["symbol"], "added_at": row["added_at"]})
        return [{**dict(row), "items": by_list.get(row["id"], [])} for row in lists]

    def get_watchlist(self, watchlist_id: int) -> dict | None:
        return next((w for w in self.list_watchlists() if w["id"] == watchlist_id), None)

    def create_watchlist(self, name: str) -> dict:
        with self.lock, self.conn:
            cursor = self.conn.execute("INSERT INTO watchlists (name, created_at) VALUES (?, ?)", (name, _now()))
        return self.get_watchlist(cursor.lastrowid)

    def rename_watchlist(self, watchlist_id: int, name: str) -> dict | None:
        with self.lock, self.conn:
            self.conn.execute("UPDATE watchlists SET name = ? WHERE id = ?", (name, watchlist_id))
        return self.get_watchlist(watchlist_id)

    def delete_watchlist(self, watchlist_id: int) -> bool:
        with self.lock, self.conn:
            return self.conn.execute("DELETE FROM watchlists WHERE id = ?", (watchlist_id,)).rowcount > 0

    def add_watchlist_item(self, watchlist_id: int, symbol: str) -> dict | None:
        with self.lock, self.conn:
            self.conn.execute(
                "INSERT OR IGNORE INTO watchlist_items (watchlist_id, symbol, added_at) VALUES (?, ?, ?)",
                (watchlist_id, symbol, _now()),
            )
        return self.get_watchlist(watchlist_id)

    def remove_watchlist_item(self, watchlist_id: int, symbol: str) -> dict | None:
        with self.lock, self.conn:
            self.conn.execute(
                "DELETE FROM watchlist_items WHERE watchlist_id = ? AND symbol = ?", (watchlist_id, symbol)
            )
        return self.get_watchlist(watchlist_id)

    def close(self) -> None:
        self.conn.close()
