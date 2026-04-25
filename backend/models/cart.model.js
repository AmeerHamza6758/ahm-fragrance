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
  quantity: { type: Number, 
    required: true, 
    min: 1, 
}  
}, 
{ timestamps: true });

// Prevent duplicate cart items for same user+product
cartSchema.index({ customerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);