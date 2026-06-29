import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { LogOutIcon, ShieldCheckIcon } from 'lucide-react'

const AdminNavbar = () => {
  const { user, logout } = useAppContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className='sticky top-0 z-40 flex items-center justify-between
      px-4 sm:px-6 md:px-10 h-16 shrink-0
      bg-[#06060e]/95 backdrop-blur-xl
      border-b border-white/6
      shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.5)]'>

      {/* Left — Logo */}
      <Link
        to='/'
        className='transition-opacity duration-200 hover:opacity-75 shrink-0'
      >
        <img src={assets.logo} alt="Logo" className='w-28 sm:w-36 h-auto' />
      </Link>

      {/* Center — Admin badge */}
      <div className='hidden sm:flex items-center gap-2 px-3 py-1.5
        bg-primary/10 border border-primary/20 rounded-full'>
        <ShieldCheckIcon className='w-3.5 h-3.5 text-primary' />
        <span className='text-[11px] font-semibold tracking-[0.18em] uppercase text-primary/80'>
          {user?.role === 'cinemaHallOwner' ? 'Owner Panel' : 'Admin Panel'}
        </span>
      </div>

      {/* Right — User info + logout */}
      <div className='flex items-center gap-3'>
        {user && (
          <>
            {/* Avatar + name — hidden on very small screens */}
            <div className='hidden xs:flex items-center gap-2.5'>
              <div className='relative'>
                <img
                  src={assets.profile}
                  alt={user.name}
                  className='w-8 h-8 rounded-full object-cover border border-primary/30
                    shadow-[0_0_10px_rgba(229,9,20,0.2)]'
                />
                <span className='absolute bottom-0 right-0 w-2 h-2 bg-emerald-400
                  border border-[#06060e] rounded-full' />
              </div>
              <div className='hidden md:block'>
                <p className='text-xs font-semibold text-white/80 leading-tight'>{user.name}</p>
                <p className='text-[10px] text-white/30 tracking-widest uppercase'>{user?.role === 'cinemaHallOwner' ? 'Cinema Hall Owner' : 'Administrator'}</p>
              </div>
            </div>

            {/* Divider */}
            <div className='hidden xs:block w-px h-5 bg-white/10' />
          </>
        )}

        {/* Back to site */}
        <Link
          to='/'
          className='hidden sm:block text-[11px] font-semibold tracking-widest uppercase
            text-white/35 hover:text-white/70 transition-colors duration-200'
        >
          ← Site
        </Link>

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-[11px] font-semibold tracking-widest uppercase
              text-red-500/70 hover:text-red-400
              bg-red-500/0 hover:bg-red-500/8
              border border-transparent hover:border-red-500/15
              transition-all duration-200 cursor-pointer'
          >
            <LogOutIcon className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        )}
      </div>
    </header>
  )
}

export default AdminNavbar