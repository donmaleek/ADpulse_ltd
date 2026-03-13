'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email via Nodemailer.
 * @param {{ to: string, subject: string, html: string, text?: string }} opts
 */
async function sendMail({ to, subject, html, text }) {
  return transporter.sendMail({
    from:    process.env.MAIL_FROM || 'Adpulse Ltd <adpulseindustries@gmail.com>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });
}

/* ── Email templates ── */

function contactConfirmationHtml(name) {
  return `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#060D1F;color:#F0F4FF;padding:40px 32px;border-radius:16px;border:1px solid rgba(255,255,255,0.09)">
    <div style="margin-bottom:28px">
      <span style="font-size:24px;font-weight:800;background:linear-gradient(135deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">ADpulse Ltd</span>
    </div>
    <h2 style="margin:0 0 12px;font-size:22px;font-weight:700">Thanks for reaching out, ${name}!</h2>
    <p style="color:#8B9DC3;line-height:1.7;margin:0 0 20px">We received your message and our team will review it promptly. You can expect a response from us within <strong style="color:#00D4FF">24 hours</strong>.</p>
    <p style="color:#8B9DC3;line-height:1.7;margin:0 0 32px">In the meantime, feel free to browse our services or drop us a WhatsApp message for urgent queries.</p>
    <a href="https://wa.me/${process.env.COMPANY_WHATSAPP || '254769968696'}" style="display:inline-block;background:linear-gradient(135deg,#00D4FF,#00FF88);color:#060D1F;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none">Chat on WhatsApp</a>
    <hr style="margin:32px 0;border:none;border-top:1px solid rgba(255,255,255,0.09)">
    <p style="color:#4A5878;font-size:13px;margin:0">Adpulse Ltd &mdash; Nairobi, Kenya &mdash; adpulseindustries@gmail.com</p>
  </div>`;
}

function contactNotificationHtml(data) {
  return `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0A1628;color:#F0F4FF;padding:32px;border-radius:16px;border:1px solid rgba(0,212,255,0.2)">
    <h2 style="margin:0 0 20px;color:#00D4FF;font-size:20px">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#8B9DC3;width:130px">Name</td><td style="padding:8px 0;font-weight:600">${data.name}</td></tr>
      <tr><td style="padding:8px 0;color:#8B9DC3">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}" style="color:#00D4FF">${data.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#8B9DC3">Company</td><td style="padding:8px 0">${data.company || '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#8B9DC3">Service</td><td style="padding:8px 0">${data.service || '—'}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.08)">
      <p style="margin:0;color:#8B9DC3;font-size:13px;margin-bottom:8px">Message:</p>
      <p style="margin:0;line-height:1.7">${data.message}</p>
    </div>
    <p style="margin-top:24px;color:#4A5878;font-size:12px">Received: ${new Date().toLocaleString('en-KE',{timeZone:'Africa/Nairobi'})}</p>
  </div>`;
}

module.exports = { sendMail, contactConfirmationHtml, contactNotificationHtml };
