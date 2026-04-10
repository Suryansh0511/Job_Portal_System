const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.connect()
  .then(client => {
    console.log("✅ DB connected");
    return client
      .query('SELECT current_database()')
      .then(res => {
        console.log('📦 Connected to DB:', res.rows[0].current_database);
        client.release();
      });
  })
  .catch(err => console.error("❌ DB connection failed:", err.message));

module.exports = pool;