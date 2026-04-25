const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
},
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  
  products: [{
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    },
    name: { type: String },  
    price: { type: Number },  
    quantity: { 
        type: Number, 
        min: 1, 
        max: 5 
    },
    total: { type: Number }
  }],
  
  subtotal: { 
    type: Number, 
    required: true 
},
  deliveryCharges: { 
    type: Number, 
    default: 150 
},
  totalAmount: { 
    type: Number, 
    required: true 
},
  
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE'],
    default: 'COD'  
  },
  
  customerInfo: {
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    postalCode: { 
        type: String, 
        required: true 
    },
    province: { 
        type: String, 
        required: true 
    }
  },
  
  agreedToTerms: { 
    type: Boolean, 
    required: true, 
    default: false 
},
  
  placedAt: { 
    type: Date, 
    default: Date.now 
},
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  refundedAt: Date
  
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);