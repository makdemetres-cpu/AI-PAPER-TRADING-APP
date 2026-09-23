import asyncio
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from server.config import load_settings
from server.http import make_client
from server.main import create_app
from server.market.service import MarketService

from .fakes import FakeMarkets
from .test_service import Clock


def service(fake: FakeMarkets, key: str = "PKTEST"):
    clock = Clock()
    svc = MarketService(make_client(fake.transport(), throttle=False), alpaca_key_id=key,
                        alpaca_secret="secret" if key else "", clock=clock)
    return svc, clock


def run(coro):
    return asyncio.run(coro)


def codes(report):
    return {n["code"] for n in report["notices"]}


def test_coin_info_from_coingecko():
    svc, _ = service(FakeMarkets())
    report = run(svc.coin_info("BTC", "USD"))
    info = report["info"]
    assert info["coingecko_id"] == "bitcoin"
    assert info["max_supply"] == 21_000_000
    assert info["rank"] == 1
    assert report["source"]["url"] == "https://www.coingecko.com/en/coins/bitcoin"
    assert report["freshness"]["status"] == "live"
    assert "2 minutes" in report["freshness"]["detail"]


def test_coin_info_in_eur_uses_coingecko_euro_figures():
    svc, _ = service(FakeMarkets())
    report = run(svc.coin_info("BTC", "EUR"))
    assert report["info"]["market_cap"] == pytest.approx(1.29e12 / 1.08)


def test_coin_info_warns_when_names_disagree():
    fake = FakeMarkets()
    fake.coingecko_names["sol"] = "Solar Token"
    svc, _ = service(fake)
    assert "name_mismatch" in codes(run(svc.coin_info("SOL", "USD")))


def test_coin_info_not_listed():
    svc, _ = service(FakeMarkets())
    report = run(svc.coin_info("USDT", "USD"))
    assert report["info"] is None
    assert "not_listed" in codes(report)
    assert report["errors"] == []


def test_coin_info_outage_serves_cache_as_stale():
    fake = FakeMarkets()
    svc, clock = service(fake)
    run(svc.coin_info("BTC", "USD"))
    fake.coingecko_up = False
    clock.advance(3600)
    report = run(svc.coin_info("BTC", "USD"))
    assert report["freshness"]["status"] == "stale"
    assert report["source"]["from_cache"] is True
    assert "refresh_failed" in codes(report)


def test_news_cleans_text_and_drops_unsafe_links():
    svc, _ = service(FakeMarkets())
    report = run(svc.news("BTC"))
    assert report["available"] is True
    assert len(report["items"]) == 1
    item = report["items"][0]
    assert item["headline"] == "Bitcoin & ether rise"
    assert item["summary"] == "Prices rose today."
    assert item["outlet"] == "Benzinga"
    assert item["published_at"] == "2026-09-23T11:00:00Z"


def test_news_without_key_explains_why():
    svc, _ = service(FakeMarkets(), key="")
    report = run(svc.news("BTC"))
    assert report["available"] is False
    assert "Alpaca" in report["reason"]


def test_news_with_rejected_key_reports_error():
    fake = FakeMarkets()
    clock = Clock()
    svc = MarketService(make_client(fake.transport(), throttle=False), alpaca_key_id="PKWRONG",
                        alpaca_secret="x", clock=clock)
    report = run(svc.news("BTC"))
    assert report["available"] is False
    assert report["errors"][0]["kind"] == "auth"


def api_client(tmp_path: Path) -> TestClient:
    settings = load_settings(Path("none.env"), overrides={"DB_PATH": str(tmp_path / "app.db")})
    return TestClient(create_app(settings, transport=FakeMarkets().transport(), throttle=False),
                      base_url="http://127.0.0.1")


def test_watchlist_lifecycle(tmp_path):
    with api_client(tmp_path) as c:
        assert c.get("/api/watchlists").json() == {"watchlists": []}
        created = c.post("/api/watchlists", json={"name": "  Long   term "}).json()
        assert created["name"] == "Long term"
        wid = created["id"]
        assert [i["symbol"] for i in c.post(f"/api/watchlists/{wid}/items", json={"symbol": "btc"}).json()["items"]] == ["BTC"]
        c.post(f"/api/watchlists/{wid}/items", json={"symbol": "BTC"})
        c.post(f"/api/watchlists/{wid}/items", json={"symbol": "SOL"})
        assert [i["symbol"] for i in c.get("/api/watchlists").json()["watchlists"][0]["items"]] == ["BTC", "SOL"]
        assert c.patch(f"/api/watchlists/{wid}", json={"name": "Core"}).json()["name"] == "Core"
        assert [i["symbol"] for i in c.delete(f"/api/watchlists/{wid}/items/btc").json()["items"]] == ["SOL"]
        assert c.delete(f"/api/watchlists/{wid}").status_code == 204
        assert c.get("/api/watchlists").json() == {"watchlists": []}


def test_watchlist_rejects_unknown_coin_and_bad_input(tmp_path):
    with api_client(tmp_path) as c:
        wid = c.post("/api/watchlists", json={"name": "A"}).json()["id"]
        assert c.post(f"/api/watchlists/{wid}/items", json={"symbol": "NOPE"}).status_code == 404
        assert c.post(f"/api/watchlists/{wid}/items", json={"symbol": "../x"}).status_code == 422
        assert c.post("/api/watchlists", json={"name": "   "}).status_code == 422
        assert c.post("/api/watchlists", json={"name": "x" * 41}).status_code == 422
        assert c.post("/api/watchlists/999/items", json={"symbol": "BTC"}).status_code == 404
        assert c.delete("/api/watchlists/999").status_code == 404


def test_info_and_news_endpoints(tmp_path):
    with api_client(tmp_path) as c:
        assert c.get("/api/assets/BTC/info", params={"currency": "EUR"}).json()["currency"] == "EUR"
        assert c.get("/api/assets/BTC/news").json()["available"] is False
