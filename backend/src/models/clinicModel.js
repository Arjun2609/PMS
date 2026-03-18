const { pool } = require("../config/db");

class ClinicModel {
  static async findAll() {
    const query = `
      SELECT c.*, COUNT(d.id) as doctor_count
      FROM app.clinics c
      LEFT JOIN app.doctors d ON c.id = d.clinic_id AND d.is_available = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.name
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT c.*, COUNT(d.id) as doctor_count
      FROM app.clinics c
      LEFT JOIN app.doctors d ON c.id = d.clinic_id AND d.is_available = true
      WHERE c.id = $1 AND c.is_active = true
      GROUP BY c.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByDoctorId(doctorId) {
    const query = `
      SELECT c.*
      FROM app.clinics c
      JOIN app.doctors d ON c.id = d.clinic_id
      WHERE d.id = $1 AND c.is_active = true
    `;
    const result = await pool.query(query, [doctorId]);
    return result.rows[0];
  }

  static async search(searchTerm) {
    const query = `
      SELECT c.*, COUNT(d.id) as doctor_count
      FROM app.clinics c
      LEFT JOIN app.doctors d ON c.id = d.clinic_id AND d.is_available = true
      WHERE c.is_active = true
      AND (c.name ILIKE $1 OR c.city ILIKE $1 OR c.state ILIKE $1)
      GROUP BY c.id
      ORDER BY c.name
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

class DoctorModel {
  static async findByUserId(userId) {
    const query = `
      SELECT d.*, u.first_name, u.last_name, u.email, c.name as clinic_name, c.address as clinic_address
      FROM app.doctors d
      JOIN app.users u ON d.user_id = u.id
      JOIN app.clinics c ON d.clinic_id = c.id
      WHERE d.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async findByClinicId(clinicId) {
    const query = `
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone
      FROM app.doctors d
      JOIN app.users u ON d.user_id = u.id
      WHERE d.clinic_id = $1 AND d.is_available = true
      ORDER BY u.first_name, u.last_name
    `;
    const result = await pool.query(query, [clinicId]);
    return result.rows;
  }

  static async findAvailableDoctors(date, time) {
    // This is a simplified version - in production you'd check actual availability
    const query = `
      SELECT d.*, u.first_name, u.last_name, c.name as clinic_name, c.address as clinic_address
      FROM app.doctors d
      JOIN app.users u ON d.user_id = u.id
      JOIN app.clinics c ON d.clinic_id = c.id
      WHERE d.is_available = true
      ORDER BY u.first_name, u.last_name
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = {
  ClinicModel,
  DoctorModel,
};
