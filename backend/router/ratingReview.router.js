
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { 
  addRatingReview, 
//   getProductReviews,  
  getAllReviews,
  checkUserReviewStatus
} = require('../controller/ratingReview.controller');

router.post('/add', authMiddleware, addRatingReview);    

router.get('/all-reviews', getAllReviews);

router.get('/check-status', authMiddleware, checkUserReviewStatus); 

// router.get('/product/:productId', getProductReviews);           

module.exports = router;