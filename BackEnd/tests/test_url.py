from src.domain.entities.url import Url
from datetime import datetime, timedelta

def test_valid_url():
    
    expires_at = (datetime.now() + timedelta(days=1)).isoformat()
    url = Url(slug="test1", original_url="https://leetcode.com/u/enzoquatrochi/", expires_at = expires_at)
    assert not url.is_expired() 

def test_exipired_url():
    
    expires_at = (datetime.now() - timedelta(days=1)).isoformat()
    url = Url(slug="test1", original_url="https://leetcode.com/u/enzoquatrochi/", expires_at = expires_at)
    assert url.is_expired() 
    