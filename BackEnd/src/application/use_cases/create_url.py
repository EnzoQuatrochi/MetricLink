import secrets
from src.domain.entities.url import Url
from src.domain.repositories.url_repository import UrlRepository
from datetime import date, timedelta

class CreateUrl:

    def __init__(self, repository: UrlRepository):

        self.repository = repository

    def execute(self, url: str, expires_at: date) -> Url:

        slug = secrets.token_urlsafe(6)

        max_expires = date.today() + timedelta(days=30)

        if expires_at > max_expires:

            expires_at = max_expires
        
        newUrl = Url(url, slug, expires_at)
        
        self.repository.save_url(newUrl)

        return newUrl
        