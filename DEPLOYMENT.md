# Anvaya — Production Deployment Guide

This guide details instructions for deploying **Anvaya — National Land Governance Research & Policy Platform** in production, staging, and local environments.

---

## 1. System Architecture Overview

```
                          [ Internet / End Users ]
                                     │
                                     ▼
                    [ Nginx Reverse Proxy (Port 80 / 443) ]
                     ├── Static Assets (React 19 + Vite SPA)
                     ├── /api/* ──────────────────────────┐
                     └── /uploads/* ──────────────────┐   │
                                                      │   │
                                                      ▼   ▼
                                       [ Gunicorn + Uvicorn Workers ]
                                        (FastAPI Backend :8000)
                                                      │
                     ┌────────────────────────────────┼────────────────────────────────┐
                     ▼                                ▼                                ▼
             [ PostgreSQL 16 ]            [ AI Inference Layer ]              [ Document Storage ]
          (pgvector Vector Search)       (Gemini API + NLP Fallback)           (Local / Cloud S3)
```

---

## 2. Quickstart with Docker Compose (Recommended)

Docker Compose provides a complete, containerized production environment with PostgreSQL 16, pgvector, FastAPI with Gunicorn workers, and Nginx serving the compiled React frontend.

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/mohitkumaarr/Anvaya.git
cd Anvaya

# Copy environment template
cp .env.example .env
```

Edit `.env` to configure your production secrets:
```ini
ENVIRONMENT=production
DEMO_MODE=true
POSTGRES_DB=landgov
POSTGRES_USER=landgov
POSTGRES_PASSWORD=your_ultra_secure_postgres_password_here
JWT_SECRET=your_long_random_64_character_jwt_secret_key_here
GEMINI_API_KEY=your_optional_gemini_api_key
```

### Step 2: Build and Launch Containers
```bash
docker compose up -d --build
```

### Step 3: Verify Container Health
```bash
docker compose ps
```
All three containers (`landgov_db`, `landgov_backend`, and `landgov_frontend`) should report healthy status:
```
NAME               IMAGE                   STATUS                    PORTS
landgov_db         pgvector/pgvector:pg16  Up (healthy)              0.0.0.0:5432->5432/tcp
landgov_backend    anvaya-backend          Up (healthy)              0.0.0.0:8000->8000/tcp
landgov_frontend   anvaya-frontend         Up (healthy)              0.0.0.0:80->80/tcp, 0.0.0.0:3000->80/tcp
```

### Step 4: Access the Application
- **Web Application Portal**: `http://localhost` (or `http://localhost:3000`)
- **Interactive API Documentation (Swagger)**: `http://localhost:8000/docs`
- **System Health Endpoint**: `http://localhost:8000/api/health`

---

## 3. Zero-Dependency Local Run (Without Docker)

For rapid development and testing without installing Docker or PostgreSQL:

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 20+ and npm

### Backend Setup
```bash
# 1. Open a terminal in project root
python -m venv venv

# Activate virtual environment:
# On Windows:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# 2. Install Python dependencies
pip install -r backend/requirements.txt

# 3. Seed demonstration database (SQLite by default)
python backend/seed.py

# 4. Start backend server
python scripts/start_backend.py
# (Runs on http://127.0.0.1:8000)
```

### Frontend Setup
```bash
# 1. Open a second terminal
cd frontend

# 2. Install npm dependencies
npm install

# 3. Start development server with API proxy
npm run dev
# (Runs on http://localhost:5173)
```

---

## 4. Cloud Deployment Options

### Option A: Render (1-Click Blueprint)
The repository contains a `render.yaml` blueprint:
1. Log in to [Render](https://render.com).
2. Go to **Blueprints** > **New Blueprint Instance**.
3. Connect your GitHub repository `mohitkumaarr/Anvaya`.
4. Render will automatically provision:
   - Managed PostgreSQL database
   - Dockerized FastAPI backend service
   - Dockerized Nginx frontend service
5. Click **Apply**.

### Option B: Railway
1. Create a new project on [Railway.app](https://railway.app).
2. Deploy PostgreSQL with pgvector from Railway templates.
3. Deploy the backend from GitHub repo (Root directory: `.`, Dockerfile: `backend/Dockerfile`).
   - Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `ENVIRONMENT=production`.
4. Deploy frontend from GitHub repo (Root directory: `frontend`, Dockerfile: `frontend/Dockerfile`).

### Option C: AWS EC2 / DigitalOcean Droplet
1. Provision an Ubuntu 24.04 LTS instance (t3.medium or 4GB RAM Droplet recommended).
2. Install Docker and Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER
   ```
3. Clone repository and launch:
   ```bash
   git clone https://github.com/mohitkumaarr/Anvaya.git /opt/landgov
   cd /opt/landgov
   cp .env.example .env
   docker compose up -d --build
   ```
4. Setup SSL with Let's Encrypt / Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.gov.in
   ```

---

## 5. Production Configuration & Security Checklist

| Parameter | Recommended Production Value | Description |
|-----------|------------------------------|-------------|
| `ENVIRONMENT` | `production` | Disables debug logs and development diagnostics |
| `DEMO_MODE` | `true` or `false` | When `true`, enables pre-seeded research, policies, and demo switcher |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Connection URI for PostgreSQL database |
| `JWT_SECRET` | 64+ char random string | Secret key for signing authentication tokens (`openssl rand -hex 32`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24 hours) | JWT token lifespan before re-authentication |
| `GEMINI_API_KEY` | Valid Google Gemini API Key | Enables live Gemini LLM synthesis. If empty, local NLP fallback engages |
| `CORS_ORIGINS` | Explicit domain list | Restrict to your actual production domains (e.g. `https://landgov.gov.in`) |

---

## 6. Pre-Configured Test Accounts

When `DEMO_MODE=true` or after running `backend/seed.py`, use the one-click role switcher in the UI top bar or login manually:

| Role | Email | Password | Access Privileges |
|------|-------|----------|-------------------|
| **Platform Administrator** | `admin@landgov.gov.in` | `admin123` | System monitoring, document approval queue, user role management |
| **Lead Researcher** | `researcher@landgov.gov.in` | `research123` | Full document upload, vector search, research gap creation, workspace tasks |
| **Senior Policymaker** | `policymaker@landgov.gov.in` | `policy123` | Policy Lab scenario modeling, comparative radar analysis, policy brief export |
| **Public Citizen** | `citizen@landgov.gov.in` | `public123` | Public repository search, dataset viewing, GIS state profiles |

---

## 7. Database Backup and Maintenance

### Automated PostgreSQL Backup
```bash
# Create timestamped database dump
docker exec -t landgov_db pg_dump -U landgov landgov > backup_landgov_$(date +%Y%m%d_%H%M%S).sql
```

### Database Restore
```bash
# Restore from backup file
cat backup_landgov.sql | docker exec -i landgov_db psql -U landgov -d landgov
```

---

## 8. Health Checks & Troubleshooting

### Check Service Health
```bash
# Backend health endpoint
curl http://localhost:8000/api/health

# Frontend health endpoint
curl http://localhost/healthz
```

### Port Conflicts
If port `80` or `5432` is already in use by local services (e.g. local IIS or PostgreSQL):
In `docker-compose.yml`, change ports to:
- Frontend: `"8080:80"` (access at `http://localhost:8080`)
- Database: `"5433:5432"`

### Viewing Real-Time Logs
```bash
# All containers
docker compose logs -f

# Backend container only
docker compose logs -f backend
```
