from fake.fake_repository_url import FakeUrlRepository
from datetime import datetime, timedelta
from application.use_cases.create_url import CreateUrl
from domain.entities.url import Url

def test_create_url_valid():

    fakeUrl = FakeUrlRepository()
    create_url_use_case = CreateUrl(fakeUrl)

    expires_at = (datetime.now() + timedelta(days=30)).isoformat()

    newUrl = create_url_use_case.execute("https://google.com", expires_at)

    assert isinstance(newUrl, Url)
    assert newUrl.original_url == "https://google.com"
    assert newUrl.slug is not None
    assert len(newUrl.slug) > 0