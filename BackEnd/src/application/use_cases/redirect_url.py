from domain.entities.url import Url
from domain.exceptions.url_exceptions import ExpiredUrlError, UrlNotFoundError
from domain.repositories.url_repository import UrlRepository

class RedirectUrl:

    def __init__(self, repository: UrlRepository):

        self.repository = repository

    def execute(self, slug: str) -> Url:

        url = self.repository.get_url(slug)

        if url:

            if url.is_expired():

                raise ExpiredUrlError() 
            
            return url
        
        else:

            raise UrlNotFoundError(slug)
