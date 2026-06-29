import { ArrowRight } from 'lucide-react'
import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

// Thin numbered rule label
const SectionLabel = ({ number, children }) => (
  <div className="flex items-center gap-3">
    <span
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.65rem',
        letterSpacing: '0.18em',
        color: 'rgba(255,255,255,0.25)',
        userSelect: 'none',
      }}
    >
      {number}
    </span>
    <span
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.65rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(230,57,70,0.9)',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  </div>
);

// Animated card wrapper for staggered entrance
const AnimatedCard = ({ children, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${index * 0.1 + 0.1}s, transform 0.6s ease ${index * 0.1 + 0.1}s`,
      }}
    >
      {children}
    </div>
  );
};

const FeaturedSection = () => {

  const { shows } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden py-20">

      {/* Ambient background glow */}
      <BlurCircle top="0" right="-80px" />
      <div
        className="absolute left-1/3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230,57,70,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Section header */}
      <div className="relative flex items-end justify-between mb-14">

        {/* Left: label + heading */}
        <div className="flex flex-col gap-3">
          <SectionLabel number="01">Now Showing</SectionLabel>

          <h2
            className="leading-none"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fff',
            }}
          >
            Featured{' '}
            <span
              style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                color: 'transparent',
              }}
            >
              Films
            </span>
          </h2>
        </div>

        {/* Right: view all */}
        <button
          onClick={() => navigate('/movies')}
          className="group flex items-center gap-2 cursor-pointer mb-1"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
        >
          View All
          <ArrowRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            style={{ width: 14, height: 14 }}
          />
        </button>
      </div>

      {/* Horizontal rule */}
      <div
        className="mb-10"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.03) 60%, transparent)',
        }}
      />

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-sm:grid-cols-1 justify-items-center">
        {shows.slice(0, 4).map((show, i) => (
          <AnimatedCard key={show?.id || show?._id || i} index={i}>
            {/* Card wrapper with hover lift */}
            <div
              className="group flex relative rounded-xl overflow-hidden cursor-pointer"
              style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Index badge */}
              <div
                className="absolute top-3 left-3 z-20"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.35)',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(6px)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Hover overlay with red accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to right, #e63946, #c1121f)' }}
              />

              <MovieCard movie={show} />
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-center gap-6 mt-20">

        {/* Decorative line */}
        <div
          className="hidden sm:block flex-1 max-w-xs"
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08))',
          }}
        />

        <button
          onClick={() => { navigate('/movies'); window.scrollTo(0, 0); }}
          className="group relative overflow-hidden cursor-pointer"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: '#fff',
            padding: '14px 40px',
            borderRadius: '4px',
            border: '1px solid rgba(230,57,70,0.5)',
            background: 'transparent',
            transition: 'border-color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(230,57,70,0.9)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(230,57,70,0.5)'}
        >
          {/* Fill animation on hover */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.15), rgba(193,18,31,0.15))' }}
          />
          <span className="relative flex items-center gap-2.5">
            Browse All Movies
            <ArrowRight
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ width: 14, height: 14 }}
            />
          </span>
        </button>

        {/* Decorative line */}
        <div
          className="hidden sm:block flex-1 max-w-xs"
          style={{
            height: '1px',
            background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.08))',
          }}
        />
      </div>
    </div>
  )
}

export default FeaturedSection