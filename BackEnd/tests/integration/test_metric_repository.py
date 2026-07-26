import psycopg
import pytest
from datetime import datetime, timedelta, timezone
from testcontainers.postgres import PostgresContainer
from src.infrastructure.database.metric_repository_implementation import MetricRepositoryImplementation

@pytest.fixture(scope="module")
def postgres():
    with PostgresContainer("postgres:16") as conteiner:
        conn = psycopg.connect(
            host = conteiner.get_container_host_ip(),
            port = conteiner.get_exposed_port(5432),
            dbname = conteiner.dbname,
            user = conteiner.username,
            password = conteiner.password
        )

        expires_at = (datetime.now() + timedelta(days=1)).isoformat()
        
        with conn.cursor() as cursor:
            cursor.execute(open("src/infrastructure/database/schema.sql").read())
            cursor.execute(
                "INSERT INTO urls (slug, original_url, expires_at) VALUES (%s, %s, %s)",
                ("test123", "https://google.com", expires_at)
            )
        conn.commit()
        yield conn
        conn.close()

@pytest.fixture
def repo(postgres):
    return MetricRepositoryImplementation(postgres)

def test_register_click(repo):

    repo.register_click("test123")

def test_get_clicks(repo):

    clicksPerDay = repo.get_clicks_per_day("test123", datetime.now(timezone.utc).date())
    assert clicksPerDay == 1

    allClicks = repo.get_all_clicks("test123")
    assert allClicks == 1

    historyClicks = repo.get_clicks_history("test123")
    assert len(historyClicks) == 1
    assert historyClicks[0]["clicks"] == 1  
