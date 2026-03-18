-- PostgreSQL Database Creation Script
-- Date: March 18, 2026
-- Purpose: Create the main PMS database

-- Connect to default postgres database first, then run:
-- psql -U postgres -f database/scripts/01_create_database/create_database.sql

CREATE DATABASE pms_db
    WITH 
    ENCODING 'UTF8'
    LC_COLLATE 'en_US.UTF-8'
    LC_CTYPE 'en_US.UTF-8'
    TEMPLATE template0;

\c pms_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

ALTER DATABASE pms_db OWNER TO postgres;

\echo 'Database pms_db created successfully'
