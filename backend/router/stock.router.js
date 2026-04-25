const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

const {
  manageStock,        //  Create + Update + Add
  getStock,           //  Get by ID + Get All + Alerts
  // deleteStock
} = require('../controller/stock.controller');


router.post('/manage', authMiddleware, manageStock);


router.get('/get', authMiddleware, getStock);


// router.delete('/delete/:productId', authMiddleware, deleteStock);

module.exports = router;




