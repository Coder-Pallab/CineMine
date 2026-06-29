import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { Play, Volume2 } from 'lucide-react'

const SectionLabel = ({ number, children }) => (
  <div className="flex items-center gap-3">
    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)' }}>
      {number}
    </span>
    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(230,57,70,0.9)', fontWeight: 600 }}>
      {children}
    </span>
  </div>
)

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const getEmbedUrl = (url) => {
    let videoId = '';
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('youtube.com')) {
        videoId = parsedUrl.searchParams.get('v');
      } else if (parsedUrl.hostname.includes('youtu.be')) {
        videoId = parsedUrl.pathname.slice(1);
      }
    } catch (e) {
      // Fallback if URL parsing fails
      if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&rel=0&modestbranding=1`;
  }

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-24 overflow-hidden">

      {/* Ambient glows */}
      <BlurCircle top="-100px" right="-100px" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,57,70,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      {/* Section header */}
      <div className="flex flex-col gap-3 mb-12">
        <SectionLabel number="02">Trailers</SectionLabel>
        <h2 className="leading-none" style={{ fontFamily: "'Georgia', serif", fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
          Watch the{' '}
          <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>Action</span>
        </h2>
      </div>

      {/* Horizontal rule */}
      <div className="mb-10" style={{ height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.03) 60%, transparent)' }} />

      {/* Main player */}
      <div className="relative mx-auto max-w-4xl">
        {/* Red corner accents */}
        <div className="absolute -top-px -left-px w-8 h-8 pointer-events-none z-10"
          style={{ borderTop: '2px solid rgba(230,57,70,0.7)', borderLeft: '2px solid rgba(230,57,70,0.7)', borderRadius: '2px 0 0 0' }} />
        <div className="absolute -top-px -right-px w-8 h-8 pointer-events-none z-10"
          style={{ borderTop: '2px solid rgba(230,57,70,0.7)', borderRight: '2px solid rgba(230,57,70,0.7)', borderRadius: '0 2px 0 0' }} />
        <div className="absolute -bottom-px -left-px w-8 h-8 pointer-events-none z-10"
          style={{ borderBottom: '2px solid rgba(230,57,70,0.7)', borderLeft: '2px solid rgba(230,57,70,0.7)', borderRadius: '0 0 0 2px' }} />
        <div className="absolute -bottom-px -right-px w-8 h-8 pointer-events-none z-10"
          style={{ borderBottom: '2px solid rgba(230,57,70,0.7)', borderRight: '2px solid rgba(230,57,70,0.7)', borderRadius: '0 0 2px 0' }} />

        {/* Glow behind player */}
        <div className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: '0 0 80px rgba(230,57,70,0.12), 0 32px 64px rgba(0,0,0,0.6)' }} />

        <iframe
          key={currentTrailer.videoUrl}
          className="w-full rounded-xl block"
          style={{ aspectRatio: '16/9', border: '1px solid rgba(255,255,255,0.07)' }}
          src={getEmbedUrl(currentTrailer.videoUrl)}
          title={currentTrailer.title || 'Trailer'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Now playing label */}
      <div className="flex items-center justify-center gap-3 mt-5 mb-10">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          Now Playing · {currentTrailer.title || 'Official Trailer'}
        </span>
        <Volume2 style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.25)' }} />
      </div>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer, i) => {
          const isActive = trailer.videoUrl === currentTrailer.videoUrl
          const isHovered = hoveredIndex === i
          return (
            <div
              key={trailer.image}
              className="relative cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setCurrentTrailer(trailer)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                aspectRatio: '16/9',
                border: isActive
                  ? '1px solid rgba(230,57,70,0.8)'
                  : '1px solid rgba(255,255,255,0.06)',
                transform: isHovered && !isActive ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'transform 0.25s ease, border-color 0.25s ease, opacity 0.25s ease',
                opacity: !isActive && hoveredIndex !== null && !isHovered ? 0.45 : 1,
                boxShadow: isActive ? '0 0 20px rgba(230,57,70,0.25)' : 'none',
              }}
            >
              <img
                src={trailer.image}
                alt={trailer.title || 'trailer'}
                className="w-full h-full object-cover"
                style={{ filter: isActive ? 'brightness(0.6)' : 'brightness(0.5)', transition: 'filter 0.25s ease' }}
              />

              {/* Overlay */}
              <div className="absolute inset-0" style={{ background: isActive ? 'rgba(230,57,70,0.15)' : 'transparent', transition: 'background 0.25s ease' }} />

              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center rounded-full"
                  style={{
                    width: 32, height: 32,
                    background: isActive ? 'rgba(230,57,70,0.9)' : 'rgba(0,0,0,0.55)',
                    border: `1px solid ${isActive ? 'rgba(230,57,70,1)' : 'rgba(255,255,255,0.2)'}`,
                    backdropFilter: 'blur(4px)',
                    transition: 'background 0.25s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}>
                  <Play style={{ width: 11, height: 11, fill: '#fff', color: '#fff', marginLeft: 1 }} />
                </div>
              </div>

              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(to right, #e63946, #c1121f)' }} />
              )}

              {/* Index badge */}
              <div className="absolute top-1.5 left-1.5"
                style={{ fontFamily: "'Courier New', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', padding: '2px 5px', borderRadius: 3 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default TrailerSection