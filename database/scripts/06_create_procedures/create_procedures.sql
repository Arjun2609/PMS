-- Stored Procedures
-- Purpose: Common database operations

-- Procedure: get_pet_medical_history
CREATE OR REPLACE FUNCTION app.get_pet_medical_history(pet_uuid UUID)
RETURNS TABLE (
    record_id UUID,
    diagnosis VARCHAR,
    record_date TIMESTAMP,
    doctor_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mr.id,
        mr.diagnosis,
        mr.record_date,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name
    FROM app.medical_records mr
    JOIN app.doctors d ON mr.doctor_id = d.id
    JOIN app.users u ON d.user_id = u.id
    WHERE mr.pet_id = pet_uuid
    ORDER BY mr.record_date DESC;
END;
$$ LANGUAGE plpgsql;

\echo 'Procedures created successfully'
