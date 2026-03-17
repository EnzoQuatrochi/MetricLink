class InvalidUrlError(Exception):

    def __init__(self):

        super().__init__("The given url is not valid. Certified to include https:// or http:/")

class ExpiredUrlError(Exception):

    def __init__(self):

        super().__init__("This url is already expired or can not be acessed.")

class UrlNotFoundError(Exception):

    def __init__(self, slug: str):

        super().__init__(f"No url found for the slug: {slug}")

class SlugAlreadyExistError(Exception):

    def __init__(self, slug: str):

        super().__init__(f"This slug: {slug} is already used.")
        