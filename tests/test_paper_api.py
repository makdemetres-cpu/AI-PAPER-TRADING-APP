from pathlib import Path

from fastapi.testclient import TestClient

from server.config import load_settings
from server.main import create_app

from .fakes import FakeMarkets


def client(tmp_path: Path) -> TestClient:
    settings = load_settings(Path("none.env"), overrides={"DB_PATH": str(tmp_path / "app.db")})
    app = create_app(settings, transport=FakeMarkets(real_clock=True).transport(), throttle=False, background=False)
    return TestClient(app, base_url="http://127.0.0.1")


def test_paper_flow_over_http(tmp_path):
    with client(tmp_path) as c:
        assert c.get("/api/paper/account").json() == {"account": None}
        assert c.get("/api/paper/portfolio").status_code == 404
        assert c.post("/api/paper/account", json={"starting_cash": 50}).status_code == 422
        assert c.post("/api/paper/account", json={"currency": "USD", "starting_cash": "25000"}).status_code == 201

        both = {"symbol": "BTC", "side": "buy", "type": "market", "quantity": "0.1", "amount": "100"}
        assert c.post("/api/paper/orders/preview", json=both).status_code == 422
        no_limit = {"symbol": "BTC", "side": "buy", "type": "limit", "quantity": "0.1"}
        assert c.post("/api/paper/orders/preview", json=no_limit).status_code == 422
        assert c.post("/api/paper/orders", json={**no_limit, "quantity": "NaN", "limit_price": "1"}).status_code == 422

        too_big = {"symbol": "BTC", "side": "buy", "type": "market", "quantity": "5"}
        rejected = c.post("/api/paper/orders", json=too_big)
        assert rejected.status_code == 422
        assert rejected.json()["problems"]

        ok = c.post("/api/paper/orders", json={**too_big, "quantity": "0.1", "why": "first trade"})
        assert ok.status_code == 201
        order_id = ok.json()["order_id"]
        assert c.patch(f"/api/paper/journal/{order_id}", json={"review": "fine"}).status_code == 204
        assert c.patch("/api/paper/journal/999", json={"review": "x"}).status_code == 404
        assert c.get("/api/paper/journal").json()["entries"][0]["review"] == "fine"
        assert c.delete(f"/api/paper/orders/{order_id}").status_code == 404
        assert c.patch("/api/paper/account/costs", json={"fee_pct": 0.2, "slippage_pct": 0}).json()["fee_pct"] == 0.2
        assert len(c.get("/api/paper/performance").json()["points"]) >= 2
