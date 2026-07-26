import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.infrastructure.http.url_router import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
