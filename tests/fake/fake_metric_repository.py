from datetime import date
from domain.repositories.metric_repository import MetricsRepository

class FakeMetricRepository(MetricsRepository):

    def __init__(self):

        self.metrics = {}

    def register_click(self, slug: str) -> None:

        today = date.today().isoformat()

        if slug not in self.metrics:

            self.metrics[slug] = {"clicks": 1, "clicks_per_day": {today: 1}}

        else:

            self.metrics[slug]["clicks"] += 1

            if today in self.metrics[slug]["clicks_per_day"]:

                self.metrics[slug]["clicks_per_day"][today] += 1

            else:

                self.metrics[slug]["clicks_per_day"][today] = 1
    
    def get_all_clicks(self, slug: str) -> int:

        return self.metrics[slug]["clicks"]

    def get_clicks_per_day(self, slug: str, day: date) -> int:

        if day in self.metrics[slug]["clicks_per_day"]:

            return self.metrics[slug]["clicks_per_day"][day]

        else:

            return 0
