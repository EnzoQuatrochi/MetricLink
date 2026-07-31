class UserAlreadyExistsError(Exception):

    def __init__(self):

        super().__init__("The user already exists. Try to login.")

class InvalidCredentialsError(Exception):

    def __init__(self):

        super().__init__("Email ou password incorrect. Try again.")

class UserNotFoundError(Exception):

    def __init__(self):

        super().__init__("User not found. Try create or fix the incorrect credentials")