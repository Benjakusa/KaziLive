"""
Migration script: Activate all users in the database.
Run this on the Render server to fix users registered with is_active=False.
"""
import sys
import os

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    users = User.query.filter_by(is_active=False).all()
    print(f"Found {len(users)} inactive users")
    
    for user in users:
        user.is_active = True
        user.is_verified = True
        print(f"  Activated: {user.email} ({user.user_type.value})")
    
    db.session.commit()
    print(f"Done. Activated {len(users)} users.")
    
    # Print stats
    total = User.query.count()
    active = User.query.filter_by(is_active=True).count()
    print(f"Total users: {total}, Active: {active}")
