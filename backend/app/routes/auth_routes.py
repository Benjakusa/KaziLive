from flask import Blueprint

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Temporary placeholder routes - we'll implement these in Week 2
@bp.route('/register', methods=['POST'])
def register():
    return {'message': 'Registration endpoint - coming soon'}, 200

@bp.route('/login', methods=['POST'])
def login():
    return {'message': 'Login endpoint - coming soon'}, 200

@bp.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    return {'message': '2FA verification endpoint - coming soon'}, 200