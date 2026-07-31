from typing import Optional
from abc import ABC, abstractmethod
from src.domain.entities.url import Url

class UrlRepository(ABC):

    @abstractmethod
    def save_url(self, url: Url) -> None:

        pass

    @abstractmethod
    def get_url(self, slug: str) -> Optional[Url]:

        pass

    def get_urls_by_user(self, user_id: int):

        pass

    @abstractmethod
    def delete_url(self, slug: str) -> None:

        pass
