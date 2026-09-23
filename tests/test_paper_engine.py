from decimal import Decimal as D

from server.paper.engine import (
    Fill,
    build_ledger,
    fee_for,
    limit_fill_price,
    market_fill_price,
    quantity_for_spend,
)


def fill(side, qty, price, fee="0", symbol="BTC", order_id=1, at="2026-09-23T12:00:00.000000Z"):
    return Fill(order_id, symbol, side, D(qty), D(price), D(fee), at)


def test_ledger_average_cost_includes_fees_and_realizes_on_sell():
    ledger = build_ledger(D(10_000), [
        fill("buy", "1", "100", "1"),
        fill("buy", "1", "200", "2"),
        fill("sell", "1", "300", "3"),
    ])
    pos = ledger.positions["BTC"]
    assert pos.quantity == D(1)
    assert pos.cost_basis == D("151.5")
    assert pos.realized == D(300) - D(3) - D("151.5")
    assert ledger.cash == D(10_000) - 101 - 202 + 297
    assert ledger.fees_paid == D(6)


def test_selling_everything_clears_cost_basis():
    ledger = build_ledger(D(1000), [fill("buy", "2", "10"), fill("sell", "2", "12")])
    assert ledger.positions["BTC"].quantity == 0
    assert ledger.positions["BTC"].cost_basis == 0
    assert ledger.positions["BTC"].avg_cost is None
    assert ledger.realized == D(4)


def test_market_fill_uses_ask_bid_and_slippage_against_you():
    assert market_fill_price("buy", D(99), D(101), D(100), D("0.1")) == (D("101.101"), "ask", D(101))
    assert market_fill_price("sell", D(99), D(101), D(100), D("0.1")) == (D("98.901"), "bid", D(99))
    assert market_fill_price("buy", None, None, D(100), D(0))[1] == "last trade"


def test_limit_fills_only_when_crossed_and_never_worse_than_limit():
    assert limit_fill_price("buy", D(100), D(99), D(101), D(100), D(0)) is None
    assert limit_fill_price("buy", D(102), D(99), D(101), D(100), D(0)) == D(101)
    assert limit_fill_price("buy", D("101.05"), D(99), D(101), D(100), D("0.1")) == D("101.05")
    assert limit_fill_price("sell", D(100), D(99), D(101), D(100), D(0)) is None
    assert limit_fill_price("sell", D(98), D(99), D(101), D(100), D(0)) == D(99)


def test_spend_amount_covers_coins_and_fee():
    qty = quantity_for_spend(D(1000), D("65001"), D("0.5"))
    gross = qty * D("65001")
    assert gross + fee_for(gross, D("0.5")) <= D(1000)
    assert qty == D("0.01530783")
