const Order = require('../models/order.model');

const checkDuplicateOrder = async (customerId, products) => {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  const productIds = products.map(p => p.productId);
  
  const existingOrder = await Order.findOne({
    customerId: customerId,
    orderStatus: { $in: ['pending', 'confirmed', 'processing'] },
    placedAt: { $gte: twentyFourHoursAgo },
    'products.productId': { $in: productIds }
  });
  
  if (existingOrder) {
    const duplicateProducts = existingOrder.products.filter(ep => 
      productIds.some(pid => pid.toString() === ep.productId.toString())
    );
    
    return {
      isDuplicate: true,
      duplicateProducts: duplicateProducts.map(p => p.name)
    };
  }
  
  return { isDuplicate: false, duplicateProducts: [] };
};

module.exports = checkDuplicateOrder;