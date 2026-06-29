// Package imports
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import dns from 'dns';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import ownerRouter from './routes/cinemaHallOwnerRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhook.js';

// Setting the DNS server
dns.setServers(['1.1.1.1', '8.8.8.8'])

// Creating App using express
const app = express();
const port = 3000;

// Connecting MySQL
await connectDB();
import { sequelize } from './configs/db.js';

// Syncing database (avoiding alter: true due to redundant index bloat)
await sequelize.sync();
// Defining Middlewares
app.use(cors());

// Capture raw body for Stripe signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl === '/api/stripe') {
      req.rawBody = buf;
    }
  }
}));

// API Routes
app.get('/', (req, res) => res.send("Server is up and running!"));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.post('/api/stripe', stripeWebhooks);
app.use('/api/auth', authRouter);
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/user', userRouter);

// Running the server
app.listen(port, () => console.log(`Server is up and running on port http://localhost:${port}`));