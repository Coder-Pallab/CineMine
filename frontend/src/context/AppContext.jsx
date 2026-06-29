import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const location = useLocation();
    const navigate = useNavigate();

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success) {
                setShows(data.shows)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchFavoriteMovies = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}`}
            })

            if(data.success) {
                setFavoriteMovies(data.movies)
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Set auth header globally or we just pass it
    // Wait, since user object might need hydration from backend if we refresh
    // For now we store user inside localStorage when logging in
    useEffect(() => {
        if (token) {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    useEffect(() => {
        fetchShows();
    }, [])

    useEffect(()=> {
        if(user && token) {
            fetchFavoriteMovies()
        }  
    },[user, token])
    

    const value = {
        axios,
        user, setUser, token, setToken, navigate, shows, fetchShows,
        favoriteMovies,
        fetchFavoriteMovies,
        image_base_url,
        logout
    }
    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);