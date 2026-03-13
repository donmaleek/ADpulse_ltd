'use strict';

require('dotenv').config();

const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const compression = require('compression');
const rateLimit  = require('express-rate-limit');

const contactRoutes    = require('./src/routes/contact');
const newsletterRoutes = require('./src/routes/newsletter');
const leadsRoutes      = require('./src/routes/leads');
const adminRoutes      = require('./src/routes/admin');

const app  = express();
const PORT = process.env.PORT || 4000;

/* ── Security middleware ── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5500',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Global rate limiter ── */
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

/* ── Health check ── */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Adpulse API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/* ── API Routes ── */
app.use('/api/contact',    contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/leads',      leadsRoutes);
app.use('/api/admin',      adminRoutes);

/* ── 404 handler ── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

/* ── Global error handler ── */
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`\n  Adpulse API running on port ${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/health\n`);
});

module.exports = app;
