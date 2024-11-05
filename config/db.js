const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'privy_monitoring_db',
  password: 'Ramadhan@12',
  port: 5432,
});

module.exports = pool;
