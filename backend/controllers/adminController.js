import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import CinemaHall from "../models/CinemaHall.js";
import { Op } from "sequelize";

// API to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true });
}

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.findAll({ where: { isPaid: true } });
        const activeShows = await Show.findAll({
            where: { showDateTime: { [Op.gte]: new Date() } },
            include: [{ model: Movie, as: 'movie' }]
        });

        const totalUser = await User.count();
        const totalHalls = await CinemaHall.count();
        const cinemaHalls = await CinemaHall.findAll({ include: [{ model: User, as: 'owner' }] });

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser,
            totalHalls,
            cinemaHalls
        }

        res.json({ success: true, dashboardData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.findAll({
            where: { showDateTime: { [Op.gte]: new Date() } },
            include: [
                { model: Movie, as: 'movie' },
                { model: CinemaHall, as: 'cinemaHall', attributes: ['name'] }
            ],
            order: [['showDateTime', 'ASC']]
        });

        res.json({ success: true, shows })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user' },
                {
                    model: Show, as: 'show',
                    include: [{ model: Movie, as: 'movie' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({success: true, bookings})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all cinema hall owners
export const getAllCinemaHallOwners = async (req, res) => {
    try {
        const owners = await User.findAll({ where: { role: 'cinemaHallOwner' } });
        res.json({ success: true, owners });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all cinema halls
export const getAllCinemaHalls = async (req, res) => {
    try {
        const halls = await CinemaHall.findAll({ include: [{ model: User, as: 'owner' }] });
        res.json({ success: true, halls });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to delete show
export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        await Show.destroy({ where: { id } });
        res.json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to delete movie
export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        await Movie.destroy({ where: { id } });
        res.json({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all movies
export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, movies });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}