
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { 
  addRatingReview, 
//   getProductReviews,  
  getAllReviews
  
} = require('../controller/ratingReview.controller');

router.post('/add', authMiddleware, addRatingReview);    

router.get('/all-reviews', getAllReviews);

// router.get('/product/:productId', getProductReviews);           

module.exports = router;