from dotenv import dotenv_values
from typing import Optional
import redis

config = dotenv_values(".env")

def get_connection():

    try:

        conn = redis.Redis.from_url(config["REDIS_URL"])
        return conn

    except Exception as e:

        raise Exception (f"Error to connect with redis: {e}")

class CacheService:

    def __init__(self, conn):

        self.connection = conn

    def get(self, key: str) -> Optional[bytes]:

        return self.connection.get(key)

    def set(self, key: str, value: str, ttl: int) -> None:

        self.connection.set(key, value, ex=ttl)

    def delete(self, key: str) -> None:

        self.connection.delete(key)
