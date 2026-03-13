'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/services',     label: 'Services' },
  { href: '/about',        label: 'About' },
  { href: '/pricing',      label: 'Pricing' },
  { href: '/blog',         label: 'Blog' },
  { href: '/contact',      label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(6,13,31,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.09)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-grotesk text-xl font-black tracking-tight">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#navGrad)"/>
            <path d="M8 22L14 10L20 18L24 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="13" r="2" fill="#00FF88"/>
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#0066FF"/>
                <stop offset="100%" stopColor="#00D4FF"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{ color: 'var(--text)' }}>
            AD<span style={{ color: 'var(--cyan)' }}>pulse</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: pathname === l.href ? 'var(--text)' : 'var(--text-2)',
                  background: pathname === l.href ? 'rgba(255,255,255,0.06)' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="ml-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #00FF88)',
                color: '#060D1F',
                boxShadow: '0 4px 16px rgba(0,212,255,0.3)',
              }}
            >
              Get Started
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} color="var(--text)" /> : <Menu size={20} color="var(--text)" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 p-4 md:hidden"
          style={{
            background: 'rgba(6,13,31,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          {[...links, { href: '/contact', label: 'Get Started' }].map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-3 rounded-lg text-sm font-medium mb-1"
              style={{ color: 'var(--text-2)' }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
