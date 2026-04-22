from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Jobseeker, Employer, UserType
from ..models.document import Document
from ..utils.decorators import jobseeker_required, employer_required, role_required

bp = Blueprint('user', __name__, url_prefix='/api/user')

# Alias for plural prefix handling if needed, or just handle in init.py
# For now, we fix the frontend, but we add the update method here for convenience.


@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    base = {
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'phone': user.phone,
        'user_type': user.user_type.value,
        'is_verified': user.is_verified,
        'created_at': user.created_at.isoformat(),
    }

    if user.user_type == UserType.JOBSEEKER:
        jobseeker = Jobseeker.query.get(user_id)
        base.update({
            'full_name': jobseeker.full_name,
            'bio': jobseeker.bio,
            'location': jobseeker.location,
            'availability_status': jobseeker.availability_status,
            'job_category': jobseeker.job_category,
            'expected_salary': jobseeker.expected_salary,
            'profile_verified': jobseeker.profile_verified,
            'skills': jobseeker.skills or [],
            'profile_picture': jobseeker.profile_picture,
            'years_of_experience': jobseeker.years_of_experience,
            'documents': [{'id': d.id, 'name': d.file_name, 'url': d.file_url, 'type': d.file_type, 'status': d.status} for d in Document.query.filter_by(user_id=user_id).all()]
        })
    elif user.user_type == UserType.EMPLOYER:
        employer = Employer.query.get(user_id)
        base.update({
            'company_name': employer.company_name,
            'company_description': employer.company_description,
            'company_location': employer.company_location,
            'verified': employer.verified,
            'payment_status': employer.payment_status,
            'company_logo': employer.company_logo
        })

    return jsonify(base), 200


@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Unified profile update that routes to specific handlers"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    
    # Update common fields
    if 'username' in data: user.username = data['username']
    if 'phone' in data: user.phone = data['phone']
    
    # Route to specific model updates
    if user.user_type == UserType.JOBSEEKER:
        from .jobseeker_routes import update_profile as js_update
        return js_update()
    elif user.user_type == UserType.EMPLOYER:
        from .employer_routes import update_employer_profile as emp_update
        return emp_update()
    
    db.session.commit()
    return jsonify({'message': 'Profile updated'}), 200


@bp.route('/jobseeker/profile', methods=['GET'])
@jobseeker_required
def jobseeker_profile():
    user_id = int(get_jwt_identity())
    jobseeker = Jobseeker.query.get(user_id)

    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404

    return jsonify({
        'id': jobseeker.id,
        'username': jobseeker.username,
        'email': jobseeker.email,
        'full_name': jobseeker.full_name,
        'bio': jobseeker.bio,
        'location': jobseeker.location,
        'availability_status': jobseeker.availability_status,
        'job_category': jobseeker.job_category,
        'expected_salary': jobseeker.expected_salary,
        'profile_verified': jobseeker.profile_verified,
        'skills': jobseeker.skills or [],
        'profile_picture': jobseeker.profile_picture
    }), 200


@bp.route('/employer/profile', methods=['GET'])
@employer_required
def employer_profile():
    user_id = int(get_jwt_identity())
    employer = Employer.query.get(user_id)

    if not employer:
        return jsonify({'error': 'Employer not found'}), 404

    return jsonify({
        'id': employer.id,
        'username': employer.username,
        'email': employer.email,
        'company_name': employer.company_name,
        'company_description': employer.company_description,
        'company_location': employer.company_location,
        'verified': employer.verified,
        'payment_status': employer.payment_status,
        'company_logo': employer.company_logo
    }), 200


@bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json()
    old_password = data.get('old_password') or data.get('oldPassword')
    new_password = data.get('new_password') or data.get('newPassword')
    
    if not old_password or not new_password:
        return jsonify({'error': 'Old and new passwords are required'}), 400
        
    from werkzeug.security import check_password_hash, generate_password_hash
    if not check_password_hash(user.password_hash, old_password):
        return jsonify({'error': 'Incorrect old password'}), 401
        
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200
