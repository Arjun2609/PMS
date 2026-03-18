const { pool } = require("../config/db");

class PetModel {
  static async create(petData) {
    const {
      ownerId,
      name,
      species,
      breed,
      dateOfBirth,
      weight,
      gender,
      microchipNumber,
    } = petData;

    const query = `
      INSERT INTO app.pets (owner_id, name, species, breed, date_of_birth, weight, gender, microchip_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, owner_id, name, species, breed, date_of_birth, weight, gender, microchip_number, created_at
    `;

    const values = [
      ownerId,
      name,
      species,
      breed,
      dateOfBirth,
      weight,
      gender,
      microchipNumber,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name, u.email as owner_email
      FROM app.pets p
      JOIN app.users u ON p.owner_id = u.id
      WHERE p.id = $1 AND p.is_active = true
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByOwnerId(ownerId) {
    const query = `
      SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM app.pets p
      JOIN app.users u ON p.owner_id = u.id
      WHERE p.owner_id = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [ownerId]);
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
      UPDATE app.pets
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      UPDATE app.pets
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async search(searchTerm, species = null, limit = 20) {
    let query = `
      SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM app.pets p
      JOIN app.users u ON p.owner_id = u.id
      WHERE p.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (searchTerm) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.breed ILIKE $${paramCount} OR p.microchip_number = $${paramCount})`;
      values.push(`%${searchTerm}%`);
      paramCount++;
    }

    if (species) {
      query += ` AND p.species = $${paramCount}`;
      values.push(species);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount}`;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = PetModel;
