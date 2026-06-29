import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import { Op } from 'sequelize';

// API controller function to get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user.id;

        const bookings = await Booking.findAll({
            where: { userId: user },
            include: [{
                model: Show,
                as: 'show',
                include: [{
                    model: Movie,
                    as: 'movie'
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message})
    }
}

// API controller function to update favorite movie
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if(!user.favorites.includes(movieId)) {
            user.favorites = [...user.favorites, movieId];
        } else {
            user.favorites = user.favorites.filter(item => item !== movieId);
        }

        await user.save();

        res.json({success: true, message: "Favorite Movies Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message})
    }
}

// API to get All favorite movies
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id)
        
        if (!user) {
            return res.json({ success: false, message: "User not found. Please login again." });
        }

        const favorites = user.favorites || [];

        const movies = await Movie.findAll({
            where: { id: { [Op.in]: favorites } }
        });

        res.json({success: true, movies});
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message})
    }
}