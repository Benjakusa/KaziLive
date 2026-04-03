import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///kazilive.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'

    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    SENDGRID_SENDER_EMAIL = os.getenv('SENDGRID_SENDER_EMAIL')
    SENDGRID_SENDER_NAME = os.getenv('SENDGRID_SENDER_NAME', 'KaziLive')
