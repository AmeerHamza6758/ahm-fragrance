const Favorite = require('../models/favorite.model');
const Product = require('../models/product.model');


const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
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

    const existingItem = await Favorite.findOne({
      userId: userId,
      productId: productId
    });

    if (existingItem) {

      await Favorite.deleteOne({ _id: existingItem._id });

      return res.status(200).json({
        success: true,
        isFavorited: false,
        message: `${product.name} removed from your favorites`,
        data: {
          action: 'removed',
          productId: product._id,
          productName: product.name
        }
      });
    } else {
      const favoriteItem = new Favorite({
        userId : userId,
        productId: productId
      });

      await favoriteItem.save();

      return res.status(201).json({
        success: true,
        isFavorited: true,
        message: `❤️ ${product.name} added to your favorites`,
        data: {
          action: 'added',
          productId: product._id,
          productName: product.name
        }
      });
    }

  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update favorites',
      error: error.message
    });
  }
};


const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const favoriteItems = await Favorite.find({ userId: userId })
      .populate({
        path: 'productId',
        select: 'name price discountPercentage description variants rating image_id tag_id category_id isActive',
        populate: [
          { path: 'image_id', model: 'images', select: 'filename path' },
          { path: 'tag_id', model: 'Tag', select: 'name' },
          { path: 'category_id', model: 'Category', select: 'name' },
          // { path: 'brand_id', model: 'Brand', select: 'brandName' }
        ]
      });

    if (!favoriteItems || favoriteItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Your favorites list is empty',
        data: [],
        count: 0
      });
    }

    const products = favoriteItems
      .filter((item) => item.productId)
      .map(item => ({
      favoriteId: item._id,
      product: item.productId
    }));

    return res.status(200).json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: products,
      count: products.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get favorites',
      error: error.message
    });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites
};