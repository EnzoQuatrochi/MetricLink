from datetime import datetime
from src.domain.exceptions.url_exceptions import InvalidUrlError

class Url():

    def __init__(self, original_url: str, slug: str, expires_at: str, user_id: int):

        self.original_url = original_url
        self.slug = slug
        self.created_at = datetime.now()
        self.user_id = user_id

        if not original_url.startswith(("http://", "https://")):

            raise InvalidUrlError()

        if isinstance(expires_at, datetime):
            self.expires_at = expires_at

        else:
            self.expires_at = datetime.fromisoformat(str(expires_at))

    def is_expired(self) -> bool: 
        
        return datetime.now() > self.expires_at
        