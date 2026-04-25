const express = require('express');
const router = express.Router();
const brandController = require('../controller/brand.controller');

router.post('/creatBrand', brandController.createBrand);
router.get('/getBrand', brandController.getBrands);
router.get('/getBrandById', brandController.getBrandById);
router.put('/updateBrand', brandController.updateBrand);
router.delete('/deleteBrand', brandController.deleteBrand);

module.exports = router;
