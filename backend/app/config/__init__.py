import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    JWT_SECRET_KEY: str | None = os.getenv("JWT_SECRET_KEY")
    MYSQL_DATABASE_HOST: str | None = os.getenv("MYSQL_DATABASE_HOST")
    MYSQL_DATABASE_USER: str | None = os.getenv("MYSQL_DATABASE_USER")
    MYSQL_DATABASE_PASSWORD: str | None = os.getenv("MYSQL_DATABASE_PASSWORD")
    MYSQL_DATABASE_DB: str | None = os.getenv("MYSQL_DATABASE_DB")
    MYSQL_DATABASE_PORT: int = int(os.getenv("MYSQL_DATABASE_PORT") or "3306")
    MYSQL_DATABASE_CHARSET: str = "utf8mb4"
    MONGO_URI: str | None = os.getenv("MONGO_URI")
