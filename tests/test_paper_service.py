import asyncio
from datetime import timedelta
from decimal import Decimal as D

import pytest

from server.db import Database
from server.http import make_client
from server.market.service import MarketService
from server.paper.service import PaperService, TradeError

from .fakes import FakeMarkets
from .test_service import Clock


def setup(currency="USD", fake=None):
    fake = fake or FakeMarkets()
    clock = Clock()
    market = MarketService(make_client(fake.transport(), throttle=False), clock=clock)
    paper = PaperService(Database(":memory:"), market, clock=clock)
    paper.create_account(currency=currency, starting_cash=D(100_000), fee_pct=D("0.5"), slippage_pct=D("0.1"), reset=False)
    return paper, fake, clock


def run(coro):
    return asyncio.run(coro)


def order(**kw):
    base = {"symbol": "BTC", "side": "buy", "type": "market", "quantity": None, "amount": None,
            "limit_price": None, "why": "", "expected_price": None}
    base.update(kw)
    return base


def set_btc(fake, price):
    fake.prices[("coinbase", "BTC-USD")] = price
    fake.prices[("kraken", "XBTUSD")] = price
    fake.prices[("alpaca", "BTC/USD")] = price


def test_second_account_needs_reset():
    paper, _, _ = setup()
    with pytest.raises(TradeError) as err:
        paper.create_account(currency="USD", starting_cash=D(5000), fee_pct=D(0), slippage_pct=D(0), reset=False)
    assert err.value.status == 409


def test_preview_market_buy_by_amount():
    paper, _, _ = setup()
    p = run(paper.preview(order(amount=D(1000))))
    assert p["can_place"] is True
    assert p["price_basis"] == "ask"
    assert p["market_price"] == 65001.0
    assert p["price"] == pytest.approx(65001 * 1.001)
    assert p["total"] <= 1000
    assert p["quote"]["source"]["name"] == "Coinbase Exchange"
    assert p["quote"]["freshness"]["status"] == "live"


def test_market_buy_then_portfolio():
    paper, _, _ = setup()
    result = run(paper.place(order(quantity=D("0.5"), why="Testing")))
    assert result["status"] == "filled"
    pf = run(paper.portfolio())
    fill_price = 65001 * 1.001
    cost = 0.5 * fill_price * 1.005
    assert pf["cash"] == pytest.approx(100_000 - cost)
    btc = pf["positions"][0]
    assert btc["quantity"] == "0.5"
    assert btc["value"] == pytest.approx(0.5 * 65000)
    assert btc["unrealized"] == pytest.approx(0.5 * 65000 - cost)
    assert pf["total_value"] == pytest.approx(pf["cash"] + 0.5 * 65000)
    assert pf["profit"] == pytest.approx(pf["total_value"] - 100_000)
    history = paper.orders()["orders"]
    assert history[0]["why"] == "Testing"
    assert history[0]["fill"]["source"] == "coinbase"
    assert history[0]["fill"]["pair"] == "BTC-USD"
    assert history[0]["fill"]["observed_at"]


def test_cannot_spend_more_than_cash_or_sell_more_than_held():
    paper, _, _ = setup()
    p = run(paper.preview(order(quantity=D(2))))
    assert not p["can_place"]
    assert "available" in p["problems"][0]
    p = run(paper.preview(order(side="sell", quantity=D(1))))
    assert not p["can_place"]
    with pytest.raises(TradeError) as err:
        run(paper.place(order(side="sell", quantity=D(1))))
    assert err.value.status == 422


def test_tiny_orders_rejected():
    paper, _, _ = setup()
    assert not run(paper.preview(order(amount=D("0.5"))))["can_place"]
    assert not run(paper.preview(order(quantity=D("0.000000001"))))["can_place"]


def test_stale_price_blocks_trading():
    paper, _, _ = setup(fake=FakeMarkets(trade_age_seconds=900))
    p = run(paper.preview(order(quantity=D("0.1"))))
    assert not p["can_place"]
    assert "stale" in p["problems"][0]


def test_disagreeing_sources_block_trading():
    fake = FakeMarkets()
    fake.prices[("kraken", "XBTUSD")] = 70000.0
    paper, _, _ = setup(fake=fake)
    p = run(paper.preview(order(quantity=D("0.1"))))
    assert any("disagree" in x for x in p["problems"])


def test_price_moved_since_review_is_rejected():
    paper, _, _ = setup()
    with pytest.raises(TradeError) as err:
        run(paper.place(order(quantity=D("0.1"), expected_price=D(60000))))
    assert err.value.status == 409
    assert paper.orders()["orders"] == []


