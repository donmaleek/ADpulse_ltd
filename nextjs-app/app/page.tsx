import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adpulse Ltd | IT Support & Software Automation Kenya',
}

const services = [
  { icon: '🖥️', title: 'Website Redesign & Optimization', desc: 'High-performance websites built to convert visitors into paying clients.' },
  { icon: '📱', title: 'Web & Mobile App Development', desc: 'Custom applications engineered to solve your specific business challenges.' },
  { icon: '👥', title: 'Custom CRM Systems', desc: 'Purpose-built CRM platforms that supercharge your team\'s productivity.' },
  { icon: '⚡', title: 'Business Process Automation', desc: 'Eliminate repetitive tasks and free your team to focus on what matters.' },
  { icon: '📧', title: 'Email & Communication Automation', desc: 'Smart campaigns and notification systems that scale with your business.' },
  { icon: '🎨', title: 'Graphic / ICT / Admin Services', desc: 'Professional design, IT support, and admin solutions under one roof.' },
]

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Satisfied Clients' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '5+',  label: 'Years Experience' },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '96px 24px 48px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,102,255,0.18) 0%, transparent 70%)',
      }}>
        <div style={{ maxWidth: 820 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:10,
            fontSize:13, fontWeight:500, color:'var(--text-2)',
            background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)',
            padding:'8px 18px', borderRadius:100, marginBottom:28, backdropFilter:'blur(8px)',
          }}>
            <span style={{ width:8, height:8, background:'var(--green)', borderRadius:'50%', display:'inline-block' }}></span>
            Available for New Projects — Kenya &amp; Beyond
          </div>
          <h1 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(40px,7vw,80px)', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.03em', marginBottom:24 }}>
            We Turn <span className="gradient-text">Technology</span><br />
            Into Your <span className="gradient-text">Competitive Edge</span>
          </h1>
          <p style={{ fontSize:'clamp(16px,2vw,19px)', color:'var(--text-2)', maxWidth:580, margin:'0 auto 36px', lineHeight:1.75 }}>
            IT support, software automation, and digital transformation solutions for forward-thinking businesses across Kenya and East Africa.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap', marginBottom:56 }}>
            <Link href="/contact" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'14px 28px', borderRadius:10, fontSize:15, fontWeight:700,
              background:'linear-gradient(135deg,#00D4FF,#00FF88)', color:'#060D1F',
              boxShadow:'0 4px 20px rgba(0,212,255,0.35)', textDecoration:'none',
            }}>
              Start a Project →
            </Link>
            <Link href="/services" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'14px 28px', borderRadius:10, fontSize:15, fontWeight:600,
              background:'transparent', color:'var(--text)',
              border:'1.5px solid rgba(255,255,255,0.09)', textDecoration:'none',
            }}>
              Explore Services
            </Link>
          </div>
          {/* Stats */}
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
            borderRadius:16, padding:'20px 32px', maxWidth:520, margin:'0 auto',
            backdropFilter:'blur(12px)',
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ display:'flex', alignItems:'center' }}>
                <div style={{ textAlign:'center', padding:'0 24px' }}>
                  <div style={{ fontFamily:'Space Grotesk', fontSize:28, fontWeight:800 }} className="gradient-text">{s.value}</div>
                  <div style={{ fontSize:12, color:'var(--text-2)', marginTop:2 }}>{s.label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div style={{ width:1, height:40, background:'var(--border)' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ padding:'100px 24px', background:'var(--bg-alt)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span style={{ display:'inline-block', fontSize:12, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--cyan)', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)', padding:'6px 16px', borderRadius:100, marginBottom:16 }}>
              What We Do
            </span>
            <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:12 }}>
              Solutions That Drive <span className="gradient-text">Real Growth</span>
            </h2>
            <p style={{ fontSize:17, color:'var(--text-2)', maxWidth:600, margin:'0 auto' }}>
              From concept to deployment — digital solutions that give your business a measurable advantage.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {services.map(s => (
              <Link key={s.title} href="/services" style={{
                display:'block', textDecoration:'none',
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
                borderRadius:24, padding:32,
                transition:'transform 0.3s ease, border-color 0.3s ease',
              }}>
                <div style={{ fontSize:36, marginBottom:16 }}>{s.icon}</div>
                <h3 style={{ fontFamily:'Space Grotesk', fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.7 }}>{s.desc}</p>
              </Link>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Link href="/services" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:600,
              border:'1.5px solid rgba(255,255,255,0.09)', color:'var(--text)', textDecoration:'none',
            }}>
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section style={{ padding:'80px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16 }}>
            Ready to Transform Your <span className="gradient-text">Business?</span>
          </h2>
          <p style={{ fontSize:17, color:'var(--text-2)', marginBottom:36, lineHeight:1.7 }}>
            Book a free 30-minute discovery call. We'll listen, understand, and recommend the right solution for your goals and budget.
          </p>
          <Link href="/contact" style={{
            display:'inline-flex', alignItems:'center', gap:10,
            padding:'16px 36px', borderRadius:12, fontSize:16, fontWeight:700,
            background:'linear-gradient(135deg,#00D4FF,#00FF88)', color:'#060D1F',
            boxShadow:'0 8px 32px rgba(0,212,255,0.4)', textDecoration:'none',
          }}>
            Book Free Consultation →
          </Link>
        </div>
      </section>
    </>
  )
}
