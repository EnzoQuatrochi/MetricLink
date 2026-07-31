from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from src.application.use_cases.user.login import Login
from src.infrastructure.http.schemas import RegisterRequest
from src.application.use_cases.user.register import Register
from src.infrastructure.http.dependencies import get_current_user, get_user_repository

router = APIRouter()

@router.post("/auth/register")
def create_user(request: RegisterRequest, repository = Depends(get_user_repository), current_user = Depends(get_current_user)) -> dict:

    use_case = Register(repository)

    use_case.execute(request.email, request.password)

    return {"message": "User created successfully"}

@router.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), repository = Depends(get_user_repository)):

    use_case = Login(repository)

    token = use_case.execute(form_data.username, form_data.password)
    
    return {"access_token": token, "token_type": "bearer"}