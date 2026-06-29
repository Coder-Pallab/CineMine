import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'users_email_unique',
            msg: 'Email already exists'
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    favorites: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
}, {
    timestamps: true,
});

export default User;