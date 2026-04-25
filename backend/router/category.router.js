const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');

router.post('/creatCategory', categoryController.createCategory);
router.get('/getCategory', categoryController.getCategories);
router.get('/getCategoryById', categoryController.getCategoryById);
router.put('/updateCategory', categoryController.updateCategory);
router.delete('/deleteCategory', categoryController.deleteCategory);

module.exports = router;
