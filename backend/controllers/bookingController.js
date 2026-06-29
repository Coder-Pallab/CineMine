import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import CinemaHall from "../models/CinemaHall.js";
import stripe from 'stripe';
import PDFDocument from 'pdfkit';

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const activeBookings = await Booking.findAll({ 
            where: { showId: showId }
        });

        const occupiedSeats = activeBookings.flatMap(booking => booking.bookedSeats);
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats.includes(seat));

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected Seats are not available.." })
        }

        const showData = await Show.findByPk(showId, { include: [{ model: Movie, as: 'movie' }] });

        const booking = await Booking.create({
            userId: userId,
            showId: showId,
            cinemaHallId: showData.cinemaHallId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const line_items = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.round(booking.amount * 100)
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking.id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        })

        booking.paymentLink = session.url
        await booking.save();


        res.json({ success: true, url: session.url })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;

        // ✅ Derive occupied seats from all active bookings
        const activeBookings = await Booking.findAll({ 
            where: { showId: showId }
        });

        const occupiedSeats = activeBookings.flatMap(booking => booking.bookedSeats);

        res.json({ success: true, occupiedSeats });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
export const downloadTicket = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: User, as: 'user' },
                {
                    model: Show, as: 'show',
                    include: [
                        { model: Movie, as: 'movie' },
                        { model: CinemaHall, as: 'cinemaHall' }
                    ]
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const isBookingOwner = booking.userId === userId;
        const isAdmin = req.user.role === 'admin';

        if (!isBookingOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "You don't have permission to download this ticket." });
        }

        if (!booking.isPaid) {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        // ─── Page Setup ───────────────────────────────────────────────
        // A5 landscape feels like a real cinema ticket
        const PAGE_W = 595;
        const PAGE_H = 220;
        const doc = new PDFDocument({ size: [PAGE_W, PAGE_H], margin: 0 });

        const filename = `CineMine_Ticket_${bookingId}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        doc.pipe(res);

        // ─── Palette ──────────────────────────────────────────────────
        const PURPLE      = '#6C3BAA';
        const PURPLE_DARK = '#4A2678';
        const GOLD        = '#F5C518';
        const WHITE       = '#FFFFFF';
        const DARK        = '#1A1A2E';
        const LIGHT_GRAY  = '#F0EBF8';
        const MID_GRAY    = '#888888';

        // ─── LEFT PANEL (dark) ────────────────────────────────────────
        const LEFT_W = 380;
        doc.rect(0, 0, LEFT_W, PAGE_H).fill(DARK);

        // Purple accent bar at top
        doc.rect(0, 0, LEFT_W, 6).fill(PURPLE);

        // Brand
        doc.fontSize(15).fillColor(PURPLE).font('Helvetica-Bold')
            .text('CINEMINE', 20, 16, { characterSpacing: 3 });
        doc.fontSize(7).fillColor(GOLD).font('Helvetica')
            .text('YOUR TICKET TO AMAZING', 20, 34, { characterSpacing: 1.5 });

        // Movie title
        const movieTitle = booking.show.movie.title.toUpperCase();
        doc.fontSize(18).fillColor(WHITE).font('Helvetica-Bold')
            .text(movieTitle, 20, 55, { width: LEFT_W - 40, lineGap: 2 });

        // Divider
        const divY = 88;
        doc.moveTo(20, divY).lineTo(LEFT_W - 20, divY)
            .strokeColor(PURPLE).lineWidth(0.5).stroke();

        // Info grid
        const showDate = new Date(booking.show.showDateTime);
        const dateStr  = showDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr  = showDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

        const col1X = 20, col2X = 140, col3X = 260;
        const labelY = 100, valueY = 112;

        // Labels
        doc.fontSize(7).fillColor(MID_GRAY).font('Helvetica');
        doc.text('DATE',   col1X, labelY);
        doc.text('TIME',   col2X, labelY);
        doc.text('SCREEN', col3X, labelY);

        // Values
        doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold');
        doc.text(dateStr,                          col1X, valueY, { width: 110 });
        doc.text(timeStr,                          col2X, valueY, { width: 110 });
        doc.text(booking.show.cinemaHall.name,     col3X, valueY, { width: 110 });

        // Second row
        const row2LabelY = 138, row2ValueY = 150;
        doc.fontSize(7).fillColor(MID_GRAY).font('Helvetica');
        doc.text('SEATS',           col1X, row2LabelY);
        doc.text('TOTAL PAID',      col2X, row2LabelY);

        doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold');
        doc.text(booking.bookedSeats.join(', '),   col1X, row2ValueY, { width: 110 });
        doc.text(`Rs. ${booking.amount}`,          col2X, row2ValueY);

        // Bottom booking ID
        doc.fontSize(7).fillColor(MID_GRAY).font('Helvetica')
            .text(`Booking ID: ${bookingId}`, 20, 188);

        // Bottom accent bar
        doc.rect(0, PAGE_H - 6, LEFT_W, 6).fill(PURPLE);

        // ─── PERFORATED TEAR LINE ─────────────────────────────────────
        const TEAR_X = LEFT_W;
        doc.save();
        doc.rect(TEAR_X - 18, 0, 36, PAGE_H).fill(DARK); // background behind tear

        // Semicircle notches
        doc.circle(TEAR_X, 0,        10).fill(WHITE);
        doc.circle(TEAR_X, PAGE_H,   10).fill(WHITE);

        // Dashed line
        doc.dash(4, { space: 4 }).moveTo(TEAR_X, 12).lineTo(TEAR_X, PAGE_H - 12)
            .strokeColor('#555577').lineWidth(1).stroke();
        doc.undash(); // reset
        doc.restore();

        // ─── RIGHT STUB (light) ───────────────────────────────────────
        const RIGHT_X = TEAR_X + 18;
        const RIGHT_W = PAGE_W - RIGHT_X;
        doc.rect(RIGHT_X, 0, RIGHT_W, PAGE_H).fill(LIGHT_GRAY);
        doc.rect(RIGHT_X, 0, RIGHT_W, 6).fill(PURPLE);
        doc.rect(RIGHT_X, PAGE_H - 6, RIGHT_W, 6).fill(PURPLE);

        // QR-code placeholder box
        const QR_SIZE = 80;
        const QR_X = RIGHT_X + (RIGHT_W - QR_SIZE) / 2;
        const QR_Y = 20;
        doc.rect(QR_X, QR_Y, QR_SIZE, QR_SIZE)
            .fillAndStroke('#FFFFFF', PURPLE);

        // QR inner pattern (decorative corners — real QR can be inserted as image)
        const corner = (x, y) => {
            doc.rect(x, y, 14, 14).fillAndStroke(PURPLE, PURPLE);
            doc.rect(x + 3, y + 3, 8, 8).fill(WHITE);
        };
        corner(QR_X + 5,           QR_Y + 5);
        corner(QR_X + QR_SIZE - 19, QR_Y + 5);
        corner(QR_X + 5,           QR_Y + QR_SIZE - 19);

        // Centre dot cluster
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                doc.rect(QR_X + 28 + c * 8, QR_Y + 28 + r * 8, 5, 5).fill(PURPLE);
            }
        }

        // SCAN label
        doc.fontSize(7).fillColor(MID_GRAY).font('Helvetica')
            .text('SCAN AT ENTRANCE', RIGHT_X, QR_Y + QR_SIZE + 8, { width: RIGHT_W, align: 'center' });

        // Stub seat chip
        const chipY = QR_Y + QR_SIZE + 24;
        const seatsLabel = booking.bookedSeats.join(', ');
        doc.roundedRect(RIGHT_X + 10, chipY, RIGHT_W - 20, 22, 4)
            .fillAndStroke(PURPLE, PURPLE);
        doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold')
            .text(seatsLabel, RIGHT_X + 10, chipY + 6, { width: RIGHT_W - 20, align: 'center' });

        // Footer note
        doc.fontSize(6.5).fillColor(MID_GRAY).font('Helvetica')
            .text('Non-transferable · No refunds', RIGHT_X, PAGE_H - 22, { width: RIGHT_W, align: 'center' });

        doc.end();

    } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};