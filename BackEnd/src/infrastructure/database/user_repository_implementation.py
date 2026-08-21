from typing import Optional
from src.domain.entities.user import User
from src.infrastructure.database.connection import get_connection
from src.domain.repositories.user_repository import UserRepository

class UserRepositoryImplementation(UserRepository):
    
    def __init__(self, connection=None):
        
        self.connection = connection or get_connection()

    def create_user(self, user: User) -> None:

        with self.connection.cursor() as cursor:

            cursor.execute("INSERT INTO users (name, password_hash) VALUES (%s, %s)",
                (user.name, user.password_hash))
            self.connection.commit()

    def get_user_by_name(self, name: str) -> Optional[User]:

        with self.connection.cursor() as cursor:

            cursor.execute("SELECT * FROM users WHERE name = %s", (name,))

            user = cursor.fetchone()

            if user is None:

                return None

            return User(id=user[0], name=user[1], password_hash=user[2])