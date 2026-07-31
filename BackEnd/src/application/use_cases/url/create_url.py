import secrets
from datetime import date, timedelta
from src.domain.entities.url import Url
from src.domain.repositories.url_repository import UrlRepository

class CreateUrl:

    def __init__(self, repository: UrlRepository):

        self.repository = repository

    def execute(self, url: str, expires_at: date, user_id : int) -> Url:

        slug = secrets.token_urlsafe(6)

        max_expires = date.today() + timedelta(days=30)

        if expires_at > max_expires:

            expires_at = max_expires
        
        newUrl = Url(url, slug, expires_at, user_id)
        
        self.repository.save_url(newUrl)

        return newUrl
        