-- Function: update_updated_at_column
-- Purpose: Automatically update the updated_at timestamp

CREATE OR REPLACE FUNCTION app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

\echo 'Functions created successfully'
