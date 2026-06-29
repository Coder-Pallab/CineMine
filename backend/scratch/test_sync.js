
import 'dotenv/config';
import { sequelize } from '../configs/db.js';
import User from '../models/User.js';

const testSync = async () => {
    try {
        console.log('Syncing with alter: true...');
        await sequelize.sync({ alter: true });
        
        const [results] = await sequelize.query('SHOW INDEX FROM Users');
        console.log('Indexes after sync:');
        results.forEach(idx => console.log(`- ${idx.Key_name}`));
    } catch (error) {
        console.error('Sync failed:', error);
    } finally {
        await sequelize.close();
    }
};

testSync();
