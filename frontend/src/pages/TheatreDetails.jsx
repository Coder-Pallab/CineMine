import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import timeFormat from '../lib/timeFormat';

const TheatreDetails = () => {
    const { id } = useParams();
    const { axios } = useAppContext();
    const navigate = useNavigate();

    const [hall, setHall] = useState(null);
    const [shows, setShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(`/api/show/cinema-halls/${id}`);
                if (data.success) {
                    setHall(data.cinemaHall);
                    setShows(data.shows);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id, axios]);

    if (isLoading) return <Loading />;

    if (!hall) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070709] text-white">
                <h2 className="text-2xl text-white/40 font-['DM_Sans']">Cinema hall not found</h2>
            </div>
        );
    }

    const moviesMap = new Map();
    shows.forEach(show => {
        if (show.movie) {
            if (!moviesMap.has(show.movie.id)) {
                moviesMap.set(show.movie.id, { movie: show.movie, shows: [] });
            }
            moviesMap.get(show.movie.id).shows.push(show);
        }
    });
    const playingMovies = Array.from(moviesMap.values());

    return (
        <div className="min-h-screen bg-[#070709] text-white font-['DM_Sans']">

            {/* ── Hero Header ── */}
            <div className="relative pt-28 pb-10 px-6 md:px-16 lg:px-36 border-b border-white/5 overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Live badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-primary/80 font-medium">Cinema Hall</span>
                </div>

                <h1 className="font-['Bebas_Neue'] text-5xl md:text-7xl tracking-widest mb-6 leading-none
                               bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent relative z-10">
                    {hall.name}
                </h1>

                <div className="flex flex-wrap gap-x-7 gap-y-3 relative z-10">
                    {hall.location && (
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8855cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>{hall.location.address}, {hall.location.city}</span>
                        </div>
                    )}
                    {hall.contactNo && (
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8855cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span>{hall.contactNo}</span>
                        </div>
                    )}
                    {hall.emailAddress && (
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8855cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            <span>{hall.emailAddress}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Now Showing ── */}
            <div className="px-6 md:px-16 lg:px-36 py-12">

                {/* Section heading */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-white/25">Currently Showing</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent" />
                </div>

                {playingMovies.length === 0 ? (
                    <div className="bg-[#0e0d12] border border-dashed border-white/8 rounded-2xl p-16 text-center">
                        <svg className="mx-auto mb-4 text-white/10" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>
                        </svg>
                        <p className="text-white/25 text-sm">No movies currently scheduled at this hall.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {playingMovies.map(({ movie, shows: movieShows }) => (
                            <div
                                key={movie.id}
                                className="group flex bg-[#0e0d12] border border-white/7 rounded-2xl overflow-hidden
                                           hover:border-primary/30 transition-all duration-200"
                            >
                                {/* Purple left accent bar */}
                                <div className="w-[3px] flex-shrink-0 bg-gradient-to-b from-primary via-primary/60 to-primary" />

                                {/* Poster */}
                                <div className="relative w-28 md:w-36 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={movie.poster_image}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* fade into card bg */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e0d12]" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col p-5 md:p-6 min-w-0">
                                    <h3 className="font-['Bebas_Neue'] text-2xl md:text-3xl tracking-wider leading-none mb-3">
                                        {movie.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {movie.duration && (
                                            <span className="text-[10px] tracking-widest uppercase text-white/35 bg-white/5 rounded px-2 py-1">
                                                {timeFormat(movie.duration)}
                                            </span>
                                        )}
                                        {movie.genre && (
                                            <span className="text-[10px] tracking-widest uppercase text-white/35 bg-white/5 rounded px-2 py-1">
                                                {movie.genre}
                                            </span>
                                        )}
                                        {movie.language && (
                                            <span className="text-[10px] tracking-widest uppercase text-white/35 bg-white/5 rounded px-2 py-1">
                                                {movie.language}
                                            </span>
                                        )}
                                    </div>

                                    {/* Showtimes */}
                                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/20 mb-2.5">
                                        Available Showtimes
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {movieShows.map(show => {
                                            const d = new Date(show.showDateTime);
                                            return (
                                                <button
                                                    key={show.id}
                                                    onClick={() => navigate(`/movies/${movie.id}`)}
                                                    className="flex flex-col items-center px-3.5 py-2 rounded-lg
                                                               bg-primary/8 border border-primary/20
                                                               hover:bg-primary/20 hover:border-primary/50
                                                               hover:-translate-y-0.5 transition-all duration-150"
                                                >
                                                    <span className="text-[13px] font-medium text-primary leading-none">
                                                        {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-[10px] text-white/25 mt-1 leading-none">
                                                        {d.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/movies/${movie.id}`)}
                                        className="mt-auto w-fit flex items-center gap-2 text-xs text-white/25
                                                   hover:text-white/60 transition-colors group/link"
                                    >
                                        View Movie Details
                                        <svg className="group-hover/link:translate-x-0.5 transition-transform" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TheatreDetails;