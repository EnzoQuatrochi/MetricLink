from jose import jwt
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

SECRET_KEY = config["SECRET_KEY"]
ALGORITHM = "HS256"

def create_token(email: str) -> str:

    expires = datetime.now() + timedelta(hours=24)

    payload = {"sub": email, "exp": expires}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> str:

    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    return payload["sub"]  