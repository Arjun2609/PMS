const { pool } = require("../config/db");

class UserModel {
  static async create(userData) {
    const { email, passwordHash, firstName, lastName, phone, role } = userData;

    const query = `
      INSERT INTO app.users (email, password_hash, first_name, last_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, phone, role, created_at
    `;

    const values = [email, passwordHash, firstName, lastName, phone, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, last_login
      FROM app.users
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at, last_login
      FROM app.users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateLastLogin(id) {
    const query = `
      UPDATE app.users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }

  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at, last_login
      FROM app.users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async getByRole(role, limit = 50, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at, last_login
      FROM app.users
      WHERE role = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [role, limit, offset]);
    return result.rows;
  }
}

module.exports = UserModel;
