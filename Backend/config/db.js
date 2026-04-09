const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'Job_Portal',
});

pool.connect((err, client) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    // This will tell us EXACTLY which database we are connected to
    client.query('SELECT current_database()', (err, res) => {
      console.log('✅ Connected to database:', res.rows[0].current_database);
      client.release();
    });
  }
});

module.exports = pool;