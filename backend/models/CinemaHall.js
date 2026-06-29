import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
import User from './User.js';

const CinemaHall = sequelize.define('CinemaHall', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.JSON, // { city: "", address: "", coordinates: { lat, lng } }
        allowNull: false,
    },
    ownerName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true,
});

CinemaHall.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(CinemaHall, { foreignKey: 'ownerId', as: 'cinemaHalls' });

export default CinemaHall;
