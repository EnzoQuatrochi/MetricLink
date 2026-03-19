from datetime import datetime

class Url():

    def __init__(self, original_url: str, slug: str, expires_at: str):

        self.original_url = original_url
        self.slug = slug
        self.created_at = datetime.now()
        self.expires_at = datetime.fromisoformat(expires_at)

    def is_expired(self) -> bool: 
        
        return datetime.now() > self.expires_at
    