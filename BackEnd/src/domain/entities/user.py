class User:

    def __init__(self, email: str, password_hash: str, id: int | None = None):

        self.id = id
        self.email = email
        self.password_hash = password_hash

