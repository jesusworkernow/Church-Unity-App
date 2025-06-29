// models/churchModel.js - DB model functions for churches
const pool = require('../db');

// Input sanitization is handled by parameterized queries
module.exports = {
  async createChurch({ name, denomination, city, country, contact_email }) {
    const result = await pool.query(
      'INSERT INTO churches (name, denomination, city, country, contact_email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, denomination, city, country, contact_email]
    );
    return result.rows[0];
  },

  async getAllChurches() {
    const result = await pool.query('SELECT * FROM churches');
    return result.rows;
  },

  async getChurchById(id) {
    const result = await pool.query('SELECT * FROM churches WHERE id = $1', [id]);
    return result.rows[0];
  },

  async updateChurch(id, { name, denomination, city, country, contact_email }) {
    const result = await pool.query(
      'UPDATE churches SET name=$1, denomination=$2, city=$3, country=$4, contact_email=$5 WHERE id=$6 RETURNING *',
      [name, denomination, city, country, contact_email, id]
    );
    return result.rows[0];
  },

  async deleteChurch(id) {
    const result = await pool.query('DELETE FROM churches WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async searchChurches({ name, city, country }) {
    let query = 'SELECT * FROM churches WHERE 1=1';
    const params = [];
    if (name) {
      params.push(`%${name}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    if (city) {
      params.push(`%${city}%`);
      query += ` AND city ILIKE $${params.length}`;
    }
    if (country) {
      params.push(`%${country}%`);
      query += ` AND country ILIKE $${params.length}`;
    }
    const result = await pool.query(query, params);
    return result.rows;
  }
};
