from src.domain.entities.url import Url
from src.domain.repositories.url_repository import UrlRepository

class GetUrlsByUser:

    def __init__(self, repository: UrlRepository):

        self.repository = repository

    def execute(self, user_id: int) -> list[Url]:

        return self.repository.get_urls_by_user(user_id)