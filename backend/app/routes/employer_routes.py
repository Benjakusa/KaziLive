from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Jobseeker, Employer
from ..models.contact import Contact

bp = Blueprint('employer', __name__, url_prefix='/api/employer')

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_employer_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Not an employer account'}), 403
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    return jsonify({
        'id': employer.id,
        'company_name': employer.company_name,
        'company_description': employer.company_description,
        'company_location': employer.company_location,
        'verified': employer.verified,
        'payment_status': employer.payment_status
    }), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_employer_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Not an employer account'}), 403
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    if 'company_name' in data:
        employer.company_name = data['company_name']
    if 'company_description' in data:
        employer.company_description = data['company_description']
    if 'company_location' in data:
        employer.company_location = data['company_location']
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200

@bp.route('/jobseekers', methods=['GET'])
@jwt_required()
def search_jobseekers():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can access this endpoint'}), 403
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    if not employer.verified:
        return jsonify({'error': 'Payment required to view jobseeker profiles'}), 402
    
    job_category = request.args.get('job_category')
    availability = request.args.get('availability')
    min_salary = request.args.get('min_salary', type=int)
    max_salary = request.args.get('max_salary', type=int)
    location = request.args.get('location')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    query = Jobseeker.query.join(User).filter(User.is_active == True)
    if job_category:
        query = query.filter(Jobseeker.job_category == job_category)
    if availability:
        query = query.filter(Jobseeker.availability_status == availability)
    if min_salary:
        query = query.filter(Jobseeker.expected_salary >= min_salary)
    if max_salary:
        query = query.filter(Jobseeker.expected_salary <= max_salary)
    if location:
        query = query.filter(Jobseeker.location.ilike(f'%{location}%'))
    
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    jobseekers = []
    for js in paginated.items:
        jobseekers.append({
            'id': js.id,
            'full_name': js.full_name,
            'job_category': js.job_category,
            'availability_status': js.availability_status,
            'expected_salary': js.expected_salary,
            'location': js.location,
            'skills': js.skills
        })
    return jsonify({
        'jobseekers': jobseekers,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': paginated.total,
            'pages': paginated.pages,
            'has_next': paginated.has_next,
            'has_prev': paginated.has_prev
        }
    }), 200

@bp.route('/jobseekers/<int:jobseeker_id>', methods=['GET'])
@jwt_required()
def view_jobseeker_profile(jobseeker_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can access this endpoint'}), 403
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    if not employer.verified:
        return jsonify({'error': 'Payment required to view profiles'}), 402
    jobseeker = Jobseeker.query.get(jobseeker_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404
    jobseeker_user = User.query.get(jobseeker.id)
    return jsonify({
        'id': jobseeker.id,
        'email': jobseeker_user.email,
        'phone': jobseeker_user.phone,
        'full_name': jobseeker.full_name,
        'bio': jobseeker.bio,
        'location': jobseeker.location,
        'availability_status': jobseeker.availability_status,
        'job_category': jobseeker.job_category,
        'expected_salary': jobseeker.expected_salary,
        'skills': jobseeker.skills
    }), 200

@bp.route('/contact/<int:jobseeker_id>', methods=['POST'])
@jwt_required()
def contact_jobseeker(jobseeker_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can contact jobseekers'}), 403
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    if not employer.verified:
        return jsonify({'error': 'Payment required to contact jobseekers'}), 402
    jobseeker = Jobseeker.query.get(jobseeker_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404
    
    message = data.get('message')
    if not message or len(message) < 10:
        return jsonify({'error': 'Message must be at least 10 characters'}), 400
    
    contact_method = data.get('contact_method', 'email')
    
    contact = Contact(
        employer_id=employer.id,
        jobseeker_id=jobseeker_id,
        message=message,
        contact_method=contact_method,
        status='sent'
    )
    db.session.add(contact)
    db.session.commit()
    
    return jsonify({
        'message': 'Message sent successfully',
        'contact_id': contact.id
    }), 200
