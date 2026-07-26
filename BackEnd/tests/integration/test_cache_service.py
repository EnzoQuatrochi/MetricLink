import pytest
import redis
from testcontainers.redis import RedisContainer
from src.infrastructure.cache.cache_service import CacheService

@pytest.fixture(scope="module")
def cache():
    with RedisContainer("redis:7") as container:
        conn = redis.Redis(
            host = container.get_container_host_ip(),
            port = container.get_exposed_port(6379)
        )
        yield CacheService(conn)

def test_set_cache(cache):

    cache.set("test_key", "https://google.com", 60)

def test_get_cache(cache):

    result = cache.get("test_key")
    assert result == b"https://google.com"

def test_delete_cache(cache):

    cache.set("test_key", "https://google.com", 60)
    cache.delete("test_key")
    result = cache.get("test_key")
    assert result is None
