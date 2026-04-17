import secrets
from domain.entities.url import Url
from domain.repositories.url_repository import UrlRepository
from datetime import date

class CreateUrl:

    def __init__(self, repository: UrlRepository):

        self.repository = repository

    def execute(self, url: str, expires_at: date) -> Url:

        slug = secrets.token_urlsafe(6)
        
        newUrl = Url(url, slug, expires_at)
        
        self.repository.save_url(newUrl)

        return newUrl
        