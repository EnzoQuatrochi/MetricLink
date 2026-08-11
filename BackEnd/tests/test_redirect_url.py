import pytest
from datetime import datetime, timedelta
from src.domain.entities.url import Url
from src.domain.exceptions.url_exceptions import ExpiredUrlError, UrlNotFoundError
from tests.fake.fake_url_repository import FakeUrlRepository
from src.application.use_cases.url.redirect_url import RedirectUrl
from tests.fake.fake_cache_service import FakeCacheService

def test_valid_redirect_url():

    expires_at = (datetime.now() + timedelta(days=1)).isoformat()
    fake_url = Url(slug="test1", original_url="https://leetcode.com/u/enzoquatrochi/", expires_at = expires_at)

    fakeRepository = FakeUrlRepository()
    fakeRepository.save_url(fake_url)
    cache = FakeCacheService()
    redirect_use_case = RedirectUrl(fakeRepository, cache)

    result = redirect_use_case.execute(slug="test1")

    assert result == "https://leetcode.com/u/enzoquatrochi/"

def test_expired_redirect_url():

    expires_at = (datetime.now() - timedelta(days=1)).isoformat()
    fake_url = Url(slug="test2", original_url="https://leetcode.com/u/enzoquatrochi/", expires_at = expires_at)

    fakeRepository = FakeUrlRepository()
    fakeRepository.save_url(fake_url)
    cache = FakeCacheService()
    redirect_use_case = RedirectUrl(fakeRepository, cache)

    with pytest.raises(ExpiredUrlError):

        redirect_use_case.execute("test2")

def test_invalid_redirect_url():

    fakeRepository = FakeUrlRepository()
    cache = FakeCacheService()
    redirect_use_case = RedirectUrl(fakeRepository, cache)
    
    with pytest.raises(UrlNotFoundError):

        redirect_use_case.execute("test3")
