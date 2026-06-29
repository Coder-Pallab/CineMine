import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { inngest } from '../inngest/index.js';

export const stripeWebhooks = async (req, res) => {
    console.log("🚀 Incoming Stripe Request...");
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log("❌ constructEvent failed:", error.message);
        console.log("Headers sig:", sig);
        console.log("Webhook Secret exists:", !!process.env.STRIPE_WEBHOOK_SECRET);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log("🔔 Received Stripe Event:", event.type);

    try {
        switch (event.type) {

            case "checkout.session.completed": {
                const session = event.data.object;
                
                const { bookingId } = session.metadata || {};
                console.log("📦 Metadata bookingId:", bookingId);
                if (!bookingId) {
                    console.log("⚠️ No bookingId in metadata");
                    break;
                }

                // ✅ Mark booking as paid
                const booking = await Booking.findByPk(bookingId);
                if (booking) {
                    booking.isPaid = true;
                    booking.paymentLink = "";
                    await booking.save();

                    // ✅ Lock seats only after payment confirmed
                    const showData = await Show.findByPk(booking.showId);
                    if (showData && Array.isArray(booking.bookedSeats)) {
                        const freshOccupiedSeats = { ...showData.occupiedSeats };
                        booking.bookedSeats.forEach((seat) => {
                            freshOccupiedSeats[seat] = booking.userId;
                        });
                        showData.occupiedSeats = freshOccupiedSeats;
                        showData.changed('occupiedSeats', true);
                        await showData.save();
                    }
                    console.log("✅ Booking marked as paid:", bookingId);
                } else {
                    console.log("❌ Booking not found in database:", bookingId);
                }

                console.log("✅ Payment confirmed, seats locked, booking updated");

                // Send confirmation email
                await inngest.send({
                    name: "app/show.booked",
                    data: {bookingId}
                })
                break;
            }

            // ✅ Handle expired checkout sessions
            case "checkout.session.expired": {
                const session = event.data.object;
                const { bookingId } = session.metadata || {};

                if (bookingId) {
                    await Booking.destroy({ where: { id: bookingId } });
                    console.log("🗑️ Booking deleted — session expired");
                }
                break;
            }

            default:
                console.log('Unhandled event type:', event.type);
        }

        return res.json({ received: true });

    } catch (err) {
        console.error("❌ Webhook processing error:", err.stack || err);
        return res.status(500).send("Internal Server Error");
    }
}