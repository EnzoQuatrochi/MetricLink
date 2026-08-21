import pytest
from src.application.use_cases.user.register import Register
from tests.fake.fake_user_repository import FakeUserRepository
from src.domain.exceptions.user_exceptions import UserAlreadyExistsError

def test_register_valid():

    repo = FakeUserRepository()
    use_case = Register(repo)
    use_case.execute("teste", "password")

    result = repo.get_user_by_name("teste")

    assert result is not None
    assert result.name == "teste"

def test_register_invalid():

    repo = FakeUserRepository()
    use_case = Register(repo)
    use_case.execute("teste", "password")

    with pytest.raises(UserAlreadyExistsError):
        use_case.execute("teste", "password123")