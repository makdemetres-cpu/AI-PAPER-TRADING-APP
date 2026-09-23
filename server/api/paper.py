from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Request, Response
from pydantic import BaseModel, Field, model_validator

router = APIRouter(prefix="/api/paper")


class AccountCreate(BaseModel):
    currency: Literal["USD", "EUR"] = "USD"
    starting_cash: Decimal = Field(Decimal(100_000), ge=100, le=100_000_000, allow_inf_nan=False)
    fee_pct: Decimal = Field(Decimal("0.5"), ge=0, le=5, allow_inf_nan=False)
    slippage_pct: Decimal = Field(Decimal("0.1"), ge=0, le=5, allow_inf_nan=False)
    reset: bool = False


class CostsUpdate(BaseModel):
    fee_pct: Decimal = Field(ge=0, le=5, allow_inf_nan=False)
    slippage_pct: Decimal = Field(ge=0, le=5, allow_inf_nan=False)


class OrderRequest(BaseModel):
    symbol: str = Field(pattern=r"^[A-Za-z0-9]{1,15}$")
    side: Literal["buy", "sell"]
    type: Literal["market", "limit"]
    quantity: Decimal | None = Field(None, gt=0, allow_inf_nan=False)
    amount: Decimal | None = Field(None, gt=0, allow_inf_nan=False)
    limit_price: Decimal | None = Field(None, gt=0, allow_inf_nan=False)
    why: str = Field("", max_length=2000)
    expected_price: Decimal | None = Field(None, gt=0, allow_inf_nan=False)

    @model_validator(mode="after")
    def check(self):
        if (self.quantity is None) == (self.amount is None):
            raise ValueError("Give either a quantity or an amount, not both.")
        if self.type == "limit" and self.limit_price is None:
            raise ValueError("A limit order needs a limit price.")
        if self.type == "market" and self.limit_price is not None:
            raise ValueError("A market order can't have a limit price.")
        return self


class JournalUpdate(BaseModel):
    why: str | None = Field(None, max_length=2000)
    review: str | None = Field(None, max_length=2000)


@router.get("/account")
async def get_account(request: Request):
    return request.app.state.paper.get_account()


@router.post("/account", status_code=201)
async def create_account(request: Request, body: AccountCreate):
    return request.app.state.paper.create_account(
        currency=body.currency, starting_cash=body.starting_cash, fee_pct=body.fee_pct,
        slippage_pct=body.slippage_pct, reset=body.reset,
    )


@router.patch("/account/costs")
async def update_costs(request: Request, body: CostsUpdate):
    return request.app.state.paper.update_costs(body.fee_pct, body.slippage_pct)


@router.get("/portfolio")
async def portfolio(request: Request):
    return await request.app.state.paper.portfolio()


@router.get("/performance")
async def performance(request: Request):
    return await request.app.state.paper.performance()


@router.post("/orders/preview")
async def preview(request: Request, body: OrderRequest):
    return await request.app.state.paper.preview(body.model_dump())


@router.post("/orders", status_code=201)
async def place(request: Request, body: OrderRequest):
    return await request.app.state.paper.place(body.model_dump())


@router.get("/orders")
async def orders(request: Request):
    return request.app.state.paper.orders()


@router.delete("/orders/{order_id}", status_code=204)
async def cancel(request: Request, order_id: int):
    request.app.state.paper.cancel(order_id)
    return Response(status_code=204)


@router.get("/journal")
async def journal(request: Request):
    return await request.app.state.paper.journal()


@router.patch("/journal/{order_id}", status_code=204)
async def update_journal(request: Request, order_id: int, body: JournalUpdate):
    why = body.why.strip() if body.why is not None else None
    review = body.review.strip() if body.review is not None else None
    request.app.state.paper.update_journal(order_id, why, review)
    return Response(status_code=204)
