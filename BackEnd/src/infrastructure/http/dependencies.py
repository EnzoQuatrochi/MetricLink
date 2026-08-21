from fastapi import Security
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.infrastructure.auth.jwt_service import decode_token
from src.infrastructure.database.metric_repository_implementation import MetricRepositoryImplementation
from src.infrastructure.database.url_repository_implementation import UrlRepositoryImplementation
from src.infrastructure.cache.cache_service import CacheService, get_connection as get_redis_connection
from src.infrastructure.database.user_repository_implementation import UserRepositoryImplementation

def get_url_repository():

    return UrlRepositoryImplementation()

def get_metric_repository():

    return MetricRepositoryImplementation()

def get_cache():

    return CacheService(get_redis_connection())

def get_user_repository():
    
    return UserRepositoryImplementation()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:

    try:
        name = decode_token(token)

        return name

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

def get_optional_user(token: str = Security(oauth2_scheme_optional)) -> str | None:

    if not token:

        return None
    try:
        
        return decode_token(token)
    except Exception:

        return None