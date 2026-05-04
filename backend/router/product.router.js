    const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');

router.post('/addProduct', productController.addProduct);
router.get('/getProductById', productController.getProductById);
router.put('/updateProduct', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);
router.get('/getProducts', productController.getProducts);
router.get('/totalProducts', productController.getTotalProducts);
router.get('/stats', productController.getProductStats);

module.exports = router;
