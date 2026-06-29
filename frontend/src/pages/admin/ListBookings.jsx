import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { CalendarIcon, CoinsIcon, LayoutListIcon, SofaIcon, UserIcon } from 'lucide-react';

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, token, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) getAllBookings();
  }, [user]);

  if (isLoading) return <Loading />;

  const validBookings = bookings.filter((item) => item.user && item.show && item.show.movie);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <LayoutListIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">Admin</span>
        </div>
        <Title text1="List" text2="Bookings" />
      </div>

      <div className="relative">
        <BlurCircle top="-60px" left="-40px" />

        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-sm font-semibold tracking-widest uppercase text-white/70">All Bookings</h2>
          <span className="text-xs text-white/30 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
            {validBookings.length}
          </span>
        </div>

        {validBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/25 border border-white/6 rounded-2xl bg-white/2">
            <LayoutListIcon className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm tracking-widest uppercase">No bookings found</p>
          </div>
        ) : (
          <>
            {/* Desktop table — hidden on mobile */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full text-sm text-nowrap">
                <thead>
                  <tr className="bg-white/4 border-b border-white/8 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">#</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">User</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Movie</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Show Time</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Seats</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {validBookings.map((item, index) => {
                    const seats = Object.values(item.bookedSeats).join(", ");
                    return (
                      <tr
                        key={index}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className="border-b border-white/5 bg-white/2 hover:bg-primary/8 transition-colors duration-200 animate-fade-in"
                      >
                        <td className="px-5 py-3.5 text-white/25 text-xs font-medium">{index + 1}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-primary uppercase">
                                {item.user.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-white/80 font-medium">{item.user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white/70 font-medium max-w-40">
                          <p className="truncate">{item.show.movie.title}</p>
                        </td>
                        <td className="px-4 py-3.5 text-white/50">{dateFormat(item.show.showDateTime)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {Object.values(item.bookedSeats).map((seat, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold bg-primary/15 border border-primary/25 text-primary px-1.5 py-0.5 rounded"
                              >
                                {seat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-emerald-400 font-semibold">
                            {currency}{item.amount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — shown only on mobile */}
            <div className="md:hidden flex flex-col gap-3">
              {validBookings.map((item, index) => (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className="rounded-xl border border-white/8 bg-white/3 p-4 animate-fade-in"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary uppercase">
                          {item.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{item.user.name}</p>
                        <p className="text-[10px] text-white/35 font-medium truncate max-w-44">{item.show.movie.title}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{currency}{item.amount}</span>
                  </div>

                  {/* Card details */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/6">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3 text-white/25 shrink-0" />
                      <p className="text-[11px] text-white/45">{dateFormat(item.show.showDateTime)}</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <SofaIcon className="w-3 h-3 text-white/25 shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {Object.values(item.bookedSeats).map((seat, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-primary/15 border border-primary/25 text-primary px-1.5 py-0.5 rounded"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.35s ease both; }
      `}</style>
    </div>
  );
};

export default ListBookings;