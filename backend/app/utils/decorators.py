from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from ..models.user import UserType


def role_required(*roles):
    """
    Decorator that checks JWT is valid AND user has one of the allowed roles.
    Usage: @role_required(UserType.ADMIN) or @role_required(UserType.JOBSEEKER, UserType.EMPLOYER)
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_type = claims.get('user_type')

            allowed = [r.value for r in roles]
            if user_type not in allowed:
                return jsonify({
                    'error': f'Access denied. Required role(s): {", ".join(allowed)}'
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator


def jobseeker_required(fn):
    return role_required(UserType.JOBSEEKER)(fn)


def employer_required(fn):
    return role_required(UserType.EMPLOYER)(fn)


def admin_required(fn):
    return role_required(UserType.ADMIN)(fn)


def employer_or_admin_required(fn):
    return role_required(UserType.EMPLOYER, UserType.ADMIN)(fn)