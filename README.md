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

## 👤 User Roles in This App

The portal has **4 user roles**. When your friend sets up, they create their own user with any role they need.

| Role | Access |
|------|--------|
| `zilla_parishad_admin` | Full admin — dashboard, all data, complaints, schemes |
| `gram_panchayat_admin` | Panchayat-level admin |
| `department_official` | Department-specific access |
| `citizen` | Basic citizen access |

> For full dashboard access like the main ZP portal, use role: **`zilla_parishad_admin`**

---

## ✅ Prerequisites

Install these before you begin:

| Tool | Download |
|------|---------|
| **Python 3.10+** | https://www.python.org/downloads/ |
| **Node.js 18+** | https://nodejs.org/ |
| **Docker Desktop** | https://www.docker.com/products/docker-desktop/ |
| **Git** | https://git-scm.com/ |

> ⚠️ Make sure **Docker Desktop is open and running** before proceeding.

---

## 🚀 Setup Guide (First Time Only)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/janhavi-gattani/govnitnidhi.git
cd govnitnidhi
```

---

### Step 2 — Start PostgreSQL with Docker

> You do **NOT** need to install PostgreSQL or create any database/user manually.
> One Docker command creates everything automatically.

**Windows (PowerShell):**
```powershell
docker run -d --name govnitnidhi-postgres -e POSTGRES_DB=aarohan_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
```

**Mac / Linux:**
```bash
docker run -d \
  --name govnitnidhi-postgres \
  -e POSTGRES_DB=aarohan_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

Verify it is running:
```bash
docker ps
```
You should see `govnitnidhi-postgres` with status `Up`.

---

### Step 3 — Set Up the Backend

```bash
# Go into the Django project folder
cd backend/mainBackend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all Python packages
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

Open `.env` in any text editor and fill in:

```env
# Django — generate a secret key (see tip below)
SECRET_KEY=your-random-secret-key-here
DEBUG=True

# Database — these match the Docker command above EXACTLY, no changes needed!
DB_NAME=aarohan_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Twilio — only needed for SMS/call features, leave as-is if not testing
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_BASE_URL=https://your-ngrok-url.ngrok-free.app

# Email — only needed for email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
DEFAULT_FROM_EMAIL=noreply@gramparishad.gov.in
```

> 💡 **Generate a SECRET_KEY** — run this once:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```
> Copy the output and paste it as your SECRET_KEY value.

---

### Step 5 — Run Database Migrations

```bash
# Make sure venv is still activated and you are in backend/mainBackend/
python manage.py migrate
```

This creates all the database tables automatically. You should see a list of migrations applied.

---

### Step 6 — Create Your Login for the ZP Portal

> ⚠️ **Important:** The database starts completely empty. You need to create your own user — your own username and password for the portal login.

Run this command:
```bash
python manage.py shell
```

You will enter a Python interactive shell. Copy and paste this entire block and press Enter:

```python
from core.models import User

user = User.objects.create_user(
    username='yourname',           # ← change this (your login username)
    password='YourPassword@123',   # ← change this (your login password)
    email='your@email.com',        # ← change this
    phone_number='+919999999999',  # ← change this (must include country code)
    role='zilla_parishad_admin',   # ← gives full dashboard access
    first_name='Your',
    last_name='Name',
    is_staff=True,
    is_superuser=True
)
print(f"User created: {user.username} with role {user.role}")
exit()
```

> 📝 Change the values in `← change this` lines to your own details.
> The `phone_number` must be unique and include country code e.g. `+919876543210`

You will see: `User created: yourname with role zilla_parishad_admin`

Now you can log in to the portal with your chosen username and password! ✅

---

### Step 7 — Start the Backend Server

```bash
python manage.py runserver
```

✅ Backend running at: **http://localhost:8000**
✅ Django Admin panel: **http://localhost:8000/admin**

---

### Step 8 — Set Up and Start the Frontend

Open a **new terminal window** (keep the backend terminal running):

```bash
# From the repo root folder
cd Gov-Admin-Dashboard

npm install

npm run dev
```

✅ Frontend running at: **http://localhost:8080**

---

### Step 9 — Log In to the Portal

1. Open **http://localhost:8080** in your browser
2. Enter the **username** and **password** you set in Step 6
3. You now have full access to the dashboard 🎉

---

## 🔁 Daily Workflow (After First Setup)

Every time you want to run the project:

```bash
# Terminal 1 — Start the database
docker start govnitnidhi-postgres

# Terminal 2 — Start backend
cd backend/mainBackend
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
python manage.py runserver

# Terminal 3 — Start frontend
cd Gov-Admin-Dashboard
npm run dev
```

---

## 🌐 Ports Summary

| Service | URL |
|---------|-----|
| 🌐 Frontend (Portal) | http://localhost:8080 |
| ⚙️ Backend API | http://localhost:8000 |
| 🔐 Django Admin | http://localhost:8000/admin |
| 🐘 PostgreSQL | localhost:5432 |

---

## ❓ Troubleshooting

**`docker: command not found`**
→ Install Docker Desktop and make sure it is running (check system tray).

**Database connection error / `could not connect to server`**
→ Run `docker ps` — if `govnitnidhi-postgres` is not listed:
→ Try: `docker start govnitnidhi-postgres`
→ If still not there, re-run the full `docker run` command from Step 2.

**`ModuleNotFoundError` in Django**
→ Virtual environment is not activated. Run `venv\Scripts\activate` first.

**`phone_number` error when creating user in shell**
→ Make sure to include the country code: `+91` followed by 10 digits. Example: `+919876543210`

**Login says "No active account found"**
→ You have not created a user yet — go back to Step 6 and run the shell script.

**Frontend shows blank page or API errors**
→ Make sure the Django backend is running on port 8000.

**`npm install` fails**
→ Check Node.js version: `node --version` — needs to be 18 or higher.

**Twilio/Email features not working**
→ You need your own Twilio account or Gmail App Password for these.
→ Core dashboard features (complaints, schemes, documents) work without them.

---

## 🔐 Security Notes

- Never commit `.env` — it is already excluded in `.gitignore`
- `.env.example` is safe to share — it has no real credentials
- Each person who clones this repo creates their own user with their own password
- For production: set `DEBUG=False` and update `ALLOWED_HOSTS`
