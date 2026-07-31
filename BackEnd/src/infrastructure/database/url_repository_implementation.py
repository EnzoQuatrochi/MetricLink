from typing import Optional
from src.domain.entities.url import Url
from src.domain.repositories.url_repository import UrlRepository
from src.infrastructure.database.connection import get_connection

class UrlRepositoryImplementation(UrlRepository):

    def __init__(self, connection=None):

        self.connection = connection or get_connection()

    def save_url(self, url: Url) -> None:

        with self.connection.cursor() as cursor:

            cursor.execute("INSERT INTO urls (slug, original_url, expires_at, user_id) VALUES (%s, %s, %s, %s)", 
               (url.slug, url.original_url, url.expires_at, url.user_id))
            self.connection.commit()

    def get_url(self, slug: str) -> Optional[Url]:

        with self.connection.cursor() as cursor:

            cursor.execute("SELECT * FROM urls WHERE slug = %s", (slug,))
            rows = cursor.fetchall()

            if rows is None:

                return None

            return [Url(original_url=row[2], slug=row[1], expires_at=row[4]) for row in rows]

    def get_urls_by_user(self, user_id: int) -> Optional[Url]:

        with self.connection.cursor() as cursor:

            cursor.execute("SELECT * FROM urls WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()

            if row is None:

                return None

            return Url(original_url=row[2], slug=row[1], expires_at=row[4], user_id=row[5])

    def delete_url(self, slug: str) -> None:
        
        with self.connection.cursor() as cursor:

            cursor.execute("DELETE FROM urls WHERE slug = %s", (slug,))
            self.connection.commit()
