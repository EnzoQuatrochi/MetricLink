from domain.repositories.metric_repository import MetricsRepository
from datetime import date

class GetMetrics:

    def __init__(self, repository: MetricsRepository):

        self.repository = repository

    def get_total_clicks(self, slug: str) -> int:

        metrics = self.repository.get_all_clicks(slug)

        return metrics

    def get_clicks_per_day(self, slug: str, day: date) -> int:
        
        metrics = self.repository.get_clicks_per_day(slug, day)

        return metrics
    