from datetime import date, datetime, timedelta
from fake.fake_metric_repository import FakeMetricRepository

def test_register_and_get_click():

    fakeMetrics = FakeMetricRepository()

    fakeMetrics.register_click("test1")
    fakeMetrics.register_click("test1")

    assert fakeMetrics.get_all_clicks("test1") == 2

def test_get_clicks_per_day_valid():

    fakeMetrics = FakeMetricRepository()

    fakeMetrics.register_click("test2")

    today = date.today().isoformat()

    assert fakeMetrics.get_clicks_per_day("test2", today) == 1

def test_get_clicks_per_day_invalid():

    fakeMetrics = FakeMetricRepository()

    fakeMetrics.register_click("test3")

    yesterday = (datetime.now() - timedelta(days=1)).isoformat()

    assert fakeMetrics.get_clicks_per_day("test3", yesterday) == 0
