import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import sendEmail from "../configs/nodeMailer.js";
import { Op } from "sequelize";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking-with-admin" });



// Inngest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    {
        id: 'send-booking-confirmation-email',
        triggers: [{ event: "app/show.booked" }],
    },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: User, as: 'user' },
                { 
                    model: Show, as: 'show',
                    include: [{ model: Movie, as: 'movie' }]
                }
            ]
        });

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation "${booking.show.movie.title}" booked!`,
            body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                
                <div style="background-color: #6c3baa; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">🎬 CineMine</h1>
                </div>

                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Hi ${booking.user.name},</h2>
                    <p style="color: #555;">Your booking is confirmed! Here are your details:</p>

                    <div style="background-color: #f3eeff; border-left: 4px solid #6c3baa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>🎥 Movie:</strong> ${booking.show.movie.title}</p>
                        <p style="margin: 5px 0;"><strong>📅 Show Time:</strong> ${booking.show.showDateTime}</p>
                        <p style="margin: 5px 0;"><strong>💺 Seats:</strong> ${booking.bookedSeats.join(', ')}</p>
                        <p style="margin: 5px 0;"><strong>💰 Amount Paid:</strong> ₹${booking.amount}</p>
                        <p style="margin: 5px 0;"><strong>🔖 Booking ID:</strong> ${bookingId}</p>
                    </div>

                    <p style="color: #555;">Please arrive 15 minutes before the show. Enjoy the movie! 🍿</p>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #aaa; font-size: 12px;">© 2026 CineMine. All rights reserved.</p>
                    </div>
                </div>

            </div>`
        })
    }
)

// Inngest function to send remainders
const sendShowReminders = inngest.createFunction(
    {
        id: 'send-show-reminder-email',
        triggers: [{ cron: "0 */8 * * *" }],
    },
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        // Prepare reminder tasks
        const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
            const shows = await Show.findAll({
                where: { showDateTime: { [Op.between]: [windowStart, in8Hours] } },
                include: [{ model: Movie, as: 'movie' }]
            });

            const tasks = []

            for (const show of shows) {
                if (!show.movie || !show.occupiedSeats) continue;

                const userIds = [...new Set(Object.values(show.occupiedSeats))]

                if (userIds.length === 0) continue;

                const users = await User.findAll({
                    where: { id: { [Op.in]: userIds } },
                    attributes: ['name', 'email']
                });

                for (const user of users) {
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showDateTime
                    })
                }
            }
            return tasks;
        })

        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No reminders to send.." }
        }

        // Send reminder emails
        const results = await step.run('send-all-reminders', async () => {
            return await Promise.allSettled(
                reminderTasks.map(task => sendEmail({
                    to: task.userEmail,
                    subject: `Reminder: Your Movie "${task.movieTitle}" starts soon!`,
                    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                
                <div style="background-color: #6c3baa; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">🎬 CineMine</h1>
                </div>

                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Hey ${task.userName}! 👋</h2>
                    <p style="color: #555; font-size: 16px;">
                        Just a reminder — your movie starts in <strong style="color: #6c3baa;">2 hours!</strong> Get ready for an amazing experience. 🍿
                    </p>

                    <div style="background-color: #f3eeff; border-left: 4px solid #6c3baa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 8px 0; color: #333;"><strong>🎥 Movie:</strong> ${task.movieTitle}</p>
                        <p style="margin: 8px 0; color: #333;"><strong>📅 Show Time:</strong> ${task.showTime}</p>
                    </div>

                    <div style="background-color: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #f57f17; font-size: 14px;">
                            ⚠️ Please arrive at least <strong>15 minutes early</strong> to avoid missing the beginning of the show.
                        </p>
                    </div>

                    <p style="color: #555;">See you at the movies! 🎉</p>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #aaa; font-size: 12px;">© 2026 CineMine. All rights reserved.</p>
                    </div>
                </div>

            </div>`
                }
                ))
            )
        })

        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.length - sent;

        return {
            sent,
            failed,
            message: `Sent ${sent} reminder(s), ${failed} failed..`
        }
    }
)

// Inngest function to send notifications when when a new show is added
const sendNewShowNotifications = inngest.createFunction(
    {
        id: 'send-new-show-notifications',
        triggers: [{ event: "app/show.added" }],
    },
    async ({ event }) => {
        const { movieTitle, movieId } = event.data;
        const users = await User.findAll();

        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;

            const subject = `🎬 New Show Added : ${movieTitle}`;
            const body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">

                <div style="background-color: #6c3baa; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">🎬 CineMine</h1>
                    <p style="color: #e0c9ff; margin: 5px 0 0;">New Movie Just Dropped!</p>
                </div>

                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Hey ${userName}! 👋</h2>
                    <p style="color: #555; font-size: 16px;">
                        A brand new movie has just been added to CineMine. Be the first to grab your seats! 🍿
                    </p>

                    <div style="background-color: #f3eeff; border-left: 4px solid #6c3baa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
                        <h2 style="color: #6c3baa; margin: 0 0 10px;">🎥 ${movieTitle}</h2>
                        <p style="color: #888; font-size: 12px; margin: 0;">Movie ID: ${movieId}</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/movies/${movieId}" 
                           style="background-color: #6c3baa; color: #ffffff; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-size: 16px; font-weight: bold;">
                            🎟️ Book Now
                        </a>
                    </div>

                    <div style="background-color: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 5px;">
                        <p style="margin: 0; color: #f57f17; font-size: 14px;">
                            🔥 Seats fill up fast — book early to get the best seats!
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #aaa; font-size: 12px;">© 2026 CineMine. All rights reserved.</p>
                    </div>
                </div>

            </div>`;

            await sendEmail({
                to: userEmail,
                subject,
                body,
            })
        }

        return {message: 'Notification sent..'}
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [sendBookingConfirmationEmail, sendShowReminders, sendNewShowNotifications];