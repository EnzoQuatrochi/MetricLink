from src.domain.entities.url import Url
from tests.fake.fake_url_repository import FakeUrlRepository
from src.application.use_cases.url.get_urls_by_user import GetUrlsByUser

def test_get_urls_by_user_valid():
    
    fakeUrl = FakeUrlRepository()

    url = Url(original_url="https://google.com", slug="test123", expires_at="2026-12-31", user_id=1)
    fakeUrl.save_url(url)

    use_case = GetUrlsByUser(fakeUrl)

    result = use_case.execute(1)
    assert len(result) == 1

def test_get_urls_by_user_invalid():

    fakeUrl = FakeUrlRepository()

    use_case = GetUrlsByUser(fakeUrl)

    result = use_case.execute(2)
    assert len(result) == 0