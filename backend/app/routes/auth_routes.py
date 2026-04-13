from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from .. import db
from ..models.user import User, Jobseeker, Employer, Admin, UserType
from ..utils.email import generate_verification_token, get_token_expiry, send_verification_email

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required = ['email', 'username', 'phone', 'password', 'user_type']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'error': 'Phone number already registered'}), 409

    try:
        user_type = UserType(data['user_type'])
    except ValueError:
        return jsonify({'error': 'Invalid user_type. Must be: jobseeker, employer, or admin'}), 400

    password_hash = generate_password_hash(data['password'])

    token = generate_verification_token()
    token_expiry = get_token_expiry()

    if user_type == UserType.JOBSEEKER:
        user = Jobseeker(
            email=data['email'],
            username=data['username'],
            phone=data['phone'],
            password_hash=password_hash,
            user_type=user_type,
            is_active=True,
            is_verified=True,
        )
    elif user_type == UserType.EMPLOYER:
        user = Employer(
            email=data['email'],
            username=data['username'],
            phone=data['phone'],
            password_hash=password_hash,
            user_type=user_type,
            is_active=True,
            is_verified=True,
            company_name=data.get('company_name', ''),
        )
    elif user_type == UserType.ADMIN:
        user = Admin(
            email=data['email'],
            username=data['username'],
            phone=data['phone'],
            password_hash=password_hash,
            user_type=user_type,
            is_active=True,
            is_verified=True,
        )

    db.session.add(user)
    db.session.commit()

    send_verification_email(user.email, token)

    return jsonify({
        'message': 'Registration successful. Check your email for the verification token.',
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type.value,
            'is_active': user.is_active,
        }
    }), 201


@bp.route('/verify-email', methods=['POST'])
def verify_email():
    data = request.get_json()

    email = data.get('email')
    token = data.get('token')

    if not email or not token:
        return jsonify({'error': 'email and token are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.is_active:
        return jsonify({'message': 'Account already verified. Please login.'}), 200

    if user.two_factor_token != token:
        return jsonify({'error': 'Invalid verification token'}), 400

    if datetime.utcnow() > user.two_factor_expires:
        return jsonify({'error': 'Token has expired. Please register again.'}), 400

    user.is_active = True
    user.is_verified = True
    user.two_factor_token = None
    user.two_factor_expires = None
    db.session.commit()

    return jsonify({
        'message': 'Email verified successfully. You can now login.',
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type.value,
        }
    }), 200


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    identifier = (
        data.get('identifier') or
        data.get('email') or
        data.get('username') or
        data.get('phone')
    )
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'identifier and password are required'}), 400

    user = (
        User.query.filter_by(email=identifier).first() or
        User.query.filter_by(username=identifier).first() or
        User.query.filter_by(phone=identifier).first()
    )

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account not verified. Check your email for the verification token.'}), 403

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'user_type': user.user_type.value,
            'username': user.username,
        }
    )

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type.value,
            'is_verified': user.is_verified,
        }
    }), 200


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'phone': user.phone,
        'user_type': user.user_type.value,
        'is_verified': user.is_verified,
        'created_at': user.created_at.isoformat(),
    }), 200


@bp.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    return verify_email()
