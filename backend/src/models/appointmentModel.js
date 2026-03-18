const { pool } = require("../config/db");

class AppointmentModel {
  static async create(appointmentData) {
    const {
      petId,
      doctorId,
      clinicId,
      appointmentDate,
      durationMinutes,
      reason,
      notes,
    } = appointmentData;

    const query = `
      INSERT INTO app.appointments (pet_id, doctor_id, clinic_id, appointment_date, duration_minutes, reason, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, pet_id, doctor_id, clinic_id, appointment_date, duration_minutes, status, reason, notes, created_at
    `;

    const values = [
      petId,
      doctorId,
      clinicId,
      appointmentDate,
      durationMinutes,
      reason,
      notes,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT a.*,
             p.name as pet_name, p.species as pet_species, p.breed as pet_breed,
             u.first_name as owner_first_name, u.last_name as owner_last_name, u.email as owner_email,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             c.name as clinic_name, c.address as clinic_address, c.phone as clinic_phone
      FROM app.appointments a
      JOIN app.pets p ON a.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON a.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.clinics c ON a.clinic_id = c.id
      WHERE a.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByPetId(petId) {
    const query = `
      SELECT a.*,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             c.name as clinic_name, c.address as clinic_address
      FROM app.appointments a
      JOIN app.doctors doc ON a.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.clinics c ON a.clinic_id = c.id
      WHERE a.pet_id = $1
      ORDER BY a.appointment_date DESC
    `;
    const result = await pool.query(query, [petId]);
    return result.rows;
  }

  static async findByDoctorId(doctorId, date = null) {
    let query = `
      SELECT a.*,
             p.name as pet_name, p.species as pet_species, p.breed as pet_breed,
             u.first_name as owner_first_name, u.last_name as owner_last_name, u.phone as owner_phone,
             c.name as clinic_name
      FROM app.appointments a
      JOIN app.pets p ON a.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.clinics c ON a.clinic_id = c.id
      WHERE a.doctor_id = $1
    `;
    const values = [doctorId];

    if (date) {
      query += ` AND DATE(a.appointment_date) = $2`;
      values.push(date);
    }

    query += ` ORDER BY a.appointment_date ASC`;
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findByClinicId(clinicId, date = null) {
    let query = `
      SELECT a.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM app.appointments a
      JOIN app.pets p ON a.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON a.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      WHERE a.clinic_id = $1
    `;
    const values = [clinicId];

    if (date) {
      query += ` AND DATE(a.appointment_date) = $2`;
      values.push(date);
    }

    query += ` ORDER BY a.appointment_date ASC`;
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updateStatus(id, status, notes = null) {
    const query = `
      UPDATE app.appointments
      SET status = $1, notes = COALESCE($2, notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, notes, id]);
    return result.rows[0];
  }

  static async getUpcoming(limit = 10) {
    const query = `
      SELECT a.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             c.name as clinic_name
      FROM app.appointments a
      JOIN app.pets p ON a.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON a.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.clinics c ON a.clinic_id = c.id
      WHERE a.appointment_date > CURRENT_TIMESTAMP
      AND a.status IN ('scheduled', 'confirmed')
      ORDER BY a.appointment_date ASC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getByDateRange(startDate, endDate, clinicId = null) {
    let query = `
      SELECT a.*,
             p.name as pet_name, p.species as pet_species,
             u.first_name as owner_first_name, u.last_name as owner_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name,
             c.name as clinic_name
      FROM app.appointments a
      JOIN app.pets p ON a.pet_id = p.id
      JOIN app.users u ON p.owner_id = u.id
      JOIN app.doctors doc ON a.doctor_id = doc.id
      JOIN app.users d ON doc.user_id = d.id
      JOIN app.clinics c ON a.clinic_id = c.id
      WHERE a.appointment_date BETWEEN $1 AND $2
    `;
    const values = [startDate, endDate];

    if (clinicId) {
      query += ` AND a.clinic_id = $3`;
      values.push(clinicId);
    }

    query += ` ORDER BY a.appointment_date ASC`;
    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = AppointmentModel;
