import pytest
import psycopg
from src.domain.entities.user import User
from testcontainers.postgres import PostgresContainer
from src.infrastructure.database.user_repository_implementation import UserRepositoryImplementation

@pytest.fixture(scope="module")
def postgres():
    with PostgresContainer("postgres:16") as conteiner:
        conn = psycopg.connect(
            host=conteiner.get_container_host_ip(),
            port=conteiner.get_exposed_port(5432),
            dbname=conteiner.dbname,
            user=conteiner.username,
            password=conteiner.password
        )
        with conn.cursor() as cursor:
            cursor.execute(open("src/infrastructure/database/schema.sql", "rb").read())
        conn.commit()
        yield conn
        conn.close()

@pytest.fixture
def repo(postgres):
    return UserRepositoryImplementation(postgres)

def test_create_user(repo):

    user = User(email="teste@teste.com", password_hash="password")
    repo.create_user(user)
    result = repo.get_user_by_email("teste@teste.com")

    assert result.email == "teste@teste.com"
    assert result.password_hash == "password"

def test_get_user_by_email(repo):

    user = User(email="teste2@teste.com", password_hash="password2")
    repo.create_user(user)

    result = repo.get_user_by_email("teste2@teste.com")

    assert result is not None 
    assert result.email == "teste2@teste.com"
    assert result.password_hash == "password2"