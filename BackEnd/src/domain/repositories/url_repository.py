from abc import ABC, abstractmethod
from typing import Optional
from src.domain.entities.url import Url

class UrlRepository(ABC):

    @abstractmethod
    def save_url(self, url: Url) -> None:

        pass

    @abstractmethod
    def get_url(self, slug: str) -> Optional[Url]:

        pass

    @abstractmethod
    def delete_url(self, slug: str) -> None:

        pass
