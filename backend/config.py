import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:password123@localhost/jobseeking_app')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    from datetime import timedelta
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Environment
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # Email (SendGrid)
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
    FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@jobseeking.com')
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', '')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET', '')
    
    # Daraja (Safaricom)
    DARAJA_SHORTCODE = os.getenv('DARAJA_SHORTCODE', '174379')
    DARAJA_CONSUMER_KEY = os.getenv('DARAJA_CONSUMER_KEY', '')
    DARAJA_CONSUMER_SECRET = os.getenv('DARAJA_CONSUMER_SECRET', '')
    DARAJA_PASSKEY = os.getenv('DARAJA_PASSKEY', '')
    
    # Pagination
    ITEMS_PER_PAGE = 20
