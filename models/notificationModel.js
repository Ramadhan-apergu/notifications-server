const pool = require('../config/db');

const getAllNotification = async () => {
  try {
    const result = await pool.query('SELECT * FROM notifications');
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getNotificationsWithPagination = async (
  search,
  limit,
  offset,
  filter
) => {
  try {
    let querySearch = '';
    const values = [limit, offset];
    let paramIndex = 3;

    if (filter) {
      querySearch += `WHERE type = $${paramIndex}`;
      values.push(filter);
      paramIndex++;
    }

    if (search) {
      if (querySearch) {
        querySearch += ` AND (type ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR source ILIKE $${paramIndex} OR detail ILIKE $${paramIndex} OR CAST(datetime AS TEXT) ILIKE $${paramIndex})`;
      } else {
        querySearch += `WHERE (type ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR source ILIKE $${paramIndex} OR detail ILIKE $${paramIndex} OR CAST(datetime AS TEXT) ILIKE $${paramIndex})`;
      }
      values.push(`%${search}%`);
    }

    const query = `
      SELECT *
      FROM notifications
      ${querySearch}
      ORDER BY datetime DESC, id DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getTotalNotifications = async (search, filter) => {
  try {
    let querySearch = '';
    const values = [];
    let paramIndex = 1;

    if (filter) {
      querySearch += `WHERE type = $${paramIndex}`;
      values.push(filter);
      paramIndex++;
    }

    if (search) {
      if (querySearch) {
        querySearch += ` AND (type ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR source ILIKE $${paramIndex} OR detail ILIKE $${paramIndex} OR CAST(datetime AS TEXT) ILIKE $${paramIndex})`;
      } else {
        querySearch += `WHERE (type ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR source ILIKE $${paramIndex} OR detail ILIKE $${paramIndex} OR CAST(datetime AS TEXT) ILIKE $${paramIndex})`;
      }
      values.push(`%${search}%`);
    }

    const query = `
      SELECT COUNT(*)
      FROM notifications
      ${querySearch}
    `;

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    throw error;
  }
};

const createNotification = async (data) => {
  try {
    const { type, name, source, detail, datetime } = data;

    const result = await pool.query(
      'INSERT INTO notifications (type, name, source, detail, datetime) VALUES ($1, $2, $3, $4, $5)',
      [type, name, source, detail, datetime]
    );

    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllNotification,
  getNotificationsWithPagination,
  getTotalNotifications,
  createNotification,
};
