from typing import Optional
from src.domain.entities.url import Url
from src.domain.repositories.url_repository import UrlRepository

class FakeUrlRepository(UrlRepository):  

    def __init__(self):

        self.urls = {}

    def save_url(self, url: Url) -> None:

        self.urls[url.slug] = url

    def get_url(self, slug: str) -> Optional[Url]:
        
        return self.urls.get(slug)

    def delete_url(self, slug: str) -> None:

        del self.urls[slug]
    
    def get_urls_by_user(self, user_id: int) -> list[Url]:

        result = []

        for url in self.urls.values():

            if url.user_id == user_id:

                result.append(url)
                
        return result   