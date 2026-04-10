from app import create_app, db
from app.models.user import Admin, UserType
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    db.create_all()
    admin_email = "admin@kazilive.com"
    # Try to find user by email or username to avoid unique constraints
    if Admin.query.filter_by(email=admin_email).first():
        print(f"Admin with email {admin_email} already exists.")
    else:
        admin = Admin(
            email=admin_email,
            username="admin",
            phone="0712345678", # Dummy unique phone
            password_hash=generate_password_hash("@Admin.2026."),
            user_type=UserType.ADMIN,
            is_active=True,
            is_verified=True
        )
        try:
            db.session.add(admin)
            db.session.commit()
            print(f"Admin account created: {admin_email}")
        except Exception as e:
            db.session.rollback()
            print(f"Error creating admin: {e}")
