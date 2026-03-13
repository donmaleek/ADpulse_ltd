'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight:'100vh', padding:'120px 24px 80px' }}>
      <div style={{ maxWidth:720, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <span style={{ display:'inline-block', fontSize:12, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--cyan)', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)', padding:'6px 16px', borderRadius:100, marginBottom:16 }}>
            Let&rsquo;s Talk
          </span>
          <h1 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(32px,5vw,52px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:12 }}>
            Ready to Transform Your <span className="gradient-text">Business?</span>
          </h1>
          <p style={{ fontSize:17, color:'var(--text-2)', lineHeight:1.7 }}>
            Fill in the form below and we&rsquo;ll respond within 24 hours with a tailored proposal.
          </p>
        </div>

        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, padding:40 }}>
          {status === 'success' ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <h3 style={{ fontFamily:'Space Grotesk', fontSize:22, fontWeight:700, marginBottom:10 }}>Message Sent!</h3>
              <p style={{ color:'var(--text-2)' }}>We&rsquo;ll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {[
                  { id:'name',    label:'Full Name',         type:'text',  placeholder:'John Doe',         required:true  },
                  { id:'email',   label:'Email Address',     type:'email', placeholder:'john@company.com',  required:true  },
                  { id:'company', label:'Company',           type:'text',  placeholder:'Your Company Ltd',  required:false },
                  { id:'phone',   label:'Phone (optional)',  type:'tel',   placeholder:'+254 700 000 000',  required:false },
                ].map(f => (
                  <div key={f.id} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    <label htmlFor={f.id} style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>{f.label}</label>
                    <input
                      id={f.id} name={f.id} type={f.type}
                      placeholder={f.placeholder} required={f.required}
                      style={{ background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'12px 16px', fontSize:14, color:'var(--text)', fontFamily:'inherit', outline:'none' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <label htmlFor="service" style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>Service Interested In</label>
                <select id="service" name="service" style={{ background:'var(--bg-alt)', border:'1.5px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'12px 16px', fontSize:14, color:'var(--text)', fontFamily:'inherit', outline:'none' }}>
                  <option value="">Select a service…</option>
                  {['Website Redesign','Web & Mobile App','Custom CRM','Process Automation','Email Automation','ICT Support','Multiple / Not Sure'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <label htmlFor="message" style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>Your Message</label>
                <textarea id="message" name="message" rows={5} required
                  placeholder="Describe your project and goals…"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'12px 16px', fontSize:14, color:'var(--text)', fontFamily:'inherit', outline:'none', resize:'vertical' }}
                />
              </div>
              {status === 'error' && (
                <p style={{ color:'#f87171', fontSize:14 }}>Something went wrong. Please try again or email us directly.</p>
              )}
              <button type="submit" disabled={status === 'sending'} style={{
                padding:'14px 28px', borderRadius:10, fontSize:15, fontWeight:700,
                background:'linear-gradient(135deg,#00D4FF,#00FF88)', color:'#060D1F',
                border:'none', cursor:'pointer', opacity: status === 'sending' ? 0.7 : 1,
              }}>
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
