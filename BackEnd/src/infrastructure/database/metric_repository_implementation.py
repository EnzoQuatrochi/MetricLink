from datetime import date
from src.domain.repositories.metric_repository import MetricsRepository
from src.infrastructure.database.connection import get_connection

class MetricRepositoryImplementation(MetricsRepository):

    def __init__(self, connection=None):
    
        self.connection = connection or get_connection()

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
        
    def get_clicks_history(self, slug) -> list:

        with self.connection.cursor() as cursor:

            cursor.execute("SELECT DATE(clicked_at), COUNT(*) FROM metrics WHERE slug = %s GROUP BY DATE(clicked_at) ORDER BY DATE(clicked_at)", (slug,))
            row = cursor.fetchall()

        return [{"day": str(row[0]), "clicks": row[1]} for row in row]
