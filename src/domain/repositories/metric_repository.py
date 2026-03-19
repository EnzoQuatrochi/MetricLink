from abc import ABC, abstractmethod
from datetime import date

class MetricsRepository(ABC):

    @abstractmethod
    def register_click(self, slug: str) -> None:

        pass

    @abstractmethod
    def get_all_clicks(self, slug: str) -> int:

        pass

    @abstractmethod
    def get_clicks_per_day(self, slug: str, day: date) -> int:

        pass
