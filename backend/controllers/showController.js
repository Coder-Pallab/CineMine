import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import CinemaHall from "../models/CinemaHall.js";
import { Op } from "sequelize";

// API to get all movies from the database
export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.json({ success: true, movies });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all upcoming shows
export const getShows = async (req, res) => {
    try {
        const shows = await Show.findAll({
            where: { showDateTime: { [Op.gte]: new Date() } },
            include: [
                { model: Movie, as: 'movie' },
                { model: CinemaHall, as: 'cinemaHall' }
            ],
            order: [['showDateTime', 'ASC']]
        });

        // If you need unique movies like before
        const uniqueMoviesMap = new Map();
        shows.forEach(show => {
            if (show.movie && show.movie.id) {
                const movieId = show.movie.id.toString();
                if (!uniqueMoviesMap.has(movieId)) {
                    // Clone the movie object to attach extra data safely
                    const movieData = show.movie.toJSON();
                    movieData.cinemaHalls = [];
                    uniqueMoviesMap.set(movieId, movieData);
                }
                const movieData = uniqueMoviesMap.get(movieId);
                // Add unique cinema hall to the array
                if (show.cinemaHall && !movieData.cinemaHalls.some(h => h.id === show.cinemaHall.id)) {
                    movieData.cinemaHalls.push(show.cinemaHall);
                }
            }
        });

        res.json({ success: true, shows: Array.from(uniqueMoviesMap.values()), allShows: shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get shows for a specific movie
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;

        const shows = await Show.findAll({
            where: { movieId: movieId, showDateTime: { [Op.gte]: new Date() } },
            include: [{ model: CinemaHall, as: 'cinemaHall' }]
        });

        const movie = await Movie.findByPk(movieId);
        
        if (!movie) {
            return res.json({ success: false, message: "Movie not found" });
        }

        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ 
                time: show.showDateTime, 
                showId: show.id, 
                showPrice: show.showPrice,
                cinemaHall: show.cinemaHall,
                occupiedSeats: show.occupiedSeats
            });
        });

        res.json({ success: true, movie, dateTime });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all public cinema halls
export const getPublicCinemaHalls = async (req, res) => {
    try {
        const halls = await CinemaHall.findAll();
        res.json({ success: true, cinemaHalls: halls });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get shows and movies of a specific cinema hall
export const getPublicCinemaHallDetails = async (req, res) => {
    try {
        const { hallId } = req.params;
        
        const cinemaHall = await CinemaHall.findByPk(hallId);
        if (!cinemaHall) {
            return res.status(404).json({ success: false, message: "Cinema Hall not found" });
        }

        const shows = await Show.findAll({
            where: { cinemaHallId: hallId, showDateTime: { [Op.gte]: new Date() } },
            include: [{ model: Movie, as: 'movie' }],
            order: [['showDateTime', 'ASC']]
        });

        res.json({ success: true, cinemaHall, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}