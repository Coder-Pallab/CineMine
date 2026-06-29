import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Title from '../../components/admin/Title';

const Field = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] tracking-widest uppercase text-white/30">{label}</label>
        <input
            {...props}
            className="bg-[#13121a] border border-white/8 rounded-lg text-white text-[13px]
                       px-3 py-2.5 outline-none placeholder:text-white/18
                       focus:border-primary/50 transition-colors font-['DM_Sans']"
        />
    </div>
);

const CinemaHalls = () => {
    const { axios, token } = useAppContext();
    const [halls, setHalls] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [emailAddress, setEmailAddress] = useState('');

    const fetchHalls = async () => {
        try {
            const { data } = await axios.get('/api/owner/cinema-halls', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) setHalls(data.cinemaHalls);
        } catch { toast.error('Failed to fetch halls'); }
    };

    useEffect(() => { fetchHalls(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/owner/cinema-hall',
                { name, ownerName, contactNo, emailAddress, location: { city, address } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success('Cinema Hall Added');
                fetchHalls();
                setName(''); setCity(''); setAddress('');
                setOwnerName(''); setContactNo(''); setEmailAddress('');
            } else {
                toast.error(data.message);
            }
        } catch { toast.error('Failed to add hall'); }
    };



    return (
        <div className="p-8 bg-[#070709] min-h-screen text-white font-['DM_Sans']">
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/22 mb-2">Admin Panel</p>
            <h1 className="font-['Bebas_Neue'] text-4xl tracking-[3px] mb-8">
                Cinema <span className="text-primary">Halls</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5 items-start">

                {/* ── Add Form ── */}
                <div className="bg-[#0e0d12] border border-white/7 rounded-2xl p-6 lg:sticky lg:top-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-0">

                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/22 pb-2 border-b border-white/5 mb-4">
                            Venue Info
                        </p>
                        <div className="flex flex-col gap-3 mb-5">
                            <Field label="Hall Name" placeholder="e.g. Grand Galaxy Cinemas" value={name} onChange={e => setName(e.target.value)} required />
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="City" placeholder="Bengaluru" value={city} onChange={e => setCity(e.target.value)} required />
                                <Field label="Address" placeholder="42 MG Road" value={address} onChange={e => setAddress(e.target.value)} required />
                            </div>
                        </div>

                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/22 pb-2 border-b border-white/5 mb-4">
                            Contact Info
                        </p>
                        <div className="flex flex-col gap-3">
                            <Field label="Owner Name" placeholder="Full name" value={ownerName} onChange={e => setOwnerName(e.target.value)} required />
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Phone" placeholder="+91 98765..." value={contactNo} onChange={e => setContactNo(e.target.value)} required />
                                <Field label="Email" type="email" placeholder="owner@hall.com" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-5 w-full bg-gradient-to-br from-primary to-primary/70 text-white
                                       font-semibold text-[13px] tracking-wide py-2.5 rounded-xl
                                       hover:opacity-85 hover:-translate-y-0.5 active:translate-y-0
                                       transition-all duration-150"
                        >
                            Add Hall
                        </button>
                    </form>
                </div>

                {/* ── Hall List ── */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/22">Registered Halls</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/6 to-transparent" />
                    </div>

                    {halls.length === 0 ? (
                        <div className="bg-[#0e0d12] border border-dashed border-white/7 rounded-2xl p-10 text-center text-xs text-white/20">
                            No halls registered yet.
                        </div>
                    ) : halls.map(hall => (
                        <div
                            key={hall.id}
                            className="group flex bg-[#0e0d12] border border-white/7 rounded-2xl overflow-hidden
                                       hover:border-primary/30 transition-all duration-200"
                        >
                            {/* Accent bar */}
                            <div className="w-[3px] flex-shrink-0 bg-primary/20 group-hover:bg-gradient-to-b
                                            group-hover:from-primary group-hover:to-primary/50 transition-all duration-200" />

                            <div className="p-4 flex-1 min-w-0">
                                <h3 className="font-['Bebas_Neue'] text-[18px] tracking-widest leading-tight mb-1 truncate">
                                    {hall.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-primary mb-2.5">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    {hall.location?.city}
                                    <span className="text-white/25">• {hall.location?.address}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { label: 'Owner', val: hall.ownerName },
                                        { label: 'Ph', val: hall.contactNo },
                                        { label: 'Email', val: hall.emailAddress },
                                    ].map(({ label, val }) => val && (
                                        <span key={label} className="text-[10px] text-white/28 bg-white/5 rounded-md px-2 py-1">
                                            <span className="text-white/50 font-medium">{label} </span>{val}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CinemaHalls;