# Project Structure Documentation

## Overview

Pet Management System (PMS) - A comprehensive full-stack application for managing veterinary clinics, doctors, pets, appointments, and medical records.

## Directory Structure

### Root Level

- `frontend/` - React-based user interface
- `backend/` - Node.js Express API server
- `database/` - All database-related scripts and migrations
- `.env` - Environment variables
- `package.json` - Root project configuration
- `README.md` - Project documentation

### Frontend Structure (`/frontend`)

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page-level components
│   ├── services/         # API service calls
│   ├── utils/            # Helper functions
│   ├── styles/           # CSS/SCSS files
│   ├── App.js
│   └── index.js
├── package.json
└── .env
```

### Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   └── utils/            # Helper functions
├── tests/                # Test files
├── server.js             # Entry point
├── package.json
└── .env
```

### Database Structure (`/database`)

```
database/
├── scripts/
│   ├── 01_create_database/     # Database creation
│   ├── 02_create_roles/        # User roles & permissions
│   ├── 03_create_schemas/      # Schema definitions
│   ├── 04_create_tables/       # Table definitions
│   ├── 05_create_functions/    # PL/pgSQL functions
│   ├── 06_create_procedures/   # Stored procedures
│   └── 07_create_indexes/      # Indexes & triggers
├── seeds/                      # Sample data
├── migrations/                 # Schema migrations
└── setup_db.bat               # Windows setup script
```

## Setup Instructions

### 1. Database Setup

```bash
# Windows
cd database
.\setup_db.bat

# Or manually
psql -U postgres -f scripts/01_create_database/create_database.sql
psql -U postgres -d pms_db -f scripts/02_create_roles/create_roles.sql
psql -U postgres -d pms_db -f scripts/03_create_schemas/create_schemas.sql
psql -U postgres -d pms_db -f scripts/04_create_tables/create_tables.sql
psql -U postgres -d pms_db -f scripts/05_create_functions/create_functions.sql
psql -U postgres -d pms_db -f scripts/06_create_procedures/create_procedures.sql
psql -U postgres -d pms_db -f scripts/07_create_indexes/create_indexes.sql
psql -U postgres -d pms_db -f seeds/sample_data.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (.env)

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pms_db
DB_USER=postgres
DB_PASSWORD=1q2w3e4r5t
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Tables

- **users** - System users (customers, veterinarians, admin, staff)
- **clinics** - Veterinary clinic information
- **doctors** - Veterinarian profiles
- **pets** - Pet information
- **appointments** - Booking records
- **medical_records** - Clinical history
- **prescriptions** - Medication prescriptions

## Key Features

✅ User management with role-based access  
✅ Clinic and doctor management  
✅ Pet registration and tracking  
✅ Appointment scheduling  
✅ Medical records management  
✅ Prescription tracking  
✅ UUID-based primary keys  
✅ Comprehensive indexing  
✅ Audit trails

## Technology Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL 18
- **Authentication**: JWT
- **Security**: Bcrypt for password hashing, Helmet for headers

## Next Steps

1. Update database credentials in `.env` files
2. Run database setup scripts
3. Install and start backend server
4. Install and start frontend application
5. Begin development on additional features
