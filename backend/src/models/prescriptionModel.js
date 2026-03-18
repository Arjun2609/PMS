const { pool } = require("../config/db");

class PrescriptionModel {
  static async create(prescriptionData) {
    const {
      medicalRecordId,
      petId,
      doctorId,
      medicationName,
      dosage,
      frequency,
      durationDays,
      quantity,
      unit,
      instructions,
    } = prescriptionData;

    const query = `
      INSERT INTO app.prescriptions (medical_record_id, pet_id, doctor_id, medication_name, dosage, frequency, duration_days, quantity, unit, instructions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, medical_record_id, pet_id, doctor_id, medication_name, dosage, frequency, duration_days, quantity, unit, instructions, prescribed_date, is_active
    `;

    const values = [
      medicalRecordId,
      petId,
      doctorId,
      medicationName,
      dosage,
      frequency,
      durationDays,
      quantity,
      unit,
      instructions,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT pr.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             mr.diagnosis, mr.record_date
      FROM app.prescriptions pr
      JOIN app.pets p ON pr.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON pr.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.medical_records mr ON pr.medical_record_id = mr.id
      WHERE pr.id = $1 AND pr.is_active = true
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByPetId(petId) {
    const query = `
      SELECT pr.*,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             mr.diagnosis, mr.record_date
      FROM app.prescriptions pr
      JOIN app.doctors doc ON pr.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.medical_records mr ON pr.medical_record_id = mr.id
      WHERE pr.pet_id = $1 AND pr.is_active = true
      ORDER BY pr.prescribed_date DESC
    `;
    const result = await pool.query(query, [petId]);
    return result.rows;
  }

  static async findByDoctorId(doctorId, limit = 50) {
    const query = `
      SELECT pr.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM app.prescriptions pr
      JOIN app.pets p ON pr.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      WHERE pr.doctor_id = $1 AND pr.is_active = true
      ORDER BY pr.prescribed_date DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [doctorId, limit]);
    return result.rows;
  }

  static async findActiveByPetId(petId) {
    const query = `
      SELECT pr.*,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM app.prescriptions pr
      JOIN app.doctors doc ON pr.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      WHERE pr.pet_id = $1 AND pr.is_active = true
      AND (pr.expiry_date IS NULL OR pr.expiry_date > CURRENT_DATE)
      ORDER BY pr.prescribed_date DESC
    `;
    const result = await pool.query(query, [petId]);
    return result.rows;
  }

  static async updateRefills(id, refillsRemaining) {
    const query = `
      UPDATE app.prescriptions
      SET refills_remaining = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND is_active = true
      RETURNING *
    `;
    const result = await pool.query(query, [refillsRemaining, id]);
    return result.rows[0];
  }

  static async deactivate(id) {
    const query = `
      UPDATE app.prescriptions
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getExpiringSoon(days = 30) {
    const query = `
      SELECT pr.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             u.phone as owner_phone
      FROM app.prescriptions pr
      JOIN app.pets p ON pr.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      WHERE pr.is_active = true
      AND pr.expiry_date IS NOT NULL
      AND pr.expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
      ORDER BY pr.expiry_date ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async searchMedications(searchTerm, limit = 20) {
    const query = `
      SELECT DISTINCT medication_name
      FROM app.prescriptions
      WHERE medication_name ILIKE $1
      AND is_active = true
      ORDER BY medication_name
      LIMIT $2
    `;
    const result = await pool.query(query, [`%${searchTerm}%`, limit]);
    return result.rows;
  }
}

module.exports = PrescriptionModel;
