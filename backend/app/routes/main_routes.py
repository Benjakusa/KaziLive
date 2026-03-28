from flask import Blueprint, jsonify

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    return jsonify({
        'message': 'Welcome to KaziLive API',
        'status': 'running',
        'endpoints': [
            '/api/auth/register',
            '/api/auth/login',
            '/api/auth/verify-2fa',
            '/api/user/profile'
        ]
    })
