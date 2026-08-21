import bcrypt
import hashlib
from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository
from src.domain.exceptions.user_exceptions import UserAlreadyExistsError

class Register:

    def __init__(self, repository: UserRepository) -> None:
        
        self.repository = repository

    def execute(self, name: str, password: str) -> User:

        existing = self.repository.get_user_by_name(name)

        if existing:

            raise UserAlreadyExistsError()
        
        password_bytes = hashlib.sha256(password.encode()).hexdigest()
        hashed = bcrypt.hashpw(password_bytes.encode(), bcrypt.gensalt())
        password_hash = hashed.decode() if isinstance(hashed, bytes) else hashed
        newUser = User(name=name, password_hash=password_hash)

        self.repository.create_user(newUser)

        return newUser