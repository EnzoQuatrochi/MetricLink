from typing import Optional

class FakeCacheService():

    def __init__(self):

        self.cache = {}

    def get(self, key: str) -> Optional[bytes]:

        value = self.cache.get(key)

        if value:

            return value.encode() 
        
        else:
            
            return None

    def set(self, key: str, value: str, ttl: int) -> None:

        self.cache[key] = value

    def delete(self, key: str) -> None:

        self.cache.pop(key, None)
