const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['privacy-policy', 'about-us', 'shipping-returns', 'terms-service']
  },
  title: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CMS', cmsSchema);
