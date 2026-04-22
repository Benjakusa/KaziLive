from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.notification import Notification

bp = Blueprint('notification', __name__, url_prefix='/api/notifications')


@bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(50).all()
    return jsonify([{
        'id': n.id,
        'title': n.title,
        'message': n.message,
        'notification_type': n.notification_type,
        'is_read': n.is_read,
        'created_at': n.created_at.isoformat()
    } for n in notifications]), 200


@bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notif_id):
    user_id = get_jwt_identity()
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if not notif:
        return jsonify({'error': 'Notification not found'}), 404
    notif.is_read = True
    db.session.commit()
    return jsonify({'message': 'Marked as read'}), 200


@bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200


def create_notification(user_id, title, message, notif_type='general'):
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notif_type
    )
    db.session.add(notif)
    db.session.commit()