-- Role Creation Script
-- Date: March 18, 2026
-- Purpose: Create application roles and permissions

-- Create application roles
CREATE ROLE pms_admin WITH CREATEDB CREATEROLE LOGIN PASSWORD 'admin_password';
CREATE ROLE pms_app WITH LOGIN PASSWORD 'app_password';
CREATE ROLE pms_readonly WITH LOGIN PASSWORD 'readonly_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE pms_db TO pms_admin;
GRANT CONNECT ON DATABASE pms_db TO pms_app;
GRANT CONNECT ON DATABASE pms_db TO pms_readonly;

\echo 'Roles created successfully'
