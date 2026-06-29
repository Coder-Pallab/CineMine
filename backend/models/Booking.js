import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
import User from './User.js';
import Show from './Show.js';
import CinemaHall from './CinemaHall.js';

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    showId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Show,
            key: 'id'
        }
    },
    cinemaHallId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: CinemaHall,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    bookedSeats: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    paymentLink: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});

Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

Booking.belongsTo(Show, { foreignKey: 'showId', as: 'show', onDelete: 'CASCADE' });
Show.hasMany(Booking, { foreignKey: 'showId', as: 'bookings', onDelete: 'CASCADE' });

Booking.belongsTo(CinemaHall, { foreignKey: 'cinemaHallId', as: 'cinemaHall', onDelete: 'CASCADE' });
CinemaHall.hasMany(Booking, { foreignKey: 'cinemaHallId', as: 'bookings', onDelete: 'CASCADE' });

export default Booking;