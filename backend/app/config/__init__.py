import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MYSQL_DATABASE_HOST: str = "localhost"
    MYSQL_DATABASE_USER: str = "root"
    MYSQL_DATABASE_PASSWORD: str = "1234567890"
    MYSQL_DATABASE_DB: str = "basededatos"
    MYSQL_DATABASE_PORT: int = 3307
    MYSQL_DATABASE_CHARSET: str = "utf8mb4"
    MONGO_URI: str = os.getenv("MONGO_URI")
