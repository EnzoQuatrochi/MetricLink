from datetime import datetime, timedelta
from domain.entities.url import Url
from domain.exceptions.url_exceptions import ExpiredUrlError, UrlNotFoundError
from fake.fake_repository_url import FakeUrlRepository
from application.use_cases.redirect_url import RedirectUrl
import pytest

def test_valid_redirect_url():

    expires_at = (datetime.now() + timedelta(days=1)).isoformat()
    fake_url = Url(slug="test1", original_url="https://leetcode.com/u/enzoquatrochi/", expires_at = expires_at)

    fakeRepository = FakeUrlRepository()
    fakeRepository.save_url(fake_url)
    redirect_use_case = RedirectUrl(fakeRepository)

    result = redirect_use_case.execute(slug="test1")

    assert result.slug == "test1"
    assert result.original_url == "https://leetcode.com/u/enzoquatrochi/"

def test_expired_redirect_url():

    expires_at = (datetime.now() - timedelta(days=1)).isoformat()
    fake_url = Url(slug="test2", original_url="https://leetcode.com/u/enzoquatrochi/", expires_at = expires_at)

    fakeRepository = FakeUrlRepository()
    fakeRepository.save_url(fake_url)
    redirect_use_case = RedirectUrl(fakeRepository)

    with pytest.raises(ExpiredUrlError):

        redirect_use_case.execute("test2")

def test_invalid_redirect_url():

    fakeRepository = FakeUrlRepository()
    redirect_use_case = RedirectUrl(fakeRepository)
    
    with pytest.raises(UrlNotFoundError):

        redirect_use_case.execute("test3")
