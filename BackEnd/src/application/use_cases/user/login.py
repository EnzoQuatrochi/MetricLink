import hashlib
import bcrypt
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.auth.jwt_service import create_token
from src.domain.exceptions.user_exceptions import InvalidCredentialsError, UserNotFoundError

class Login:

    def __init__(self, repository: UserRepository):

        self.repository = repository

    def execute(self, name: str, password: str) -> str:

        existing = self.repository.get_user_by_name(name)

        if not existing:

            raise UserNotFoundError

        password_bytes = hashlib.sha256(password.encode()).hexdigest()

        if not bcrypt.checkpw(password_bytes.encode(), existing.password_hash.encode()):

            raise InvalidCredentialsError()

        token = create_token(name)

        return token