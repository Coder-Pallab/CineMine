import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
  TrendingUpIcon,
  MapPinIcon,
  FilmIcon,
  Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, token, user, image_base_url } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings || '0',
      icon: ChartLineIcon,
      accent: 'from-red-500/20 to-red-900/5',
      border: 'border-red-500/25',
      iconColor: 'text-red-400',
      glow: 'shadow-red-900/30',
    },
    {
      title: 'Total Revenue',
      value: `${currency}${dashboardData.totalRevenue || '0'}`,
      icon: CircleDollarSignIcon,
      accent: 'from-amber-500/20 to-amber-900/5',
      border: 'border-amber-500/25',
      iconColor: 'text-amber-400',
      glow: 'shadow-amber-900/30',
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeShows.length || '0',
      icon: PlayCircleIcon,
      accent: 'from-emerald-500/20 to-emerald-900/5',
      border: 'border-emerald-500/25',
      iconColor: 'text-emerald-400',
      glow: 'shadow-emerald-900/30',
    },
    ...(user.role === 'admin' ? [
      {
        title: 'Total Users',
        value: dashboardData.totalUser || '0',
        icon: UserIcon,
        accent: 'from-sky-500/20 to-sky-900/5',
        border: 'border-sky-500/25',
        iconColor: 'text-sky-400',
        glow: 'shadow-sky-900/30',
      },
      {
        title: 'Cinema Halls',
        value: dashboardData.totalHalls || '0',
        icon: MapPinIcon,
        accent: 'from-indigo-500/20 to-indigo-900/5',
        border: 'border-indigo-500/25',
        iconColor: 'text-indigo-400',
        glow: 'shadow-indigo-900/30',
      }
    ] : [
      {
        title: 'Cinema Halls',
        value: dashboardData.totalHalls || '0',
        icon: MapPinIcon,
        accent: 'from-sky-500/20 to-sky-900/5',
        border: 'border-sky-500/25',
        iconColor: 'text-sky-400',
        glow: 'shadow-sky-900/30',
      },
      {
        title: 'Total Movies',
        value: dashboardData.totalMovies || '0',
        icon: FilmIcon,
        accent: 'from-indigo-500/20 to-indigo-900/5',
        border: 'border-indigo-500/25',
        iconColor: 'text-indigo-400',
        glow: 'shadow-indigo-900/30',
      }
    ]),
  ];

  const fetchDashboardData = async () => {
    try {
      const endpoint = user.role === 'cinemaHallOwner' ? '/api/owner/dashboard' : '/api/admin/dashboard';
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDashboardData(data.stats || data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching dashboard data', error);
    }
  };

  const deleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;
    try {
      const endpoint = user.role === 'admin' ? `/api/admin/delete-show/${id}` : `/api/owner/show/${id}`;
      const { data } = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message || 'Show deleted');
        fetchDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting show');
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className='min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>

      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-1'>
          <TrendingUpIcon className='w-4 h-4 text-primary' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-white/30'>Overview</span>
        </div>
        <Title text1={user.role === 'admin' ? "Admin" : "Owner"} text2="Dashboard" />
      </div>

      {/* Stats Cards */}
      <div className='relative mb-10'>
        <BlurCircle top='-80px' left='-40px' />
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4'>
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`
                relative overflow-hidden rounded-xl
                bg-linear-to-br ${card.accent}
                border ${card.border}
                shadow-lg ${card.glow}
                p-4 sm:p-5
                hover:-translate-y-0.5 hover:shadow-xl
                transition-all duration-300
                animate-fade-in
              `}
            >
              {/* Background grid texture */}
              <div className='absolute inset-0 opacity-[0.03]'
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 20px,white 20px,white 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,white 20px,white 21px)'
                }}
              />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-black/30 border border-white/8 mb-3 ${card.iconColor}`}>
                <card.icon className='w-4 h-4' />
              </div>

              {/* Value */}
              <p className='text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-1'>
                {card.value}
              </p>

              {/* Label */}
              <p className='text-[11px] sm:text-xs font-medium tracking-widest uppercase text-white/40'>
                {card.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shows Section */}
      <div className='relative'>
        <BlurCircle top='60px' left='-5%' />

        {/* Section header */}
        <div className='flex items-center justify-between mb-5'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-5 bg-primary rounded-full' />
            <h2 className='text-base sm:text-lg font-semibold text-white tracking-wide'>Active Shows</h2>
            <span className='text-xs font-medium text-white/30 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full'>
              {dashboardData.activeShows.length}
            </span>
          </div>
        </div>

        {dashboardData.activeShows.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-white/25 border border-white/6 rounded-2xl bg-white/2'>
            <PlayCircleIcon className='w-12 h-12 mb-3 opacity-40' />
            <p className='text-sm tracking-widest uppercase'>No active shows</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4'>
            {dashboardData.activeShows.map((show, i) => (
              <div
                key={show.id || show._id}
                style={{ animationDelay: `${i * 60}ms` }}
                className='group relative rounded-xl overflow-hidden bg-[#0d0d14] border border-white/8
                  hover:border-primary/40 hover:-translate-y-1
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(229,9,20,0.15)]
                  transition-all duration-300 cursor-pointer animate-fade-in'
              >
                {/* Poster */}
                <div className='relative aspect-2/3 overflow-hidden'>
                  <img
                    src={show.movie.poster_image || show.movie.poster_path}
                    alt={show.movie.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  {/* Gradient overlay */}
                  <div className='absolute inset-0 bg-linear-to-t from-[#0d0d14] via-transparent to-transparent' />
                </div>

                {/* Info */}
                <div className='p-2.5 sm:p-3'>
                  <p className='text-[11px] sm:text-xs font-semibold text-white/90 truncate leading-tight mb-1.5'>
                    {show.movie.title}
                  </p>

                  <div className='flex items-center justify-between'>
                    <span className='text-xs sm:text-sm font-bold text-primary'>
                      {currency}{show.showPrice}
                    </span>
                  </div>

                  <p className='text-[10px] text-white/35 mt-1.5 leading-tight'>
                    {dateFormat(show.showDateTime)}
                  </p>
                </div>

                {/* Admin Delete Button */}
                {user.role === 'admin' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteShow(show.id); }}
                    className='absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                  </button>
                )}

                {/* Bottom accent line on hover */}
                <div className='absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cinema Halls Section (Admin only) */}
      {user.role === 'admin' && dashboardData.cinemaHalls && (
        <div className='relative mt-12'>
          <BlurCircle top='20px' right='-5%' />
          <div className='flex items-center justify-between mb-5'>
            <div className='flex items-center gap-3'>
              <div className='w-1 h-5 bg-indigo-500 rounded-full' />
              <h2 className='text-base sm:text-lg font-semibold text-white tracking-wide'>Registered Venues</h2>
              <span className='text-xs font-medium text-white/30 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full'>
                {dashboardData.cinemaHalls.length}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {dashboardData.cinemaHalls.map((hall, i) => (
              <div
                key={hall.id}
                onClick={() => navigate(`/theatres/${hall.id}`)}
                style={{ animationDelay: `${i * 50}ms` }}
                className='group relative bg-[#0e0d15] border border-white/8 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer animate-fade-in'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400'>
                      <MapPinIcon className='w-5 h-5' />
                    </div>
                    <div>
                      <h3 className='text-sm font-semibold text-white/90 group-hover:text-indigo-400 transition-colors'>{hall.name}</h3>
                      <p className='text-[10px] text-white/30 uppercase tracking-widest mt-0.5'>
                        {typeof hall.location === 'object' ? `${hall.location.city}, ${hall.location.address}` : hall.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]'>
                  <div className='flex items-center gap-1.5 text-white/40'>
                    <UserIcon className='w-3 h-3' />
                    <span>Owner: {hall.owner?.name || 'Unknown'}</span>
                  </div>
                  <span className='text-indigo-400/80 font-medium'>View Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease both;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;