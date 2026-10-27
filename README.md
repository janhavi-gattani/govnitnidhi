# 🏛️ GovNitNidhi — Government Admin Dashboard

A full-stack government administration platform with a Django REST API backend and a React + TypeScript frontend dashboard.

---

## 📁 Project Structure

```
govnitnidhi/
├── backend/
│   └── mainBackend/          ← Django REST API
│       ├── core/             ← Main Django app (models, views, APIs)
│       ├── mainBackend/      ← Django project settings
│       ├── manage.py
│       ├── requirements.txt
│       ├── .env.example      ← Copy this to .env and fill in your values
│       └── .env              ← YOUR secrets (never committed to git)
└── Gov-Admin-Dashboard/      ← React + Vite + TypeScript Frontend
    ├── src/
    ├── package.json
    └── vite.config.ts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Django, Django REST Framework, JWT Auth |
| Database | PostgreSQL (via Docker) |
| SMS/Calls | Twilio |
| Email | Gmail SMTP |

---

## ✅ Prerequisites

Install these before you begin:

| Tool | Download |
|------|---------|
| **Python 3.10+** | https://www.python.org/downloads/ |
| **Node.js 18+** | https://nodejs.org/ |
| **Docker Desktop** | https://www.docker.com/products/docker-desktop/ |
| **Git** | https://git-scm.com/ |

> ⚠️ Make sure **Docker Desktop is running** before you start.

---

## 🚀 Setup Guide (First Time)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/janhavi-gattani/govnitnidhi.git
cd govnitnidhi
```

---

### Step 2 — Start PostgreSQL with Docker

> You do **NOT** need to install PostgreSQL or create any users manually.
> One Docker command sets everything up automatically.

**On Mac / Linux:**
```bash
docker run -d \
  --name govnitnidhi-postgres \
  -e POSTGRES_DB=aarohan_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

**On Windows (PowerShell):**
```powershell
docker run -d --name govnitnidhi-postgres -e POSTGRES_DB=aarohan_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
```

Verify it is running:
```bash
docker ps
```
You should see `govnitnidhi-postgres` listed with status `Up`.

---

### Step 3 — Set Up the Backend

```bash
cd backend/mainBackend

python -m venv venv

# Activate — Windows:
venv\Scripts\activate
# Activate — Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

---

### Step 4 — Configure Environment Variables

```bash
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Django
SECRET_KEY=your-random-secret-key-here
DEBUG=True

# Database — these match the Docker command above, no changes needed!
DB_NAME=aarohan_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Twilio (needed only for SMS/call features)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_BASE_URL=https://your-ngrok-url.ngrok-free.app

# Email (needed only for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
DEFAULT_FROM_EMAIL=noreply@gramparishad.gov.in
```

> 💡 Generate a Django SECRET_KEY:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

> ℹ️ If you do not have Twilio/Email credentials, that is okay — the core dashboard still works.

---

### Step 5 — Run Database Migrations

```bash
python manage.py migrate
```

---

### Step 6 — Create an Admin User

```bash
python manage.py createsuperuser
```

---

### Step 7 — Start the Backend Server

```bash
python manage.py runserver
```

✅ Backend API: **http://localhost:8000**
✅ Admin panel: **http://localhost:8000/admin**

---

### Step 8 — Set Up and Start the Frontend

Open a **new terminal** (keep backend running):

```bash
cd Gov-Admin-Dashboard
npm install
npm run dev
```

✅ Frontend: **http://localhost:8080**

---

## 🔁 Daily Workflow (After First Setup)

```bash
# 1. Start the database
docker start govnitnidhi-postgres

# 2. Terminal 1 — Backend
cd backend/mainBackend
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux
python manage.py runserver

# 3. Terminal 2 — Frontend
cd Gov-Admin-Dashboard
npm run dev
```

---

## 🌐 Ports Summary

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin |
| PostgreSQL | localhost:5432 |

---

## ❓ Troubleshooting

**`docker: command not found`**
→ Install and open Docker Desktop first.

**Database connection error**
→ Run `docker ps` to check if the container is up.
→ If stopped: `docker start govnitnidhi-postgres`
→ If missing: re-run the `docker run` command from Step 2.

**`ModuleNotFoundError` in Django**
→ Virtual environment is not activated. Run `venv\Scripts\activate`.

**Frontend blank / cannot connect to API**
→ Make sure Django backend is running on port 8000.

**`npm install` fails**
→ Check Node version: `node --version` (needs 18+).

**Gmail not sending email**
→ Use a Gmail **App Password**, not your regular password.
→ Enable 2FA on Google account, then generate App Password under Security settings.

---

## 🔐 Security Notes

- Never commit your `.env` file — it is already excluded by `.gitignore`
- `.env.example` is safe to share — it contains no real credentials
- For production: set `DEBUG=False` and configure `ALLOWED_HOSTS`
