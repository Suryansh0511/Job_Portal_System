const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// SKILLS
router.get('/skills', async (req, res) => {
  try { res.json((await pool.query('SELECT * FROM skills ORDER BY skill_type')).rows); }
  catch { res.status(500).json({ error: 'Failed.' }); }
});
router.post('/skills', authenticate, authorize('Admin'), async (req, res) => {
  const { skill_type, skill_desc } = req.body;
  try {
    const r = await pool.query('INSERT INTO skills (skill_type, skill_desc) VALUES ($1,$2) RETURNING *', [skill_type, skill_desc]);
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});
router.delete('/skills/:id', authenticate, authorize('Admin'), async (req, res) => {
  try { await pool.query('DELETE FROM skills WHERE skill_id=$1', [req.params.id]); res.json({ message: 'Deleted.' }); }
  catch { res.status(500).json({ error: 'Failed.' }); }
});

// APPLICATIONS
router.post('/applications', authenticate, authorize('JobSeeker'), async (req, res) => {
  const { job_id, res_id } = req.body;
  try {
    const exists = await pool.query('SELECT * FROM applications WHERE job_id=$1 AND user_id=$2', [job_id, req.user.userId]);
    if (exists.rows.length) return res.status(409).json({ error: 'Already applied.' });
    const r = await pool.query('INSERT INTO applications (job_id, user_id, res_id) VALUES ($1,$2,$3) RETURNING *',
      [job_id, req.user.userId, res_id || null]);
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});
router.get('/applications/my', authenticate, authorize('JobSeeker'), async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT a.*, j.job_name, j.job_type FROM applications a JOIN job j ON a.job_id=j.job_id WHERE a.user_id=$1 ORDER BY a.applied_at DESC`,
      [req.user.userId]);
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});
router.get('/applications/job/:job_id', authenticate, authorize('Recruiter', 'Admin'), async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT a.*, u.user_name, u.user_email, res.res_name FROM applications a
       JOIN users u ON a.user_id=u.user_id LEFT JOIN resume res ON a.res_id=res.res_id
       WHERE a.job_id=$1 ORDER BY a.applied_at DESC`, [req.params.job_id]);
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});
router.put('/applications/:id/status', authenticate, authorize('Recruiter', 'Admin'), async (req, res) => {
  try {
    await pool.query('UPDATE applications SET status=$1 WHERE app_id=$2', [req.body.status, req.params.id]);
    res.json({ message: 'Updated.' });
  } catch { res.status(500).json({ error: 'Failed.' }); }
});

// ADMIN
router.get('/admin/users', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT u.user_id, u.user_name, u.user_email, u.user_mobile, r.role_name, l.login_username, u.created_at
       FROM users u JOIN login l ON u.user_id=l.user_id JOIN roles r ON l.login_role_id=r.role_id ORDER BY u.user_id`);
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});
router.delete('/admin/users/:id', authenticate, authorize('Admin'), async (req, res) => {
  try { await pool.query('DELETE FROM users WHERE user_id=$1', [req.params.id]); res.json({ message: 'Deleted.' }); }
  catch { res.status(500).json({ error: 'Failed.' }); }
});

// SALARY
router.get('/salary', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const r = await pool.query(`SELECT s.*, u.user_name FROM salary s JOIN users u ON s.sal_emp_id=u.user_id`);
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});
router.post('/salary', authenticate, authorize('Admin'), async (req, res) => {
  const { sal_emp_id, sal_amt, sal_desc, sal_type, sal_total } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO salary (sal_emp_id, sal_amt, sal_desc, sal_type, sal_total) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [sal_emp_id, sal_amt, sal_desc, sal_type, sal_total]);
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Failed.' }); }
});

module.exports = router;
