import os
import time
from typing import List
from fastapi import FastAPI, WebSocket, Path
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

import dataaccess.session as database_session
from dataaccess import todos as dataaccess_todos

# Setup FastAPI app
app = FastAPI(
    title="API Server",
    description="API Server",
    version="v1"
)

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Application start/stop hooks


@app.on_event("startup")
async def startup():
    # Connect to database
    await database_session.connect()


@app.on_event("shutdown")
async def shutdown():
    # Disconnect from database
    await database_session.disconnect()

# Routes


@app.get(
    "/",
    summary="Index",
    description="Root api"
)
async def get_index():
    return {
        "message": "Welcome to the API Service"
    }


@app.get("/todos")
async def todos_index():
    return await dataaccess_todos.browse(paginate=False)


@app.post("/todos")
async def todos_create(
    json_obj: dict
):
    # Create
    data_db = await dataaccess_todos.create(task=json_obj["task"])
    return data_db


@app.put("/todos/{id}")
async def todos_update(
        json_obj: dict,
        id: int = Path(..., description="The data id")
):
    # Update
    data_db = await dataaccess_todos.update(task=json_obj["task"])

    return data_db


@app.get("/todos/{id}")
async def todos_fetch(
        id: int = Path(..., description="The data id")
):
    data_db = await dataaccess_todos.get(id)

    return data_db


# Web Sockets
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     created_at = 0
#     while True:
#         data = await dataaccess_todos.browse(paginate=False, created_at=created_at)
#         if len(data) > 0:
#             created_at = data[0]["created_at"]
#             await websocket.send_json(data)

#         # Sleep
#         time.sleep(5)

# Additional routers here
