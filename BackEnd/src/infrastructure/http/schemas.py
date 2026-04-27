from pydantic import BaseModel
from datetime import date, datetime

class CreateUrlRequest(BaseModel):
    original_url: str
    expires_at: date

class UrlResponse(BaseModel):
    slug: str
    original_url: str
    created_at: datetime
    expires_at: datetime
    