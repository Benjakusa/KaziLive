from .. import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum as SQLAlchemyEnum
import enum

class UserType(enum.Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"
    ADMIN = "admin"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    user_type = db.Column(SQLAlchemyEnum(UserType), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 2FA fields
    two_factor_token = db.Column(db.String(6), nullable=True)
    two_factor_expires = db.Column(db.DateTime, nullable=True)
    is_two_factor_enabled = db.Column(db.Boolean, default=False)
    
    # Relationships
    documents = db.relationship('Document', backref='user', lazy=True, cascade='all, delete-orphan')
    
    __mapper_args__ = {
        'polymorphic_on': user_type,
        'polymorphic_identity': 'user'
    }
    
    def __repr__(self):
        return f'<User {self.username}>'

class Jobseeker(User):
    __tablename__ = 'jobseekers'
    __mapper_args__ = {
        'polymorphic_identity': UserType.JOBSEEKER
    }
    
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    
    # Jobseeker specific fields
    availability_status = db.Column(db.String(50), default='available')
    job_category = db.Column(db.String(100))
    expected_salary = db.Column(db.Integer)  # Monthly salary expectation
    profile_verified = db.Column(db.Boolean, default=False)
    
    # Profile fields
    full_name = db.Column(db.String(100))
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))
    skills = db.Column(db.ARRAY(db.String))  # PostgreSQL array for skills
    
    # Relationships
    contacts = db.relationship('Contact', foreign_keys='Contact.jobseeker_id', backref='jobseeker', lazy=True)

class Employer(User):
    __tablename__ = 'employers'
    __mapper_args__ = {
        'polymorphic_identity': UserType.EMPLOYER
    }
    
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    
    # Employer specific fields
    company_name = db.Column(db.String(100))
    company_description = db.Column(db.Text)
    company_location = db.Column(db.String(100))
    verified = db.Column(db.Boolean, default=False)
    verified_at = db.Column(db.DateTime, nullable=True)
    
    # Payment fields
    payment_transaction_id = db.Column(db.String(100), nullable=True)
    payment_status = db.Column(db.String(50), default='pending')
    
    # Relationships
    contacts = db.relationship('Contact', foreign_keys='Contact.employer_id', backref='employer', lazy=True)

class Admin(User):
    __tablename__ = 'admins'
    __mapper_args__ = {
        'polymorphic_identity': UserType.ADMIN
    }
    
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    role = db.Column(db.String(50), default='super_admin')