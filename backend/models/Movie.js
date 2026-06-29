import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
import User from './User.js';

const Movie = sequelize.define('Movie', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poster_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    director: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    studio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    releaseDate: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true,
});

Movie.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Movie, { foreignKey: 'ownerId', as: 'movies' });

export default Movie;