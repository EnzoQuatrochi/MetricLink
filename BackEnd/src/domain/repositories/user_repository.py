from typing import Optional
from abc import ABC, abstractmethod
from src.domain.entities.user import User

class UserRepository(ABC):

    @abstractmethod
    def create_user(self, user: User) -> None:

        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[User]:

        pass