import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', padding: '64px 0 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48 }}>
          <div>
            <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, fontFamily:'Space Grotesk', fontSize:20, fontWeight:800 }}>
              <span style={{ color:'var(--text)' }}>AD<span style={{ color:'var(--cyan)' }}>pulse</span></span>
            </Link>
            <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.75, maxWidth:280 }}>
              Empowering businesses across Kenya with smart IT solutions and software automation.
            </p>
          </div>
          {[
            { title: 'Services', links: ['Website Design','App Development','CRM Systems','Process Automation','Email Automation','ICT Support'] },
            { title: 'Company',  links: ['About Us','Our Process','Portfolio','Blog','Contact'] },
            { title: 'Contact',  links: ['Nairobi, Kenya','adpulseindustries@gmail.com','+254 769 968 696','Mon–Fri 8am–6pm EAT'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:12, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text)', marginBottom:16 }}>
                {col.title}
              </h4>
              <ul style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {col.links.map(l => (
                  <li key={l} style={{ fontSize:14, color:'var(--text-2)' }}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--border)', padding:'20px 0', display:'flex', justifyContent:'space-between' }}>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>&copy; 2026 Adpulse Ltd. All rights reserved.</p>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>Crafted with passion in Kenya 🇰🇪</p>
        </div>
      </div>
    </footer>
  )
}
