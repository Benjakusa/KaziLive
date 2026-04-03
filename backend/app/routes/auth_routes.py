from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from .. import db
from ..models.user import User, Jobseeker, Employer, Admin, UserType

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate required fields
    required = ['email', 'username', 'phone', 'password', 'user_type']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Check uniqueness
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'error': 'Phone number already registered'}), 409

    # Validate user_type
    try:
        user_type = UserType(data['user_type'])
    except ValueError:
        return jsonify({'error': 'Invalid user_type. Must be: jobseeker, employer, or admin'}), 400

    password_hash = generate_password_hash(data['password'])

    # Create the correct proxy model
    if user_type == UserType.JOBSEEKER:
        user = Jobseeker(
            email=data['email'],
            username=data['username'],
            phone=data['phone'],
            password_hash=password_hash,
            user_type=user_type,
        )
    elif user_type == UserType.EMPLOYER:
        user = Employer(
            email=data['email'],
            username=data['username'],
            phone=data['phone'],
            password_hash=password_hash,
            user_type=user_type,
            company_name=data.get('company_name', ''),
        )
    elif user_type == UserType.ADMIN:
        user = Admin(
            email=data['email'],
            username=data['username'],
            phone=data['phone'],
            password_hash=password_hash,
            user_type=user_type,
        )

    if user is None:
        return jsonify({'error': 'Failed to create user'}), 500

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type.value,
        }
    }), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Accept identifier (email / username / phone) + password
    identifier = (
        data.get('identifier') or
        data.get('email') or
        data.get('username') or
        data.get('phone')
    )
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'identifier and password are required'}), 400

    # Find user by any of the three identifiers
    user = (
        User.query.filter_by(email=identifier).first() or
        User.query.filter_by(username=identifier).first() or
        User.query.filter_by(phone=identifier).first()
    )

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account is deactivated. Contact support.'}), 403

    # Issue JWT
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
    """Protected route — confirms JWT is working."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

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
    # Implemented in 2-Step Authentication task
    return jsonify({'message': '2FA verification endpoint - coming soon'}), 200