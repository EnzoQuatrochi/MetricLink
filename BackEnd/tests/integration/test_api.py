import pytest
import psycopg
import redis
from src.infrastructure.http.app import app
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from testcontainers.redis import RedisContainer
from testcontainers.postgres import PostgresContainer
from src.infrastructure.http.dependencies import get_cache, get_metric_repository, get_url_repository
from src.infrastructure.cache.cache_service import CacheService
from src.infrastructure.database.url_repository_implementation import UrlRepositoryImplementation
from src.infrastructure.database.metric_repository_implementation import MetricRepositoryImplementation

@pytest.fixture(scope="module")
def postgres():
    with PostgresContainer("postgres:16") as container:
        conn = psycopg.connect(
            host=container.get_container_host_ip(),
            port=container.get_exposed_port(5432),
            dbname=container.dbname,
            user=container.username,
            password=container.password
        )
        with conn.cursor() as cursor:
            cursor.execute(open("src/infrastructure/database/schema.sql").read())
        conn.commit()
        yield conn
        conn.close()

@pytest.fixture(scope="module")
def redis_conn():
    with RedisContainer("redis:7") as container:
        conn = redis.Redis(
            host=container.get_container_host_ip(),
            port=container.get_exposed_port(6379)
        )
        yield conn

@pytest.fixture(scope="module")
def client(postgres, redis_conn):
    app.dependency_overrides[get_url_repository] = lambda: UrlRepositoryImplementation(postgres)
    app.dependency_overrides[get_metric_repository] = lambda: MetricRepositoryImplementation(postgres)
    app.dependency_overrides[get_cache] = lambda: CacheService(redis_conn)
    yield TestClient(app)

def test_create_url(client):

    expires_at = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    response = client.post("/urls", json={
        "original_url": "https://google.com",
        "expires_at": expires_at
    })
    assert response.status_code == 200
    assert "slug" in response.json()

def test_redirect_url(client):

    expires_at = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    create = client.post("/urls", json={
        "original_url": "https://google.com",
        "expires_at": expires_at
    })

    slug = create.json()["slug"]
    response = client.get(f"/{slug}", follow_redirects=False)

    assert response.status_code == 302

def test_get_metrics_history(client):

    expires_at = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    create = client.post("/urls", json={
        "original_url": "https://google.com",
        "expires_at": expires_at
    })
    slug = create.json()["slug"]
    client.get(f"/{slug}", follow_redirects=False)
    response = client.get(f"/urls/{slug}/history")
    assert response.status_code == 200
    assert "total_clicks" in response.json()
