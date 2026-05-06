const RatingReview = require('../models/ratingReview.model');
const Product = require('../models/product.model');




// const getProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Product ID is required'
//       });
//     }

//     const product = await Product.findOne({
//       _id: productId,
//       isActive: true
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     const reviews = await RatingReview.find({ productId: productId })
//       .populate('userId', 'userName email')
//       .sort({ createdAt: -1 }); 

//     if (reviews.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'No reviews yet for this product',
//         data: {
//           productId: product._id,
//           productName: product.name,
//           averageRating: product.rating || 0,
//           totalReviews: 0,
//           reviews: []
//         }
//       });
//     }

//     const formattedReviews = reviews.map(review => ({
//       reviewId: review._id,
//       rating: review.rating,
//       review: review.review,
//       user: {
//         id: review.userId._id,
//         name: review.userId.userName
//       },
//       submittedAt: review.createdAt
//     }));

//     return res.status(200).json({
//       success: true,
//       message: 'Reviews retrieved successfully',
//       data: {
//         productId: product._id,
//         productName: product.name,
//         averageRating: product.rating || 0,
//         totalReviews: reviews.length,
//         reviews: formattedReviews
//       }
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to get reviews',
//       error: error.message
//     });
//   }
// };

const getAllReviews = async (req, res) => {
  try {

    const reviews = await RatingReview.find()
      .populate('userId', 'userName email')  
      .populate('productId', 'name images')  
      .sort({ createdAt: -1 });  

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No reviews found',
        data: [],
        count: 0
      });
    }

    const formattedReviews = reviews.map(review => ({
      reviewId: review._id,
      userName: review.userId?.userName || 'Anonymous User',
      rating: review.rating,
      reviewText: review.review,
      productName: review.productId?.name || 'Product',
      productImage: review.productId?.images?.[0] || '',
      submittedAt: review.createdAt
    }));

    return res.status(200).json({
      success: true,
      message: 'All reviews retrieved successfully',
      data: formattedReviews,
      count: formattedReviews.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

const addRatingReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, rating, review } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (!review || review.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review text is required'
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    const existingReview = await RatingReview.findOne({
      userId: userId,
      productId: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const ratingReview = new RatingReview({
      userId: userId,
      productId: productId,
      rating: rating,
      review: review.trim()
    });

    await ratingReview.save();

    const allRatings = await RatingReview.find({ productId: productId });
    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = sumRatings / totalRatings;


    const updatedProduct = await Product.findByIdAndUpdate(productId, {
  rating: parseFloat(averageRating.toFixed(1))
}, { new: true });


        
    // await Product.findByIdAndUpdate(productId, {
    //   rating: parseFloat(averageRating.toFixed(1))
    // });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your rating and review has been submitted successfully.',
      data: {
        reviewId: ratingReview._id,
        productId: productId,
        productName: product.name,
        rating: rating,
        review: review.trim(),
        productNewAverageRating: averageRating.toFixed(1)
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to submit rating and review',
      error: error.message
    });
  }
};

const checkUserReviewStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const existingReview = await RatingReview.findOne({
      userId: userId,
      productId: productId
    });

    return res.status(200).json({
      success: true,
      hasReviewed: !!existingReview
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check review status',
      error: error.message
    });
  }
};

module.exports = {
  addRatingReview,
  // getProductReviews,
  getAllReviews,
  checkUserReviewStatus
};