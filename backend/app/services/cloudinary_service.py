import cloudinary
import cloudinary.uploader
from flask import current_app

def init_cloudinary(app):
    """Initialize Cloudinary with app config"""
    cloudinary.config(
        cloud_name=app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=app.config.get('CLOUDINARY_API_KEY'),
        api_secret=app.config.get('CLOUDINARY_API_SECRET')
    )

def upload_image(file, folder='jobseekers'):
    """Upload image to Cloudinary with automatic resizing
    
    Resizes to max 800x800 pixels, optimizes quality
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            transformation=[
                {'width': 800, 'height': 800, 'crop': 'limit'},
                {'quality': 'auto'},
                {'fetch_format': 'auto'}
            ]
        )
        
        return {
            'success': True,
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'width': result.get('width'),
            'height': result.get('height'),
            'format': result.get('format')
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def upload_document(file, folder='documents'):
    """Upload document (PDF, DOC, etc.) to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type='raw'
        )
        
        return {
            'success': True,
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'format': result.get('format')
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def delete_file(public_id):
    """Delete file from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {'success': True, 'result': result}
    except Exception as e:
        return {'success': False, 'error': str(e)}
