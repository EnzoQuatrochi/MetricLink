import psycopg
from dotenv import dotenv_values

config = dotenv_values(".env")

def get_connection():

    try:

        conn = psycopg.connect(config["DATABASE_URL"])
        return conn

    except Exception as e:

        raise Exception (f"Error to connect with database: {e}")
