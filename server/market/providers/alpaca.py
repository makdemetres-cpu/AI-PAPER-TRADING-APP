import html
import re
from datetime import datetime, timezone
from urllib.parse import urlparse

import httpx

from ..models import Quote
from .base import ProviderError, get_json, parse_iso, to_float

# Market data only. The app has no code path to Alpaca's trading hosts, and
# server/http.py refuses them even if one were added by mistake.
DATA_URL = "https://data.alpaca.markets/v1beta3/crypto/us"
NEWS_URL = "https://data.alpaca.markets/v1beta1/news"
SOURCE = "alpaca"
TAG_RE = re.compile(r"<[^>]+>")


def plain_text(value) -> str:
    return " ".join(TAG_RE.sub(" ", html.unescape(str(value or ""))).split())


class AlpacaProvider:
    source = SOURCE

    def __init__(self, client: httpx.AsyncClient, key_id: str = "", secret: str = "", clock=lambda: datetime.now(timezone.utc)):
        self.client = client
        self.clock = clock
        self.headers = {"APCA-API-KEY-ID": key_id, "APCA-API-SECRET-KEY": secret} if key_id and secret else {}

    @property
    def has_key(self) -> bool:
        return bool(self.headers)

    async def quote(self, base: str, currency: str, pair: str) -> Quote:
        data = await get_json(
            self.client, SOURCE, f"{DATA_URL}/latest/trades", params={"symbols": pair}, headers=self.headers
        )
        trade = ((data or {}).get("trades") or {}).get(pair)
        if not trade:
            raise ProviderError(SOURCE, "not_listed", "Alpaca doesn't have this market.")
        return Quote(
            base=base,
            currency=currency,
            price=to_float(trade.get("p")),
            source=SOURCE,
            fetched_at=self.clock(),
            observed_at=parse_iso(trade.get("t")),
            pair=pair,
        )

    async def news(self, symbol: str, limit: int = 12) -> list[dict]:
        if not self.has_key:
            raise ProviderError(SOURCE, "auth", "News needs a free Alpaca paper-account key in the .env file.")
        data = await get_json(
            self.client,
            SOURCE,
            NEWS_URL,
            params={"symbols": f"{symbol}USD", "limit": limit, "sort": "desc", "include_content": "false"},
            headers=self.headers,
        )
        items = (data or {}).get("news")
        if not isinstance(items, list):
            raise ProviderError(SOURCE, "bad_data", "Alpaca sent news we couldn't read.")
        out = []
        for item in items:
            if not isinstance(item, dict):
                continue
            url = str(item.get("url") or "")
            published = parse_iso(item.get("created_at"))
            headline = plain_text(item.get("headline"))
            if not headline or published is None or urlparse(url).scheme not in ("http", "https"):
                continue
            out.append({
                "id": str(item.get("id", "")),
                "headline": headline,
                "summary": plain_text(item.get("summary")),
                "outlet": plain_text(item.get("source")).title() or "Unknown outlet",
                "author": plain_text(item.get("author")),
                "url": url,
                "published_at": published,
                "updated_at": parse_iso(item.get("updated_at")),
                "symbols": [str(s) for s in item.get("symbols") or []],
            })
        return out
