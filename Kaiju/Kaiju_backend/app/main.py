import asyncio
from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.districts import router as districts_router
from app.api.resources import router as resources_router
from app.api.disaster import router as disaster_router
from app.api.transfers import router as transfers_router
from app.api.calendar import router as calendar_router
from app.api.permissions import router as permissions_router
from app.api.ws import router as ws_router
from app.services import ws_manager

app = FastAPI(
    title="Kaiju API",
    description="Disaster-response resource coordination API for the city of Tokyork.",
    version="1.0.0",
)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(districts_router)
app.include_router(resources_router)
app.include_router(disaster_router)
app.include_router(transfers_router)
app.include_router(calendar_router)
app.include_router(permissions_router)
app.include_router(ws_router)


@app.on_event("startup")
def onStartup():
    ws_manager.set_server_loop(asyncio.get_event_loop())


@app.get("/")
def read_root():
    return {"status": "OK"}
