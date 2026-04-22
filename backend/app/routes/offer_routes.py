from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.offer import Offer
from ..models.user import Employer

bp = Blueprint('offer', __name__, url_prefix='/api/offers')


@bp.route('', methods=['GET'])
@jwt_required()
def get_offers():
    user_id = get_jwt_identity()
    offers = Offer.query.filter_by(jobseeker_id=user_id).order_by(Offer.created_at.desc()).all()
    return jsonify([{
        'id': o.id,
        'employer_id': o.employer_id,
        'company': Employer.query.get(o.employer_id).company_name if Employer.query.get(o.employer_id) else 'Unknown',
        'position': o.position,
        'salary': o.salary,
        'message': o.message,
        'status': o.status,
        'date': o.created_at.isoformat()
    } for o in offers]), 200


@bp.route('/<int:offer_id>/accept', methods=['POST'])
@jwt_required()
def accept_offer(offer_id):
    user_id = get_jwt_identity()
    offer = Offer.query.filter_by(id=offer_id, jobseeker_id=user_id).first()
    if not offer:
        return jsonify({'error': 'Offer not found'}), 404
    offer.status = 'accepted'
    db.session.commit()
    return jsonify({'message': 'Offer accepted'}), 200


@bp.route('/<int:offer_id>/decline', methods=['POST'])
@jwt_required()
def decline_offer(offer_id):
    user_id = get_jwt_identity()
    offer = Offer.query.filter_by(id=offer_id, jobseeker_id=user_id).first()
    if not offer:
        return jsonify({'error': 'Offer not found'}), 404
    offer.status = 'declined'
    db.session.commit()
    return jsonify({'message': 'Offer declined'}), 200


@bp.route('/create', methods=['POST'])
@jwt_required()
def create_offer():
    """Employer creates an offer for a jobseeker"""
    from flask import request
    user_id = get_jwt_identity()
    
    employer = Employer.query.get(user_id)
    if not employer:
        return jsonify({'error': 'Only employers can create offers'}), 403
    
    data = request.get_json()
    jobseeker_id = data.get('jobseeker_id')
    position = data.get('position')
    salary = data.get('salary')
    message = data.get('message', '')
    
    if not jobseeker_id or not position:
        return jsonify({'error': 'Jobseeker ID and position are required'}), 400
    
    offer = Offer(
        employer_id=user_id,
        jobseeker_id=jobseeker_id,
        position=position,
        salary=salary,
        message=message
    )
    db.session.add(offer)
    db.session.commit()
    
    return jsonify({'message': 'Offer created successfully', 'id': offer.id}), 201