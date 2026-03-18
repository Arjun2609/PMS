# Local Setup Guide

## Prerequisites
- **Node.js** (v18+) installed
- **PostgreSQL 18** installed and running
- **Git** installed

---

## Step 1: Database Setup

### Start PostgreSQL (Windows)
Open PowerShell as Administrator and ensure PostgreSQL service is running:
```powershell
Get-Service PostgreSQL*
```

If not running, start it:
```powershell
Start-Service PostgreSQL18
```

### Initialize Database (one-time)
From `C:\PMS\database`:
```powershell
cd C:\PMS\database
.\setup_db.bat
```

This will create the database and schema. Then seed sample data:
```powershell
cd C:\PMS\database\seeds
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d pms_db -f sample_data.sql
```

---

## Step 2: Backend Setup & Run

### Install Backend Dependencies
```powershell
cd C:\PMS\backend
npm install
```

### Start Backend Server
```powershell
npm start
```

Backend runs on **http://localhost:5000**

Verify health check:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

---

## Step 3: Frontend Setup & Run

### Install Frontend Dependencies
```powershell
cd C:\PMS\frontend
npm install
```

### Start Frontend Dev Server
```powershell
npm start
```

Frontend runs on **http://localhost:3003**

---

## Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:3003
```

You can now:
- Register a new user
- Login with credentials
- Browse pets, appointments, medical records, etc.

---

## Troubleshooting

### Backend won't start (EADDRINUSE)
Port 5000 is already in use. Kill the process:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm start
```

### Frontend won't start (Port 3000 taken)
React will automatically suggest port 3003 or higher. Accept the prompt.

### Database connection fails
Ensure PostgreSQL is running and credentials are correct in:
```
backend/src/config/db.js
```

Default: `user: postgres`, `password: postgres`, `database: pms_db`

---

## Quick Start (All in One)

Open **two separate PowerShell windows**:

**Window 1 (Backend):**
```powershell
cd C:\PMS\backend
npm start
```

**Window 2 (Frontend):**
```powershell
cd C:\PMS\frontend
npm start
```

Then open **http://localhost:3003** in your browser.

---

## Running Tests Locally

### API Health & Smoke Tests
```powershell
cd C:\PMS
.\test-api.ps1
```

### Full E2E Flow (Register → Login → Protected Routes)
```powershell
cd C:\PMS
.\e2e-test.ps1
```

---

## Production Build

### Build Frontend for Production
```powershell
cd C:\PMS\frontend
npm run build
```

Output goes to `frontend/build/` directory.
