import { Sequelize } from "sequelize";
import mysql2 from "mysql2"; // Force Vercel to bundle the driver

export const sequelize = new Sequelize(
    process.env.MYSQL_DB || 'cinemine',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || '',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        dialect: 'mysql',
        dialectModule: mysql2, // Bind explicit import to bypassing dynamic requiring
        logging: false
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database Connected');
    } catch (error) {
        console.log('Unable to connect to MySQL database:', error.message);
    }
}

export default connectDB;