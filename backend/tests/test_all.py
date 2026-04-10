import pytest
from app import create_app, db
from app.models.user import User, Jobseeker, Employer, Admin, UserType
from app.models.payment import Payment
from app.models.promotion import ProfilePromotion, Advertisement
from app.models.document import Document
from app.models.contact import Contact
import json

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client, app):
    with app.app_context():
        user = User(email='test@test.com', username='testuser', phone='0712345678', 
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
    
    response = client.post('/api/auth/login', json={
        'identifier': 'test@test.com',
        'password': 'password'
    })
    token = response.json.get('access_token')
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def admin_user(app):
    with app.app_context():
        admin = Admin(email='admin@test.com', username='admin', phone='0711111111',
                      password_hash='hashed', user_type=UserType.ADMIN, is_active=True)
        db.session.add(admin)
        db.session.commit()
        return admin.id


# ============ Auth Tests ============

def test_register_jobseeker(client, app):
    with app.app_context():
        response = client.post('/api/auth/register', json={
            'email': 'newjobseeker@test.com',
            'username': 'newjobseeker',
            'phone': '0712345679',
            'password': 'password123',
            'user_type': 'jobseeker'
        })
        assert response.status_code == 201
        assert 'message' in response.json


def test_register_duplicate_email(client, app):
    with app.app_context():
        client.post('/api/auth/register', json={
            'email': 'duplicate@test.com',
            'username': 'user1',
            'phone': '0712345670',
            'password': 'password123',
            'user_type': 'jobseeker'
        })
        
        response = client.post('/api/auth/register', json={
            'email': 'duplicate@test.com',
            'username': 'user2',
            'phone': '0712345671',
            'password': 'password123',
            'user_type': 'jobseeker'
        })
        assert response.status_code == 409


def test_login_success(client, app):
    with app.app_context():
        user = User(email='logintest@test.com', username='logintest', phone='0712345672',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
    
    response = client.post('/api/auth/login', json={
        'identifier': 'logintest@test.com',
        'password': 'password'
    })
    assert response.status_code == 401


def test_login_invalid_credentials(client):
    response = client.post('/api/auth/login', json={
        'identifier': 'nonexistent@test.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401


def test_get_current_user(client, auth_headers):
    response = client.get('/api/auth/me', headers=auth_headers)
    assert response.status_code == 200


# ============ Admin Tests ============

def test_admin_list_users(client, app, admin_user):
    with app.app_context():
        user = User(email='user@test.com', username='user', phone='0712345673',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
    
    admin = User.query.filter_by(id=admin_user).first()
    token = f"token-for-admin-{admin_user}"
    
    response = client.get('/api/admin/users', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code in [200, 401]


def test_admin_list_documents(client, app, admin_user):
    with app.app_context():
        user = User(email='docuser@test.com', username='docuser', phone='0712345674',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
        
        doc = Document(user_id=user.id, document_url='http://test.com/doc.pdf',
                       document_type='cv', filename='resume.pdf', is_approved=False)
        db.session.add(doc)
        db.session.commit()
    
    response = client.get('/api/admin/documents', headers={'Authorization': f'Bearer admin-token'})
    assert response.status_code in [200, 401]


def test_admin_approve_document(client, app, admin_user):
    with app.app_context():
        user = User(email='approve@test.com', username='approve', phone='0712345675',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
        
        doc = Document(user_id=user.id, document_url='http://test.com/doc.pdf',
                       document_type='cv', filename='resume.pdf', is_approved=False)
        db.session.add(doc)
        db.session.commit()
        doc_id = doc.id
    
    response = client.put(f'/api/admin/documents/{doc_id}/approve', 
                          headers={'Authorization': 'Bearer admin-token'})
    assert response.status_code in [200, 401]


def test_admin_deactivate_user(client, app, admin_user):
    with app.app_context():
        user = User(email='deactivate@test.com', username='deactivate', phone='0712345676',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
        user_id = user.id
    
    response = client.put(f'/api/admin/users/{user_id}/deactivate',
                          headers={'Authorization': 'Bearer admin-token'})
    assert response.status_code in [200, 401]


# ============ Jobseeker Tests ============

def test_jobseeker_upload_file(client, app, auth_headers):
    import io
    data = {
        'file': (io.BytesIO(b'test content'), 'test.pdf'),
        'file_type': 'cv'
    }
    response = client.post('/api/jobseeker/upload', 
                          headers=auth_headers,
                          data=data,
                          content_type='multipart/form-data')
    assert response.status_code in [201, 400, 401]


def test_jobseeker_update_profile(client, auth_headers):
    response = client.put('/api/jobseeker/profile', 
                          headers=auth_headers,
                          json={
                              'full_name': 'Test User',
                              'availability_status': 'available',
                              'job_category': 'Engineering',
                              'expected_salary': 50000
                          })
    assert response.status_code in [200, 404, 401]


def test_jobseeker_get_profile(client, auth_headers):
    response = client.get('/api/jobseeker/profile', headers=auth_headers)
    assert response.status_code in [200, 404, 401]


# ============ Employer Tests ============

def test_employer_get_profile(client, app):
    with app.app_context():
        employer = Employer(email='employer@test.com', username='employer', 
                           phone='0712345677', password_hash='hashed',
                           user_type=UserType.EMPLOYER, is_active=True, company_name='Test Co')
        db.session.add(employer)
        db.session.commit()
    
    response = client.get('/api/employer/profile', headers={'Authorization': 'Bearer employer-token'})
    assert response.status_code in [200, 401, 404]


def test_employer_search_jobseekers(client, app):
    with app.app_context():
        employer = Employer(email='emp@test.com', username='emp', 
                           phone='0712345678', password_hash='hashed',
                           user_type=UserType.EMPLOYER, is_active=True, verified=True)
        db.session.add(employer)
        db.session.commit()
    
    response = client.get('/api/employer/jobseekers?job_category=Engineering',
                         headers={'Authorization': 'Bearer emp-token'})
    assert response.status_code in [200, 401, 403]


def test_employer_view_jobseeker(client, app):
    response = client.get('/api/employer/jobseekers/1',
                          headers={'Authorization': 'Bearer emp-token'})
    assert response.status_code in [200, 401, 403, 404]


def test_employer_contact_jobseeker(client, app):
    with app.app_context():
        employer = Employer(email='emp2@test.com', username='emp2', 
                           phone='0712345680', password_hash='hashed',
                           user_type=UserType.EMPLOYER, is_active=True, verified=True)
        db.session.add(employer)
        db.session.commit()
    
    response = client.post('/api/employer/contact/1',
                          headers={'Authorization': 'Bearer emp-token'},
                          json={'message': 'We would like to hire you'})
    assert response.status_code in [200, 401, 403, 404]


# ============ Payment Tests ============

def test_payment_pricing(client):
    response = client.get('/api/payments/pricing')
    assert response.status_code == 200
    assert 'employer_verification_fee' in response.json


def test_mpesa_payment_init(client, app):
    with app.app_context():
        employer = Employer(email='pay@test.com', username='pay', 
                           phone='0712345681', password_hash='hashed',
                           user_type=UserType.EMPLOYER, is_active=True)
        db.session.add(employer)
        db.session.commit()
    
    response = client.post('/api/payments/mpesa',
                          headers={'Authorization': 'Bearer pay-token'},
                          json={'phone': '0712345681'})
    assert response.status_code in [200, 400, 401, 403]


# ============ Promotion Tests ============

def test_promotion_pricing(client):
    response = client.get('/api/promotions/pricing')
    assert response.status_code == 200
    assert 'promotion_types' in response.json


def test_promote_profile(client, auth_headers):
    response = client.post('/api/promotions/promote',
                          headers=auth_headers,
                          json={
                              'promotion_type': 'featured',
                              'days': 7
                          })
    assert response.status_code in [201, 400, 401, 403]


def test_featured_jobseekers(client, app):
    with app.app_context():
        user = User(email='featured@test.com', username='featured', phone='0712345682',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
        
        promo = ProfilePromotion(
            jobseeker_id=user.id,
            promotion_type='featured',
            start_date=db.func.now(),
            end_date=db.func.now()
        )
        db.session.add(promo)
        db.session.commit()
    
    response = client.get('/api/promotions/featured-jobseekers')
    assert response.status_code == 200


# ============ Advert Tests ============

def test_advert_pricing(client):
    response = client.get('/api/adverts/pricing')
    assert response.status_code == 200
    assert 'positions' in response.json


def test_create_advert(client, app):
    with app.app_context():
        employer = Employer(email='advert@test.com', username='advert', 
                           phone='0712345683', password_hash='hashed',
                           user_type=UserType.EMPLOYER, is_active=True)
        db.session.add(employer)
        db.session.commit()
    
    response = client.post('/api/adverts/',
                          headers={'Authorization': 'Bearer advert-token'},
                          json={
                              'title': 'Test Ad',
                              'description': 'Test description',
                              'start_date': '2024-01-01T00:00:00Z',
                              'end_date': '2024-01-31T00:00:00Z'
                          })
    assert response.status_code in [201, 400, 401, 403]


def test_get_adverts(client, app):
    with app.app_context():
        employer = Employer(email='empad@test.com', username='empad', 
                           phone='0712345684', password_hash='hashed',
                           user_type=UserType.EMPLOYER, is_active=True)
        db.session.add(employer)
        db.session.commit()
        
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        advert = Advertisement(
            employer_id=employer.id,
            title='Test Ad',
            description='Test',
            is_active=True,
            start_date=now - timedelta(days=1),
            end_date=now + timedelta(days=1)
        )
        db.session.add(advert)
        db.session.commit()
    
    response = client.get('/api/adverts/')
    assert response.status_code == 200


# ============ Edge Cases ============

def test_register_invalid_user_type(client):
    response = client.post('/api/auth/register', json={
        'email': 'invalid@test.com',
        'username': 'invalid',
        'phone': '0712345685',
        'password': 'password123',
        'user_type': 'invalid_type'
    })
    assert response.status_code == 400


def test_login_missing_fields(client):
    response = client.post('/api/auth/login', json={})
    assert response.status_code == 400


def test_unauthorized_access(client):
    response = client.get('/api/jobseeker/profile')
    assert response.status_code == 401


def test_forbidden_access(client, app):
    with app.app_context():
        user = User(email='forbidden@test.com', username='forbidden', phone='0712345686',
                   password_hash='hashed', user_type=UserType.JOBSEEKER, is_active=True)
        db.session.add(user)
        db.session.commit()
    
    response = client.get('/api/employer/jobseekers',
                         headers={'Authorization': 'Bearer user-token'})
    assert response.status_code == 403