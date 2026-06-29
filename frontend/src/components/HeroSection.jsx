import React, { useEffect, useRef, useState, useCallback } from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, Clock, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MOVIES = [
  {
    id: 0,
    bg: '/roi_roi_binale.jpg',
    logo: null,
    logoAlt: null,
    title: ['Roi', 'Roi', 'Binale'],
    titleStroke: [false, true, false],
    genre: 'Drama · Musical · Rommance',
    year: '2025',
    runtime: '2h 26m',
    rating: '8.6',
    ratingSource: 'IMDb',
    vol: null,
    desc: 'Roi Roi Binale is a soul-stirring Assamese musical that weaves together themes of love, art, identity, and the lingering shadows of a region scarred by past turmoil.',
    // Colour theme: cosmic indigo-to-red
    accent: '#e63946',
    accentGlow: 'rgba(230,57,70,0.45)',
    badgeColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-400/10 border-yellow-400/30',
    overlayFrom: 'rgba(0,0,0,0.95)',
    overlayMid: 'rgba(10,5,30,0.55)',
  },
  {
    id: 1,
    bg: '/bhaimon_da.jpg',
    logo: null,
    logoAlt: null,
    title: ['Bhaimon', 'Da'],
    titleStroke: [false, true],
    genre: 'Drama · Biography · Musical',
    year: '2025',
    runtime: '2h 39m',
    rating: '8.7',
    ratingSource: 'IMDb',
    vol: null,
    desc: 'Based on a true story, Bhaimon Da recounts the harrowing journey of two Manipuri women who embarked on a perilous trek across war-torn Assam in search of medical treatment for their ailing infant daughter. Their odyssey through conflict-ridden landscapes becomes a testament to resilience and maternal devotion.',
    accent: '#f4a261',
    accentGlow: 'rgba(244,162,97,0.4)',
    badgeColor: 'text-orange-300',
    badgeBg: 'bg-orange-400/10 border-orange-400/30',
    overlayFrom: 'rgba(0,0,0,0.95)',
    overlayMid: 'rgba(5,10,25,0.5)',
  },
]

