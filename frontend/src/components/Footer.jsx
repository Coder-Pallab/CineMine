import React from 'react'
import { assets } from '../assets/assets'
// import { Twitter, Instagram, Youtube } from 'lucide-react'

const FooterLink = ({ href = '#', children }) => (
  <li>
    <a
      href={href}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
    >
      <span style={{ display: 'inline-block', width: 12, height: 1, background: 'rgba(230,57,70,0.6)', flexShrink: 0 }} />
      {children}
    </a>
  </li>
)

const SocialButton = ({ href = '#', icon: Icon }) => (
  <a
    href={href}
    className="flex items-center justify-center"
    style={{
      width: 34, height: 34,
      borderRadius: 6,
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.35)',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(230,57,70,0.6)'
      e.currentTarget.style.color = '#e63946'
      e.currentTarget.style.background = 'rgba(230,57,70,0.08)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
      e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
      e.currentTarget.style.background = 'transparent'
    }}
  >
    <Icon style={{ width: 14, height: 14 }} />
  </a>
)

const Footer = () => {
  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-8 overflow-hidden">

      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 600, height: 2, background: 'linear-gradient(to right, transparent, rgba(230,57,70,0.3), transparent)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 400, height: 80, background: 'radial-gradient(ellipse at top, rgba(230,57,70,0.06), transparent 70%)', filter: 'blur(20px)' }} />

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Brand column */}
        <div className="md:col-span-5 flex flex-col items-start gap-5">
          <img src={assets.logo} alt="CineMine" className="h-9 w-auto object-contain"/>

          {/* Tagline */}
          <p style={{ fontFamily: "'Georgia', serif", fontSize: '0.85rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.4)', maxWidth: 320 }}>
            Your one-stop destination for booking movie tickets online. Explore latest releases, watch trailers, and book seats instantly.
          </p>

          {/* Social row */}
          <div className="flex items-center gap-2 mt-1">
            {/* <SocialButton icon={Twitter} />
            <SocialButton icon={Instagram} />
            <SocialButton icon={Youtube} /> */}
            {/* <SocialButton icon={Github} /> */}
          </div>

          {/* App store badges */}
          <div className="flex items-center gap-3 mt-2">
            <img src={assets.googlePlay} alt="Google Play" className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer" />
            <img src={assets.appStore} alt="App Store" className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 5 }} />
          </div>
        </div>

        {/* Spacer */}
        <div className="hidden md:block md:col-span-1" />

        {/* Company links */}
        <div className="md:col-span-3">
          <h3 className="mb-5" style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(230,57,70,0.9)', fontWeight: 600 }}>
            Company
          </h3>
          <ul className="space-y-3.5">
            <FooterLink>Home</FooterLink>
            <FooterLink>About Us</FooterLink>
            <FooterLink>Contact Us</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-3">
          <h3 className="mb-5" style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(230,57,70,0.9)', fontWeight: 600 }}>
            Get In Touch
          </h3>
          <div className="space-y-3.5">
            {['+91-6001478031', 'cinemine.contact@gmail.com'].map((item) => (
              <p key={item} className="flex items-center gap-2"
                style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ display: 'inline-block', width: 12, height: 1, background: 'rgba(230,57,70,0.6)', flexShrink: 0 }} />
                {item}
              </p>
            ))}
          </div>

          {/* Mini newsletter */}
          <div className="mt-8">
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
              Stay Updated
            </p>
            <div className="flex" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  padding: '8px 12px',
                  fontFamily: "'Courier New', monospace", fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em',
                }}
              />
              <button
                style={{
                  padding: '8px 14px',
                  background: 'rgba(230,57,70,0.85)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: "'Courier New', monospace", fontSize: '0.62rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#fff', fontWeight: 600,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e63946'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(230,57,70,0.85)'}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: '0.62rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} CINEMINE · ALL RIGHTS RESERVED
        </p>
        <div className="flex items-center gap-1" style={{ fontFamily: "'Courier New', monospace", fontSize: '0.62rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.15)' }}>
          <span>BUILT BY</span>
          <a
            href="https://fullstackpallab.vercel.app"
            style={{ color: 'rgba(230,57,70,0.6)', textDecoration: 'none', marginLeft: 4, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e63946'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(230,57,70,0.6)'}
          >
            FULLSTACKPALLAB
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer