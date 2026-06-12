# main.py — Oliver

from fastapi import FastAPI

from routers.api import router

app = FastAPI(
    title="OperaLens API"
)

app.include_router(router)