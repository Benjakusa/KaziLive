from .. import db
from datetime import datetime

class ProfilePromotion(db.Model):
    __tablename__ = 'profile_promotions'
    
    id = db.Column(db.Integer, primary_key=True)
    jobseeker_id = db.Column(db.Integer, db.ForeignKey('jobseekers.id'), nullable=False)
    promotion_type = db.Column(db.String(50), default='featured')
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    jobseeker = db.relationship('Jobseeker', backref='promotions')
    
    def __repr__(self):
        return f'<ProfilePromotion {self.id}>'


class Advertisement(db.Model):
    __tablename__ = 'advertisements'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    target_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    views = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    employer = db.relationship('Employer', backref='advertisements')
    
    def __repr__(self):
        return f'<Advertisement {self.id}>'