from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Jobseeker, Employer
from ..models.contact import Contact
from ..models.document import Document
from ..services.cloudinary_service import upload_image, upload_document

bp = Blueprint('employer', __name__, url_prefix='/api/employer', strict_slashes=False)

@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    """Upload a file (Company logo, documents)"""
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
        result = upload_image(file, folder=f'employers/{user_id}/images')
    elif file.content_type in allowed_document:
        result = upload_document(file, folder=f'employers/{user_id}/documents')
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

    # Update company logo if specified
    if file_type == 'company_logo':
        employer = Employer.query.get(user_id)
        if employer:
            employer.company_logo = result['url']
    
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
        'email': user.email,
        'username': user.username,
        'company_name': employer.company_name,
        'company_description': employer.company_description,
        'company_location': employer.company_location,
        'company_logo': employer.company_logo,
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
        return jsonify({'error': 'Payment required to view jobseeker profiles. Please complete payment to get verified.'}), 402
    
    job_category = request.args.get('job_category')
    availability = request.args.get('availability') # Default to None (show all)
    min_salary = request.args.get('min_salary', type=int)
    max_salary = request.args.get('max_salary', type=int)
    location = request.args.get('location')
    query = request.args.get('q', '').lower()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Get all jobseekers and filter in Python
    all_jobseekers = Jobseeker.query.all()
    
    results = []
    for js in all_jobseekers:
        user_info = User.query.get(js.id)
        if not user_info or not user_info.is_active:
            continue
        
        # Keyword search - handling NULL values with fallback
        if query:
            searchable_text = f"{js.full_name or ''} {js.job_category or ''} {' '.join(js.skills or [])}".lower()
            if query not in searchable_text:
                continue

        if job_category and js.job_category != job_category:
            continue
        if availability and js.availability_status != availability:
            continue
        if min_salary and (js.expected_salary is None or js.expected_salary < min_salary):
            continue
        if max_salary and (js.expected_salary is None or js.expected_salary > max_salary):
            continue
        if location and location.lower() not in (js.location or '').lower():
            continue
        
        results.append({
            'id': js.id,
            'full_name': js.full_name or "Incomplete Profile",
            'job_category': js.job_category or "Candidate",
            'availability_status': js.availability_status,
            'expected_salary': js.expected_salary,
            'years_of_experience': js.years_of_experience,
            'location': js.location or "Location not set",
            'skills': js.skills or [],
            'profile_picture': js.profile_picture
        })
    
    start = (page - 1) * per_page
    end = start + per_page
    paginated_items = results[start:end]
    total_pages = (len(results) + per_page - 1) // per_page
    
    return jsonify({
        'jobseekers': paginated_items,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': len(results),
            'pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
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
        return jsonify({'error': 'Payment required to view profiles. Please complete payment to get verified.'}), 402
    
    jobseeker = Jobseeker.query.get(jobseeker_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404
    jobseeker_user = User.query.get(jobseeker.id)
    
    # Get uploaded documents (CV, certificates)
    from ..models.document import Document
    documents = Document.query.filter_by(user_id=jobseeker_id).all()
    docs = [{'id': d.id, 'file_name': d.file_name, 'file_url': d.file_url, 'file_type': d.file_type, 'status': d.status} for d in documents]
    
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
        'skills': jobseeker.skills,
        'profile_verified': jobseeker.profile_verified,
        'profile_picture': jobseeker.profile_picture,
        'documents': docs
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


@bp.route('/contacts', methods=['GET'])
@jwt_required()
def get_employer_contacts():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can access contacts'}), 403
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    
    contacts = Contact.query.filter_by(employer_id=employer.id).order_by(Contact.created_at.desc()).all()
    return jsonify([{
        'id': c.id,
        'jobseeker_id': c.jobseeker_id,
        'jobseeker_name': Jobseeker.query.get(c.jobseeker_id).full_name if Jobseeker.query.get(c.jobseeker_id) else None,
        'message': c.message,
        'contact_method': c.contact_method,
        'status': c.status,
        'created_at': c.created_at.isoformat()
    } for c in contacts]), 200
@bp.route('/stk-push', methods=['POST'])
@jwt_required()
def stk_push_simulation():
    """Simulate M-Pesa STK Push"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can initiate payments'}), 403
    
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    
    data = request.get_json()
    amount = data.get('amount', 1000)
    phone_number = data.get('phone_number')
    
    if not phone_number:
        return jsonify({'error': 'Phone number is required'}), 400
    
    # Simulate a successful prompt
    import uuid
    from datetime import datetime
    from ..models.payment import Payment
    
    transaction_id = f"MPESA-{uuid.uuid4().hex[:8].upper()}"
    employer.verified = True
    employer.verified_at = datetime.utcnow()
    employer.payment_status = 'completed'
    employer.payment_transaction_id = transaction_id
    
    # Create Payment Record
    payment = Payment(
        user_id=user_id,
        transaction_id=transaction_id,
        phone=phone_number,
        amount=int(amount),
        status='completed',
        payment_type='employer_verification',
        paid_at=datetime.utcnow()
    )
    db.session.add(payment)
    db.session.commit()
    
    return jsonify({
        'message': 'STK Push initiated and payment simulated successfully',
        'CheckoutRequestID': uuid.uuid4().hex,
        'transaction_id': transaction_id,
        'status': 'success'
    }), 200


@bp.route('/payments', methods=['GET'])
@jwt_required()
def get_employer_payments():
    user_id = get_jwt_identity()
    from ..models.payment import Payment
    payments = Payment.query.filter_by(user_id=user_id).order_by(Payment.created_at.desc()).all()
    return jsonify([{
        'id': p.id,
        'transaction_id': p.transaction_id,
        'amount': p.amount,
        'status': p.status,
        'payment_type': p.payment_type,
        'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')
    } for p in payments]), 200

@bp.route('/stk-callback', methods=['POST'])
def stk_callback():
    """Placeholder for M-Pesa callback"""
    data = request.get_json()
    # Log callback data for debugging
    print(f"M-Pesa Callback Received: {data}")
    return jsonify({'ResultCode': 0, 'ResultDesc': 'Accepted'}), 200