def test_limit_buy_reserves_cash_and_fills_when_price_drops():
    paper, fake, clock = setup()
    result = run(paper.place(order(type="limit", quantity=D(1), limit_price=D(60000))))
    assert result["status"] == "open"
    pf = run(paper.portfolio())
    assert pf["cash_reserved"] == pytest.approx(60000 * 1.005)
    assert pf["cash_available"] == pytest.approx(100_000 - 60000 * 1.005)
    assert run(paper.check_limit_orders()) == 0

    set_btc(fake, 59000.0)
    clock.advance(10)
    assert run(paper.check_limit_orders()) == 1
    history = paper.orders()["orders"]
    assert history[0]["status"] == "filled"
    assert history[0]["fill"]["price"] == pytest.approx(59001 * 1.001)
    pf = run(paper.portfolio())
    assert pf["cash_reserved"] == 0
    assert pf["positions"][0]["quantity"] == "1"


def test_limit_does_not_fill_on_stale_price():
    paper, fake, clock = setup()
    run(paper.place(order(type="limit", quantity=D(1), limit_price=D(60000))))
    set_btc(fake, 59000.0)
    fake.trade_age_seconds = 900
    clock.advance(10)
    assert run(paper.check_limit_orders()) == 0


def test_marketable_limit_fills_immediately_at_better_price():
    paper, _, _ = setup()
    result = run(paper.place(order(type="limit", quantity=D("0.1"), limit_price=D(70000))))
    assert result["status"] == "filled"
    assert paper.orders()["orders"][0]["fill"]["price"] == pytest.approx(65001 * 1.001)


def test_limit_sell_reserves_coins():
    paper, _, _ = setup()
    run(paper.place(order(quantity=D(1))))
    run(paper.place(order(side="sell", type="limit", quantity=D("0.6"), limit_price=D(80000))))
    p = run(paper.preview(order(side="sell", quantity=D("0.5"))))
    assert not p["can_place"]
    assert "set aside" in p["problems"][0]


def test_cancel_open_order():
    paper, _, _ = setup()
    order_id = run(paper.place(order(type="limit", quantity=D(1), limit_price=D(60000))))["order_id"]
    paper.cancel(order_id)
    assert paper.orders()["orders"][0]["status"] == "cancelled"
    with pytest.raises(TradeError):
        paper.cancel(order_id)


def test_reset_starts_fresh_and_cancels_open_orders():
    paper, _, _ = setup()
    run(paper.place(order(quantity=D("0.1"))))
    run(paper.place(order(type="limit", quantity=D(1), limit_price=D(60000))))
    paper.create_account(currency="EUR", starting_cash=D(5000), fee_pct=D(0), slippage_pct=D(0), reset=True)
    pf = run(paper.portfolio())
    assert pf["account"]["currency"] == "EUR"
    assert pf["cash"] == 5000
    assert pf["positions"] == []
    assert paper.store.open_orders_all() == []


def test_eur_account_uses_native_euro_market():
    paper, _, _ = setup(currency="EUR")
    run(paper.place(order(quantity=D("0.1"))))
    fill = paper.orders()["orders"][0]["fill"]
    assert fill["pair"] == "BTC-EUR"
    assert fill["converted"] is False


def test_eur_account_converted_fill_records_ecb_rate():
    paper, _, _ = setup(currency="EUR")
    p = run(paper.preview(order(symbol="ETH", quantity=D(1))))
    assert any("converted" in w for w in p["warnings"])
    run(paper.place(order(symbol="ETH", quantity=D(1))))
    fill = paper.orders()["orders"][0]["fill"]
    assert fill["converted"] is True
    assert fill["fx_rate"] == "1.08"
    assert fill["fx_date"] == "2026-09-22"


def test_journal_review_and_outcome():
    paper, fake, clock = setup()
    order_id = run(paper.place(order(quantity=D("0.1"), why="Dip")))["order_id"]
    set_btc(fake, 70000.0)
    clock.advance(3600)
    paper.update_journal(order_id, why=None, review="Worked out")
    entry = run(paper.journal())["entries"][0]
    assert entry["why"] == "Dip"
    assert entry["review"] == "Worked out"
    assert entry["outcome"]["change_pct"] == pytest.approx((70000 / (65001 * 1.001) - 1) * 100)
    assert entry["outcome"]["since"] == "1 hour"


def test_performance_has_start_and_daily_points():
    paper, _, clock = setup()
    run(paper.place(order(quantity=D(1))))
    clock.advance(3 * 86400)
    perf = run(paper.performance())
    assert perf["points"][0]["value"] == 100_000
    assert len(perf["points"]) >= 4
    times = [p["time"] for p in perf["points"]]
    assert times == sorted(times)
    assert perf["sources"][0]["pair"] == "BTC-USD"


def test_performance_without_trades():
    paper, _, _ = setup()
    perf = run(paper.performance())
    assert [p["value"] for p in perf["points"]] == [100_000, 100_000]
