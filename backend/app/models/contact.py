from .. import db
from datetime import datetime

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    jobseeker_id = db.Column(db.Integer, db.ForeignKey('jobseekers.id'), nullable=False)
    message = db.Column(db.Text)
    contact_method = db.Column(db.String(50), default='email')
    status = db.Column(db.String(50), default='sent')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('employer_id', 'jobseeker_id', name='unique_contact'),
    )
