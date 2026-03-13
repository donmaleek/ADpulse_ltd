'use strict';

const express   = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const pool      = require('../db/pool');
const { sendMail, contactConfirmationHtml, contactNotificationHtml } = require('../utils/mailer');

const router = express.Router();

/* Strict rate limit for contact form: 5 per hour per IP */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Please try again in an hour.' },
});

const validate = [
  body('name').trim().notEmpty().isLength({ max: 120 }).withMessage('Name is required (max 120 chars).'),
  body('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('message').trim().notEmpty().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10–5000 characters.'),
  body('company').optional().trim().isLength({ max: 120 }),
  body('service').optional().trim().isLength({ max: 120 }),
];

/* POST /api/contact */
router.post('/', contactLimiter, validate, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { name, email, company, service, message } = req.body;
  const ip = req.ip;

  try {
    /* Save to database */
    const { rows } = await pool.query(
      `INSERT INTO contacts (name, email, company, service, message, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [name, email, company || null, service || null, message, ip]
    );

    const contact = rows[0];

    /* Auto-create lead in pipeline */
    await pool.query(
      `INSERT INTO leads (contact_id, name, email, company, service, stage)
       VALUES ($1, $2, $3, $4, $5, 'new')`,
      [contact.id, name, email, company || null, service || null]
    );

    /* Send emails (non-blocking) */
    Promise.all([
      sendMail({
        to: email,
        subject: 'We received your message — Adpulse Ltd',
        html: contactConfirmationHtml(name),
      }),
      sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `New enquiry from ${name} — ${service || 'General'}`,
        html: contactNotificationHtml({ name, email, company, service, message }),
      }),
    ]).catch(err => console.error('[MAIL]', err.message));

    return res.status(201).json({
      success: true,
      message: 'Your message has been received. We\'ll be in touch within 24 hours.',
      id: contact.id,
    });
  } catch (err) {
    next(err);
  }
});

/* GET /api/contact — admin fetch all contacts */
const { requireAuth } = require('../middleware/auth');
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '20'));
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = 'SELECT * FROM contacts';
    const params = [];
    if (status) {
      params.push(status);
      query += ` WHERE status = $${params.length}`;
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    const { rows: count } = await pool.query('SELECT COUNT(*) FROM contacts' + (status ? ' WHERE status = $1' : ''), status ? [status] : []);

    res.json({ success: true, data: rows, total: parseInt(count[0].count), page, limit });
  } catch (err) {
    next(err);
  }
});

/* PATCH /api/contact/:id/status */
router.patch('/:id/status', requireAuth, async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['new', 'in_review', 'converted', 'closed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value.' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE contacts SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
