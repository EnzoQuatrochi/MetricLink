import hashlib
import bcrypt
from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository
from src.domain.exceptions.user_exceptions import UserAlreadyExistsError

class Register:

    def __init__(self, repository: UserRepository) -> None:
        
        self.repository = repository

    def execute(self, email: str, password: str) -> User:

        existing = self.repository.get_user_by_email(email)

        if existing:

            raise UserAlreadyExistsError()
        
        password_bytes = hashlib.sha256(password.encode()).hexdigest()
        hashed = bcrypt.hashpw(password_bytes.encode(), bcrypt.gensalt())

        newUser = User(email, hashed)

        self.repository.create_user(newUser)

        return newUser