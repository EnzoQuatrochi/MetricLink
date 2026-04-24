from pydantic import BaseModel
from datetime import date

class CreateUrlRequest(BaseModel):
    original_url: str
    expires_at: date
    