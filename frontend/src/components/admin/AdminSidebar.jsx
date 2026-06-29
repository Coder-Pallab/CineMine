import React from 'react'
import { assets } from '../../assets/assets'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, FilmIcon, MapPinIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const adminNavLinks = [
  { name: 'Dashboard',      path: '/admin',               icon: LayoutDashboardIcon },
  { name: 'All Movies',     path: '/admin/list-movies',   icon: FilmIcon },
  { name: 'All Shows',      path: '/admin/list-shows',    icon: ListIcon },
  { name: 'All Bookings',   path: '/admin/list-bookings', icon: ListCollapseIcon },
];

const ownerNavLinks = [
  { name: 'Dashboard',     path: '/owner',               icon: LayoutDashboardIcon },
  { name: 'Cinema Halls',  path: '/owner/cinema-halls',  icon: MapPinIcon },
  { name: 'Movies',        path: '/owner/movies',        icon: FilmIcon },
  { name: 'Shows',         path: '/owner/shows',         icon: ListIcon },
  { name: 'Bookings',      path: '/owner/bookings',      icon: ListCollapseIcon },
];

const AdminSidebar = () => {
  const { user } = useAppContext();
  
  const navLinks = user?.role === 'cinemaHallOwner' ? ownerNavLinks : adminNavLinks;

  const profile = {
    firstName: user?.name || 'CineMine',
    lastName: user?.role === 'cinemaHallOwner' ? 'Owner' : 'Admin',
    imageUrl: user?.image || assets.profile,
  };

  return (
    <>
      {/* ── DESKTOP sidebar (md+) ── */}
      <aside className='hidden md:flex flex-col h-[calc(100vh-64px)] w-56 lg:w-60 shrink-0 border-r border-white/6 bg-[#06060e]'>

        {/* Profile */}
        <div className='flex flex-col items-center pt-8 pb-6 px-4 border-b border-white/6'>
          <div className='relative'>
            <img
              src={profile.imageUrl}
              alt="Profile"
              className='w-14 h-14 rounded-full object-cover border-2 border-primary/40 shadow-[0_0_16px_rgba(229,9,20,0.25)]'
            />
            {/* Online dot */}
            <span className='absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#06060e] rounded-full' />
          </div>
          <p className='mt-3 text-sm font-semibold text-white/85 tracking-wide'>
            {profile.firstName}
          </p>
          <p className='text-[11px] text-white/30 tracking-widest uppercase'>{profile.lastName}</p>
        </div>

        {/* Nav links */}
        <nav className='flex flex-col gap-1 px-3 pt-4 flex-1'>
          <p className='text-[10px] font-semibold tracking-[0.18em] uppercase text-white/20 px-3 mb-1'>
            Menu
          </p>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(229,9,20,0.2)]'
                  : 'text-white/40 hover:text-white/75 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                  <span>{link.name}</span>
                  {/* Active pill */}
                  {isActive && (
                    <span className='absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(229,9,20,0.8)]' />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className='px-4 py-4 border-t border-white/6'>
          <p className='text-[10px] text-white/15 tracking-widest text-center uppercase'>
            {profile.lastName} Panel
          </p>
        </div>
      </aside>

      {/* ── MOBILE bottom nav (< md) ── */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around
        bg-[#07070f]/95 backdrop-blur-xl border-t border-white/8
        px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]'>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0
              ${isActive ? 'text-primary' : 'text-white/35 hover:text-white/60'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-primary/15 shadow-[inset_0_0_0_1px_rgba(229,9,20,0.25)]' : ''}`}>
                  <link.icon className='w-4.5 h-4.5' />
                  {isActive && (
                    <span className='absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(229,9,20,0.9)]' />
                  )}
                </div>
                <span className='text-[10px] font-medium tracking-wide leading-none truncate max-w-16 text-center'>
                  {link.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default AdminSidebar;