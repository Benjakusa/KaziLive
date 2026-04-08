from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Employer

bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@bp.route('/mpesa', methods=['POST'])
@jwt_required()
def init_mpesa_payment():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can make payments'}), 403
    
    phone = data.get('phone')
    if not phone:
        return jsonify({'error': 'Phone number required'}), 400
    
    return jsonify({
        'message': 'Payment initiated. Check your phone for STK push.',
        'demo_mode': True
    }), 200

@bp.route('/callback', methods=['POST'])
def mpesa_callback():
    data = request.get_json()
    return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'}), 200
