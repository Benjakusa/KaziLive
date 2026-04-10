from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.user import User, Jobseeker
from ..models.promotion import ProfilePromotion
from datetime import datetime, timedelta

bp = Blueprint('promotions', __name__, url_prefix='/api/promotions')

PROMOTION_PRICES = {
    'featured': 200,
    'highlighted': 100,
    'top_search': 300
}


@bp.route('/promote', methods=['POST'])
@jwt_required()
def promote_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'jobseeker':
        return jsonify({'error': 'Only jobseekers can promote profiles'}), 403
    
    promotion_type = data.get('promotion_type', 'featured')
    if promotion_type not in PROMOTION_PRICES:
        return jsonify({'error': 'Invalid promotion type'}), 400
    
    days = data.get('days', 7)
    if days not in [7, 14, 30]:
        return jsonify({'error': 'Invalid duration. Choose 7, 14, or 30 days'}), 400
    
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=days)
    
    promotion = ProfilePromotion(
        jobseeker_id=user_id,
        promotion_type=promotion_type,
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(promotion)
    db.session.commit()
    
    return jsonify({
        'message': 'Profile promoted successfully',
        'promotion': {
            'id': promotion.id,
            'type': promotion.promotion_type,
            'start_date': promotion.start_date.isoformat(),
            'end_date': promotion.end_date.isoformat(),
            'price': PROMOTION_PRICES[promotion_type] * days
        }
    }), 201


@bp.route('/my-promotions', methods=['GET'])
@jwt_required()
def my_promotions():
    user_id = get_jwt_identity()
    
    promotions = ProfilePromotion.query.filter_by(jobseeker_id=user_id).order_by(ProfilePromotion.created_at.desc()).all()
    
    return jsonify([{
        'id': p.id,
        'type': p.promotion_type,
        'start_date': p.start_date.isoformat(),
        'end_date': p.end_date.isoformat(),
        'is_active': p.is_active
    } for p in promotions]), 200


@bp.route('/pricing', methods=['GET'])
def get_promotion_pricing():
    return jsonify({
        'promotion_types': {
            'featured': {
                'price_per_day': PROMOTION_PRICES['featured'],
                'description': 'Your profile appears at the top of search results'
            },
            'highlighted': {
                'price_per_day': PROMOTION_PRICES['highlighted'],
                'description': 'Your profile is highlighted in search results'
            },
            'top_search': {
                'price_per_day': PROMOTION_PRICES['top_search'],
                'description': 'Maximum visibility - appears first everywhere'
            }
        },
        'durations': [7, 14, 30],
        'currency': 'KES'
    }), 200


@bp.route('/featured-jobseekers', methods=['GET'])
def get_featured_jobseekers():
    now = datetime.utcnow()
    
    featured = ProfilePromotion.query.filter(
        ProfilePromotion.is_active == True,
        ProfilePromotion.start_date <= now,
        ProfilePromotion.end_date >= now
    ).order_by(ProfilePromotion.start_date.desc()).limit(10).all()
    
    results = []
    for p in featured:
        jobseeker = Jobseeker.query.get(p.jobseeker_id)
        user = User.query.get(p.jobseeker_id)
        if jobseeker and user and user.is_active:
            results.append({
                'id': jobseeker.id,
                'full_name': jobseeker.full_name,
                'job_category': jobseeker.job_category,
                'location': jobseeker.location,
                'promotion_type': p.promotion_type
            })
    
    return jsonify(results), 200