import pytest
import psycopg
from datetime import datetime, timedelta
from testcontainers.postgres import PostgresContainer
from src.domain.entities.url import Url
from src.infrastructure.database.url_repository_implementation import UrlRepositoryImplementation

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
    return UrlRepositoryImplementation(postgres)

def test_save_and_get_url(repo):

    expires_at = (datetime.now() + timedelta(days=1)).isoformat()
    url = Url(original_url="https://google.com", slug="test123", expires_at=expires_at, user_id=None)

    repo.save_url(url)
    result = repo.get_url(url.slug)

    assert result is not None
    assert result.slug == "test123"
    assert result.original_url == "https://google.com"
  