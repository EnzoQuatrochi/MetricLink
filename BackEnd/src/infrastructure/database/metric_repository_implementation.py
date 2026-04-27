from datetime import date
from src.domain.repositories.metric_repository import MetricsRepository
from src.infrastructure.database.connection import get_connection

class MetricRepositoryImplementation(MetricsRepository):

    def __init__(self):

        self.connection = get_connection()

    def register_click(self, slug: str) -> None:

        with self.connection.cursor() as cursor:

            cursor.execute("INSERT INTO metrics (slug) VALUES (%s)", (slug,))
            self.connection.commit()

    def get_all_clicks(self, slug: str) -> int:

        with self.connection.cursor() as cursor:

            cursor.execute("SELECT COUNT(*) FROM metrics WHERE slug = (%s)", (slug,))
            row = cursor.fetchone()

            return row[0]

    def get_clicks_per_day(self, slug: str, day: date) -> int:
        
        with self.connection.cursor() as cursor:

            cursor.execute("SELECT COUNT(*) FROM metrics WHERE slug = (%s) AND DATE(clicked_at) = (%s)", (slug, day,))
            row = cursor.fetchone()

            return row[0]
