from datetime import datetime, timedelta
from tests.fake.fake_url_repository import FakeUrlRepository
from src.application.use_cases.url.delete_url import DeleteUrl
from src.application.use_cases.url.create_url import CreateUrl

def test_delete_url():

    fakeUrl = FakeUrlRepository()
    create_url_use_case = CreateUrl(fakeUrl)

    expires_at = (datetime.now() + timedelta(days=30)).date()

    newUrl = create_url_use_case.execute("https://google.com", expires_at, None)

    delete = DeleteUrl(fakeUrl)
    delete.execute(newUrl.slug)

    result = fakeUrl.get_url(newUrl.slug)
    assert result is None