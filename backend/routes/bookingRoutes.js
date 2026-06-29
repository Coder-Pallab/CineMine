import express from 'express';
import { createBooking, getOccupiedSeats, downloadTicket } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', verifyToken, createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.get('/ticket/:bookingId', verifyToken, downloadTicket);

export default bookingRouter;