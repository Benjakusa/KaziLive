from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..utils.decorators import admin_required
from ..models.user import User, Jobseeker, Employer, UserType
from ..models.document import Document
from ..models.payment import Payment
from .. import db

bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        'id': u.id,
        'email': u.email,
        'username': u.username,
        'user_type': u.user_type.value,
        'is_active': u.is_active,
        'is_verified': u.is_verified,
        'created_at': u.created_at.strftime('%Y-%m-%d'),
    } for u in users]), 200


@bp.route('/documents', methods=['GET'])
@admin_required
def list_documents():
    """List all documents for verification review"""
    from datetime import datetime
    
    docs = Document.query.order_by(Document.uploaded_at.desc()).all()
    
    results = []
    for d in docs:
        user = User.query.get(d.user_id)
        user_name = "Unknown"
        user_type = "Unknown"
        
        if user:
            user_type = user.user_type.value
            if user_type == 'jobseeker':
                js = Jobseeker.query.get(user.id)
                user_name = js.full_name if js else user.username
            elif user_type == 'employer':
                emp = Employer.query.get(user.id)
                user_name = emp.company_name if emp else user.username
            else:
                user_name = user.username
                
        results.append({
            'id': d.id,
            'user_name': user_name,
            'user_type': user_type.capitalize(),
            'file_name': d.file_name,
            'file_url': d.file_url,
            'file_type': d.file_type,
            'status': d.status,
            'uploaded_at': d.uploaded_at.strftime('%Y-%m-%d') if d.uploaded_at else "Unknown"
        })
    return jsonify(results), 200


@bp.route('/documents/<int:doc_id>/approve', methods=['PUT'])
@admin_required
def approve_document(doc_id):
    from datetime import datetime
    document = Document.query.get(doc_id)

    if not document:
        return jsonify({'error': 'Document not found'}), 404

    document.status = 'Verified'
    document.approved_at = datetime.utcnow()
    
    # Auto-verify user if this is a primary document
    user = User.query.get(document.user_id)
    if user:
        user.is_verified = True
        
        # Double check specific models
        if user.user_type == UserType.JOBSEEKER:
            js = Jobseeker.query.get(user.id)
            if js: js.profile_verified = True
        elif user.user_type == UserType.EMPLOYER:
            emp = Employer.query.get(user.id)
            if emp:
                emp.verified = True
                emp.verified_at = datetime.utcnow()
    
    db.session.commit()

    return jsonify({
        'message': 'Document approved and user verified successfully',
        'document_id': doc_id,
        'status': 'Verified'
    }), 200


@bp.route('/users/<int:user_id>/deactivate', methods=['PUT'])
@admin_required
def deactivate_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.is_active = False
    db.session.commit()

    return jsonify({'message': f'User {user.username} deactivated'}), 200


@bp.route('/users/<int:user_id>/activate', methods=['PUT'])
@admin_required
def activate_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.is_active = True
    db.session.commit()

    return jsonify({'message': f'User {user.username} activated'}), 200


@bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    # Handle cascading deletes if necessary, but DB should handle foreign keys.
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200


