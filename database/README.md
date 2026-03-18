# Database README

## Pet Management System - Database

### Overview

PostgreSQL 18 database for the Pet Management System with comprehensive schema including users, clinics, doctors, pets, appointments, medical records, and prescriptions.

### Structure

#### Scripts Directory

Database setup scripts organized in execution order:

1. **01_create_database/** - Database creation
   - Creates main `pms_db` database
   - Enables required extensions (uuid-ossp, pg_trgm)

2. **02_create_roles/** - Role management
   - Creates application roles: pms_admin, pms_app, pms_readonly
   - Sets up role-based permissions

3. **03_create_schemas/** - Schema creation
   - public schema - Default
   - app schema - Application tables
   - audit schema - Audit logging
   - staging schema - Data staging area

4. **04_create_tables/** - Table definitions
   - users, clinics, doctors, pets
   - appointments, medical_records, prescriptions
   - Includes constraints and indexes

5. **05_create_functions/** - PL/pgSQL functions
   - update_updated_at_column() - Timestamp management
   - Custom business logic functions

6. **06_create_procedures/** - Stored procedures
   - get_pet_medical_history() - Retrieve pet history
   - Additional operational procedures

7. **07_create_indexes/** - Indexes and triggers
   - Performance indexes
   - Automatic timestamp triggers

#### Other Directories

- **seeds/** - Sample data for testing and development
- **migrations/** - Schema migration scripts

### Tables

#### users

Core user table for system access (customers, veterinarians, admin, staff)

```sql
Columns: id (UUID), email, password_hash, first_name, last_name, phone, role, is_active, timestamps
```

#### clinics

Veterinary clinic information and locations

```sql
Columns: id (UUID), name, address, city, state, postal_code, phone, email, coordinates, hours, timestamps
```

#### doctors

Veterinarian profiles linked to clinics

```sql
Columns: id (UUID), user_id (FK), clinic_id (FK), license_number, specialization, experience, bio, is_available, timestamps
```

#### pets

Pet information owned by users

```sql
Columns: id (UUID), owner_id (FK), name, species, breed, color, date_of_birth, weight, gender, microchip_number, timestamps
```

#### appointments

Appointment records between pets and doctors

```sql
Columns: id (UUID), pet_id (FK), doctor_id (FK), clinic_id (FK), appointment_date, duration, status, reason, notes, timestamps
```

#### medical_records

Medical history and clinical notes for pets

```sql
Columns: id (UUID), pet_id (FK), doctor_id (FK), appointment_id (FK), clinic_id (FK), record_date, diagnosis, symptoms, clinical_notes, treatment_plan, follow_up_date, timestamps
```

#### prescriptions

Medication prescriptions linked to medical records

```sql
Columns: id (UUID), medical_record_id (FK), pet_id (FK), doctor_id (FK), medication_name, dosage, frequency, duration, quantity, unit, instructions, refills, is_active, prescribed_date, expiry_date, timestamps
```

### Setup Instructions

#### Prerequisites

- PostgreSQL 18 installed
- psql command-line tool available
- Windows batch file support (setup_db.bat)

#### Automated Setup (Windows)

```batch
cd database
setup_db.bat
```

#### Manual Setup

```bash
# 1. Create database and roles
psql -U postgres -f scripts/01_create_database/create_database.sql
psql -U postgres -f scripts/02_create_roles/create_roles.sql

# 2. Connect to pms_db and create schemas
psql -U postgres -d pms_db -f scripts/03_create_schemas/create_schemas.sql

# 3. Create tables
psql -U postgres -d pms_db -f scripts/04_create_tables/create_tables.sql

# 4. Create functions
psql -U postgres -d pms_db -f scripts/05_create_functions/create_functions.sql

# 5. Create procedures
psql -U postgres -d pms_db -f scripts/06_create_procedures/create_procedures.sql

# 6. Create indexes and triggers
psql -U postgres -d pms_db -f scripts/07_create_indexes/create_indexes.sql

# 7. Load sample data (optional)
psql -U postgres -d pms_db -f seeds/sample_data.sql
```

#### Connection String

```
postgresql://postgres:password@localhost:5432/pms_db
```

### Key Features

✅ UUID primary keys for all tables
✅ Foreign key relationships with CASCADE/RESTRICT policies
✅ Comprehensive indexes for query optimization
✅ CHECK constraints for data integrity
✅ Automatic timestamp management with triggers
✅ Role-based access control
✅ Multiple schemas for data organization
✅ Stored procedures for common operations
✅ Sample data for development

### Backup & Restore

#### Backup

```bash
pg_dump -U postgres -d pms_db > backup.sql
```

#### Restore

```bash
psql -U postgres -d pms_db < backup.sql
```

### Performance Considerations

- Indexes on frequently queried columns
- Compound indexes for complex queries
- Foreign key constraints for referential integrity
- Trigger-based automatic timestamp updates
- Connection pooling recommended at application level

### Security

- Role-based database users
- Separate schemas for different concerns
- Parameterized queries to prevent SQL injection
- Password hashing at application level
- Audit trail capability via audit schema

### Maintenance

#### Analyze and Vacuum

```bash
psql -U postgres -d pms_db -c "VACUUM ANALYZE;"
```

#### Check Index Health

```bash
psql -U postgres -d pms_db -c "SELECT * FROM pg_stat_user_indexes;"
```

### Troubleshooting

**Connection Issues:**

- Verify PostgreSQL service is running
- Check connection string and credentials
- Ensure database exists

**Permission Errors:**

- Verify user roles are created
- Check GRANT statements executed
- Restart PostgreSQL service

**Schema Not Found:**

- Run schema creation script
- Set search_path in connection
