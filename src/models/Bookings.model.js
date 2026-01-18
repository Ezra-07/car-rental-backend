import pool from "../config/db.js";

export const Booking = {

  async create({ userId, carName, days, rentPerDay }) {
    const result = await pool.query(
      `
      INSERT INTO bookings (user_id, car_name, days, rent_per_day, status)
      VALUES ($1, $2, $3, $4, 'booked')
      RETURNING *
      `,
      [userId, carName, days, rentPerDay]
    );

    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },

  async updateById(id, fields) {
    const { carName, days, rentPerDay, status } = fields;

    const result = await pool.query(
      `
      UPDATE bookings
      SET
        car_name = COALESCE($1, car_name),
        days = COALESCE($2, days),
        rent_per_day = COALESCE($3, rent_per_day),
        status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *
      `,
      [carName, days, rentPerDay, status, id]
    );

    return result.rows[0] || null;
  },

  async deleteById(id) {
    const result = await pool.query(
      `DELETE FROM bookings WHERE id = $1 RETURNING id`,
      [id]
    );

    return result.rows[0] || null;
  },

  async getSummary(userId) {
    const result = await pool.query(
      `
      SELECT
        COUNT(*) AS total_bookings,
        COALESCE(SUM(days * rent_per_day), 0) AS total_amount
      FROM bookings
      WHERE user_id = $1
      AND status IN ('booked', 'completed')
      `,
      [userId]
    );

    return result.rows[0];
  }
};
    