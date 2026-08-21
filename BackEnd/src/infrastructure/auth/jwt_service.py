import os
from jose import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def create_token(name: str) -> str:

    expires = datetime.now() + timedelta(hours=24)

    payload = {"sub": name, "exp": expires}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> str:

    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    return payload["sub"]  