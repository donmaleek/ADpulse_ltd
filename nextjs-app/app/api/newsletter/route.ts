import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Valid email required.' }, { status: 422 })
    }
    await pool.query(
      `INSERT INTO subscribers (email, ip_address)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET status='active'`,
      [email, req.ip]
    )
    return NextResponse.json({ success: true, message: 'Subscribed!' }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/newsletter]', err)
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 })
  }
}
