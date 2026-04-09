import re

def validate_email(email):
    if not email:
        return False
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

def validate_phone(phone):
    if not phone:
        return False
    pattern = r'^(07|01|2547|2541)\d{8}$'
    phone = re.sub(r'[\s\-\(\)\+]', '', str(phone))
    return bool(re.match(pattern, phone))

def validate_password(password):
    if not password:
        return False
    return len(password) >= 6

def validate_salary(salary):
    if salary is None:
        return True
    try:
        return int(salary) >= 0
    except (ValueError, TypeError):
        return False

def validate_jobseeker_profile(data):
    errors = []
    if not data.get('full_name'):
        errors.append("full_name is required")
    if data.get('phone') and not validate_phone(data['phone']):
        errors.append("Invalid phone number format")
    if data.get('expected_salary') and not validate_salary(data['expected_salary']):
        errors.append("expected_salary must be a positive number")
    return errors

def validate_employer_profile(data):
    errors = []
    if not data.get('company_name'):
        errors.append("company_name is required")
    if data.get('company_phone') and not validate_phone(data['company_phone']):
        errors.append("Invalid phone number format")
    return errors
