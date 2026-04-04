# KaziLive API Documentation

**Base URL (Production):** `https://kazilive-backend.onrender.com`  
**Base URL (Local):** `http://localhost:5000`  
**Content-Type:** `application/json`

---

## Authentication

Protected routes require a JWT token in the request header:

```
Authorization: Bearer <access_token>
```

---

## User Types

| Type | Value |
|------|-------|
| Job Seeker | `jobseeker` |
| Employer | `employer` |
| Admin | `admin` |

---

## Auth Endpoints

### Register

**POST** `/api/auth/register`

Creates a new user account. Account is inactive until email is verified.

**Request Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | string | yes | must be unique |
| username | string | yes | must be unique |
| phone | string | yes | must be unique |
| password | string | yes | |
| user_type | string | yes | `jobseeker`, `employer`, or `admin` |
| company_name | string | no | employers only |

**Example Request:**
```json
{
  "email": "john@example.com",
  "username": "johndoe",
  "phone": "0700000000",
  "password": "yourpassword",
  "user_type": "jobseeker"
}
```

**Success Response** `201`:
```json
{
  "message": "Registration successful. Check your email for the verification token.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "user_type": "jobseeker",
    "is_active": false
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 400 | Missing required field |
| 409 | Email, username, or phone already exists |
| 400 | Invalid user_type |

---

### Verify Email

**POST** `/api/auth/verify-email`

Verifies the 6-digit token sent to the user's email. Activates the account.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| email | string | yes |
| token | string | yes |

**Example Request:**
```json
{
  "email": "john@example.com",
  "token": "847291"
}
```

**Success Response** `200`:
```json
{
  "message": "Email verified successfully. You can now login.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "user_type": "jobseeker"
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 400 | Missing email or token |
| 404 | User not found |
| 400 | Invalid token |
| 400 | Token expired |

---

### Login

**POST** `/api/auth/login`

Logs in using email, username, or phone number.

**Request Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| identifier | string | yes | email, username, or phone |
| password | string | yes | |

**Example Request:**
```json
{
  "identifier": "john@example.com",
  "password": "yourpassword"
}
```

**Success Response** `200`:
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLC...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "user_type": "jobseeker",
    "is_verified": true
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 400 | Missing identifier or password |
| 401 | Invalid credentials |
| 403 | Account not verified |

---

### Get Current User

**GET** `/api/auth/me`

Returns the logged-in user's details. Requires JWT token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response** `200`:
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "phone": "0700000000",
  "user_type": "jobseeker",
  "is_verified": true,
  "created_at": "2026-04-01T10:00:00"
}
```

---

## User Endpoints

### Get Profile

**GET** `/api/user/profile`

Returns the profile of the logged-in user. Response includes role-specific fields.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response for Jobseeker** `200`:
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "user_type": "jobseeker",
  "is_verified": true,
  "full_name": null,
  "bio": null,
  "location": null,
  "availability_status": "available",
  "job_category": null,
  "expected_salary": null,
  "profile_verified": false,
  "skills": []
}
```

**Success Response for Employer** `200`:
```json
{
  "id": 2,
  "email": "employer@company.com",
  "username": "companyname",
  "user_type": "employer",
  "is_verified": true,
  "company_name": "Acme Ltd",
  "company_description": null,
  "company_location": null,
  "verified": false,
  "payment_status": "pending"
}
```

---

### Jobseeker Profile

**GET** `/api/user/jobseeker/profile`

Jobseeker accounts only. Returns full jobseeker profile fields.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 403 | Not a jobseeker account |
| 404 | Jobseeker not found |

---

### Employer Profile

**GET** `/api/user/employer/profile`

Employer accounts only. Returns full employer profile fields.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 403 | Not an employer account |
| 404 | Employer not found |

---

## Admin Endpoints

All admin endpoints require an admin account JWT token.

### List All Users

**GET** `/api/admin/users`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response** `200`:
```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "user_type": "jobseeker",
    "is_active": true,
    "is_verified": true,
    "created_at": "2026-04-01T10:00:00"
  }
]
```

---

### List All Documents

**GET** `/api/admin/documents`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response** `200`:
```json
[
  {
    "id": 1,
    "user_id": 2,
    "filename": "cv.pdf",
    "is_approved": false,
    "uploaded_at": "2026-04-01T10:00:00"
  }
]
```

---

### Approve Document

**PUT** `/api/admin/documents/<doc_id>/approve`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response** `200`:
```json
{
  "message": "Document approved successfully",
  "document_id": 1
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 404 | Document not found |
| 403 | Not an admin account |

---

### Deactivate User

**PUT** `/api/admin/users/<user_id>/deactivate`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response** `200`:
```json
{
  "message": "User johndoe deactivated"
}
```

---

### Activate User

**PUT** `/api/admin/users/<user_id>/activate`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response** `200`:
```json
{
  "message": "User johndoe activated"
}
```

---

## Role Access Summary

| Endpoint | Jobseeker | Employer | Admin |
|----------|-----------|----------|-------|
| POST /api/auth/register | open | open | open |
| POST /api/auth/login | open | open | open |
| POST /api/auth/verify-email | open | open | open |
| GET /api/auth/me | yes | yes | yes |
| GET /api/user/profile | yes | yes | yes |
| GET /api/user/jobseeker/profile | yes | no | no |
| GET /api/user/employer/profile | no | yes | no |
| GET /api/admin/users | no | no | yes |
| GET /api/admin/documents | no | no | yes |
| PUT /api/admin/documents/:id/approve | no | no | yes |
| PUT /api/admin/users/:id/deactivate | no | no | yes |
| PUT /api/admin/users/:id/activate | no | no | yes |

---

## Notes for Frontend (Person 3 & 4)

- Always store the `access_token` from login in memory or secure storage
- Token expires after **1 hour** — implement token refresh or re-login flow
- All requests to protected routes must include the `Authorization: Bearer` header
- Check `user_type` in the login response to redirect to the correct dashboard
- If a user gets a `403` on login, it means their email is not verified yet — prompt them to check their email

## Notes for Backend (Person 2)

- Import `db` from `app` — `from .. import db`
- Import decorators from `app/utils/decorators.py` — `from ..utils.decorators import admin_required, jobseeker_required, employer_required`
- Use `get_jwt_identity()` to get the logged-in user's ID inside protected routes
- Follow the same blueprint pattern — `bp = Blueprint('name', __name__, url_prefix='/api/name')`
- Register your blueprint in `app/__init__.py`