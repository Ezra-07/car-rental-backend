import pool from "../config/db.js"

export const User = {
  async create(username, hashedPassword) {
    const result = await pool.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      [username, hashedPassword]
    )
    return result.rows[0]; 
  },

  async findByUsername(username) {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    )
    return result.rows[0] || null;
  },
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    )
    return result.rows[0] || null;
  }
}
