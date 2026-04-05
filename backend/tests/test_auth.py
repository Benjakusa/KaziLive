def test_register(client):
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'username': 'testuser',
        'phone': '0712345678',
        'password': 'password123',
        'user_type': 'jobseeker'
    })
    # Registration returns 201 even though user needs verification
    assert response.status_code == 201
    assert 'message' in response.json
    assert 'Registration successful' in response.json['message']

def test_duplicate_registration(client):
    # First registration
    client.post('/api/auth/register', json={
        'email': 'duplicate@example.com',
        'username': 'duplicate',
        'phone': '0799999999',
        'password': 'password123',
        'user_type': 'jobseeker'
    })
    
    # Duplicate registration
    response = client.post('/api/auth/register', json={
        'email': 'duplicate@example.com',
        'username': 'duplicate2',
        'phone': '0788888888',
        'password': 'password123',
        'user_type': 'jobseeker'
    })
    assert response.status_code == 409
    assert 'error' in response.json

def test_login_before_verification(client):
    # Register first
    client.post('/api/auth/register', json={
        'email': 'unverified@example.com',
        'username': 'unverified',
        'phone': '0777777777',
        'password': 'password123',
        'user_type': 'jobseeker'
    })
    
    # Try login without verification
    response = client.post('/api/auth/login', json={
        'identifier': 'unverified@example.com',
        'password': 'password123'
    })
    assert response.status_code == 403
    assert 'Account not verified' in response.json['error']

def test_invalid_login(client):
    response = client.post('/api/auth/login', json={
        'identifier': 'nonexistent@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401

def test_missing_fields(client):
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com'
    })
    assert response.status_code == 400
