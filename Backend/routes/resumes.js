const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/my', authenticate, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM resume WHERE res_user_id=$1 ORDER BY created_at DESC', [req.user.userId]);
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});

router.post('/', authenticate, authorize('JobSeeker'), async (req, res) => {
  const { res_name, res_type, res_desc } = req.body;
  if (!res_name) return res.status(400).json({ error: 'Resume name required.' });
  try {
    const r = await pool.query(
      'INSERT INTO resume (res_name, res_type, res_desc, res_user_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [res_name, res_type || 'Generated', res_desc, req.user.userId]
    );
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});

router.put('/:id', authenticate, authorize('JobSeeker'), async (req, res) => {
  const { res_name, res_type, res_desc } = req.body;
  try {
    await pool.query('UPDATE resume SET res_name=$1, res_type=$2, res_desc=$3 WHERE res_id=$4 AND res_user_id=$5',
      [res_name, res_type, res_desc, req.params.id, req.user.userId]);
    res.json({ message: 'Updated.' });
  } catch { res.status(500).json({ error: 'Failed.' }); }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM resume WHERE res_id=$1 AND res_user_id=$2', [req.params.id, req.user.userId]);
    res.json({ message: 'Deleted.' });
  } catch { res.status(500).json({ error: 'Failed.' }); }
});

module.exports = router;
