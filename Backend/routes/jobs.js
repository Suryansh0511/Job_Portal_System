const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, u.user_name as posted_by_name,
        COALESCE(json_agg(s.skill_type) FILTER (WHERE s.skill_id IS NOT NULL), '[]') AS skills
      FROM job j LEFT JOIN users u ON j.posted_by = u.user_id
      LEFT JOIN job_skills js ON j.job_id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.skill_id
      GROUP BY j.job_id, u.user_name ORDER BY j.created_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch jobs.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, u.user_name as posted_by_name,
        COALESCE(json_agg(json_build_object('skill_id', s.skill_id, 'skill_type', s.skill_type))
          FILTER (WHERE s.skill_id IS NOT NULL), '[]') AS skills
      FROM job j LEFT JOIN users u ON j.posted_by = u.user_id
      LEFT JOIN job_skills js ON j.job_id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.skill_id
      WHERE j.job_id = $1 GROUP BY j.job_id, u.user_name`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch job.' }); }
});

router.post('/', authenticate, authorize('Recruiter', 'Admin'), async (req, res) => {
  const { job_name, job_desc, job_type, job_vac, skill_ids } = req.body;
  if (!job_name) return res.status(400).json({ error: 'Job name required.' });
  try {
    const r = await pool.query(
      'INSERT INTO job (job_name, job_desc, job_type, job_vac, posted_by) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [job_name, job_desc, job_type, job_vac || 1, req.user.userId]
    );
    const job = r.rows[0];
    if (skill_ids?.length) {
      const vals = skill_ids.map(id => `(${job.job_id}, ${id})`).join(',');
      await pool.query(`INSERT INTO job_skills (job_id, skill_id) VALUES ${vals}`);
    }
    res.status(201).json({ message: 'Job posted.', job });
  } catch (err) { res.status(500).json({ error: 'Failed to post job.' }); }
});

router.put('/:id', authenticate, authorize('Recruiter', 'Admin'), async (req, res) => {
  const { job_name, job_desc, job_type, job_vac, skill_ids } = req.body;
  try {
    await pool.query('UPDATE job SET job_name=$1, job_desc=$2, job_type=$3, job_vac=$4 WHERE job_id=$5',
      [job_name, job_desc, job_type, job_vac, req.params.id]);
    if (skill_ids !== undefined) {
      await pool.query('DELETE FROM job_skills WHERE job_id=$1', [req.params.id]);
      if (skill_ids.length) {
        const vals = skill_ids.map(id => `(${req.params.id}, ${id})`).join(',');
        await pool.query(`INSERT INTO job_skills (job_id, skill_id) VALUES ${vals}`);
      }
    }
    res.json({ message: 'Job updated.' });
  } catch (err) { res.status(500).json({ error: 'Failed to update job.' }); }
});

router.delete('/:id', authenticate, authorize('Admin', 'Recruiter'), async (req, res) => {
  try {
    await pool.query('DELETE FROM job WHERE job_id=$1', [req.params.id]);
    res.json({ message: 'Job deleted.' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete job.' }); }
});

module.exports = router;
