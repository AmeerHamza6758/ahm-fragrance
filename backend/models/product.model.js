const mongoose = require('mongoose');

 const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  description: {
    type: String
  },

  // ✅ NEW FIELD
  variants: [
    {
      size: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    }
  ],

  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  isActive: { 
    type: Boolean, 
    default: true 
  },  

  image_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },

  tag_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  },
    rating: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

productSchema.virtual('currentPrice').get(function() {
  return this.price - (this.price * this.discountPercentage / 100);
});

// Ensure virtual fields are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
