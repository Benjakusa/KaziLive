from flask import Blueprint

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Temporary placeholder routes - we'll implement these in Week 2
@bp.route('/documents', methods=['GET'])
def list_documents():
    return {'message': 'List documents endpoint - coming soon'}, 200

@bp.route('/documents/<int:doc_id>/approve', methods=['PUT'])
def approve_document(doc_id):
    return {'message': 'Approve document endpoint - coming soon'}, 200