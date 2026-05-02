const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth.middleware');
const {
  getCheckoutSummary,
  createOrder,
  cancelOrder,
  getPendingOrdersCount
} = require('../controller/order.controller');

// router.use(authMiddleware);


router.get('/checkout', authMiddleware,getCheckoutSummary);
router.get('/pendingOrders', getPendingOrdersCount);

router.post('/create', authMiddleware,createOrder);


router.put('/:id/cancel', authMiddleware,cancelOrder);

module.exports = router;