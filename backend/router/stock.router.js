const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

const {
  manageStock,        //  Create + Update + Add
  getStock,           //  Get by ID + Get All + Alerts
  getLowStockCount,   //  Get count of low stock products
  // deleteStock
} = require('../controller/stock.controller');


router.post('/manage', authMiddleware, manageStock);


router.get('/get', authMiddleware, getStock);
router.get('/lowStockCount', getLowStockCount);


// router.delete('/delete/:productId', authMiddleware, deleteStock);

module.exports = router;




