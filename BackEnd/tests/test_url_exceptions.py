import pytest
from src.domain.exceptions.url_exceptions import (
    InvalidUrlError, 
    ExpiredUrlError, 
    UrlNotFoundError, 
    SlugAlreadyExistError
)

def test_invalid_url_error():

    with pytest.raises(InvalidUrlError):
        raise InvalidUrlError()
    
def test_expired_url_error():

    with pytest.raises(ExpiredUrlError):
        raise ExpiredUrlError()
    
def test_url_not_found_error():

    with pytest.raises(UrlNotFoundError) as exc:
        raise UrlNotFoundError(slug="test1")
    
    assert "test1" in str(exc.value)

def test_slug_already_exist_error():

    with pytest.raises(SlugAlreadyExistError) as exc:
        raise SlugAlreadyExistError(slug="test1")
    
    assert "test1" in str(exc.value)