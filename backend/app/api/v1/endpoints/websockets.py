import json
import asyncio
from typing import List, Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
                # Echo / handle client status update events
                event_type = data.get("type", "PING")
                if event_type == "LOCATION_UPDATE":
                    await manager.broadcast({
                        "event": "VOLUNTEER_LOCATION_MOVED",
                        "volunteer_id": data.get("volunteer_id"),
                        "latitude": data.get("latitude"),
                        "longitude": data.get("longitude")
                    })
                elif event_type == "STATUS_UPDATE":
                    await manager.broadcast({
                        "event": "EMERGENCY_STATUS_CHANGED",
                        "request_id": data.get("request_id"),
                        "status": data.get("status")
                    })
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
