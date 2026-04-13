from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import Jobseeker, Employer
from ..models.document import Document
from ..models.contact import Contact
from ..services.cloudinary_service import upload_image, upload_document

bp = Blueprint('jobseeker', __name__, url_prefix='/api/jobseeker')

@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    """Upload a file (CV, certificate, profile image)"""
    user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    file_type = request.form.get('file_type', 'document')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file type
    allowed_image = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    allowed_document = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if file.content_type in allowed_image:
        result = upload_image(file, folder=f'jobseekers/{user_id}/images')
    elif file.content_type in allowed_document:
        result = upload_document(file, folder=f'jobseekers/{user_id}/documents')
    else:
        return jsonify({'error': 'File type not allowed. Use images or PDF/DOC.'}), 400
    
    if not result['success']:
        return jsonify({'error': result['error']}), 500
    
    # Save to database
    document = Document(
        user_id=user_id,
        file_name=file.filename,
        file_url=result['url'],
        file_type=file_type,
        file_size=request.content_length,
        status='pending'
    )
    db.session.add(document)
    db.session.commit()
    
    return jsonify({
        'message': 'File uploaded successfully',
        'file': {
            'id': document.id,
            'url': document.file_url,
            'type': document.file_type,
            'filename': document.file_name,
            'status': document.status
        }
    }), 201

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update jobseeker profile with availability, category, salary"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    jobseeker = Jobseeker.query.get(user_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker profile not found'}), 404
    
    # Update fields
    if 'full_name' in data:
        jobseeker.full_name = data['full_name']
    if 'availability_status' in data:
        jobseeker.availability_status = data['availability_status']
    if 'job_category' in data:
        jobseeker.job_category = data['job_category']
    if 'expected_salary' in data:
        jobseeker.expected_salary = data['expected_salary']
    if 'skills' in data:
        jobseeker.skills = data['skills']
    if 'location' in data:
        jobseeker.location = data['location']
    if 'bio' in data:
        jobseeker.bio = data['bio']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'profile': {
            'full_name': jobseeker.full_name,
            'availability_status': jobseeker.availability_status,
            'job_category': jobseeker.job_category,
            'expected_salary': jobseeker.expected_salary,
            'skills': jobseeker.skills,
            'profile_verified': jobseeker.profile_verified
        }
    }), 200

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get jobseeker profile"""
    user_id = get_jwt_identity()
    
    jobseeker = Jobseeker.query.get(user_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker profile not found'}), 404
    
    return jsonify({
        'id': jobseeker.id,
        'full_name': jobseeker.full_name,
        'bio': jobseeker.bio,
        'location': jobseeker.location,
        'availability_status': jobseeker.availability_status,
        'job_category': jobseeker.job_category,
        'expected_salary': jobseeker.expected_salary,
        'skills': jobseeker.skills or [],
        'profile_verified': jobseeker.profile_verified
    }), 200


@bp.route('/contacts', methods=['GET'])
@jwt_required()
def get_jobseeker_contacts():
    user_id = get_jwt_identity()
    jobseeker = Jobseeker.query.get(user_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker profile not found'}), 404
    
    contacts = Contact.query.filter_by(jobseeker_id=user_id).order_by(Contact.created_at.desc()).all()
    return jsonify([{
        'id': c.id,
        'employer_id': c.employer_id,
        'employer_name': Employer.query.get(c.employer_id).company_name if Employer.query.get(c.employer_id) else None,
        'message': c.message,
        'contact_method': c.contact_method,
        'status': c.status,
        'created_at': c.created_at.isoformat()
    } for c in contacts]), 200
