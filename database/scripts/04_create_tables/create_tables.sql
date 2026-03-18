-- Master Table Creation Script
-- Date: March 18, 2026
-- Source: Combined schema from schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE app.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'veterinarian', 'admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON app.users(email);
CREATE INDEX idx_users_role ON app.users(role);
CREATE INDEX idx_users_is_active ON app.users(is_active);

-- ============================================================================
-- CLINICS TABLE
-- ============================================================================
CREATE TABLE app.clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    opening_time TIME,
    closing_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clinics_city ON app.clinics(city);
CREATE INDEX idx_clinics_is_active ON app.clinics(is_active);
CREATE INDEX idx_clinics_name ON app.clinics(name);

-- ============================================================================
-- DOCTORS TABLE
-- ============================================================================
CREATE TABLE app.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    clinic_id UUID NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(255),
    years_of_experience INT CHECK (years_of_experience >= 0),
    bio TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctors_user FOREIGN KEY (user_id)
        REFERENCES app.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_doctors_clinic FOREIGN KEY (clinic_id)
        REFERENCES app.clinics(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_doctors_clinic_id ON app.doctors(clinic_id);
CREATE INDEX idx_doctors_user_id ON app.doctors(user_id);
CREATE INDEX idx_doctors_is_available ON app.doctors(is_available);
CREATE INDEX idx_doctors_specialization ON app.doctors(specialization);

-- ============================================================================
-- PETS TABLE
-- ============================================================================
CREATE TABLE app.pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'hamster', 'other')),
    breed VARCHAR(100),
    color VARCHAR(100),
    date_of_birth DATE,
    weight DECIMAL(8, 2),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unknown')),
    microchip_number VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pets_owner FOREIGN KEY (owner_id)
        REFERENCES app.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_pets_owner_id ON app.pets(owner_id);
CREATE INDEX idx_pets_species ON app.pets(species);
CREATE INDEX idx_pets_microchip ON app.pets(microchip_number);
CREATE INDEX idx_pets_is_active ON app.pets(is_active);

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE app.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    clinic_id UUID NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 30 CHECK (duration_minutes > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled')),
    reason VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_pet FOREIGN KEY (pet_id)
        REFERENCES app.pets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id)
        REFERENCES app.doctors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_clinic FOREIGN KEY (clinic_id)
        REFERENCES app.clinics(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_appointments_pet_id ON app.appointments(pet_id);
CREATE INDEX idx_appointments_doctor_id ON app.appointments(doctor_id);
CREATE INDEX idx_appointments_clinic_id ON app.appointments(clinic_id);
CREATE INDEX idx_appointments_appointment_date ON app.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON app.appointments(status);
CREATE INDEX idx_appointments_doctor_date ON app.appointments(doctor_id, appointment_date);

-- ============================================================================
-- MEDICAL_RECORDS TABLE
-- ============================================================================
CREATE TABLE app.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    appointment_id UUID,
    clinic_id UUID NOT NULL,
    record_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diagnosis VARCHAR(500),
    symptoms TEXT,
    clinical_notes TEXT NOT NULL,
    treatment_plan TEXT,
    follow_up_date DATE,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medical_records_pet FOREIGN KEY (pet_id)
        REFERENCES app.pets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_medical_records_doctor FOREIGN KEY (doctor_id)
        REFERENCES app.doctors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_medical_records_appointment FOREIGN KEY (appointment_id)
        REFERENCES app.appointments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_medical_records_clinic FOREIGN KEY (clinic_id)
        REFERENCES app.clinics(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_medical_records_pet_id ON app.medical_records(pet_id);
CREATE INDEX idx_medical_records_doctor_id ON app.medical_records(doctor_id);
CREATE INDEX idx_medical_records_appointment_id ON app.medical_records(appointment_id);
CREATE INDEX idx_medical_records_clinic_id ON app.medical_records(clinic_id);
CREATE INDEX idx_medical_records_record_date ON app.medical_records(record_date);
CREATE INDEX idx_medical_records_is_archived ON app.medical_records(is_archived);
CREATE INDEX idx_medical_records_pet_date ON app.medical_records(pet_id, record_date DESC);

-- ============================================================================
-- PRESCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE app.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_id UUID NOT NULL,
    pet_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    duration_days INT CHECK (duration_days > 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL,
    instructions TEXT,
    refills_remaining INT DEFAULT 0 CHECK (refills_remaining >= 0),
    is_active BOOLEAN DEFAULT true,
    prescribed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prescriptions_medical_record FOREIGN KEY (medical_record_id)
        REFERENCES app.medical_records(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prescriptions_pet FOREIGN KEY (pet_id)
        REFERENCES app.pets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id)
        REFERENCES app.doctors(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_prescriptions_medical_record_id ON app.prescriptions(medical_record_id);
CREATE INDEX idx_prescriptions_pet_id ON app.prescriptions(pet_id);
CREATE INDEX idx_prescriptions_doctor_id ON app.prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_is_active ON app.prescriptions(is_active);
CREATE INDEX idx_prescriptions_expiry_date ON app.prescriptions(expiry_date);
CREATE INDEX idx_prescriptions_prescribed_date ON app.prescriptions(prescribed_date);

\echo 'All tables created successfully'
