const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    name: String,
    image_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images' }]
});

const Product = mongoose.model('Product', productSchema);

async function linkImage() {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/ahm-fragrance');
        console.log('Connected to DB');

        const imageId = '69f8e44e17fa8802cd0584a5'; // Existing image ID
        const product = await Product.findOne({ name: 'Test1' });
        
        if (product) {
            product.image_id = [imageId];
            await product.save();
            console.log('Linked image to Test1');
        } else {
            console.log('Product Test1 not found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

linkImage();
