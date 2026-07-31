from datetime import date
from fastapi.responses import RedirectResponse
from fastapi import APIRouter, Depends, Response
from src.application.use_cases.url.create_url import CreateUrl
from src.application.use_cases.url.delete_url import DeleteUrl
from src.application.use_cases.url.get_metrics import GetMetrics
from src.application.use_cases.url.redirect_url import RedirectUrl
from src.application.use_cases.url.get_urls_by_user import GetUrlsByUser
from src.infrastructure.http.schemas import CreateUrlRequest, UrlResponse
from src.infrastructure.http.dependencies import get_current_user, get_metric_repository, get_url_repository, get_cache, get_user_repository

router = APIRouter()        

@router.get("/favicon.ico")
def favicon():
    return Response(status_code=204)

@router.post("/urls")
def create_url(request: CreateUrlRequest, repository = Depends(get_url_repository), user_repository = Depends(get_user_repository), current_user = Depends(get_current_user)) -> UrlResponse:

    user = user_repository.get_user_by_email(current_user)

    use_case = CreateUrl(repository)

    return use_case.execute(request.original_url, request.expires_at, user.id)

@router.get("/{slug}")
def redirect_url(slug: str, repository = Depends(get_url_repository), metric_repository = Depends(get_metric_repository), cache = Depends(get_cache)):

    use_case = RedirectUrl(repository, cache)

    original_url = use_case.execute(slug)

    metric_repository.register_click(slug)

    return RedirectResponse(url=original_url, status_code=302)

@router.get("/urls/{slug}/metrics")
def get_metrics(slug: str, day: date, repository = Depends(get_metric_repository), current_user = Depends(get_current_user)):
    
    use_case = GetMetrics(repository)

    return {
        "total_clicks": use_case.get_total_clicks(slug),
        "clicks_per_day": use_case.get_clicks_per_day(slug, day)
    }

@router.get("/urls/{user_id}")
def get_urls_by_user(repository = Depends(get_url_repository), user_repository = Depends(get_user_repository), current_user = Depends(get_current_user)):

    user = user_repository.get_user_by_email(current_user)

    use_case = GetUrlsByUser(repository)

    return use_case.execute(user.id)

@router.get("/urls/{slug}/history")
def get_metrics_history(slug: str, repository = Depends(get_metric_repository), current_user = Depends(get_current_user)):

    use_case = GetMetrics(repository)

    return {
        "total_clicks": use_case.get_total_clicks(slug),
        "history": use_case.get_clicks_history(slug)
    }

@router.delete("/urls/{slug}")
def delete_url(slug: str, repository = Depends(get_url_repository), current_user = Depends(get_current_user)) -> None:

    use_case = DeleteUrl(repository)

    return use_case.execute(slug)
