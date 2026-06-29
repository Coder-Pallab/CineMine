import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
import Movie from './Movie.js';
import CinemaHall from './CinemaHall.js';

const Show = sequelize.define('Show', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    movieId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Movie,
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
    showDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    showPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    occupiedSeats: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
}, {
    timestamps: false,
});

Show.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie', onDelete: 'CASCADE' });
Movie.hasMany(Show, { foreignKey: 'movieId', as: 'shows', onDelete: 'CASCADE' });

Show.belongsTo(CinemaHall, { foreignKey: 'cinemaHallId', as: 'cinemaHall', onDelete: 'CASCADE' });
CinemaHall.hasMany(Show, { foreignKey: 'cinemaHallId', as: 'shows', onDelete: 'CASCADE' });

export default Show;