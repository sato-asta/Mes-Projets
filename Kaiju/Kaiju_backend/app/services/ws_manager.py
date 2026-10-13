import asyncio

active_connections = []
server_loop = None

def set_server_loop(loop):
    global server_loop
    server_loop = loop


async def connect(websocket):
    await websocket.accept()
    active_connections.append(websocket)


def disconnect(websocket):
    if websocket in active_connections:
        active_connections.remove(websocket)


async def send_to_all(event: dict):
    for websocket in list(active_connections):
        try:
            await websocket.send_json(event)
        except Exception:
            disconnect(websocket)


def broadcast(event_type: str, data: dict):
    event = {"event": event_type, "data": data}

    if server_loop is None:
        return

    asyncio.run_coroutine_threadsafe(send_to_all(event), server_loop)
