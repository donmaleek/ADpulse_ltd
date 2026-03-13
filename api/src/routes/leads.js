'use strict';

const express = require('express');
const { body, validationResult } = require('express-validator');
const pool    = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* All leads routes require auth */
router.use(requireAuth);

/* GET /api/leads — list all leads with pipeline view */
router.get('/', async (req, res, next) => {
  try {
    const stage    = req.query.stage;
    const priority = req.query.priority;
    const params   = [];
    const conds    = [];

    if (stage)    { params.push(stage);    conds.push(`stage    = $${params.length}`); }
    if (priority) { params.push(priority); conds.push(`priority = $${params.length}`); }

    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC`, params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

/* GET /api/leads/pipeline — grouped by stage for kanban view */
router.get('/pipeline', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT stage, COUNT(*) AS count, COALESCE(SUM(value),0) AS total_value
       FROM leads
       GROUP BY stage
       ORDER BY CASE stage
         WHEN 'new' THEN 1 WHEN 'qualified' THEN 2
         WHEN 'proposal' THEN 3 WHEN 'negotiation' THEN 4
         WHEN 'won' THEN 5 WHEN 'lost' THEN 6 END`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

/* GET /api/leads/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM leads WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

/* POST /api/leads — create lead manually */
router.post('/', [
  body('name').trim().notEmpty(),
  body('email').trim().isEmail().normalizeEmail(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { name, email, company, phone, service, value, priority, notes, assigned_to } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO leads (name, email, company, phone, service, value, priority, notes, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, email, company, phone, service, value || null, priority || 'medium', notes, assigned_to]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

/* PATCH /api/leads/:id — update lead */
router.patch('/:id', async (req, res, next) => {
  const allowed = ['stage','priority','value','notes','assigned_to','next_action','next_action_date'];
  const fields  = Object.keys(req.body).filter(k => allowed.includes(k));
  if (!fields.length) return res.status(400).json({ success: false, message: 'No valid fields provided.' });

  const sets   = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  const values = fields.map(f => req.body[f]);
  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE leads SET ${sets} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

/* DELETE /api/leads/:id */
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM leads WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
