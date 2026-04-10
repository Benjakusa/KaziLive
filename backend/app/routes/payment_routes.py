from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Employer
from ..models.payment import Payment
from ..services.daraja_service import DarajaAPI
from ..utils.email import send_payment_notification_email
from datetime import datetime
import uuid

bp = Blueprint('payments', __name__, url_prefix='/api/payments')

EMPLOYER_FEE = 500

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
    
    phone = phone.replace('+254', '0')
    if not phone.startswith('0'):
        phone = '0' + phone
    
    transaction_id = str(uuid.uuid4())
    
    payment = Payment(
        user_id=user_id,
        amount=EMPLOYER_FEE,
        transaction_id=transaction_id,
        phone=phone,
        status='pending',
        payment_type='employer_verification'
    )
    db.session.add(payment)
    db.session.commit()
    
    daraja = DarajaAPI()
    result = daraja.stk_push(
        phone=phone,
        amount=EMPLOYER_FEE,
        transaction_id=transaction_id,
        description="KaziLive Employer Verification"
    )
    
    if result.get('success'):
        payment.checkout_request_id = result.get('checkout_request_id')
        db.session.commit()
        return jsonify({
            'message': 'Payment initiated. Check your phone for STK push.',
            'transaction_id': transaction_id,
            'checkout_request_id': result.get('checkout_request_id')
        }), 200
    else:
        payment.status = 'failed'
        payment.error_message = result.get('error', 'Payment failed')
        db.session.commit()
        return jsonify({
            'error': result.get('error', 'Payment failed'),
            'transaction_id': transaction_id
        }), 400


@bp.route('/status/<transaction_id>', methods=['GET'])
@jwt_required()
def check_payment_status(transaction_id):
    payment = Payment.query.filter_by(transaction_id=transaction_id).first()
    
    if not payment:
        return jsonify({'error': 'Transaction not found'}), 404
    
    if payment.status == 'completed':
        return jsonify({
            'status': 'completed',
            'amount': payment.amount,
            'paid_at': payment.paid_at.isoformat() if payment.paid_at else None
        }), 200
    
    daraja = DarajaAPI()
    result = daraja.query_transaction(payment.checkout_request_id)
    
    if result.get('success') and result.get('result_code') == '0':
        payment.status = 'completed'
        payment.paid_at = datetime.utcnow()
        
        employer = Employer.query.get(payment.user_id)
        if employer:
            employer.verified = True
            employer.verified_at = datetime.utcnow()
            employer.payment_status = 'completed'
            employer.payment_transaction_id = transaction_id
            
            user = User.query.get(payment.user_id)
            if user:
                send_payment_notification_email(user.email, payment.amount, transaction_id)
        
        db.session.commit()
        
        return jsonify({
            'status': 'completed',
            'amount': payment.amount,
            'paid_at': payment.paid_at.isoformat()
        }), 200
    
    return jsonify({
        'status': payment.status,
        'message': 'Payment still processing'
    }), 200


@bp.route('/callback', methods=['POST'])
def mpesa_callback():
    try:
        data = request.get_json()
        
        result_code = data.get('ResultCode')
        result_desc = data.get('ResultDesc', '')
        
        callback_metadata = data.get('CallbackMetadata', {}).get('Item', [])
        
        transaction_id = None
        amount = None
        phone = None
        timestamp = None
        
        for item in callback_metadata:
            if item.get('Name') == 'TransactionID':
                transaction_id = item.get('Value')
            elif item.get('Name') == 'Amount':
                amount = item.get('Value')
            elif item.get('Name') == 'PhoneNumber':
                phone = item.get('Value')
            elif item.get('Name') == 'TransactionTime':
                timestamp = item.get('Value')
        
        payment = Payment.query.filter_by(checkout_request_id=transaction_id).first()
        
        if not payment and result_code == 0:
            payment = Payment.query.filter_by(transaction_id=data.get('CheckoutRequestID')).first()
        
        if payment and result_code == 0:
            payment.status = 'completed'
            payment.paid_at = datetime.utcnow()
            payment.mpesa_receipt = transaction_id
            
            employer = Employer.query.get(payment.user_id)
            if employer:
                employer.verified = True
                employer.verified_at = datetime.utcnow()
                employer.payment_status = 'completed'
                employer.payment_transaction_id = payment.transaction_id
                
                user = User.query.get(payment.user_id)
                if user:
                    send_payment_notification_email(user.email, payment.amount, transaction_id)
            
            db.session.commit()
        
        return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'}), 200
    except Exception as e:
        print(f"Callback error: {e}")
        return jsonify({'ResultCode': 1, 'ResultDesc': 'Failed'}), 200


@bp.route('/pricing', methods=['GET'])
def get_pricing():
    return jsonify({
        'employer_verification_fee': EMPLOYER_FEE,
        'currency': 'KES',
        'description': 'One-time payment to browse jobseeker profiles'
    }), 200