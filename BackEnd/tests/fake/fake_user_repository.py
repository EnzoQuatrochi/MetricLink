from typing import Optional
from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository

class FakeUserRepository(UserRepository):

    def __init__(self):

        self.users = {}
    
    def create_user(self, user: User) -> None:

        self.users[user.name] = user

    def get_user_by_name(self, name: str) -> Optional[User]:

        return self.users.get(name)