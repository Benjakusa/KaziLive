import random
import string
from datetime import datetime, timedelta


def generate_verification_token(length=6):
    """Generate a 6-digit numeric token."""
    return ''.join(random.choices(string.digits, k=length))


def get_token_expiry(minutes=30):
    """Token valid for 30 minutes."""
    return datetime.utcnow() + timedelta(minutes=minutes)


def send_verification_email(email, token):
    """
    Console email logger — replaced with SendGrid in Task 4.
    """
    print("\n" + "="*50)
    print("📧 VERIFICATION EMAIL (Console Logger)")
    print(f"   To:    {email}")
    print(f"   Token: {token}")
    print(f"   Valid: 30 minutes")
    print("="*50 + "\n")