from flask import jsonify, request
from werkzeug.exceptions import NotFound, Unauthorized, BadRequest, Forbidden

def register_error_handlers(app):
    """Register all error handlers with the Flask app"""
    
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'error': 'Resource Not Found',
            'message': 'The requested resource does not exist',
            'redirect': '/api/auth/login',
            'status_code': 404
        }), 404
    
    @app.errorhandler(401)
    def unauthorized_error(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Please login to access this resource',
            'redirect': '/api/auth/login',
            'status_code': 401
        }), 401
    
    @app.errorhandler(403)
    def forbidden_error(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource',
            'status_code': 403
        }), 403
    
    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({
            'error': 'Bad Request',
            'message': 'Invalid data provided. Please check your input.',
            'status_code': 400
        }), 400
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Something went wrong on our end. Please try again later.',
            'status_code': 500
        }), 500
    
    @app.errorhandler(429)
    def rate_limit_error(error):
        return jsonify({
            'error': 'Too Many Requests',
            'message': 'Please slow down. Too many requests.',
            'status_code': 429
        }), 429
    
    @app.errorhandler(NotFound)
    def handle_not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested URL was not found on the server',
            'redirect': '/api/auth/login',
            'status_code': 404
        }), 404
    
    @app.errorhandler(Unauthorized)
    def handle_unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required',
            'redirect': '/api/auth/login',
            'status_code': 401
        }), 401

def register_template_error_handlers(app):
    """Register error handlers that can return HTML (for debugging)"""
    
    @app.errorhandler(404)
    def not_found_html(error):
        # Return JSON for API requests, HTML for browser
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Not Found'}), 404
        return "Page not found. Go to <a href='/api/auth/login'>Login</a>", 404
