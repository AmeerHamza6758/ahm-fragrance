const mongoose = require('mongoose');
require('dotenv').config();

const imageSchema = new mongoose.Schema({
    path: String,
    filename: String
});

const Image = mongoose.model('images', imageSchema);

async function checkImages() {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/AHM_Fragrances');
        console.log('Connected to DB');

        const images = await Image.find().limit(10);
        images.forEach(img => {
            console.log(`ID: ${img._id}, Path: ${img.path}, Filename: ${img.filename}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImages();
