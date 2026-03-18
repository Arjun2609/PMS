-- Seed Data Script
-- Purpose: Insert sample data for testing and development

-- Insert sample users
INSERT INTO app.users (email, password_hash, first_name, last_name, phone, role, is_active)
VALUES 
    ('admin@pms.com', 'hashed_password_1', 'Admin', 'User', '555-0001', 'admin', true),
    ('vet1@pms.com', 'hashed_password_2', 'Dr. Sarah', 'Johnson', '555-0002', 'veterinarian', true),
    ('customer1@pms.com', 'hashed_password_3', 'John', 'Doe', '555-0003', 'customer', true),
    ('staff1@pms.com', 'hashed_password_4', 'Jane', 'Smith', '555-0004', 'staff', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample clinics
INSERT INTO app.clinics (name, address, city, state, postal_code, phone, email, opening_time, closing_time, is_active)
VALUES 
    ('Happy Paws Clinic', '123 Pet Street', 'New York', 'NY', '10001', '555-1000', 'info@happypaws.com', '08:00:00', '18:00:00', true),
    ('Caring Veterinary Center', '456 Animal Ave', 'Los Angeles', 'CA', '90001', '555-2000', 'info@caring-vet.com', '09:00:00', '17:00:00', true)
ON CONFLICT (phone) DO NOTHING;

\echo 'Sample data inserted successfully'
