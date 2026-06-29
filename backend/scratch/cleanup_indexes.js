
import 'dotenv/config';
import { sequelize } from '../configs/db.js';

const cleanupIndexes = async () => {
    try {
        const [results] = await sequelize.query('SHOW INDEX FROM Users');
        console.log(`Found ${results.length} indexes.`);
        
        // We want to keep PRIMARY and maybe one email index.
        // Let's drop all email_N indexes.
        for (const index of results) {
            if (index.Key_name.startsWith('email_')) {
                console.log(`Dropping index: ${index.Key_name}`);
                await sequelize.query(`ALTER TABLE Users DROP INDEX ${index.Key_name}`);
            }
        }
        
        console.log('Cleanup complete.');
    } catch (error) {
        console.error('Error cleaning up indexes:', error);
    } finally {
        await sequelize.close();
    }
};

cleanupIndexes();
