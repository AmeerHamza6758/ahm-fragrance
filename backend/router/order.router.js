const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth.middleware');
const {
  getCheckoutSummary,
  createOrder,
  cancelOrder
} = require('../controller/order.controller');

router.use(authMiddleware);


router.get('/checkout', authMiddleware,getCheckoutSummary);

router.post('/create', createOrder);


router.put('/:id/cancel', cancelOrder);

module.exports = router;