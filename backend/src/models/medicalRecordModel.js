const { pool } = require("../config/db");

class MedicalRecordModel {
  static async create(recordData) {
    const {
      petId,
      doctorId,
      appointmentId,
      clinicId,
      diagnosis,
      symptoms,
      clinicalNotes,
      treatmentPlan,
      followUpDate,
    } = recordData;

    const query = `
      INSERT INTO app.medical_records (pet_id, doctor_id, appointment_id, clinic_id, diagnosis, symptoms, clinical_notes, treatment_plan, follow_up_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, pet_id, doctor_id, appointment_id, clinic_id, record_date, diagnosis, symptoms, clinical_notes, treatment_plan, follow_up_date, created_at
    `;

    const values = [
      petId,
      doctorId,
      appointmentId,
      clinicId,
      diagnosis,
      symptoms,
      clinicalNotes,
      treatmentPlan,
      followUpDate,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT mr.*,
             p.name as pet_name, p.species as pet_species, p.breed as pet_breed,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             c.name as clinic_name
      FROM app.medical_records mr
      JOIN app.pets p ON mr.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON mr.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.clinics c ON mr.clinic_id = c.id
      WHERE mr.id = $1 AND mr.is_archived = false
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByPetId(petId) {
    const query = `
      SELECT mr.*,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             c.name as clinic_name
      FROM app.medical_records mr
      JOIN app.doctors doc ON mr.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.clinics c ON mr.clinic_id = c.id
      WHERE mr.pet_id = $1 AND mr.is_archived = false
      ORDER BY mr.record_date DESC
    `;
    const result = await pool.query(query, [petId]);
    return result.rows;
  }

  static async findByDoctorId(doctorId, limit = 50) {
    const query = `
      SELECT mr.*,
             p.name as pet_name, p.species as pet_species, p.breed as pet_breed,
             u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM app.medical_records mr
      JOIN app.pets p ON mr.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      WHERE mr.doctor_id = $1 AND mr.is_archived = false
      ORDER BY mr.record_date DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [doctorId, limit]);
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    const query = `
      UPDATE app.medical_records
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async archive(id) {
    const query = `
      UPDATE app.medical_records
      SET is_archived = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getRecentRecords(limit = 20) {
    const query = `
      SELECT mr.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM app.medical_records mr
      JOIN app.pets p ON mr.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON mr.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      WHERE mr.is_archived = false
      ORDER BY mr.record_date DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = MedicalRecordModel;
