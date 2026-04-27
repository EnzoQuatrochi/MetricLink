from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from datetime import date
from src.application.use_cases.create_url import CreateUrl
from src.application.use_cases.get_metrics import GetMetrics
from src.application.use_cases.delete_url import DeleteUrl
from src.application.use_cases.redirect_url import RedirectUrl
from src.infrastructure.http.schemas import CreateUrlRequest, UrlResponse
from src.infrastructure.database.metric_repository_implementation import MetricRepositoryImplementation
from src.infrastructure.database.url_repository_implementation import UrlRepositoryImplementation

router = APIRouter()

@router.post("/urls")
def create_url(request: CreateUrlRequest) -> UrlResponse:

    repository = UrlRepositoryImplementation()

    use_case = CreateUrl(repository)

    return use_case.execute(request.original_url, request.expires_at)

@router.get("/{slug}")
def redirect_url(slug: str):

    if slug == "favicon.ico":
        return None
    
    repository = UrlRepositoryImplementation()

    use_case = RedirectUrl(repository)

    url = use_case.execute(slug)

    metric_repository = MetricRepositoryImplementation()
    metric_repository.register_click(slug)

    return RedirectResponse(url=url.original_url, status_code=302)

@router.get("/urls/{slug}/metrics")
def get_metrics(slug: str, day: date):
    
    repository = MetricRepositoryImplementation()

    use_case = GetMetrics(repository)

    return {
        "total_clicks": use_case.get_total_clicks(slug),
        "clicks_per_day": use_case.get_clicks_per_day(slug, day)
    }

@router.delete("/urls/{slug}")
def delete_url(slug: str) -> None:

    repository = UrlRepositoryImplementation()

    use_case = DeleteUrl(repository)

    return use_case.execute(slug)
