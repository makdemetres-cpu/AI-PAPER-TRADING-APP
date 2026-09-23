from fastapi import APIRouter, HTTPException, Path, Request
from pydantic import BaseModel, Field, field_validator

router = APIRouter(prefix="/api/watchlists")

Symbol = Path(pattern=r"^[A-Za-z0-9]{1,15}$")


class WatchlistName(BaseModel):
    name: str = Field(min_length=1, max_length=40)

    @field_validator("name")
    @classmethod
    def strip(cls, value: str) -> str:
        value = " ".join(value.split())
        if not value:
            raise ValueError("Name can't be empty.")
        return value


class NewItem(BaseModel):
    symbol: str = Field(pattern=r"^[A-Za-z0-9]{1,15}$")


def found(watchlist: dict | None) -> dict:
    if watchlist is None:
        raise HTTPException(404, "That watchlist doesn't exist.")
    return watchlist


@router.get("")
async def list_watchlists(request: Request):
    return {"watchlists": request.app.state.db.list_watchlists()}


@router.post("", status_code=201)
async def create_watchlist(request: Request, body: WatchlistName):
    return request.app.state.db.create_watchlist(body.name)


@router.patch("/{watchlist_id}")
async def rename_watchlist(request: Request, watchlist_id: int, body: WatchlistName):
    return found(request.app.state.db.rename_watchlist(watchlist_id, body.name))


@router.delete("/{watchlist_id}", status_code=204)
async def delete_watchlist(request: Request, watchlist_id: int):
    if not request.app.state.db.delete_watchlist(watchlist_id):
        raise HTTPException(404, "That watchlist doesn't exist.")


@router.post("/{watchlist_id}/items")
async def add_item(request: Request, watchlist_id: int, body: NewItem):
    found(request.app.state.db.get_watchlist(watchlist_id))
    asset, _ = await request.app.state.market.asset(body.symbol)
    return request.app.state.db.add_watchlist_item(watchlist_id, asset.symbol)


@router.delete("/{watchlist_id}/items/{symbol}")
async def remove_item(request: Request, watchlist_id: int, symbol: str = Symbol):
    return found(request.app.state.db.remove_watchlist_item(watchlist_id, symbol.upper()))
