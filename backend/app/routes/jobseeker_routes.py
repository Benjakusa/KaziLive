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
    allowed_document = ['application/pdf']
    
    if file.content_type in allowed_image:
        result = upload_image(file, folder=f'jobseekers/{user_id}/images')
    elif file.content_type in allowed_document:
        result = upload_document(file, folder=f'jobseekers/{user_id}/documents')
    else:
        return jsonify({'error': 'File type not allowed. Use images (JPG/PNG/GIF) or PDF.'}), 400
    
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

    # Update profile picture if specified
    if file_type == 'profile_picture':
        jobseeker = Jobseeker.query.get(user_id)
        if jobseeker:
            jobseeker.profile_picture = result['url']
    
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

@bp.route('/upload-public', methods=['POST'])
def upload_public_file():
    """Upload a profile image for registration (no auth required)"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    file_type = request.form.get('file_type', 'profile_picture')
    
    # Only allow profile_picture or company_logo for public upload
    if file_type not in ['profile_picture', 'company_logo', 'logo']:
        return jsonify({'error': 'Unauthorized file type for public upload'}), 403
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file type
    allowed_image = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if file.content_type not in allowed_image:
        return jsonify({'error': 'Only images are allowed for public upload'}), 400
        
    result = upload_image(file, folder='temp_registrations')
    
    if not result['success']:
        return jsonify({'error': result['error']}), 500
    
    return jsonify({
        'message': 'File uploaded successfully',
        'url': result['url']
    }), 201

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update jobseeker profile with availability, category, salary"""
    user_id = get_jwt_identity()
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        jobseeker = Jobseeker.query.get(user_id)
        if not jobseeker:
            return jsonify({'error': 'Jobseeker profile not found'}), 404
        
        # Update user-level fields (email, phone)
        if 'email' in data:
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user_id:
                return jsonify({'error': 'Email already taken'}), 400
            jobseeker.email = data['email']
            
        if 'phone' in data:
            existing = User.query.filter_by(phone=data['phone']).first()
            if existing and existing.id != user_id:
                return jsonify({'error': 'Phone number already taken'}), 400
            jobseeker.phone = data['phone']

        # Update jobseeker-specific fields
        if 'full_name' in data:
            jobseeker.full_name = data['full_name']
        if 'availability_status' in data:
            jobseeker.availability_status = data['availability_status']
        if 'job_category' in data:
            jobseeker.job_category = data['job_category']
        if 'expected_salary' in data:
            try:
                jobseeker.expected_salary = int(data.get('expected_salary') or 0)
            except (ValueError, TypeError):
                jobseeker.expected_salary = 0
        if 'skills' in data:
            jobseeker.skills = data['skills']
        if 'location' in data:
            jobseeker.location = data['location']
        if 'bio' in data:
            jobseeker.bio = data['bio']
        if 'years_of_experience' in data:
            try:
                jobseeker.years_of_experience = int(data.get('years_of_experience') or 0)
            except (ValueError, TypeError):
                jobseeker.years_of_experience = 0
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'full_name': jobseeker.full_name,
                'email': jobseeker.email,
                'phone': jobseeker.phone,
                'job_category': jobseeker.job_category,
                'skills': jobseeker.skills
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR in update_profile: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error during profile update', 'details': str(e)}), 500

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
        'years_of_experience': jobseeker.years_of_experience,
        'skills': jobseeker.skills or [],
        'profile_verified': jobseeker.profile_verified,
        'profile_picture': jobseeker.profile_picture
    }), 200


@bp.route('/documents', methods=['GET'])
@jwt_required()
def get_documents():
    """Get all documents for the authenticated jobseeker"""
    user_id = get_jwt_identity()
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': doc.id,
        'name': doc.file_name,
        'url': doc.file_url,
        'type': doc.file_type,
        'size': f"{doc.file_size // 1024} KB" if doc.file_size else "Unknown",
        'status': doc.status,
        'date': doc.uploaded_at.strftime('%Y-%m-%d') if doc.uploaded_at else "Unknown"
    } for doc in documents]), 200

@bp.route('/documents/<int:doc_id>', methods=['DELETE'])
@jwt_required()
def delete_document(doc_id):
    """Delete a specific document"""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not document:
        return jsonify({'error': 'Document not found or access denied'}), 404
    
    db.session.delete(document)
    db.session.commit()
    
    return jsonify({'message': 'Document deleted successfully'}), 200


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

@bp.route('/request-verification', methods=['POST'])
@jwt_required()
def request_verification():
    """Request verification of all uploaded documents"""
    user_id = get_jwt_identity()
    jobseeker = Jobseeker.query.get(user_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker profile not found'}), 404
        
    documents = Document.query.filter_by(user_id=user_id).all()
    if not documents:
        return jsonify({'error': 'No documents found to verify. Please upload your CV first.'}), 400
        
    try:
        # Update all 'pending' or 'rejected' documents to 'Under Review'
        for doc in documents:
            if doc.status in ['pending', 'rejected']:
                doc.status = 'Under Review'
        
        # Mark profile as pending verification if field exists
        if hasattr(jobseeker, 'profile_verified'):
            jobseeker.profile_verified = False # It's already false, but ensures it's pending
            
        db.session.commit()
        
        # In a real app, we would send a notification to admins here
        
        return jsonify({
            'message': 'Verification request submitted successfully. Our team will review your portfolio.',
            'status': 'Under Review'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to submit request: {str(e)}'}), 500

@bp.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    """Permanently delete user account and profile"""
    user_id = get_jwt_identity()
    jobseeker = Jobseeker.query.get(user_id)
    
    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404
        
    try:
        # Delete associated contacts first
        from ..models.contact import Contact
        Contact.query.filter_by(jobseeker_id=user_id).delete()
        
        # Delete the user and associated data
        db.session.delete(jobseeker)
        db.session.commit()
        
        return jsonify({'message': 'Account and profile deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500
