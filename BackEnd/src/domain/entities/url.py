from datetime import datetime, date

class Url():

    def __init__(self, original_url: str, slug: str, expires_at: str):

        self.original_url = original_url
        self.slug = slug
        self.created_at = datetime.now()

        if isinstance(expires_at, datetime):
            self.expires_at = expires_at

        else:
            self.expires_at = datetime.fromisoformat(str(expires_at))

    def is_expired(self) -> bool: 
        
        return datetime.now() > self.expires_at
        