const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');
const generateOrderNumber = require('../utils/generateOrderNumber');
const checkDuplicateOrder = require('../utils/checkDuplicateOrder');


const getCheckoutSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    
    // Get user's cart items with product details
    const cartItems = await Cart.find({ customerId: userId }).populate('productId');
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Add products before checkout.'
      });
    }
    
    let subtotal = 0;
    const items = [];
    
    for (const item of cartItems) {
      const product = item.productId;
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product?.name || 'unknown'} is no longer available.`
        });
      }
      
      // Check stock availability
      const stock = await Stock.findOne({ productId: product._id });
      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${stock?.quantity || 0}`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || '',
        total: itemTotal
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Checkout summary retrieved successfully',
      data: {
        items,
        subtotal,
        deliveryCharges: 0, // Free delivery as per your terms
        totalAmount: subtotal,
        cartItemCount: cartItems.length
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get checkout summary',
      error: error.message
    });
  }
};


const createOrder = async (req, res) => {
  try {
        const userId = req.user.userId;

    const { items, customerInfo, agreedToTerms } = req.body;
    

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order. Please add products to cart.'
      });
    }
    

    if (!agreedToTerms) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the Terms & Conditions to place order.'
      });
    }
    

    const requiredFields = ['name', 'phone', 'email', 'address', 'city', 'postalCode', 'province'];
    for (const field of requiredFields) {
      if (!customerInfo[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required. Please fill all delivery details.`
        });
      }
    }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }
    

    const phoneRegex = /^03[0-9]{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Pakistani phone number (e.g., 03044524449).'
      });
    }
    
    const duplicateCheck = await checkDuplicateOrder(userId, items);
    if (duplicateCheck.isDuplicate) {
      return res.status(409).json({
        success: false,
        message: `You have already ordered these product(s) within the last 24 hours: ${duplicateCheck.duplicateProducts.join(', ')}. Please wait before ordering again or contact us through email or phonenumber.`,
        duplicateProducts: duplicateCheck.duplicateProducts
      });
    }
    
    let subtotal = 0;
    const orderProducts = [];
    const stockUpdates = [];
    
     const deliveryCharges = 150;

    for (const item of items) {
      const product = await Product.findOne({ 
        _id: item.productId, 
        isActive: true 
      });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found or unavailable.`
        });
      }
      

      // if (item.quantity > product.maxPerOrder) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `You can only order max ${product.maxPerOrder} bottles of ${product.name}.`
      //   });
      // }
      
      if (item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Quantity must be at least 1 for ${product.name}.`
        });
      }
      
      const stock = await Stock.findOne({ productId: product._id });
      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${stock?.quantity || 0}. Please reduce quantity.`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
      
      stockUpdates.push({
        productId: product._id,
        quantity: stock.quantity - item.quantity,
        previousQuantity: stock.quantity,
        productName: product.name
      });
    }
    
    const totalAmount = subtotal + deliveryCharges;

    const orderNumber = await generateOrderNumber();
    
  
    const order = new Order({
      orderNumber,
      customerId: userId,
      products: orderProducts,
      subtotal,
      deliveryCharges,
      totalAmount, 
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'COD',
      customerInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        province: customerInfo.province
      },
      agreedToTerms: true,
      placedAt: new Date()
    });
    
    await order.save();
    
    // Deduct stock and log history
    for (const update of stockUpdates) {
      await Stock.findOneAndUpdate(
        { productId: update.productId },
        {
          $set: { quantity: update.quantity },
          $push: {
            stockHistory: {
              previousQuantity: update.previousQuantity,
              newQuantity: update.quantity,
              changedBy: userId,
              reason: 'order_placed',
              changedAt: new Date()
            }
          }
        }
      );
    }
    

    await Cart.deleteMany({ customerId: userId });
    
    const lowStockProducts = [];
    for (const update of stockUpdates) {
      const stock = await Stock.findOne({ productId: update.productId });
      if (stock.quantity <= stock.lowStockThreshold) {
        lowStockProducts.push({
          productId: update.productId,
          name: update.productName,
          currentStock: stock.quantity,
          threshold: stock.lowStockThreshold
        });
      }
    }
    
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! You will receive delivery within 3-5 working days.',
      data: {
        order,
        lowStockAlerts: lowStockProducts.length > 0 ? lowStockProducts : null
      }
    });
    
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).json({
        success: false,
        message: 'Order number conflict. Please try again.',
        error: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;
    
    const order = await Order.findOne({ 
      _id: orderId, 
      customerId: userId 
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have access to this order.'
      });
    }
    
    // ✅ Only check if order is pending - NO 24-hour restriction
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}. Contact support for assistance immediately.`
      });
    }
    
    // ❌ REMOVED the 24-hour check completely
    
    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
    
    // Restore stock for each product in the cancelled order
    for (const item of order.products) {
      const stock = await Stock.findOne({ productId: item.productId });
      if (stock) {
        const previousQuantity = stock.quantity;
        const newQuantity = stock.quantity + item.quantity;
        
        await Stock.findOneAndUpdate(
          { productId: item.productId },
          {
            $set: { quantity: newQuantity },
            $push: {
              stockHistory: {
                previousQuantity,
                newQuantity,
                changedBy: userId,
                reason: 'order_cancelled',
                changedAt: new Date()
              }
            }
          }
        );
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully. Your payment has been released (no charge as it was COD).',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        cancelledAt: order.cancelledAt
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// const cancelOrder = async (req, res) => {
//   try {

//     const userId = req.user.userId;
//     const orderId = req.params.id;
    
//     const order = await Order.findOne({ 
//       _id: orderId, 
//       customerId: userId 
//     });
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or you do not have access to this order.'
//       });
//     }
    
//     if (order.orderStatus !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Order cannot be cancelled because it is already ${order.orderStatus}. Contact support for assistance immediately.`
//       });
//     }
    
//     // Check if order was placed within 24 hours
//     const timeSincePlaced = Date.now() - new Date(order.placedAt).getTime();
//     const hoursSincePlaced = timeSincePlaced / (1000 * 60 * 60);
    
//     if (hoursSincePlaced > 24) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order can only be cancelled within 24 hours of placing. Please contact support for assistance.'
//       });
//     }
    
//     // Update order status
//     order.orderStatus = 'cancelled';
//     order.cancelledAt = new Date();
//     await order.save();
    
//     // Restore stock for each product in the cancelled order
//     for (const item of order.products) {
//       const stock = await Stock.findOne({ productId: item.productId });
//       if (stock) {
//         const previousQuantity = stock.quantity;
//         const newQuantity = stock.quantity + item.quantity;
        
//         await Stock.findOneAndUpdate(
//           { productId: item.productId },
//           {
//             $set: { quantity: newQuantity },
//             $push: {
//               stockHistory: {
//                 previousQuantity,
//                 newQuantity,
//                 changedBy: userId,
//                 reason: 'order_cancelled',
//                 changedAt: new Date()
//               }
//             }
//           }
//         );
//       }
//     }
    
//     return res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully. Your payment has been released (no charge as it was COD).',
//       data: {
//         orderId: order._id,
//         orderNumber: order.orderNumber,
//         cancelledAt: order.cancelledAt
//       }
//     });
    
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to cancel order',
//       error: error.message
//     });
//   }
// };

module.exports = {
  getCheckoutSummary,
  createOrder,
  cancelOrder
};