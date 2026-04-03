from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..utils.decorators import admin_required
from ..models.user import User, Jobseeker, Employer, UserType
from ..models.document import Document
from .. import db

bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'email': u.email,
        'username': u.username,
        'user_type': u.user_type.value,
        'is_active': u.is_active,
        'is_verified': u.is_verified,
        'created_at': u.created_at.isoformat(),
    } for u in users]), 200


@bp.route('/documents', methods=['GET'])
@admin_required
def list_documents():
    documents = Document.query.all()
    return jsonify([{
        'id': d.id,
        'user_id': d.user_id,
        'filename': d.filename,
        'is_approved': d.is_approved,
        'uploaded_at': d.uploaded_at.isoformat() if hasattr(d, 'uploaded_at') else None,
    } for d in documents]), 200


@bp.route('/documents/<int:doc_id>/approve', methods=['PUT'])
@admin_required
def approve_document(doc_id):
    document = Document.query.get(doc_id)

    if not document:
        return jsonify({'error': 'Document not found'}), 404

    document.is_approved = True
    db.session.commit()

    return jsonify({
        'message': 'Document approved successfully',
        'document_id': doc_id,
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
