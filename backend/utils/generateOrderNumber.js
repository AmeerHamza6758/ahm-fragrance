const Order = require('../models/order.model');

const generateOrderNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;
  
  // Find last order with today's prefix
  const lastOrder = await Order.findOne({
    orderNumber: new RegExp(`^AHM-${datePrefix}`)
  }).sort({ orderNumber: -1 });
  
  let sequence = 1;
  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequence = lastSeq + 1;
  }
  
  const paddedSeq = String(sequence).padStart(3, '0');
  return `AHM-${datePrefix}-${paddedSeq}`;
};

module.exports = generateOrderNumber;