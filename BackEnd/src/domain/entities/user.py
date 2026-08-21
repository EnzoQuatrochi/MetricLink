class User:

    def __init__(self, name: str, password_hash: str, id: int | None = None):

        self.id = id
        self.name = name
        self.password_hash = password_hash

