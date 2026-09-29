# Physio Wellness Platform

A production-ready wellness and digital physiotherapy web application built with a modern full-stack architecture.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js · TypeScript · Tailwind CSS |
| **Backend** | FastAPI · Python · Pydantic · SQLAlchemy 2.x |
| **Database** | PostgreSQL |
| **Migrations** | Alembic |

---

## Project Structure

```
physio-wellness-platform/
├── backend/          # FastAPI REST API
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── core/            # Config, logging, security
│   │   ├── shared/          # Cross-domain schemas & exceptions
│   │   ├── domains/         # Domain-driven modules
│   │   ├── integrations/    # Third-party service clients
│   │   ├── migrations/      # Alembic DB migrations
│   │   └── tests/           # Pytest test suite
│   ├── alembic.ini
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/         # Next.js web client
│   ├── src/
│   │   ├── app/             # App Router pages & layouts
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utilities & API client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service modules
│   │   └── types/           # TypeScript interfaces
│   └── package.json
│
└── docker-compose.yml
```

---

## Prerequisites

- **Python** 3.12+
- **Node.js** 20+
- **PostgreSQL** 16+ (or use Docker)

---

## Getting Started

### 1. Clone & Environment Setup

```bash
git clone <repo-url>
cd physio-wellness-platform
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your local database credentials

# Run the development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.

- Health check: `GET http://localhost:8000/health`
- Swagger docs (debug mode): `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local if backend URL differs

# Run the development server
npm run dev
```

The frontend will be available at **http://localhost:3000**.

### 4. Docker (Full Stack)

```bash
# From the project root
docker-compose up --build
```

This starts the backend, frontend, and a PostgreSQL instance.

---

## Verifying the Setup

### Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "app_name": "Physio Wellness Platform",
  "version": "0.1.0",
  "environment": "development",
  "timestamp": "2026-09-28T12:00:00Z"
}
```

### Frontend

Open **http://localhost:3000** in your browser. You should see the platform landing page.

---

## Running Tests

### Backend

```bash
cd backend
pytest app/tests/ -v
```

---

## Development Roadmap

- **Phase 1** ✅ Project foundation, health check, layout, API client
- **Phase 2** 🔲 Authentication, user models, database setup
- **Phase 3** 🔲 Patient profiles, therapist profiles, clinics
- **Phase 4** 🔲 Appointments, assessments, treatment plans
- **Phase 5** 🔲 Payments, subscriptions, notifications
- **Phase 6** 🔲 AI-assisted features

---

## License

Private — All rights reserved.
