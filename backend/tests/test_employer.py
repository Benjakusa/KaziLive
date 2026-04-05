def test_employer_profile_requires_auth(client):
    response = client.get('/api/employer/profile')
    assert response.status_code == 401

def test_employer_jobseekers_requires_auth(client):
    response = client.get('/api/employer/jobseekers')
    assert response.status_code == 401
