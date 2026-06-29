
import 'dotenv/config';
import { sequelize } from '../configs/db.js';

const inspectIndexes = async () => {
    try {
        const [results] = await sequelize.query('SHOW INDEX FROM Users');
        console.log('Current Indexes on Users table:');
        results.forEach(index => {
            console.log(`- Name: ${index.Key_name}, Column: ${index.Column_name}, Non_unique: ${index.Non_unique}`);
        });
        
        if (results.length >= 60) {
            console.log('\nFound many indexes. Suggest dropping redundant ones.');
        }
    } catch (error) {
        console.error('Error inspecting indexes:', error);
    } finally {
        await sequelize.close();
    }
};

inspectIndexes();
