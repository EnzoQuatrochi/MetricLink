from typing import Optional
from src.domain.entities.url import Url
from src.domain.repositories.url_repository import UrlRepository
from src.infrastructure.database.connection import get_connection

class UrlRepositoryImplementation(UrlRepository):

    def __init__(self):

        self.connection = get_connection()

    def save_url(self, url: Url) -> None:

        with self.connection.cursor() as cursor:

            cursor.execute("INSERT INTO urls (slug, original_url, expires_at) VALUES (%s, %s, %s)", 
               (url.slug, url.original_url, url.expires_at))
            self.connection.commit()

    def get_url(self, slug: str) -> Optional[Url]:

        with self.connection.cursor() as cursor:

            cursor.execute("SELECT * FROM urls WHERE slug = %s", (slug,))
            row = cursor.fetchone()

            if row is None:

                return None

            return Url(original_url=row[1], slug=row[2], expires_at=row[4])

    def delete_url(self, slug: str) -> None:
        
        with self.connection.cursor() as cursor:

            cursor.execute("DELETE FROM urls WHERE slug = %s", (slug,))
            self.connection.commit()