@bp.route('/jobseekers/<int:user_id>/verify', methods=['PUT'])
@admin_required
def verify_jobseeker(user_id):
    jobseeker = Jobseeker.query.get(user_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404
    jobseeker.profile_verified = True
    db.session.commit()
    return jsonify({'message': 'Jobseeker profile verified successfully'}), 200


@bp.route('/jobseekers/<int:user_id>/unverify', methods=['PUT'])
@admin_required
def unverify_jobseeker(user_id):
    jobseeker = Jobseeker.query.get(user_id)
    if not jobseeker:
        return jsonify({'error': 'Jobseeker not found'}), 404
    jobseeker.profile_verified = False
    db.session.commit()
    return jsonify({'message': 'Jobseeker profile verification revoked'}), 200


@bp.route('/jobseekers', methods=['GET'])
@admin_required
def list_jobseekers():
    jobseekers = Jobseeker.query.all()
    return jsonify([{
        'id': js.id,
        'full_name': js.full_name,
        'job_category': js.job_category,
        'availability_status': js.availability_status,
        'expected_salary': js.expected_salary,
        'location': js.location,
        'profile_verified': js.profile_verified,
    } for js in jobseekers]), 200


@bp.route('/documents/<int:doc_id>/reject', methods=['PUT'])
@admin_required
def reject_document(doc_id):
    from flask import request
    document = Document.query.get(doc_id)
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    data = request.get_json() or {}
    reason = data.get('reason', 'Document did not meet verification requirements')
    
    document.status = 'Rejected'
    document.rejection_reason = reason
    db.session.commit()
    return jsonify({
        'message': f'Document rejected. Reason: {reason}',
        'document_id': doc_id,
        'status': 'Rejected'
    }), 200


@bp.route('/documents/<int:doc_id>', methods=['DELETE'])
@admin_required
def delete_document(doc_id):
    document = Document.query.get(doc_id)
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    # Optional: Delete from Cloudinary if needed, but for now just DB
    db.session.delete(document)
    db.session.commit()
    return jsonify({'message': 'Document deleted successfully'}), 200


@bp.route('/payments', methods=['GET'])
@admin_required
def list_payments():
    """Get all payments with employer token/verification info"""
    from ..models.payment import Payment
    from ..models.user import Employer
    
    payments = Payment.query.order_by(Payment.created_at.desc()).all()
    
    results = []
    for p in payments:
        user = User.query.get(p.user_id)
        employer = Employer.query.get(p.user_id) if user and user.user_type.value == 'employer' else None
        
        results.append({
            'id': p.id,
            'user_id': p.user_id,
            'user_email': user.email if user else 'Unknown',
            'user_name': employer.company_name if employer else (user.username if user else 'Unknown'),
            'transaction_id': p.transaction_id,
            'mpesa_receipt': p.mpesa_receipt,
            'phone': p.phone,
            'amount': p.amount,
            'status': p.status,
            'payment_type': p.payment_type,
            'created_at': p.created_at.strftime('%Y-%m-%d %H:%M') if p.created_at else None,
            'paid_at': p.paid_at.strftime('%Y-%m-%d %H:%M') if p.paid_at else None,
            'is_verified': employer.verified if employer else False,
            'payment_status': employer.payment_status if employer else None
        })
    
    return jsonify(results), 200


@bp.route('/employers', methods=['GET'])
@admin_required
def list_employers_with_tokens():
    """Get all employers with their token/verification status"""
    employers = Employer.query.order_by(Employer.verified.desc()).all()
    
    results = []
    for emp in employers:
        user = User.query.get(emp.id)
        payment = Payment.query.filter_by(user_id=emp.id, status='completed').first()
        
        results.append({
            'id': emp.id,
            'company_name': emp.company_name or 'Unknown',
            'email': user.email if user else 'Unknown',
            'company_location': emp.company_location or 'N/A',
            'verified': emp.verified,
            'verified_at': emp.verified_at.strftime('%Y-%m-%d') if emp.verified_at else None,
            'payment_status': emp.payment_status,
            'payment_transaction_id': emp.payment_transaction_id,
            'has_token': emp.verified,
            'token_granted_at': emp.verified_at.strftime('%Y-%m-%d') if emp.verified and emp.verified_at else None
        })
    
    return jsonify(results), 200


@bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    """Get platform-wide statistics for the admin dashboard"""
    total_users = User.query.count()
    jobseekers = Jobseeker.query.count()
    employers = Employer.query.count()
    pending_verifications = Document.query.filter_by(status='Under Review').count()
    total_docs = Document.query.count()
    
    # Simple revenue simulation if payment model is used
    from ..models.payment import Payment
    try:
        total_revenue = db.session.query(db.func.sum(Payment.amount)).scalar() or 0
    except:
        total_revenue = 0
    
    return jsonify({
        'total_users': total_users,
        'jobseekers': jobseekers,
        'employers': employers,
        'pending_verifications': pending_verifications,
        'total_documents': total_docs,
        'total_revenue': float(total_revenue),
        'server_status': 'Online'
    }), 200
