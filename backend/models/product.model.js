const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ""
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
      },
      stock: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  ],


  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  image_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'images',
  }],

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

productSchema.virtual('currentPrice').get(function () {
  if (this.variants && this.variants.length > 0) {
    const variant = this.variants[0];
    return variant.price - (variant.price * variant.discountPercentage / 100);
  }
  return 0;
});

// Ensure virtual fields are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
