import os
from dotenv import load_dotenv

# Load secrets from .env file
load_dotenv()

class Config:
    # Database - simple connection
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password123@localhost/jobseeking_app')
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'timothy-super-secret-key-123')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'timothy-jwt-secret-456')
    
    # App settings
    DEBUG = True
    
    # Daraja Payment - SUPER SIMPLE SHORTCODE
    # Shortcode: 174379 (easy to remember - like "1-7-4-3-7-9")
    DARAJA_SHORTCODE = "174379"  # Simple: 1 7 4 3 7 9
    DARAJA_CONSUMER_KEY = os.getenv('DARAJA_CONSUMER_KEY', '')
    DARAJA_CONSUMER_SECRET = os.getenv('DARAJA_CONSUMER_SECRET', '')
    DARAJA_PASSKEY = os.getenv('DARAJA_PASSKEY', '')
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', '')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET', '')
    
    # SendGrid
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
    FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@jobseeking.com')
