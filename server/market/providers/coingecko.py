from datetime import datetime, timezone

import httpx

from .base import ProviderError, get_json, parse_iso, to_float

BASE_URL = "https://api.coingecko.com/api/v3"
SOURCE = "coingecko"


class CoinGeckoProvider:
    source = SOURCE

    def __init__(self, client: httpx.AsyncClient, api_key: str = "", clock=lambda: datetime.now(timezone.utc)):
        self.client = client
        self.clock = clock
        self.headers = {"x-cg-demo-api-key": api_key} if api_key else {}

    async def market(self, symbol: str, currency: str) -> dict:
        # include_tokens=top resolves a shared symbol to the coin with the largest market cap.
        data = await get_json(
            self.client,
            SOURCE,
            f"{BASE_URL}/coins/markets",
            params={"vs_currency": currency.lower(), "symbols": symbol.lower(), "include_tokens": "top"},
            headers=self.headers,
        )
        if not isinstance(data, list):
            raise ProviderError(SOURCE, "bad_data", "CoinGecko sent a reply we couldn't read.")
        if not data:
            raise ProviderError(SOURCE, "not_listed", f"CoinGecko has no data for {symbol.upper()}.")
        row = data[0]
        if not isinstance(row, dict) or not row.get("id"):
            raise ProviderError(SOURCE, "bad_data", "CoinGecko sent a reply we couldn't read.")
        return {
            "coingecko_id": str(row["id"]),
            "name": str(row.get("name") or ""),
            "symbol": str(row.get("symbol") or "").upper(),
            "rank": row.get("market_cap_rank") if isinstance(row.get("market_cap_rank"), int) else None,
            "price": to_float(row.get("current_price")),
            "market_cap": to_float(row.get("market_cap")),
            "fully_diluted_valuation": to_float(row.get("fully_diluted_valuation")),
            "circulating_supply": to_float(row.get("circulating_supply")),
            "total_supply": to_float(row.get("total_supply")),
            "max_supply": to_float(row.get("max_supply")),
            "ath": to_float(row.get("ath")),
            "ath_date": parse_iso(row.get("ath_date")),
            "last_updated": parse_iso(row.get("last_updated")),
            "fetched_at": self.clock(),
        }
