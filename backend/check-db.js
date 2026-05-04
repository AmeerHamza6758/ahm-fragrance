const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    name: String,
    image_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images' }]
});

const imageSchema = new mongoose.Schema({
    path: String,
    filename: String
});

const Product = mongoose.model('Product', productSchema);
const Image = mongoose.model('images', imageSchema);

async function checkImages() {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/AHM_Fragrances');
        console.log('Connected to DB');

        const products = await Product.find().populate('image_id');
        console.log(`Found ${products.length} products`);
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`  Images Array:`, p.image_id.map(img => img.path));
            console.log(`  Legacy Image:`, p.get('image'));
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImages();
