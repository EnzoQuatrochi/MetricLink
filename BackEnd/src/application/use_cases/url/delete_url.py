from src.domain.repositories.url_repository import UrlRepository

class DeleteUrl():

    def __init__(self, repository: UrlRepository):

        self.repository = repository

    def execute(self, slug: str) -> None:
 
        self.repository.delete_url(slug)
