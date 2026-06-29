import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/AppContext';
import { FilmIcon, Trash2, ClockIcon, StarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ListMovies = () => {
  const { axios, token, user } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllMovies = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-movies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching movies');
    }
    setLoading(false);
  };

  const deleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie? This will also delete all associated shows.')) return;
    try {
      const { data } = await axios.delete(`/api/admin/delete-movie/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        getAllMovies();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting movie');
    }
  };

  useEffect(() => {
    if (user) getAllMovies();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-['DM_Sans']">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FilmIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">Admin Panel</span>
        </div>
        <Title text1="Movie" text2="Management" />
      </div>

      <div className="relative">
        <BlurCircle top="-60px" left="-40px" />

        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-sm font-semibold tracking-widest uppercase text-white/70">All Registered Movies</h2>
          <span className="text-xs text-white/30 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
            {movies.length}
          </span>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/25 border border-white/6 rounded-2xl bg-white/2">
            <FilmIcon className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm tracking-widest uppercase">No movies found in database</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                style={{ animationDelay: `${index * 40}ms` }}
                className="group relative bg-[#0e0d12] border border-white/7 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 animate-fade-in"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-[#13121a]">
                  <img
                    src={movie.poster_image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d12] via-transparent to-transparent opacity-60" />
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteMovie(movie.id)}
                    className="absolute top-2 right-2 p-2 rounded-xl bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-xl backdrop-blur-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-1.5 py-0.5 rounded-lg">
                      <StarIcon className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-white/90">{movie.rating}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white/90 truncate mb-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                    <span className="flex items-center gap-1">
                       <ClockIcon className="w-2.5 h-2.5" /> {movie.duration}m
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="truncate">{movie.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease both; }
      `}</style>
    </div>
  );
};

export default ListMovies;
