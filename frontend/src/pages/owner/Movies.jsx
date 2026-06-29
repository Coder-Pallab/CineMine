import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Field = ({ label, className = '', ...props }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-[10px] tracking-widest uppercase text-white/28">{label}</label>
        <input
            {...props}
            className="bg-[#13121a] border border-white/8 rounded-lg text-white text-[13px]
                       px-3 py-2.5 outline-none placeholder:text-white/18
                       focus:border-primary/55 transition-colors font-['DM_Sans'] w-full"
        />
    </div>
);

const Movies = () => {
    const { axios, token } = useAppContext();
    const [movies, setMovies] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', duration: '', genre: '', poster_image: '',
        language: '', rating: '', director: '', studio: '', releaseDate: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get('/api/owner/movies', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) setMovies(data.movies);
        } catch { toast.error('Failed to fetch movies'); }
    };

    useEffect(() => { fetchMovies(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let finalPosterUrl = formData.poster_image;
            if (imageFile) {
                const imgData = new FormData();
                imgData.append('image', imageFile);
                const uploadRes = await axios.post('/api/owner/upload', imgData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                if (uploadRes.data.success) finalPosterUrl = uploadRes.data.imageUrl;
                else { toast.error('Image upload failed'); return; }
            }
            const payload = {
                ...formData,
                poster_image: finalPosterUrl || 'https://via.placeholder.com/500x750?text=No+Poster',
                duration: parseInt(formData.duration),
                rating: formData.rating ? parseFloat(formData.rating) : null
            };
            
            if (isEditing) {
                const { data } = await axios.put(`/api/owner/movie/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                if (data.success) {
                    toast.success('Movie Updated');
                    setIsEditing(false);
                    setEditId(null);
                } else {
                    toast.error(data.message);
                    return;
                }
            } else {
                const { data } = await axios.post('/api/owner/movie', payload, { headers: { Authorization: `Bearer ${token}` } });
                if (data.success) {
                    toast.success('Movie Added');
                } else {
                    toast.error(data.message);
                    return;
                }
            }

            fetchMovies();
            setFormData({ title: '', description: '', duration: '', genre: '', poster_image: '', language: '', rating: '', director: '', studio: '', releaseDate: '' });
            setImageFile(null);
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? 'Failed to update movie' : 'Failed to add movie');
        }
        finally { setIsUploading(false); }
    };

    const handleEdit = (movie) => {
        setIsEditing(true);
        setEditId(movie.id);
        setFormData({
            title: movie.title || '',
            description: movie.description || '',
            duration: movie.duration || '',
            genre: movie.genre || '',
            poster_image: movie.poster_image || '',
            language: movie.language || '',
            rating: movie.rating || '',
            director: movie.director || '',
            studio: movie.studio || '',
            releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: '', description: '', duration: '', genre: '', poster_image: '', language: '', rating: '', director: '', studio: '', releaseDate: '' });
        setImageFile(null);
    };

    const deleteMovie = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie? This will also delete all associated shows.')) return;
        try {
            const { data } = await axios.delete(`/api/owner/movie/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success('Movie Deleted');
                fetchMovies();
            } else toast.error(data.message);
        } catch { toast.error('Failed to delete movie'); }
    };



    return (
        <div className="p-8 bg-[#070709] min-h-screen text-white font-['DM_Sans']">
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/22 mb-2">Admin Panel</p>
            <h1 className="font-['Bebas_Neue'] text-4xl tracking-[3px] mb-8">
                My <span className="text-primary">Movies</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                {/* ── Form ── */}
                <div className="bg-[#0e0d12] border border-white/7 rounded-2xl p-6 lg:sticky lg:top-6">
                    <form onSubmit={handleSubmit}>

                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/22 pb-2 border-b border-white/5 mb-4">
                            Film Details
                        </p>

                        <div className="flex flex-col gap-2.5 mb-2.5">
                            <Field label="Title" name="title" placeholder="e.g. Dune: Part Two" value={formData.title} onChange={handleChange} required />
                            <div className="grid grid-cols-2 gap-2.5">
                                <Field label="Genre" name="genre" placeholder="Sci-Fi" value={formData.genre} onChange={handleChange} required />
                                <Field label="Language" name="language" placeholder="English" value={formData.language} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-3 gap-2.5">
                                <Field label="Duration (min)" name="duration" type="number" placeholder="166" value={formData.duration} onChange={handleChange} required />
                                <Field label="Rating" name="rating" type="number" step="0.1" placeholder="8.5" value={formData.rating} onChange={handleChange} />
                                <Field label="Release Date" name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <Field label="Director" name="director" placeholder="Denis Villeneuve" value={formData.director} onChange={handleChange} />
                                <Field label="Studio" name="studio" placeholder="Legendary" value={formData.studio} onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] tracking-widest uppercase text-white/28">Description</label>
                                <textarea
                                    name="description" rows={3} placeholder="A brief synopsis..."
                                    value={formData.description} onChange={handleChange} required
                                    className="bg-[#13121a] border border-white/8 rounded-lg text-white text-[13px]
                                               px-3 py-2.5 outline-none placeholder:text-white/18 resize-none
                                               focus:border-primary/55 transition-colors font-['DM_Sans']"
                                />
                            </div>
                        </div>

                        {/* Poster */}
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/22 pb-2 border-b border-white/5 mb-4 mt-4">
                            Poster
                        </p>
                        <div className="bg-[#13121a] border border-white/8 rounded-xl p-4">
                            <Field
                                label="Image URL"
                                name="poster_image"
                                placeholder="https://..."
                                value={formData.poster_image}
                                onChange={handleChange}
                                disabled={!!imageFile}
                            />
                            <div className="flex items-center gap-3 my-3 text-[10px] text-white/20 tracking-widest uppercase">
                                <div className="flex-1 h-px bg-white/6" /><span>or</span><div className="flex-1 h-px bg-white/6" />
                            </div>
                            <label className={`flex flex-col items-center justify-center border border-dashed rounded-lg py-4 cursor-pointer transition-colors
                                             ${formData.poster_image ? 'border-white/5 opacity-40 pointer-events-none' : 'border-primary/25 hover:border-primary/55'}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(108,59,170,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <span className="text-[11px] text-white/22 mt-2">
                                    {imageFile ? imageFile.name : 'Click to upload poster'}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit" disabled={isUploading}
                                className={`mt-5 flex-1 bg-gradient-to-br ${isEditing ? 'from-amber-500 to-amber-600' : 'from-primary to-primary/70'} text-white
                                           font-semibold text-[13px] tracking-wide py-2.5 rounded-xl
                                           hover:opacity-85 hover:-translate-y-0.5 active:translate-y-0
                                           transition-all duration-150 disabled:opacity-40`}
                            >
                                {isUploading ? 'Uploading...' : (isEditing ? 'Update Movie' : 'Add Movie')}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="mt-5 px-5 bg-white/5 border border-white/10 text-white/60
                                               font-semibold text-[13px] tracking-wide py-2.5 rounded-xl
                                               hover:bg-white/10 hover:text-white transition-all duration-150"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* ── Movie Grid ── */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/22 whitespace-nowrap">Registered Movies</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/6 to-transparent" />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                        {movies.map(movie => (
                            <div key={movie.id}
                                className="group bg-[#0e0d12] border border-white/7 rounded-xl overflow-hidden
                                           hover:border-primary/35 hover:-translate-y-0.5 transition-all duration-200">
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    <img src={movie.poster_image} alt={movie.title}
                                        className="w-full h-full object-cover block bg-[#13121a]" />
                                    
                                    {/* Edit overlay */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleEdit(movie); }}
                                        className="absolute top-2 right-10 w-7 h-7 rounded-lg bg-amber-500/80 text-white
                                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                                   flex items-center justify-center hover:bg-amber-600 shadow-lg"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>

                                    {/* Delete overlay */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteMovie(movie.id); }}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 text-white
                                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                                   flex items-center justify-center hover:bg-red-600 shadow-lg"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="relative p-2.5 pb-3">
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-primary/50
                                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    <p className="font-['Bebas_Neue'] text-[14px] tracking-wider truncate mb-1">{movie.title}</p>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] text-white/28">{movie.duration}m</span>
                                        <span className="w-1 h-1 rounded-full bg-white/15" />
                                        <span className="text-[10px] text-white/28">{movie.language || 'EN'}</span>
                                        {movie.rating && (
                                            <span className="text-[10px] text-primary/80 bg-primary/10 rounded px-1.5 py-0.5 ml-auto">
                                                ★ {movie.rating}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty slot */}
                        <div className="aspect-[2/3] border border-dashed border-primary/15 rounded-xl
                                        flex flex-col items-center justify-center cursor-pointer
                                        hover:border-primary/35 transition-colors group/add">
                            <svg className="text-primary/35 group-hover/add:text-primary/60 transition-colors"
                                 width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                            </svg>
                            <p className="text-[10px] text-white/18 mt-2 text-center px-3">Add your next film</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movies;