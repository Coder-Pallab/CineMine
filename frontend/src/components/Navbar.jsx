import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { favoriteMovies, user, logout } = useAppContext()

  const NAV_LINKS = [
    { label: 'Home',     to: '/' },
    { label: 'Movies',   to: '/movies' },
    { label: 'Theatres', to: '/theatres' },
    { label: 'Releases', to: '/' },
    ...(favoriteMovies?.length > 0
      ? [{ label: 'Favorites', to: '/favorites' }]
      : []),
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const closeMenu = () => { window.scrollTo(0, 0); setIsOpen(false) }

  const handleNavAndClose = (path) => {
    closeMenu()
    navigate(path)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 transition-all duration-500
          ${scrolled
            ? 'py-3 bg-black/90 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.7)]'
            : 'py-5 bg-linear-to-b from-black/70 to-transparent'
          }`}
      >
        {/* Logo */}
        <Link
          to='/'
          onClick={() => window.scrollTo(0, 0)}
          className='shrink-0 transition-opacity duration-200 hover:opacity-80'
        >
          <img src={assets.logo} alt="Logo" className='w-32 sm:w-40 h-auto' />
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className='hidden md:flex items-center gap-1'>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className='group relative px-4 py-1.5 text-[13px] font-medium tracking-widest uppercase
                text-white/60 hover:text-white transition-colors duration-200'
            >
              {label}
              <span className='absolute bottom-0 left-4 h-px bg-primary w-0 group-hover:w-[calc(100%-32px)] transition-all duration-300 ease-out' />
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Search — desktop only */}
          <button
            aria-label="Search"
            className='hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-white/10 text-white/55 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200'
          >
            <SearchIcon className='w-4 h-4' />
          </button>

          {/* Desktop auth — hidden on mobile */}
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className='hidden md:block relative overflow-hidden px-5 py-2 sm:px-7 sm:py-2 text-[13px] font-semibold tracking-widest uppercase text-white
                bg-primary hover:bg-primary-dull rounded-sm
                shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_28px_rgba(229,9,20,0.6)]
                transition-all duration-200 cursor-pointer
                after:absolute after:inset-0 after:bg-linear-to-br after:from-white/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-200'
            >
              Sign In
            </button>
          ) : (
            <div className='hidden md:flex items-center gap-4'>
              <button
                onClick={() => navigate('/my-bookings')}
                className='text-[13px] font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 cursor-pointer'
              >
                My Bookings
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className='text-[13px] font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 cursor-pointer'
                >
                  Admin Panel
                </button>
              )}
              {user.role === 'cinemaHallOwner' && (
                <button
                  onClick={() => navigate('/owner')}
                  className='text-[13px] font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 cursor-pointer'
                >
                  Owner Panel
                </button>
              )}
              <button
                onClick={logout}
                className='text-[13px] font-semibold tracking-widest uppercase text-red-500 hover:text-red-400 transition-colors duration-200 cursor-pointer'
              >
                Logout
              </button>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className='md:hidden flex items-center justify-center w-9 h-9 text-white/70 hover:text-white transition-colors duration-200'
          >
            <MenuIcon className='w-6 h-6' />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer — slides in from right */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer panel */}
      <div
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw]
          bg-[#07070f] border-l border-white/8
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Red top accent */}
        <span className='absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary to-transparent' />

        {/* Drawer header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-white/8'>
          <img src={assets.logo} alt="Logo" className='w-28 h-auto opacity-80' />
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className='w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200'
          >
            <XIcon className='w-4 h-4' />
          </button>
        </div>

        {/* Nav links */}
        <div className='flex flex-col px-4 py-4 gap-1 border-b border-white/8'>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={closeMenu}
              className='px-4 py-3 text-[13px] font-semibold tracking-widest uppercase text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200'
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile auth section */}
        <div className='flex flex-col px-4 py-4 gap-2 mt-auto border-t border-white/8'>
          {!user ? (
            <button
              onClick={() => handleNavAndClose('/login')}
              className='w-full py-3 text-[13px] font-semibold tracking-widest uppercase text-white
                bg-primary hover:bg-primary-dull rounded-sm
                shadow-[0_0_20px_rgba(229,9,20,0.35)]
                transition-all duration-200 cursor-pointer'
            >
              Sign In
            </button>
          ) : (
            <>
              <button
                onClick={() => handleNavAndClose('/my-bookings')}
                className='w-full px-4 py-3 text-left text-[13px] font-semibold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200'
              >
                My Bookings
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => handleNavAndClose('/admin')}
                  className='w-full px-4 py-3 text-left text-[13px] font-semibold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200'
                >
                  Admin Panel
                </button>
              )}
              {user.role === 'cinemaHallOwner' && (
                <button
                  onClick={() => handleNavAndClose('/owner')}
                  className='w-full px-4 py-3 text-left text-[13px] font-semibold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200'
                >
                  Owner Panel
                </button>
              )}
              <button
                onClick={() => { logout(); closeMenu() }}
                className='w-full px-4 py-3 text-left text-[13px] font-semibold tracking-widest uppercase text-red-500 hover:text-red-400 hover:bg-red-500/8 rounded-md transition-all duration-200'
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar