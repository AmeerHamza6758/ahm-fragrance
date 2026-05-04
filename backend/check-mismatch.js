const mongoose = require('mongoose');
require('dotenv').config();

async function checkSchemaMismatch() {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/AHM_Fragrances');
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const products = await db.collection('products').find().toArray();
        
        products.forEach(p => {
            console.log(`Product: ${p.name}, image_id type: ${Array.isArray(p.image_id) ? 'Array' : typeof p.image_id}`);
            console.log(`  image_id value:`, p.image_id);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchemaMismatch();
