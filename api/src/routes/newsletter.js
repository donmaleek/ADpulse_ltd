'use strict';

const express   = require('express');
const { body, validationResult } = require('express-validator');
const pool      = require('../db/pool');
const { sendMail } = require('../utils/mailer');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* POST /api/newsletter — subscribe */
router.post('/', [
  body('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('name').optional().trim().isLength({ max: 120 }),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { email, name } = req.body;
  try {
    /* Upsert — re-activates unsubscribed users */
    await pool.query(
      `INSERT INTO subscribers (email, name, ip_address)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET status = 'active', name = EXCLUDED.name`,
      [email, name || null, req.ip]
    );

    /* Welcome email */
    sendMail({
      to: email,
      subject: 'Welcome to the Adpulse Insider Newsletter!',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#060D1F;color:#F0F4FF;padding:40px 32px;border-radius:16px;border:1px solid rgba(255,255,255,0.09)">
          <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;background:linear-gradient(135deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">You're In!</h2>
          <p style="color:#8B9DC3;line-height:1.7">Welcome to the Adpulse Insider Newsletter. Every month we send practical insights on tech, automation, and digital strategy for East African businesses.</p>
          <p style="color:#8B9DC3;line-height:1.7">No spam. Unsubscribe anytime.</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid rgba(255,255,255,0.09)">
          <p style="color:#4A5878;font-size:13px;margin:0">Adpulse Ltd &mdash; Mombasa, Kenya</p>
        </div>`,
    }).catch(err => console.error('[MAIL]', err.message));

    res.status(201).json({ success: true, message: 'You are now subscribed!' });
  } catch (err) {
    next(err);
  }
});

/* DELETE /api/newsletter/unsubscribe */
router.delete('/unsubscribe', [
  body('email').trim().isEmail().normalizeEmail(),
], async (req, res, next) => {
  const { email } = req.body;
  try {
    await pool.query(
      `UPDATE subscribers SET status='unsubscribed', unsubscribed_at=NOW() WHERE email=$1`,
      [email]
    );
    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (err) {
    next(err);
  }
});

/* GET /api/newsletter — admin: list subscribers */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, name, status, subscribed_at
       FROM subscribers
       ORDER BY subscribed_at DESC`
    );
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
