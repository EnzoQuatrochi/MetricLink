from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from datetime import date
from src.infrastructure.http.dependencies import get_metric_repository, get_url_repository, get_cache
from src.application.use_cases.create_url import CreateUrl
from src.application.use_cases.get_metrics import GetMetrics
from src.application.use_cases.delete_url import DeleteUrl
from src.application.use_cases.redirect_url import RedirectUrl
from src.infrastructure.http.schemas import CreateUrlRequest, UrlResponse

router = APIRouter()

@router.post("/urls")
def create_url(request: CreateUrlRequest, repository = Depends(get_url_repository)) -> UrlResponse:

    use_case = CreateUrl(repository)

    return use_case.execute(request.original_url, request.expires_at)

@router.get("/{slug}")
def redirect_url(slug: str, repository = Depends(get_url_repository), metric_repository = Depends(get_metric_repository), cache = Depends(get_cache)):

    if slug == "favicon.ico":
        return None

    use_case = RedirectUrl(repository, cache)

    original_url = use_case.execute(slug)

    metric_repository.register_click(slug)

    return RedirectResponse(url=original_url, status_code=302)

@router.get("/urls/{slug}/metrics")
def get_metrics(slug: str, day: date, repository = Depends(get_metric_repository)):
    
    use_case = GetMetrics(repository)

    return {
        "total_clicks": use_case.get_total_clicks(slug),
        "clicks_per_day": use_case.get_clicks_per_day(slug, day)
    }

@router.get("/urls/{slug}/history")
def get_metrics_history(slug: str, repository = Depends(get_metric_repository)):

    use_case = GetMetrics(repository)

    return {
        "total_clicks": use_case.get_total_clicks(slug),
        "history": use_case.get_clicks_history(slug)
    }

@router.delete("/urls/{slug}")
def delete_url(slug: str, repository = Depends(get_url_repository)) -> None:

    use_case = DeleteUrl(repository)

    return use_case.execute(slug)
