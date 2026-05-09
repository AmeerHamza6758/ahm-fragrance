const express = require('express');
const router = express.Router();
const {authMiddleware, optionalAuthMiddleware} = require('../middleware/auth.middleware');
const {
  getCheckoutSummary,
  createOrder,
  cancelOrder,
  getPendingOrdersCount,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder
} = require('../controller/order.controller');

// router.use(authMiddleware);


router.get('/checkout', authMiddleware,getCheckoutSummary);
router.get('/pendingOrders', getPendingOrdersCount);
router.get('/track', optionalAuthMiddleware, trackOrder);
router.get('/all', getAllOrders);
router.get('/:id', getOrderById);

router.post('/create', authMiddleware,createOrder);


router.put('/:id/cancel', authMiddleware,cancelOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;