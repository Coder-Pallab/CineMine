import express from 'express';
import { verifyCinemaHallOwner } from '../middleware/auth.js';
import {
    addCinemaHall,
    getMyCinemaHalls,
    addMovie,
    getMyMovies,
    addShow,
    getMyShows,
    deleteMovie,
    deleteShow,
    getMyBookings,
    getDashboardStats,
    uploadImage,
    updateMovie
} from '../controllers/cinemaHallOwnerController.js';
import upload from '../configs/multer.js';

const ownerRouter = express.Router();

// All routes require cinemaHallOwner role
ownerRouter.use(verifyCinemaHallOwner);

ownerRouter.post('/cinema-hall', addCinemaHall);
ownerRouter.get('/cinema-halls', getMyCinemaHalls);

ownerRouter.post('/movie', addMovie);
ownerRouter.put('/movie/:id', updateMovie);
ownerRouter.get('/movies', getMyMovies);
ownerRouter.post('/upload', upload.single('image'), uploadImage);

ownerRouter.post('/show', addShow);
ownerRouter.get('/shows', getMyShows);
ownerRouter.delete('/show/:id', deleteShow);
ownerRouter.delete('/movie/:id', deleteMovie);
ownerRouter.get('/bookings', getMyBookings);

ownerRouter.get('/dashboard', getDashboardStats);

export default ownerRouter;
