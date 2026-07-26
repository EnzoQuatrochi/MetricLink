from src.infrastructure.database.metric_repository_implementation import MetricRepositoryImplementation
from src.infrastructure.database.url_repository_implementation import UrlRepositoryImplementation
from src.infrastructure.cache.cache_service import CacheService, get_connection as get_redis_connection

def get_url_repository():

    return UrlRepositoryImplementation()

def get_metric_repository():

    return MetricRepositoryImplementation()

def get_cache():

    return CacheService(get_redis_connection())