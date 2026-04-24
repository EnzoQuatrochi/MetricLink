from fastapi import APIRouter

router = APIRouter()

@router.post("/urls")
def create_url():
    pass

@router.get("/{slug}")
def get_url(slug: str):
    pass

@router.get("/urls/{slug}/metrics")
def get_metrics(slug: str):
    pass
