from datetime import datetime
from src.domain.entities.url import Url
from src.domain.exceptions.url_exceptions import ExpiredUrlError, UrlNotFoundError
from src.domain.repositories.url_repository import UrlRepository
from src.infrastructure.cache.cache_service import CacheService

class RedirectUrl:

    def __init__(self, repository: UrlRepository, cache: CacheService):

        self.repository = repository
        self.cache = cache

    def execute(self, slug: str) -> str:

        cached  = self.cache.get(slug)

        if cached :

            return cached.decode()

        url = self.repository.get_url(slug)

        if url is None:
            
            raise UrlNotFoundError(slug)

        if url.is_expired():

            raise ExpiredUrlError() 
            
        ttl = int((url.expires_at - datetime.now()).total_seconds())
        self.cache.set(url.slug, url.original_url, ttl)

        return url.original_url
