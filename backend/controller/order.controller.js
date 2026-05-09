const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');
const generateOrderNumber = require('../utils/generateOrderNumber');
const checkDuplicateOrder = require('../utils/checkDuplicateOrder');
const transporter = require("../config/transporter");

const normalizeSize = (size) => String(size || '50ml').trim().toLowerCase();

const getVariantForSize = (product, size) => {
  const normalizedSize = normalizeSize(size);
  return (
    product?.variants?.find(
      (variant) => normalizeSize(variant?.size) === normalizedSize,
    ) || null
  );
};


const getCheckoutSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    
    // Get user's cart items with product details
    const cartItems = await Cart.find({ customerId: userId }).populate({
      path: 'productId',
      populate: [
        { path: 'image_id' },
        { path: 'category_id' },
        { path: 'tag_id' }
      ]
    });
    
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
      
      const selectedVariant = getVariantForSize(product, item.size || '50ml');
      const currentPrice = selectedVariant?.price ?? 0;
      const itemTotal = currentPrice * item.quantity;
      subtotal += itemTotal;
      
      items.push({
        productId: product._id,
        name: product.name,
        price: currentPrice,
        size: item.size || '50ml',
        quantity: item.quantity,
        image: product.image_id?.[0]?.path || '',
        tag: product.tag_id?.name || '',
        category: product.category_id?.name || '',
        total: itemTotal
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Checkout summary retrieved successfully',
      data: {
        items,
        subtotal,
        deliveryCharges: 0,
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
    
    let subtotal = 0;
    const orderProducts = [];
    const stockUpdates = [];
    
     const deliveryCharges = 0;

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
      
      const selectedVariant = getVariantForSize(product, item.size || '50ml');
      const currentPrice = selectedVariant?.price ?? 0;
      const itemTotal = currentPrice * item.quantity;
      subtotal += itemTotal;
      
      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: currentPrice,
        size: item.size || '50ml',
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
    
    // Send order confirmation email
    try {
      const productListHtml = order.products.map(p => `
          <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.name} (${p.size})</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${p.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">PKR ${p.price.toLocaleString()}</td>
          </tr>
      `).join('');

      const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #7E525C;">Order Confirmation - AHM Fragrances</h2>
              <p>Dear ${order.customerInfo.name},</p>
              <p>Thank you for your order! We have received your request and are currently processing it.</p>
              
              <div style="background-color: #F9F6F2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
                  <div style="margin-top: 15px;">
                      <a href="${process.env.FRONTEND_URL}/track-order?orderNumber=${order.orderNumber}&contact=${order.customerInfo.email}" 
                         style="background-color: #7E525C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                         Track Your Order
                      </a>
                  </div>
              </div>

              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr style="background-color: #eee;">
                          <th style="padding: 10px; text-align: left;">Product</th>
                          <th style="padding: 10px; text-align: center;">Qty</th>
                          <th style="padding: 10px; text-align: right;">Price</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${productListHtml}
                  </tbody>
              </table>

              <div style="text-align: right; margin-top: 20px;">
                  <p><strong>Subtotal:</strong> PKR ${order.subtotal.toLocaleString()}</p>
                  <p><strong>Shipping:</strong> PKR ${order.deliveryCharges.toLocaleString()}</p>
                  <h3 style="color: #7E525C;">Total Amount: PKR ${order.totalAmount.toLocaleString()}</h3>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <h4 style="color: #7E525C;">Shipping Details:</h4>
              <p>${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.province}</p>
              <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>

              <p style="margin-top: 40px; font-size: 14px; color: #666;">
                  If you have any questions, please contact us at <a href="mailto:support@ahmfragrances.com">support@ahmfragrances.com</a>
              </p>
          </div>
      `;

      await transporter.sendMail({
          from: `"AHM Fragrances" <${process.env.EMAIL_USER}>`,
          to: order.customerInfo.email,
          subject: `Order Confirmation - ${order.orderNumber}`,
          html: emailHtml
      });
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
      // We don't block the response if email fails
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! You will receive a confirmation email shortly.',
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



const getPendingOrdersCount = async (req, res) => {
  try {
    const totalPendingOrders = await Order.countDocuments({
      orderStatus: 'pending'
    });

    res.status(200).json({
      success: true,
      totalPendingOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get pending orders count',
      error: error.message
    });
  }
};





const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const totalOrders = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        totalItems: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('customerId', 'userName email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get order details', error: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderNumber, contact } = req.query;
    const userId = req.user?.userId;

    let query = {};

    if (userId) {
      // If logged in, find user's orders
      query.customerId = userId;
      if (orderNumber) {
        query.orderNumber = orderNumber.trim();
      }
    } else {
      // If not logged in, must provide orderNumber and contact
      if (!orderNumber || !contact) {
        return res.status(400).json({
          success: false,
          message: 'Order number and email/phone are required for guest tracking.'
        });
      }
      query.orderNumber = orderNumber.trim();
      query.$or = [
        { 'customerInfo.email': contact.trim().toLowerCase() },
        { 'customerInfo.phone': contact.trim() }
      ];
    }

    const orders = await Order.find(query)
      .populate({
        path: 'products.productId',
        populate: { path: 'image_id' }
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: userId 
          ? (orderNumber ? `Order #${orderNumber} not found in your account.` : 'No orders found in your account.')
          : 'No order found with these details. Please check your Order Number and Contact info.'
      });
    }

    res.status(200).json({
      success: true,
      data: userId && !orderNumber ? orders : (orders.length === 1 ? orders[0] : orders)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order(s)',
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (status) order.orderStatus = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid'; // Usually delivered means paid for COD
    }
    
    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

module.exports = {
  getCheckoutSummary,
  createOrder,
  cancelOrder,
  getPendingOrdersCount,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder
};