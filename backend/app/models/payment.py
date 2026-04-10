from .. import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    transaction_id = db.Column(db.String(100), unique=True, nullable=False)
    checkout_request_id = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='pending')
    payment_type = db.Column(db.String(50), default='employer_verification')
    mpesa_receipt = db.Column(db.String(50), nullable=True)
    error_message = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime, nullable=True)
    
    user = db.relationship('User', backref='payments')
    
    def __repr__(self):
        return f'<Payment {self.transaction_id}>'