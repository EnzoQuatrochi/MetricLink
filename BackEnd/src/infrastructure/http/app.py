from fastapi import FastAPI
from src.infrastructure.http.url_router import router

app = FastAPI()
app.include_router(router)
