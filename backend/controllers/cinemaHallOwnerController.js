import CinemaHall from '../models/CinemaHall.js';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

// Cinema Hall Operations
export const addCinemaHall = async (req, res) => {
    try {
        const { name, location, ownerName, contactNo, emailAddress } = req.body;
        const ownerId = req.user.id;

        const cinemaHall = await CinemaHall.create({
            name,
            location,
            ownerName,
            contactNo,
            emailAddress,
            ownerId
        });

        res.status(201).json({ success: true, message: 'Cinema Hall Added Successfully', cinemaHall });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyCinemaHalls = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const cinemaHalls = await CinemaHall.findAll({ where: { ownerId } });
        res.json({ success: true, cinemaHalls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Movie Operations
export const addMovie = async (req, res) => {
    try {
        const { title, description, duration, genre, poster_image, language, rating, director, studio, releaseDate } = req.body;
        const ownerId = req.user.id;

        const movie = await Movie.create({
            title,
            description,
            duration,
            genre,
            poster_image,
            language,
            rating,
            director,
            studio,
            releaseDate,
            ownerId
        });

        res.status(201).json({ success: true, message: 'Movie Added Successfully', movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, duration, genre, poster_image, language, rating, director, studio, releaseDate } = req.body;
        const ownerId = req.user.id;

        const movie = await Movie.findOne({ where: { id, ownerId } });
        if (!movie) return res.status(404).json({ success: false, message: 'Movie not found or unauthorized' });

        await movie.update({
            title,
            description,
            duration,
            genre,
            poster_image,
            language,
            rating,
            director,
            studio,
            releaseDate
        });

        res.json({ success: true, message: 'Movie Updated Successfully', movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyMovies = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const movies = await Movie.findAll({ where: { ownerId } });
        res.json({ success: true, movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Show Operations
export const addShow = async (req, res) => {
    try {
        const { movieId, cinemaHallId, showDateTime, showPrice } = req.body;
        const ownerId = req.user.id;

        // Verify that the movie and cinema hall belong to the owner
        const movie = await Movie.findOne({ where: { id: movieId, ownerId } });
        if (!movie) return res.status(403).json({ success: false, message: 'Unauthorized or movie not found' });

        const cinemaHall = await CinemaHall.findOne({ where: { id: cinemaHallId, ownerId } });
        if (!cinemaHall) return res.status(403).json({ success: false, message: 'Unauthorized or cinema hall not found' });

        const show = await Show.create({
            movieId,
            cinemaHallId,
            showDateTime,
            showPrice,
            occupiedSeats: {}
        });

        res.status(201).json({ success: true, message: 'Show Added Successfully', show });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyShows = async (req, res) => {
    try {
        const ownerId = req.user.id;
        
        // Find shows where the cinema hall belongs to the owner
        const cinemaHalls = await CinemaHall.findAll({ where: { ownerId } });
        const cinemaHallIds = cinemaHalls.map(hall => hall.id);

        const shows = await Show.findAll({
            where: { cinemaHallId: { [Op.in]: cinemaHallIds } },
            include: [
                { model: Movie, as: 'movie' },
                { model: CinemaHall, as: 'cinemaHall' }
            ],
            order: [['showDateTime', 'DESC']]
        });

        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const ownerId = req.user.id;
        
        const cinemaHalls = await CinemaHall.findAll({ where: { ownerId } });
        const cinemaHallIds = cinemaHalls.map(hall => hall.id);

        const totalHalls = cinemaHalls.length;
        const totalMovies = await Movie.count({ where: { ownerId } });
        
        const activeShows = await Show.findAll({
            where: { 
                cinemaHallId: { [Op.in]: cinemaHallIds },
                showDateTime: { [Op.gte]: new Date() }
            },
            include: [{ model: Movie, as: 'movie' }]
        });

        const showsCount = activeShows.length;

        const bookings = await Booking.findAll({
            where: { cinemaHallId: { [Op.in]: cinemaHallIds }, isPaid: true }
        });

        const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

        res.json({
            success: true,
            stats: {
                totalHalls,
                totalMovies,
                showsCount,
                totalBookings: bookings.length,
                totalRevenue,
                activeShows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        res.json({ success: true, imageUrl: req.file.path });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const movie = await Movie.findOne({ where: { id, ownerId } });
        if (!movie) return res.status(404).json({ success: false, message: 'Movie not found or unauthorized' });

        await movie.destroy();
        res.json({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const show = await Show.findByPk(id, {
            include: [{ model: CinemaHall, as: 'cinemaHall' }]
        });

        if (!show || show.cinemaHall.ownerId !== ownerId) {
            return res.status(404).json({ success: false, message: 'Show not found or unauthorized' });
        }

        await show.destroy();
        res.json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const ownerId = req.user.id;
        
        const cinemaHalls = await CinemaHall.findAll({ where: { ownerId } });
        const cinemaHallIds = cinemaHalls.map(hall => hall.id);

        const bookings = await Booking.findAll({
            where: { cinemaHallId: { [Op.in]: cinemaHallIds } },
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                { 
                    model: Show, as: 'show',
                    include: [{ model: Movie, as: 'movie', attributes: ['title'] }]
                },
                { model: CinemaHall, as: 'cinemaHall', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
