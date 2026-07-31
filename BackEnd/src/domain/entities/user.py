class User:

    def __init__(self, id: int, email: str, password_hash: str):

        self.id = id
        self.email = email
        self.password_hash = password_hash

