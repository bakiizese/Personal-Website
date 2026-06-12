import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key-change-in-production")
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")
    CONTACT_LOG_PATH = os.environ.get("CONTACT_LOG_PATH", "./logs/contact.jsonl")
    MAX_CONTENT_LENGTH = 16 * 1024


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "").split(",")
