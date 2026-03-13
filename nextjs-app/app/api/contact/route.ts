import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import nodemailer from 'nodemailer'

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required.' }, { status: 422 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 422 })
    }

    /* Save to DB */
    await pool.query(
      `INSERT INTO contacts (name, email, company, service, message, ip_address)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [name, email, company || null, service || null, message, req.ip]
    )

    /* Send notification email */
    await transporter.sendMail({
      from:    process.env.MAIL_FROM,
      to:      process.env.ADMIN_EMAIL,
      subject: `New enquiry from ${name}`,
      html:    `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Service:</strong> ${service || '—'}</p><p><strong>Message:</strong> ${message}</p>`,
    }).catch(() => {/* non-fatal */})

    return NextResponse.json({ success: true, message: 'Message received! We\'ll respond within 24 hours.' }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 })
  }
}
