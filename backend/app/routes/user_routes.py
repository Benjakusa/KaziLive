from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Jobseeker, Employer, UserType
from ..utils.decorators import jobseeker_required, employer_required, role_required

bp = Blueprint('user', __name__, url_prefix='/api/user')


@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
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

    # Append role-specific fields
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
        })
    elif user.user_type == UserType.EMPLOYER:
        employer = Employer.query.get(user_id)
        base.update({
            'company_name': employer.company_name,
            'company_description': employer.company_description,
            'company_location': employer.company_location,
            'verified': employer.verified,
            'payment_status': employer.payment_status,
        })

    return jsonify(base), 200


@bp.route('/jobseeker/profile', methods=['GET'])
@jobseeker_required
def jobseeker_profile():
    """Jobseeker-only profile endpoint."""
    user_id = get_jwt_identity()
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
    }), 200


@bp.route('/employer/profile', methods=['GET'])
@employer_required
def employer_profile():
    """Employer-only profile endpoint."""
    user_id = get_jwt_identity()
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
    }), 200