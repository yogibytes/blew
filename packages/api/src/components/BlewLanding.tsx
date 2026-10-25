'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BlewTerminal } from '@/components/BlewTerminal'

const links = [['Product','/product'],['Developers','/developers'],['Pricing','/pricing'],['Security','/security'],['Company','/company'],['Docs','/docs']]
const testimonials = [
  ['"I integrated Blew in a day\nand saved 70% on payment fees.\nMy customers love it."','John','E-commerce Store'],
  ['"The simplest way to accept\nSOL and USDC from customers."','Maya','Digital Studio'],
  ['"We shipped our first crypto\ncheckout before lunch."','Alex','Independent Builder'],
]
const ledeTexts = [
  'Accept SOL and USDC payments with a simple, developer-first infrastructure.',
  'Drop one React widget into your site and start accepting crypto payments.',
  'Create payments with a single API call and track each one through confirmation.',
  'Add crypto checkout to your store without building any payment plumbing.',
  'Payments, products and transaction logs behind one clean API, built on Solana.',
  'Test on devnet, then go live on mainnet when you\'re ready.',
  'Built for developers and merchants who want crypto payments without the friction.',
]

function BlewWordmark({ small = false }: { small?: boolean }) {
  return <span className={small ? 'blew-wordmark blew-wordmark-small' : 'blew-wordmark'} role="img" aria-label="Blew">Blew</span>
}

function RotatingLede() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % ledeTexts.length), 4500)
    return () => clearInterval(timer)
  }, [])
  return <p className="lede" key={index} aria-live="polite">
    {ledeTexts[index].split('\n').map((line, i) => <span key={i}>{line}{i === 0 ? '' : ''}<br /></span>)}
  </p>
}

function Testimonial() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const timer = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000); return () => clearInterval(timer) }, [paused])
  const [quote, name, role] = testimonials[index]
  return <section className="testimonial" aria-label="Customer testimonial" aria-live="polite" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <p className="quote">{quote}</p><div className="profile"><div className="avatar">{name[0]}</div><div><strong>{name}</strong><span>{role}</span></div></div>
    <div className="progress" aria-label={`${index + 1} of 3`}><button aria-label="Show testimonial 1" className={index === 0 ? 'active' : ''} onClick={() => setIndex(0)} /><button aria-label="Show testimonial 2" className={index === 1 ? 'active' : ''} onClick={() => setIndex(1)} /><button aria-label="Show testimonial 3" className={index === 2 ? 'active' : ''} onClick={() => setIndex(2)} /></div>
  </section>
}

export function BlewLanding() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <main className="blew-site">
  <div className="photo-layer" />
    <header className="site-header"><Link href="/" className="brand"><BlewWordmark small /></Link><nav className="header-nav"><Link href="/dashboard">Dashboard <ArrowUpRight /></Link><Link href="/get-started" className="outline-link">Get Started <ArrowUpRight /></Link></nav><button className="menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></header>
    {menuOpen && <nav className="mobile-menu">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}<Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link><Link href="/get-started" onClick={() => setMenuOpen(false)}>Get Started</Link></nav>}
    <div className="hero-grid"><section className="hero-copy"><h1><span>Give your</span><span>crypto payments</span><span>wings.</span></h1><RotatingLede /><Link href="/get-started" className="start-link"><ArrowRight aria-hidden="true" /> <span>Start building</span></Link><nav className="side-nav">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></section><section className="demo-column"><Testimonial /><BlewTerminal /></section></div>
    <footer className="site-footer"><div className="socials"><a href="https://x.com/blew" target="_blank" rel="noreferrer" aria-label="Blew on X"><span>𝕏</span></a><a href="https://github.com/blew" target="_blank" rel="noreferrer" aria-label="Blew on GitHub"><span className="github-mark">GH</span></a><a href="https://discord.com/invite/blew" target="_blank" rel="noreferrer" aria-label="Blew on Discord"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.317 4.492c-1.53-.742-3.247-1.3-5.085-1.564a.05.05 0 0 0-.052.025c-.221.387-.467.896-.639 1.298a18.666 18.666 0 0 0-5.487 0c-.172-.402-.419-.911-.64-1.298a.052.052 0 0 0-.052-.025c-1.838.264-3.555.822-5.085 1.564a.05.05 0 0 0-.024.045c-.326 4.87.278 9.677 3.228 13.59a.06.06 0 0 0 .052.028c1.2.473 2.359.922 3.546 1.255a.05.05 0 0 0 .054-.019c.225-.31.425-.645.607-1.002a.05.05 0 0 0-.028-.07c-.77-.243-1.501-.566-2.21-.923a.05.05 0 0 1-.005-.083c.149-.112.297-.229.437-.343a.05.05 0 0 1 .052-.007c4.642 2.122 9.67 2.122 14.275 0a.05.05 0 0 1 .053.007c.14.114.288.231.437.343a.05.05 0 0 1-.004.083c-.709.357-1.44.68-2.21.923a.05.05 0 0 0-.028.07c.182.357.382.692.607 1.002a.05.05 0 0 0 .054.019c1.187-.333 2.346-.782 3.546-1.255a.06.06 0 0 0 .052-.028c2.95-3.913 4.555-8.72 3.229-13.59a.05.05 0 0 0-.024-.045zM8.02 15.33c-1.183 0-2.157-.967-2.157-2.156 0-1.193.974-2.157 2.157-2.157 1.183 0 2.158.964 2.157 2.157 0 1.19-.974 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.967-2.157-2.156 0-1.193.974-2.157 2.157-2.157 1.183 0 2.158.964 2.157 2.157 0 1.19-.974 2.156-2.157 2.156z"/></svg></a></div><span>© {new Date().getFullYear()} Blew. All rights reserved.</span><div className="legal"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/status">Status</a><a href="mailto:hello@blew.example">Contact</a></div></footer>
  </main>
}
