from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Employer
from ..models.promotion import Advertisement
from datetime import datetime

bp = Blueprint('adverts', __name__, url_prefix='/api/adverts')

ADVERT_PRICES = {
    'banner': 500,
    'sidebar': 300,
    'popup': 1000
}


@bp.route('/', methods=['POST'])
@jwt_required()
def create_advert():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can create adverts'}), 403
    
    required = ['title', 'description', 'start_date', 'end_date']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    
    advert = Advertisement(
        employer_id=user_id,
        title=data['title'],
        description=data.get('description'),
        image_url=data.get('image_url'),
        target_url=data.get('target_url'),
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(advert)
    db.session.commit()
    
    return jsonify({
        'message': 'Advert created successfully',
        'advert': {
            'id': advert.id,
            'title': advert.title,
            'start_date': advert.start_date.isoformat(),
            'end_date': advert.end_date.isoformat(),
            'is_active': advert.is_active
        }
    }), 201


@bp.route('/', methods=['GET'])
def get_adverts():
    now = datetime.utcnow()
    position = request.args.get('position', 'banner')
    
    adverts = Advertisement.query.filter(
        Advertisement.is_active == True,
        Advertisement.start_date <= now,
        Advertisement.end_date >= now
    ).order_by(Advertisement.created_at.desc()).limit(10).all()
    
    for ad in adverts:
        ad.views += 1
    db.session.commit()
    
    return jsonify([{
        'id': a.id,
        'title': a.title,
        'description': a.description,
        'image_url': a.image_url,
        'target_url': a.target_url
    } for a in adverts]), 200


@bp.route('/<int:advert_id>/click', methods=['POST'])
def track_click(advert_id):
    advert = Advertisement.query.get(advert_id)
    if not advert:
        return jsonify({'error': 'Advert not found'}), 404
    
    advert.clicks += 1
    db.session.commit()
    
    return jsonify({'target_url': advert.target_url}), 200


@bp.route('/my-adverts', methods=['GET'])
@jwt_required()
def my_adverts():
    user_id = get_jwt_identity()
    
    adverts = Advertisement.query.filter_by(employer_id=user_id).order_by(Advertisement.created_at.desc()).all()
    
    return jsonify([{
        'id': a.id,
        'title': a.title,
        'description': a.description,
        'is_active': a.is_active,
        'start_date': a.start_date.isoformat(),
        'end_date': a.end_date.isoformat(),
        'views': a.views,
        'clicks': a.clicks
    } for a in adverts]), 200


@bp.route('/<int:advert_id>', methods=['PUT'])
@jwt_required()
def update_advert(advert_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    advert = Advertisement.query.get(advert_id)
    if not advert:
        return jsonify({'error': 'Advert not found'}), 404
    
    if advert.employer_id != int(user_id):
        return jsonify({'error': 'Not authorized'}), 403
    
    if 'title' in data:
        advert.title = data['title']
    if 'description' in data:
        advert.description = data['description']
    if 'is_active' in data:
        advert.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({'message': 'Advert updated successfully'}), 200


@bp.route('/pricing', methods=['GET'])
def get_advert_pricing():
    return jsonify({
        'positions': {
            'banner': {'price': ADVERT_PRICES['banner'], 'description': 'Top banner placement'},
            'sidebar': {'price': ADVERT_PRICES['sidebar'], 'description': 'Sidebar ad'},
            'popup': {'price': ADVERT_PRICES['popup'], 'description': 'Modal popup'}
        },
        'currency': 'KES',
        'billing': 'per week'
    }), 200