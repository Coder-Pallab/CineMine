import express from 'express';
import { getMovies, getShow, getShows, getPublicCinemaHalls, getPublicCinemaHallDetails } from '../controllers/showController.js';

const showRouter = express.Router();

showRouter.get('/movies', getMovies); // New route to get all movies
showRouter.get('/all', getShows);
showRouter.get('/cinema-halls', getPublicCinemaHalls);
showRouter.get('/cinema-halls/:hallId', getPublicCinemaHallDetails);
showRouter.get('/:movieId', getShow);

export default showRouter;