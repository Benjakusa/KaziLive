from datetime import datetime

def human_readable_date(date_obj):
    """Convert datetime to human-readable format
    
    Examples:
        April 5, 2026 at 2:30 PM
        January 15, 2026 at 9:00 AM
    """
    if not date_obj:
        return "Not available"
    
    if isinstance(date_obj, str):
        try:
            date_obj = datetime.fromisoformat(date_obj.replace('Z', '+00:00'))
        except:
            return date_obj
    
    return date_obj.strftime('%B %d, %Y at %I:%M %p')

def format_date_short(date_obj):
    """Short date format: Apr 5, 2026"""
    if not date_obj:
        return "N/A"
    
    if isinstance(date_obj, str):
        try:
            date_obj = datetime.fromisoformat(date_obj.replace('Z', '+00:00'))
        except:
            return date_obj
    
    return date_obj.strftime('%b %d, %Y')

def format_date_iso(date_obj):
    """ISO format for API responses: 2026-04-05"""
    if not date_obj:
        return None
    
    if isinstance(date_obj, datetime):
        return date_obj.strftime('%Y-%m-%d')
    
    return date_obj
