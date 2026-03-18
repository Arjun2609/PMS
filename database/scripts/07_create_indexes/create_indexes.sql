-- Index Creation and Optimization Scripts
-- Purpose: Create triggers and additional indexes

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON app.users
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON app.clinics
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON app.doctors
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON app.pets
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON app.appointments
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON app.medical_records
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON app.prescriptions
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

\echo 'Triggers and indexes created successfully'
