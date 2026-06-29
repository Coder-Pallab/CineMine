import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loading from '../components/Loading';

const FilmIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a06be0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>
    </svg>
);

const Theatres = () => {
    const [halls, setHalls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { axios } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const { data } = await axios.get('/api/show/cinema-halls');
                if (data.success) setHalls(data.cinemaHalls);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHalls();
    }, [axios]);

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#070709] text-white font-['DM_Sans']">

            {/* ── Hero ── */}
            <div className="relative pt-28 pb-10 px-6 md:px-16 lg:px-36 border-b border-white/5 overflow-hidden">
                <div className="absolute -top-20 -left-16 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <p className="text-[10px] tracking-[0.22em] uppercase text-white/25 mb-2 relative z-10">Explore Venues</p>
                <h1 className="font-['Bebas_Neue'] text-5xl md:text-7xl tracking-widest leading-none mb-2 relative z-10">
                    All{' '}
                    <span className="text-primary">Theatres</span>
                    {halls.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-full px-3 py-1 text-[11px] text-primary font-['DM_Sans'] font-semibold align-middle relative -top-1 ml-3">
                            <b className="text-[13px]">{halls.length}</b> venues
                        </span>
                    )}
                </h1>
                <p className="text-sm text-white/25 relative z-10">Find cinemas near you and browse now-showing films</p>
            </div>

            {/* ── Grid ── */}
            <div className="px-6 md:px-16 lg:px-36 py-10">
                {halls.length === 0 ? (
                    <div className="bg-[#0e0d12] border border-dashed border-white/7 rounded-2xl p-16 text-center">
                        <svg className="mx-auto mb-3 text-white/10" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>
                        </svg>
                        <p className="text-white/20 text-sm">No theatres found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                        {halls.map((hall) => (
                            <div
                                key={hall.id}
                                onClick={() => { window.scrollTo(0, 0); navigate(`/theatres/${hall.id}`); }}
                                className="group bg-[#0e0d12] border border-white/7 rounded-2xl overflow-hidden
                                           cursor-pointer hover:border-primary/40 hover:-translate-y-0.5
                                           transition-all duration-200 flex flex-col relative"
                            >
                                {/* Top accent line on hover */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-primary/50
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                <div className="p-5 flex flex-col flex-1">
                                    {/* Icon */}
                                    <div className="w-9 h-9 rounded-[10px] bg-primary/10 border border-primary/20
                                                    flex items-center justify-center mb-4 flex-shrink-0">
                                        <FilmIcon />
                                    </div>

                                    {/* Name */}
                                    <h2 className="font-['Bebas_Neue'] text-xl tracking-wider leading-tight mb-2">
                                        {hall.name}
                                    </h2>

                                    {/* City */}
                                    <div className="flex items-center gap-1.5 text-[12px] text-primary font-medium mb-1">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        {hall.location?.city || 'City'}
                                    </div>

                                    {/* Address */}
                                    <p className="text-[11px] text-white/25 leading-relaxed">
                                        {hall.location?.address || 'Address not available'}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between">
                                    <span className="text-[10px] text-white/20">
                                        {hall.contactNo || (hall.ownerName && `Owner: ${hall.ownerName}`) || '—'}
                                    </span>
                                    <svg className="text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0
                                                    transition-all duration-200"
                                         width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Theatres;