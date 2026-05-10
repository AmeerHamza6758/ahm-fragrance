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
      currentPrice: {
        type: Number,
        required: true,
        default: function() {
          return this.price - (this.price * (this.discountPercentage || 0) / 100);
        }
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

// ✅ Pre-save hook to calculate currentPrice for each variant
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.variants.forEach(variant => {
      const price = variant.price || 0;
      const discount = variant.discountPercentage || 0;
      variant.currentPrice = price - (price * discount / 100);
    });
  }
  next();
});

// ✅ Also handle findOneAndUpdate
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.variants && Array.isArray(update.variants)) {
    update.variants.forEach(variant => {
      const price = variant.price || 0;
      const discount = variant.discountPercentage || 0;
      variant.currentPrice = price - (price * discount / 100);
    });
  }
  next();
});

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
