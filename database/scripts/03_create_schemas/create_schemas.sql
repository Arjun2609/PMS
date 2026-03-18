-- Schema Creation Script
-- Date: March 18, 2026
-- Purpose: Create application schemas

CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS staging;

-- Set permissions
GRANT USAGE ON SCHEMA public TO pms_app, pms_readonly;
GRANT USAGE ON SCHEMA app TO pms_app, pms_readonly;
GRANT USAGE ON SCHEMA audit TO pms_app;
GRANT USAGE ON SCHEMA staging TO pms_app;

\echo 'Schemas created successfully'
