const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth.middleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} = require('../controller/cart.controller');

router.use(authMiddleware);

router.post('/add',authMiddleware, addToCart);

router.get('/', getCart);

router.put('/update/:productId', updateCartItem);

router.delete('/remove/:productId', removeCartItem);

module.exports = router;