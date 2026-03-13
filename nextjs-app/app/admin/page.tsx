'use client'

import { useState, useEffect } from 'react'

interface DashboardData {
  contacts:    { total: string; new_count: string; this_month: string }
  leads:       { total: string; won: string; new_count: string; revenue: string }
  subscribers: { total: string; active: string }
}

export default function AdminDashboard() {
  const [token, setToken]   = useState<string|null>(null)
  const [data,  setData]    = useState<DashboardData|null>(null)
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [err,   setErr]     = useState('')
  const [loading, setLoading] = useState(false)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    })
    const json = await res.json()
    if (json.success) {
      setToken(json.token)
      localStorage.setItem('adpulse_admin_token', json.token)
    } else {
      setErr(json.message || 'Invalid credentials')
    }
    setLoading(false)
  }

  useEffect(() => {
    const saved = localStorage.getItem('adpulse_admin_token')
    if (saved) setToken(saved)
  }, [])

  useEffect(() => {
    if (!token) return
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => j.success && setData(j.data))
      .catch(() => setToken(null))
  }, [token])

  if (!token) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:400, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, padding:40 }}>
        <h1 style={{ fontFamily:'Space Grotesk', fontSize:24, fontWeight:800, marginBottom:8 }}>Admin Login</h1>
        <p style={{ color:'var(--text-2)', fontSize:14, marginBottom:28 }}>Adpulse Ltd — Staff Portal</p>
        <form onSubmit={login} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[{ id:'email', label:'Email', type:'email', val:email, set:setEmail },
            { id:'pass',  label:'Password', type:'password', val:pass,  set:setPass }].map(f => (
            <div key={f.id}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:8 }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required
                style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'12px 16px', fontSize:14, color:'var(--text)', fontFamily:'inherit', outline:'none' }}
              />
            </div>
          ))}
          {err && <p style={{ color:'#f87171', fontSize:13 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ padding:'13px', borderRadius:10, fontSize:15, fontWeight:700, background:'linear-gradient(135deg,#00D4FF,#00FF88)', color:'#060D1F', border:'none', cursor:'pointer' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )

  const statCards = data ? [
    { label:'Total Enquiries',    value: data.contacts.total,       sub: `${data.contacts.new_count} new`,  color:'#00D4FF' },
    { label:'Active Leads',       value: data.leads.total,          sub: `${data.leads.won} won`,           color:'#00FF88' },
    { label:'Newsletter Subs',    value: data.subscribers.active,   sub: 'active subscribers',              color:'#7C3AED' },
    { label:'Revenue Pipeline',   value: `KES ${Number(data.leads.revenue).toLocaleString()}`, sub:'from won deals', color:'#FFB800' },
  ] : []

  return (
    <div style={{ minHeight:'100vh', padding:'88px 24px 48px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
          <div>
            <h1 style={{ fontFamily:'Space Grotesk', fontSize:28, fontWeight:800 }}>Dashboard</h1>
            <p style={{ color:'var(--text-2)', fontSize:14 }}>Welcome back, Adpulse Admin</p>
          </div>
          <button onClick={() => { setToken(null); localStorage.removeItem('adpulse_admin_token') }}
            style={{ padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:600, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'var(--text-2)', cursor:'pointer' }}>
            Sign Out
          </button>
        </div>

        {data ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {statCards.map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, padding:28 }}>
                <p style={{ fontSize:13, color:'var(--text-2)', marginBottom:8 }}>{s.label}</p>
                <p style={{ fontFamily:'Space Grotesk', fontSize:36, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:12, color:'var(--text-3)', marginTop:6 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color:'var(--text-2)' }}>Loading dashboard data…</p>
        )}
      </div>
    </div>
  )
}
