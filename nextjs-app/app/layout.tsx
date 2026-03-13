import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Adpulse Ltd | IT Support & Software Automation | Kenya',
  description: 'We turn technology into your competitive edge. IT support, software automation, CRM systems, and digital transformation for businesses across Kenya and East Africa.',
  keywords: 'IT support Kenya, software automation, web development Mombasa, CRM systems, business automation',
  openGraph: {
    title: 'Adpulse Ltd | IT Support & Software Automation',
    description: 'Smart digital solutions for forward-thinking businesses in Kenya.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
