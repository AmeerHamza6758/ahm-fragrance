const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
},
  size: {
    type: String,
    default: '50ml',
    trim: true,
  },
  quantity: { type: Number, 
    required: true, 
    min: 1, 
}  
}, 
{ timestamps: true });

// Prevent duplicate cart items for same user+product+size
cartSchema.index({ customerId: 1, productId: 1, size: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);

// One-time cleanup for legacy index that blocked different sizes of same product.
Cart.on('index', async () => {
  try {
    await Cart.collection.dropIndex('customerId_1_productId_1');
  } catch (error) {
    // Ignore when index doesn't exist (already migrated or fresh DB).
  }
});

module.exports = Cart;