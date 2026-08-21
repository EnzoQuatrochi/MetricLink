import pytest
from src.application.use_cases.user.login import Login
from src.application.use_cases.user.register import Register
from tests.fake.fake_user_repository import FakeUserRepository
from src.domain.exceptions.user_exceptions import InvalidCredentialsError, UserNotFoundError

def test_login():

    repo = FakeUserRepository()
    register_use_case = Register(repo)
    register_use_case.execute("teste", "password")

    login_use_case = Login(repo)
    token = login_use_case.execute("teste", "password")
    
    assert token is not None
    assert isinstance(token, str)

def test_invalid_name_login():

    repo = FakeUserRepository()
    login_use_case = Login(repo)

    with pytest.raises(UserNotFoundError):
        login_use_case.execute("nouser", "password")

def test_invalid_password_login():

    repo = FakeUserRepository()
    register_use_case = Register(repo)
    register_use_case.execute("teste", "")

    login_use_case = Login(repo)

    with pytest.raises(InvalidCredentialsError):
        login_use_case.execute("teste", "password")