import express from 'express';
import { verifyAdmin } from '../middleware/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin, getAllCinemaHallOwners, getAllCinemaHalls, deleteShow, deleteMovie, getAllMovies } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/is-admin', verifyAdmin, isAdmin);
adminRouter.get('/dashboard', verifyAdmin, getDashboardData);
adminRouter.get('/all-shows', verifyAdmin, getAllShows);
adminRouter.get('/all-bookings', verifyAdmin, getAllBookings);
adminRouter.get('/all-movies', verifyAdmin, getAllMovies);
adminRouter.get('/cinema-halls', verifyAdmin, getAllCinemaHalls);
adminRouter.get('/owners', verifyAdmin, getAllCinemaHallOwners);
adminRouter.delete('/delete-show/:id', verifyAdmin, deleteShow);
adminRouter.delete('/delete-movie/:id', verifyAdmin, deleteMovie);

export default adminRouter;