import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "devsecretkey")
    SQLALCHEMY_DATABASE_URI = "sqlite:///perfectmatch.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False