from flask import Blueprint

bp = Blueprint('user', __name__, url_prefix='/api/user')

# Temporary placeholder routes - we'll implement these in Week 2
@bp.route('/profile', methods=['GET'])
def get_profile():
    return {'message': 'Get profile endpoint - coming soon'}, 200

@bp.route('/profile', methods=['PUT'])
def update_profile():
    return {'message': 'Update profile endpoint - coming soon'}, 200