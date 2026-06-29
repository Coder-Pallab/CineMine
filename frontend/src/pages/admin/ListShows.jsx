import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { CalendarIcon, ClapperboardIcon, LayoutListIcon, TicketIcon, TrendingUpIcon, MapPinIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, token, user, image_base_url } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-shows', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const deleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;
    try {
      const { data } = await axios.delete(`/api/admin/delete-show/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        getAllShows();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting show');
    }
  };

  useEffect(() => {
    if (user) getAllShows();
  }, [user]);

  if (loading) return <Loading />;

  const totalBookings = shows.reduce((acc, s) => acc + Object.keys(s.occupiedSeats).length, 0);
  const totalEarnings = shows.reduce((acc, s) => acc + Object.keys(s.occupiedSeats).length * s.showPrice, 0);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <ClapperboardIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">Admin</span>
        </div>
        <Title text1="List" text2="Shows" />
      </div>

      <div className="relative">
        <BlurCircle top="-60px" left="-40px" />

        {/* Summary pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
            <ClapperboardIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-medium">Shows</span>
            <span className="text-sm font-bold text-white ml-1">{shows.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
            <TicketIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-medium">Bookings</span>
            <span className="text-sm font-bold text-white ml-1">{totalBookings}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
            <TrendingUpIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-medium">Revenue</span>
            <span className="text-sm font-bold text-emerald-400 ml-1">{currency}{totalEarnings}</span>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-sm font-semibold tracking-widest uppercase text-white/70">All Shows</h2>
          <span className="text-xs text-white/30 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
            {shows.length}
          </span>
        </div>

        {shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/25 border border-white/6 rounded-2xl bg-white/2">
            <ClapperboardIcon className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm tracking-widest uppercase">No shows found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full text-sm text-nowrap">
                <thead>
                  <tr className="bg-white/4 border-b border-white/8 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">#</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Movie</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Venue</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Show Time</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Bookings</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Earnings</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-white/40">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((show, index) => {
                    const bookedCount = Object.keys(show.occupiedSeats).length;
                    const earnings = bookedCount * show.showPrice;
                    return (
                      <tr
                        key={index}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className="border-b border-white/5 bg-white/2 hover:bg-primary/8 transition-colors duration-200 animate-fade-in"
                      >
                        <td className="px-5 py-3.5 text-white/25 text-xs font-medium">{index + 1}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {(show.movie?.poster_image || (image_base_url && show.movie?.poster_path)) && (
                              <img
                                src={show.movie.poster_image || image_base_url + show.movie.poster_path}
                                alt={show.movie.title}
                                className="w-8 h-11 object-cover rounded-md shrink-0 border border-white/8"
                              />
                            )}
                            <div>
                              <p className="text-white/85 font-medium max-w-48 truncate">{show.movie.title}</p>
                              <p className="text-[11px] text-white/35 mt-0.5">{currency}{show.showPrice} / seat</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-[11px] text-white/40 uppercase tracking-wider">
                            <MapPinIcon className="w-2.5 h-2.5" />
                            <span className="truncate max-w-32">{show.cinemaHall?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white/50">{dateFormat(show.showDateTime)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <TicketIcon className="w-3.5 h-3.5 text-amber-400/60" />
                            <span className="text-white/70 font-medium">{bookedCount}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-emerald-400 font-semibold">{currency}{earnings}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => deleteShow(show.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3">
              {shows.map((show, index) => {
                const bookedCount = Object.keys(show.occupiedSeats).length;
                const earnings = bookedCount * show.showPrice;
                return (
                  <div
                    key={index}
                    style={{ animationDelay: `${index * 40}ms` }}
                    className="rounded-xl border border-white/8 bg-white/3 p-4 animate-fade-in"
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-3 mb-3">
                      {(show.movie?.poster_image || (image_base_url && show.movie?.poster_path)) && (
                        <img
                          src={show.movie.poster_image || image_base_url + show.movie.poster_path}
                          alt={show.movie.title}
                          className="w-9 h-12 object-cover rounded-lg shrink-0 border border-white/8"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white/90 truncate">{show.movie.title}</p>
                        <p className="text-[10px] text-primary flex items-center gap-1 mt-0.5 uppercase tracking-wide">
                          <MapPinIcon className="w-2.5 h-2.5" /> {show.cinemaHall?.name || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-sm font-bold text-emerald-400 shrink-0">{currency}{earnings}</span>
                        <button
                          onClick={() => deleteShow(show.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card details */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/6">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3 h-3 text-white/25 shrink-0" />
                        <p className="text-[11px] text-white/45">{dateFormat(show.showDateTime)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TicketIcon className="w-3 h-3 text-amber-400/60 shrink-0" />
                        <p className="text-[11px] text-white/45">
                          <span className="text-white/70 font-semibold">{bookedCount}</span> booked
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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

export default ListShows;