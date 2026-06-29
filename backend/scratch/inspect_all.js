
import 'dotenv/config';
import { sequelize } from '../configs/db.js';

const inspectAll = async () => {
    try {
        const tables = ['Bookings', 'CinemaHalls', 'Movies', 'Shows', 'Users'];
        for (const table of tables) {
            const [results] = await sequelize.query(`SHOW INDEX FROM ${table}`);
            console.log(`Table ${table} has ${results.length} indexes.`);
            if (results.length > 10) {
                results.forEach(idx => {
                    if (idx.Key_name.includes('_2') || idx.Key_name.includes('_3')) {
                         console.log(`  - Potential duplicate: ${idx.Key_name}`);
                    }
                });
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
};

inspectAll();