const HeroSection = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [active, setActive] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef(null)

  const movie = MOVIES[active]

  // Parallax
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 18
      const y = (e.clientY / innerHeight - 0.5) * 8
      el.style.setProperty('--px', `${x}px`)
      el.style.setProperty('--py', `${y}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const switchTo = useCallback((idx) => {
    if (transitioning || idx === active) return
    setTransitioning(true)
    setTimeout(() => {
      setActive(idx)
      setTransitioning(false)
    }, 420)
  }, [transitioning, active])

  const next = useCallback(() => switchTo((active + 1) % MOVIES.length), [active, switchTo])
  const prev = useCallback(() => switchTo((active - 1 + MOVIES.length) % MOVIES.length), [active, switchTo])

  // Auto-advance every 8s
  useEffect(() => {
    timerRef.current = setInterval(next, 8000)
    return () => clearInterval(timerRef.current)
  }, [next])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 8000)
  }

  const handleSwitch = (idx) => { switchTo(idx); resetTimer() }

  return (
    <div
      ref={containerRef}
      className="hero-section relative flex flex-col items-start justify-end pb-16 sm:pb-20 md:pb-24 px-5 sm:px-8 md:px-16 lg:px-36 h-screen min-h-145 overflow-hidden"
      style={{ '--px': '0px', '--py': '0px' }}
    >
      {/* ── Background layers ── */}
      {MOVIES.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url("${m.bg}")`,
            transform: i === active ? 'translate(var(--px), var(--py)) scale(1.08)' : 'scale(1.12)',
            transition: 'opacity 0.7s ease, transform 0.12s ease-out',
            opacity: i === active ? 1 : 0,
          }}
        />
      ))}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/25 to-transparent" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Accent glow at bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[40vw] h-[40vh] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 0% 100%, ${movie.accentGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Vertical rule — desktop only */}
      <div className="hidden md:block absolute left-16 lg:left-36 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/8 to-transparent pointer-events-none" />

      {/* ── CONTENT ── */}
      <div
        className={`relative z-10 flex flex-col items-start gap-4 sm:gap-5 max-w-xl lg:max-w-2xl hero-content transition-opacity duration-300 ${transitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
        style={{ transition: 'opacity 0.32s ease, transform 0.32s ease' }}
      >
        {/* Studio logo */}
        {movie.logo && (
          <img
            src={movie.logo}
            alt={movie.logoAlt}
            className="h-6 sm:h-8 lg:h-9 w-auto object-contain hero-logo"
          />
        )}

        {/* Rating + vol */}
        <div className="flex items-center gap-2 flex-wrap hero-badge">
          <div className={`flex items-center gap-1.5 ${movie.badgeBg} border ${movie.badgeColor} text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm`}>
            <Star className="w-3 h-3 fill-current" />
            <span>{movie.rating} · {movie.ratingSource}</span>
          </div>
          {movie.vol && (
            <span className="text-xs text-white/35 tracking-widest uppercase font-medium">{movie.vol}</span>
          )}
        </div>

        {/* Title */}
        <h1
          className="font-black tracking-tight leading-[0.92] hero-title"
          style={{
            fontSize: 'clamp(2.6rem, 7.5vw, 5.8rem)',
            fontFamily: "'Georgia', serif",
            textShadow: '0 4px 40px rgba(0,0,0,0.9)',
          }}
        >
          {movie.title.map((line, i) => (
            <React.Fragment key={i}>
              {movie.titleStroke[i] ? (
                <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.35)', color: 'transparent' }}>
                  {line}
                </span>
              ) : (
                <span className="text-white">{line}</span>
              )}
              {i < movie.title.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* Meta */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/45 hero-meta"
          style={{ fontFamily: "'Courier New', monospace", letterSpacing: '0.05em' }}
        >
          <span className="text-white/60 uppercase tracking-widest">{movie.genre}</span>
          <span className="w-px h-3 bg-white/20 hidden sm:inline-block" />
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{movie.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{movie.runtime}</span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-12 h-px hero-divider"
          style={{ background: `linear-gradient(to right, ${movie.accent}, transparent)` }}
        />

        {/* Description — hidden on very small screens */}
        <p
          className="hidden sm:block text-sm leading-relaxed text-white/50 max-w-md hero-desc"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {movie.desc}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3 sm:gap-4 pt-1 hero-cta flex-wrap">
          <button
            onClick={() => navigate('/movies')}
            className="group relative flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-widest uppercase overflow-hidden rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${movie.accent}, ${movie.accent}cc)`,
              boxShadow: `0 0 28px ${movie.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
              fontFamily: "'Courier New', monospace",
            }}
          >
            <span className="relative z-10">Explore Movies</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            className="group flex items-center gap-2.5 py-3 text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: "'Courier New', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 group-hover:border-white/50 transition-colors duration-300">
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
            </span>
            <span className="hidden sm:inline">Watch Trailer</span>
          </button>
        </div>
      </div>

      {/* ── MOVIE SELECTOR — right side desktop, bottom mobile ── */}

      {/* Desktop: stacked poster switcher on the right */}
      <div className="hidden lg:flex flex-col gap-3 absolute right-16 xl:right-24 bottom-24 z-20">
        {MOVIES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => handleSwitch(i)}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
              ${i === active
                ? 'w-20 h-28 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105'
                : 'w-16 h-22 border-white/10 opacity-50 hover:opacity-80 hover:scale-105'
              }`}
            style={i === active ? { boxShadow: `0 0 20px ${m.accentGlow}` } : {}}
            aria-label={`Switch to ${m.title.join(' ')}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url("${m.bg}")` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            {i === active && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(to right, transparent, ${m.accent}, transparent)` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Bottom controls: dots + arrows */}
      <div className="absolute bottom-6 sm:bottom-8 right-5 sm:right-8 md:right-16 lg:right-16 z-20 flex items-center gap-3">
        {/* Prev / Next arrows */}
        <button
          onClick={() => { prev(); resetTimer() }}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {MOVIES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSwitch(i)}
              className="transition-all duration-300 cursor-pointer rounded-full"
              style={{
                width: i === active ? '24px' : '6px',
                height: '6px',
                background: i === active ? movie.accent : 'rgba(255,255,255,0.25)',
                boxShadow: i === active ? `0 0 8px ${movie.accentGlow}` : 'none',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => { next(); resetTimer() }}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 z-20">
        <div
          key={active}
          className="h-full"
          style={{
            background: movie.accent,
            animation: 'progress 8s linear forwards',
            boxShadow: `0 0 8px ${movie.accentGlow}`,
          }}
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-black to-transparent pointer-events-none" />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .hero-logo    { animation: fadeUp .55s ease both .1s; }
        .hero-badge   { animation: fadeUp .55s ease both .2s; }
        .hero-title   { animation: fadeUp .65s ease both .3s; }
        .hero-meta    { animation: fadeUp .55s ease both .42s; }
        .hero-divider { animation: fadeUp .55s ease both .52s; }
        .hero-desc    { animation: fadeUp .55s ease both .62s; }
        .hero-cta     { animation: fadeUp .55s ease both .72s; }
      `}</style>
    </div>
  )
}

export default HeroSection