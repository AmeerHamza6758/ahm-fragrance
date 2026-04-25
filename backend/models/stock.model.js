
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true, 
    unique: true  
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 0, 
    min: 0 
  },
  reservedQuantity: { 
    type: Number, 
    default: 0  
  },
  lowStockThreshold: { 
    type: Number, 
    default: 10 
  },
  lastRestockedAt: { 
    type: Date 
  },
  lastUpdatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'  
  },
  stockHistory: [{  // Track changes over time
    previousQuantity: Number,
    newQuantity: Number,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,  // order_placed, admin_restock, return
    changedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);