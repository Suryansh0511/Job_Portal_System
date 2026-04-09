require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Test database on startup
pool.query('SELECT * FROM login LIMIT 1', (err, res) => {
  if (err) console.error('LOGIN TABLE ERROR:', err.message);
  else console.log('✅ LOGIN TABLE OK');
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, mobile, email, address, username, password, role_id } = req.body;

  console.log('Register request received:', { name, email, username, role_id });

  if (!name || !email || !username || !password || !role_id) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  try {
    // Check if username already exists
    const exists = await pool.query(
      'SELECT * FROM login WHERE login_username = $1',
      [username]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    // Check if email already exists
    const emailExists = await pool.query(
      'SELECT * FROM users WHERE user_email = $1',
      [email]
    );
    if (emailExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Insert into users table
    const userResult = await pool.query(
      `INSERT INTO users (user_name, user_mobile, user_email, user_address)
       VALUES ($1, $2, $3, $4) RETURNING user_id`,
      [name, mobile, email, address]
    );
    const userId = userResult.rows[0].user_id;

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert into login table
    await pool.query(
      `INSERT INTO login (login_username, user_password, login_role_id, user_id)
       VALUES ($1, $2, $3, $4)`,
      [username, hashed, role_id, userId]
    );

    console.log('✅ User registered successfully:', username);
    res.status(201).json({ message: 'Registered successfully.' });

  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received:', { username });

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  try {
    const result = await pool.query(
      `SELECT l.*, r.role_name, u.user_name, u.user_email
       FROM login l
       JOIN roles r ON l.login_role_id = r.role_id
       JOIN users u ON l.user_id = u.user_id
       WHERE l.login_username = $1`,
      [username]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.user_password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'suryansh_jobportal_secret_2024';
    const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role_name,
        username: user.login_username
      },
      jwtSecret,
      { expiresIn: jwtExpiry }
    );

    console.log('✅ Login successful:', username, '| Role:', user.role_name);

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.user_name,
        username: user.login_username,
        email: user.user_email,
        role: user.role_name
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;