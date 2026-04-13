# KaziLive

A full-stack job seeking platform connecting job seekers with employers in Kenya.

**Live URLs:**
- Frontend: https://kazi-live.vercel.app
- Backend API: https://kazilive-backend.onrender.com

---

## Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Redux Toolkit** for state management
- **Axios** for HTTP requests
- **Lucide React** for icons

### Backend
- **Flask 2.3.3** (Python)
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **Flask-JWT-Extended** for authentication
- **Flask-Migrate** for database migrations

### External Services
- **SendGrid** for email notifications
- **Cloudinary** for file storage
- **Daraja API** (Safaricom) for M-Pesa payments

---

## Project Structure

```
KaziLive/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── employer/  # Employer dashboard pages
│   │   │   └── jobseeker/ # Jobseeker dashboard pages
│   │   ├── components/    # Reusable UI components
│   │   ├── features/     # Feature modules
│   │   ├── services/     # API service layer
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS files
│   └── package.json
│
├── backend/                 # Flask backend API
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API endpoint blueprints
│   │   ├── services/     # Business logic services
│   │   └── utils/        # Utility functions
│   ├── migrations/        # Alembic database migrations
│   ├── instance/         # Local SQLite database
│   ├── config.py         # Configuration settings
│   └── requirements.txt
│
└── vercel.json            # Vercel deployment config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL (for production)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run the development server
python run.py
```

The backend runs on http://localhost:5000

## Features

### For Job Seekers
- User registration and email verification
- Profile creation with skills, bio, and availability
- Upload CVs and documents
- Search and browse job listings
- Apply to positions

### For Employers
- Company registration
- Post job advertisements
- Search and filter job seekers
- View job seeker profiles
- Manage applications

### For Admins
- User management (activate/deactivate)
- Document approval
- Platform analytics

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/verify-email` | Verify email with token |
| GET | `/api/auth/me` | Get current user |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get logged-in user profile |
| GET | `/api/user/jobseeker/profile` | Get jobseeker profile |
| GET | `/api/user/employer/profile` | Get employer profile |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/documents` | List all documents |
| PUT | `/api/admin/documents/<id>/approve` | Approve document |
| PUT | `/api/admin/users/<id>/deactivate` | Deactivate user |
| PUT | `/api/admin/users/<id>/activate` | Activate user |

Full API documentation is available in [backend/API_DOCS.md](backend/API_DOCS.md).

---

## Running Tests

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

---

## Deployment

### Frontend (Vercel)
The frontend is deployed to Vercel. The configuration in `vercel.json` automatically builds and deploys from the `frontend/` directory.

### Backend (Render)
The backend is deployed to Render. The `Procfile` specifies the web server command:

```
web: gunicorn wsgi:app
```

---

## License

MIT