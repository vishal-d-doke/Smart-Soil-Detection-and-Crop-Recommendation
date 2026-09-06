# Deployment Guide: Smart Soil Detection and Crop Recommendation

This guide provides step-by-step instructions to deploy the **Smart Soil Detection and Crop Recommendation** application to production.

---

## Architecture Overview

- **Backend**: FastAPI (Python 3.11+) with SQLAlchemy and Uvicorn.
- **Frontend**: React 19 SPA built with Vite.
- **Database**: PostgreSQL (recommended for production) or SQLite (for local testing).
- **Deployment Targets**: Render (Blueprint included), Docker / Docker Compose, Railway, or VPS.

---

## Option 1: Deploy to Render (Recommended - Zero Configuration)

The project includes an optimized [`render.yaml`](file:///render.yaml) Blueprint that automatically provisions:
1. **PostgreSQL Database** (`smart-soil-db`)
2. **FastAPI Web Service** (`smart-soil-api`)
3. **React Static Site** (`smart-soil-frontend`)

### Step 1: Push Code to GitHub
Ensure all your changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Step 2: Deploy Blueprint on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub account and select your repository (`Smart-Soil-Detection-and-Crop-Recommendation`).
4. Click **Apply**.
   - Render will parse `render.yaml` and create the database and both services.
   - The backend will automatically connect to the managed PostgreSQL database and generate a secure `SECRET_KEY`.

### Step 3: Link Frontend to Backend
1. Once the **`smart-soil-api`** service finishes deploying, copy its live URL (for example: `https://smart-soil-api.onrender.com`).
2. In the Render Dashboard, open the **`smart-soil-frontend`** service.
3. Navigate to **Environment**.
4. Set or update the `VITE_API_BASE_URL` environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://smart-soil-api.onrender.com` *(use your actual backend URL, without trailing slash)*
5. Click **Save Changes** and trigger **Manual Deploy** -> **Clear build cache & deploy**.

### Step 4 (Optional): Twilio OTP Setup
If you want to enable real SMS mobile login:
1. Open **`smart-soil-api`** -> **Environment**.
2. Add:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_PHONE_NUMBER`: Your Twilio Phone Number (in E.164 format, e.g. `+15551234567`)
3. Save changes. If omitted, the app runs in standard email/password authentication mode and logs OTPs for testing.

---

## Option 2: Deploy with Docker Compose (VPS / Cloud VM)

Deploy the complete stack (PostgreSQL + Backend + Frontend Nginx) on any Linux server or locally using Docker.

### Step 1: Install Docker & Docker Compose
Ensure Docker and Docker Compose are installed on your server.

### Step 2: Clone and Start
```bash
git clone https://github.com/vishal-d-doke/Smart-Soil-Detection-and-Crop-Recommendation.git
cd Smart-Soil-Detection-and-Crop-Recommendation

# Start all containers in the background
docker compose up -d --build
```

### Step 3: Access the Application
- **Frontend**: `http://<your-server-ip>:3000`
- **Backend API**: `http://<your-server-ip>:8000`
- **API Health Check**: `http://<your-server-ip>:8000/health`
- **API Docs (Swagger)**: `http://<your-server-ip>:8000/docs`

To stop the containers:
```bash
docker compose down
```

---

## Option 3: Manual Cloud Host / VPS Deployment

If deploying directly onto an Ubuntu/Debian VPS with systemd and Nginx:

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Set production environment variables
export DATABASE_URL="postgresql+psycopg://user:password@localhost:5432/smart_soil"
export SECRET_KEY="$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
export CORS_ORIGINS="https://yourdomain.com"
export APP_DEBUG="false"

# Run with Gunicorn/Uvicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 2. Frontend Build
```bash
cd frontend
npm ci
VITE_API_BASE_URL="https://api.yourdomain.com" npm run build
# The compiled static files will be in frontend/dist/
```

---

## Environment Variables Reference

### Backend (`smart-soil-api`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes (in prod) | `sqlite:///./app.db` | PostgreSQL connection string (auto-normalized) |
| `SECRET_KEY` | Yes | Generated | Secret key for JWT session tokens |
| `CORS_ORIGINS` | No | `*` | Allowed origins (comma-separated or `*`) |
| `APP_DEBUG` | No | `false` | Enable or disable debug mode |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `60` | Token expiration time in minutes |
| `TWILIO_ACCOUNT_SID` | Optional | `""` | Twilio account SID for mobile SMS |
| `TWILIO_AUTH_TOKEN` | Optional | `""` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Optional | `""` | Twilio phone number |

### Frontend (`smart-soil-frontend`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes (in prod) | `http://localhost:8000` | Full URL of the backend API |

---

## Post-Deployment Smoke Test Checklist

- [ ] Check `/health` endpoint: `GET https://your-backend-url/health` returns `{"status": "ok"}`
- [ ] Check API docs: `GET https://your-backend-url/docs` renders Swagger UI
- [ ] Visit the frontend root in your browser
- [ ] Register a new user with full name, email, mobile number, and password
- [ ] Log in with the registered credentials
- [ ] Submit a Soil Analysis form and verify instant health score & recommendations
- [ ] Submit a Crop Recommendation form and verify recommended crop
- [ ] Open the History page and verify past predictions appear correctly
