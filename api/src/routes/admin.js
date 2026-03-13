'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool     = require('../db/pool');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

/* POST /api/admin/login */
router.post('/login', [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM admin_users WHERE email=$1 AND is_active=true', [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    await pool.query('UPDATE admin_users SET last_login=NOW() WHERE id=$1', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

/* POST /api/admin/register — only existing admins can create new users */
router.post('/register', requireAuth, requireRole('admin'), [
  body('name').trim().notEmpty(),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['admin', 'staff']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { name, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
      [name, email, hash, role]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already in use.' });
    }
    next(err);
  }
});

/* GET /api/admin/me */
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.admin });
});

/* GET /api/admin/dashboard — summary stats */
router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const [contacts, leads, subscribers, pipeline] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='new')         AS new_count,
        COUNT(*) FILTER (WHERE created_at > NOW()-INTERVAL '30 days') AS this_month
        FROM contacts`),
      pool.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE stage='won')          AS won,
        COUNT(*) FILTER (WHERE stage='new')          AS new_count,
        COALESCE(SUM(value) FILTER (WHERE stage='won'), 0) AS revenue
        FROM leads`),
      pool.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='active')      AS active
        FROM subscribers`),
      pool.query(`SELECT stage, COUNT(*) AS count, COALESCE(SUM(value),0) AS value
        FROM leads GROUP BY stage`),
    ]);

    res.json({
      success: true,
      data: {
        contacts:    contacts.rows[0],
        leads:       leads.rows[0],
        subscribers: subscribers.rows[0],
        pipeline:    pipeline.rows,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
