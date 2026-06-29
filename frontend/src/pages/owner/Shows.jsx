import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CalendarIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);
const ClockIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);
const ScreenIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>
    </svg>
);
const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
    </svg>
);

const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1 mb-2.5">
        <label className="text-[10px] tracking-widest uppercase text-white/28">{label}</label>
        {children}
    </div>
);

const inputCls = `bg-[#13121a] border border-white/8 rounded-lg text-white text-[13px]
                  px-3 py-2.5 outline-none placeholder:text-white/18
                  focus:border-primary/55 transition-colors font-['DM_Sans'] w-full`;

const Shows = () => {
    const { axios, token } = useAppContext();
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const [formData, setFormData] = useState({
        movieId: '', cinemaHallId: '', showDateTime: '', showPrice: ''
    });

    const fetchData = async () => {
        try {
            const [showsRes, moviesRes, hallsRes] = await Promise.all([
                axios.get('/api/owner/shows', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/owner/movies', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/owner/cinema-halls', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (showsRes.data.success) setShows(showsRes.data.shows);
            if (moviesRes.data.success) setMovies(moviesRes.data.movies);
            if (hallsRes.data.success) setHalls(hallsRes.data.cinemaHalls);
            if (moviesRes.data.movies?.[0] && hallsRes.data.cinemaHalls?.[0]) {
                setFormData(prev => ({
                    ...prev,
                    movieId: moviesRes.data.movies[0].id,
                    cinemaHallId: hallsRes.data.cinemaHalls[0].id
                }));
            }
        } catch { toast.error('Failed to fetch data'); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/owner/show',
                { ...formData, showPrice: parseFloat(formData.showPrice) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success('Show Added');
                fetchData();
                setFormData(prev => ({ ...prev, showDateTime: '', showPrice: '' }));
            } else toast.error(data.message);
        } catch { toast.error('Failed to add show'); }
    };

    const deleteShow = async (id) => {
        if (!window.confirm('Are you sure you want to delete this show?')) return;
        try {
            const { data } = await axios.delete(`/api/owner/show/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success('Show Deleted');
                fetchData();
            } else toast.error(data.message);
        } catch { toast.error('Failed to delete show'); }
    };

    const selectCls = `${inputCls} appearance-none cursor-pointer`;

    return (
        <div className="p-8 bg-[#070709] min-h-screen text-white font-['DM_Sans']">
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/22 mb-2">Admin Panel</p>
            <h1 className="font-['Bebas_Neue'] text-4xl tracking-[3px] mb-8">
                My <span className="text-primary">Shows</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">

                {/* ── Form ── */}
                <div className="bg-[#0e0d12] border border-white/7 rounded-2xl p-6 lg:sticky lg:top-6">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/22 pb-2 border-b border-white/5 mb-4">
                        Schedule a Show
                    </p>
                    <form onSubmit={handleSubmit}>
                        <Field label="Movie">
                            <select name="movieId" value={formData.movieId} onChange={handleChange} required className={selectCls}>
                                <option value="" disabled>Select Movie</option>
                                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                            </select>
                        </Field>
                        <Field label="Cinema Hall">
                            <select name="cinemaHallId" value={formData.cinemaHallId} onChange={handleChange} required className={selectCls}>
                                <option value="" disabled>Select Hall</option>
                                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </Field>
                        <Field label="Date & Time">
                            <input name="showDateTime" type="datetime-local" value={formData.showDateTime} onChange={handleChange} required className={inputCls} />
                        </Field>
                        <Field label="Ticket Price (₹)">
                            <input name="showPrice" type="number" step="0.01" placeholder="e.g. 250" value={formData.showPrice} onChange={handleChange} required className={inputCls} />
                        </Field>
                        <button
                            type="submit"
                            className="mt-3 w-full bg-gradient-to-br from-primary to-primary/70 text-white
                                       font-semibold text-[13px] tracking-wide py-2.5 rounded-xl
                                       hover:opacity-85 hover:-translate-y-0.5 active:translate-y-0
                                       transition-all duration-150"
                        >
                            Add Show
                        </button>
                    </form>
                </div>

                {/* ── Shows List ── */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/22 whitespace-nowrap">Scheduled Shows</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/6 to-transparent" />
                    </div>

                    {shows.length === 0 ? (
                        <div className="bg-[#0e0d12] border border-dashed border-white/7 rounded-2xl p-12 text-center text-xs text-white/18">
                            No shows scheduled yet.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            {shows.map(show => {
                                const d = new Date(show.showDateTime);
                                const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

                                return (
                                    <div key={show.id}
                                        className="group flex bg-[#0e0d12] border border-white/7 rounded-2xl overflow-hidden
                                                   hover:border-primary/30 transition-all duration-200">

                                        {/* Accent bar */}
                                        <div className="w-[3px] flex-shrink-0 bg-primary/20
                                                        group-hover:bg-gradient-to-b group-hover:from-primary group-hover:to-primary/50
                                                        transition-all duration-200" />

                                        <div className="flex-1 flex items-center gap-4 px-4 py-3.5 min-w-0">
                                            {/* Mini poster */}
                                            {show.movie?.poster_image && (
                                                <img src={show.movie.poster_image} alt=""
                                                    className="w-9 h-[52px] rounded-md object-cover flex-shrink-0 bg-[#13121a]" />
                                            )}

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-['Bebas_Neue'] text-[17px] tracking-wider truncate mb-1">
                                                    {show.movie?.title}
                                                </p>
                                                <p className="flex items-center gap-1.5 text-[11px] text-white/35 mb-2">
                                                    <ScreenIcon />
                                                    {show.cinemaHall?.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-md px-2 py-1 text-[11px] text-primary/80">
                                                        <CalendarIcon />{dateStr}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 bg-white/4 border border-white/8 rounded-md px-2 py-1 text-[11px] text-white/40">
                                                        <ClockIcon />{timeStr}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 text-right flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <p className="font-['Bebas_Neue'] text-[22px] tracking-wide">₹{show.showPrice}</p>
                                                    <p className="text-[9px] tracking-widest uppercase text-white/20">per seat</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteShow(show.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500
                                                               flex items-center justify-center hover:bg-red-500 hover:text-white
                                                               transition-all duration-150"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shows;