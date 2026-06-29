import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const navigate = useNavigate();
  const { shows, axios, token, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) setShow(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please Login to Proceed");
      const { data } = await axios.post('/api/user/update-favorites', { movieId: id }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getShow(); }, [id]);
  useEffect(() => {
    setIsFav(!!favoriteMovies.find(m => (m.id || m._id) === id));
  }, [favoriteMovies, id]);

  if (!show) return <Loading />;

  const { movie, dateTime } = show;
  
  if (!movie) {
    return (
      <div className="md-root flex items-center justify-center">
        <h2 style={{ color: '#fff' }}>Movie not found or No upcoming shows available.</h2>
      </div>
    );
  }

  const year = movie.release_date?.split("-")[0];
  const genres = movie.genres?.map(g => g.name).join(" · ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .md-root {
          min-height: 100vh;
          background: #060608;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .md-hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .md-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          filter: brightness(0.35) saturate(0.7);
          transform: scale(1.04);
          transition: transform 8s ease;
        }

        .md-hero:hover .md-hero-bg { transform: scale(1); }

        .md-hero-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(6,6,8,0.2) 0%,
            rgba(6,6,8,0.1) 30%,
            rgba(6,6,8,0.6) 60%,
            rgba(6,6,8,1) 100%
          );
          z-index: 1;
        }

        .md-hero-side-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(6,6,8,0.85) 0%, transparent 55%);
          z-index: 1;
        }

        .md-hero-content {
          position: relative;
          z-index: 2;
          padding: 100px 24px 48px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        @media (min-width: 768px) {
          .md-hero-content {
            padding: 140px 64px 64px;
            flex-direction: row;
            align-items: flex-end;
            gap: 48px;
          }
        }

        /* Poster */
        .md-poster-wrap {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        @media (min-width: 768px) { .md-poster-wrap { margin-bottom: 0; } }

        .md-poster {
          width: 150px;
          border-radius: 6px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          object-fit: cover;
          aspect-ratio: 2/3;
        }

        @media (min-width: 480px) { .md-poster { width: 180px; } }
        @media (min-width: 768px) { .md-poster { width: 220px; } }
        @media (min-width: 1024px) { .md-poster { width: 260px; } }

        /* Info */
        .md-info { flex: 1; min-width: 0; }

        .md-lang-tag {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #e50914;
          font-weight: 500;
          margin-bottom: 12px;
          opacity: 0;
          animation: fadeUp 0.5s 0.1s forwards;
        }

        .md-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 7vw, 80px);
          line-height: 0.9;
          letter-spacing: 2px;
          margin: 0 0 16px;
          opacity: 0;
          animation: fadeUp 0.5s 0.15s forwards;
        }

        .md-meta-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
          margin-bottom: 16px;
          opacity: 0;
          animation: fadeUp 0.5s 0.2s forwards;
        }

        .md-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .md-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
        }

        .md-overview {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.5);
          font-weight: 300;
          max-width: 560px;
          margin-bottom: 28px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          opacity: 0;
          animation: fadeUp 0.5s 0.25s forwards;
        }

        .md-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          opacity: 0;
          animation: fadeUp 0.5s 0.3s forwards;
        }

        .btn-trailer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 22px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 3px;
          color: rgba(255,255,255,0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }

        .btn-trailer:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.22);
        }

        .btn-tickets {
          display: inline-flex;
          align-items: center;
          padding: 13px 28px;
          background: #e50914;
          border-radius: 3px;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 3px;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          white-space: nowrap;
          border: none;
        }

        .btn-tickets:hover { background: #c40812; }

        .btn-fav {
          width: 46px; height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }

        .btn-fav:hover { background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.4); }
        .btn-fav.active { background: rgba(229,9,20,0.15); border-color: #e50914; }

        /* ── Body sections ── */
        .md-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        @media (min-width: 768px) { .md-body { padding: 0 64px 100px; } }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 56px 0 28px;
        }

        .section-label {
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #e50914;
          font-weight: 500;
          white-space: nowrap;
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Cast */
        .cast-scroll {
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: none;
        }
        .cast-scroll::-webkit-scrollbar { display: none; }

        .cast-track {
          display: flex;
          gap: 20px;
          width: max-content;
        }

        .cast-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 72px;
          cursor: default;
        }

        @media (min-width: 768px) { .cast-item { width: 84px; } }

        .cast-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.08);
          filter: grayscale(0.3);
          transition: filter 0.2s, transform 0.2s;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .cast-avatar { width: 76px; height: 76px; }
        }

        .cast-item:hover .cast-avatar {
          filter: grayscale(0);
          transform: scale(1.06);
        }

        .cast-name {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          line-height: 1.3;
          font-weight: 300;
        }

        /* Date select anchor */
        #dateSelect { scroll-margin-top: 80px; }

        /* You may also like */
        .also-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (min-width: 600px) { .also-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px) { .also-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

        .show-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 48px;
        }

        .btn-show-more {
          padding: 13px 40px;
          background: transparent;
          border: 1px solid rgba(229,9,20,0.4);
          border-radius: 3px;
          color: #e50914;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 3px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-show-more:hover { background: rgba(229,9,20,0.08); }

        /* dot-grid bg */
        .md-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="md-root">
        {/* ── HERO ── */}
        <div className="md-hero">
          <div
            className="md-hero-bg"
            style={{ backgroundImage: `url(${movie.poster_image})` }}
          />
          <div className="md-hero-grad" />
          <div className="md-hero-side-grad" />

          <div className="md-hero-content">
            {/* Poster */}
            <div className="md-poster-wrap">
              <img
                src={movie.poster_image}
                alt={movie.title}
                className="md-poster"
              />
            </div>

            {/* Info */}
            <div className="md-info">
              <span className="md-lang-tag">English</span>

              <h1 className="md-title">{movie.title}</h1>

              <div className="md-meta-row">
                {movie.rating && (
                  <div className="md-rating">
                    <StarIcon style={{ width: 15, height: 15, fill: '#e50914', color: '#e50914' }} />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                )}
                {movie.rating && <div className="md-dot" />}
                
                <span>{movie.duration ? timeFormat(movie.duration) : ''}</span>
                <div className="md-dot" />
                <span>{movie.genre}</span>
                
                {movie.releaseDate && (
                  <>
                    <div className="md-dot" />
                    <span>{new Date(movie.releaseDate).getFullYear() || movie.releaseDate}</span>
                  </>
                )}
                
                {movie.director && (
                  <>
                    <div className="md-dot" />
                    <span>{movie.director}</span>
                  </>
                )}
                
                {movie.studio && (
                  <>
                    <div className="md-dot" />
                    <span>{movie.studio}</span>
                  </>
                )}
              </div>

              <p className="md-overview">{movie.description}</p>

              <div className="md-actions">
                <button className="btn-trailer">
                  <PlayCircleIcon style={{ width: 17, height: 17 }} />
                  Watch Trailer
                </button>
                <a href="#dateSelect" className="btn-tickets">Buy Tickets</a>
                <button
                  onClick={handleFavorite}
                  className={`btn-fav${isFav ? ' active' : ''}`}
                  aria-label="Toggle favorite"
                >
                  <Heart
                    style={{
                      width: 18, height: 18,
                      fill: isFav ? '#e50914' : 'transparent',
                      color: isFav ? '#e50914' : 'rgba(255,255,255,0.6)'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="md-body">

          {/* Cast */}
          {/* <div className="section-header">
            <span className="section-label">Cast</span>
            <div className="section-line" />
          </div>
          */}

          {/* Date selector */}
          <div className="section-header" id="dateSelect">
            <span className="section-label">Select Showtime</span>
            <div className="section-line" />
          </div>

          <DateSelect dateTime={dateTime} id={id} />

          {/* You may also like */}
          <div className="section-header">
            <span className="section-label">You May Also Like</span>
            <div className="section-line" />
          </div>

          <div className="also-grid">
            {shows.slice(0, 4).map((movie, i) => (
              <MovieCard key={i} movie={movie} />
            ))}
          </div>

          <div className="show-more-wrap">
            <button
              className="btn-show-more"
              onClick={() => { navigate('/movies'); window.scrollTo(0, 0); }}
            >
              Browse All Films
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;