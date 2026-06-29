import { Star, Clock, Ticket } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const { image_base_url } = useAppContext();

  const goToMovie = () => {
    navigate(`/movies/${movie.id || movie._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="relative w-full max-w-55 flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: hovered
          ? '1px solid rgba(230,57,70,0.35)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.6)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={goToMovie}
    >
      {/* Poster */}
      <div className="relative overflow-hidden aspect-2/3">
        <img
          src={movie.poster_image || movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            filter: hovered ? 'brightness(0.55)' : 'brightness(0.75)',
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

        {/* Genre */}
        {movie.genre && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-red-500/90 backdrop-blur">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white font-semibold">
              {movie.genre}
            </span>
          </div>
        )}

        {/* Hover Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-xs font-mono uppercase tracking-widest shadow-lg">
            <Ticket className="w-3 h-3" />
            Buy Tickets
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 w-full px-3 pb-3 pt-6">
          <h3 className="text-sm font-bold text-white truncate">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-[10px] text-white/50 font-mono tracking-wider">
            <Clock className="w-3 h-3" />
            <span>{movie.duration ? timeFormat(movie.duration) : ''}</span>
          </div>

          {movie.cinemaHalls && movie.cinemaHalls.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-[9px] text-white/40 font-mono tracking-wider truncate">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span className="truncate">
                {movie.cinemaHalls.map(h => h.location?.city || h.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Accent */}
      <div
        className="h-0.5 transition-all duration-300"
        style={{
          background: hovered
            ? 'linear-gradient(to right, #e63946, #c1121f)'
            : 'rgba(255,255,255,0.05)',
        }}
      />
    </div>
  );
};

export default MovieCard;