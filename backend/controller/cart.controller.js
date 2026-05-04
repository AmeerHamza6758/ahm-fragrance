const mongoose = require('mongoose');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');

const normalizeSize = (size) => String(size || '50ml').trim().toLowerCase();

const getVariantForSize = (product, size) => {
  const normalizedSize = normalizeSize(size);
  return (
    product?.variants?.find(
      (variant) => normalizeSize(variant?.size) === normalizedSize,
    ) || null
  );
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { productId, quantity = 1, size = '50ml' } = req.body;
    const normalizedSize = normalizeSize(size);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
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

    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const selectedVariant = getVariantForSize(product, normalizedSize);
      if (!selectedVariant) {
        return res.status(400).json({
          success: false,
          message: 'Invalid size selected for this product',
        });
      }
    }

    const stock = await Stock.findOne({ productId: product._id });
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${stock?.quantity || 0}`
      });
    }

    // Check if product already in cart
    const existingCartItem = await Cart.findOne({
      customerId: userId,
      productId: product._id,
      size: normalizedSize,
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;


      if (stock.quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${stock.quantity} left in stock`
        });
      }

      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: `Cart updated. ${product.name} (${normalizedSize}) quantity increased to ${newQuantity}`,
        data: {
          cartItem: existingCartItem,
          product: {
            id: product._id,
            name: product.name,
            price: getVariantForSize(product, normalizedSize)?.price ?? product.variants?.[0]?.price ?? 0,
            image: product.images?.[0] || ''
          }
        }
      });
    }

    // Create new cart item
    const cartItem = new Cart({
      customerId: userId,
      productId: product._id,
      size: normalizedSize,
      quantity
    });

    await cartItem.save();

    const populatedCart = await Cart.findById(cartItem._id).populate('productId');

    return res.status(201).json({
      success: true,
      message: `${product.name} (${normalizedSize}) added to cart successfully`,
      data: {
        cartItem: populatedCart,
        product: {
          id: product._id,
          name: product.name,
          price: getVariantForSize(product, normalizedSize)?.price ?? product.variants?.[0]?.price ?? 0,
          image: product.images?.[0] || ''
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add product to cart',
      error: error.message
    });
  }
};

const getCart = async (req, res) => {
  try {

    const userId = req.user.userId;

    const cartItems = await Cart.find({ customerId: userId })
      .populate('productId');

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Your cart is empty',
        data: {
          items: [],
          subtotal: 0,
          totalItems: 0,
          deliveryCharges: 150,
          totalAmount: 150
        }
      });
    }

    let subtotal = 0;
    const items = [];
    let hasOutOfStock = false;
    const outOfStockProducts = [];

    for (const item of cartItems) {
      const product = item.productId;

      // Check if product still exists and is active
      if (!product || !product.isActive) {
        // Option C + B: Keep but mark as unavailable
        items.push({
          cartId: item._id,
          productId: item.productId?._id || 'deleted',
          name: product?.name || 'Product unavailable',
          price: product?.price || 0,
          quantity: item.quantity,
          size: item.size || '50ml',
          image: product?.images?.[0] || '',
          total: 0,
          isAvailable: false,
          message: 'Product no longer available'
        });
        hasOutOfStock = true;
        outOfStockProducts.push(product?.name || 'Unknown product');
        continue;
      }

      // Check stock availability
      const stock = await Stock.findOne({ productId: product._id });
      const isOutOfStock = !stock || stock.quantity < item.quantity;

      // Use latest price with selected variant when available
      const selectedSize = item.size || '50ml';
      const selectedVariant = getVariantForSize(product, selectedSize);
      const currentPrice = selectedVariant?.price ?? product.variants?.[0]?.price ?? 0;
      const itemTotal = currentPrice * item.quantity;
      subtotal += itemTotal;

      items.push({
        cartId: item._id,
        productId: product._id,
        name: product.name,
        price: currentPrice,
        originalPrice: product.discountPrice || currentPrice,
        quantity: item.quantity,
        size: selectedSize,
        image: product.images?.[0] || '',
        total: itemTotal,
        isAvailable: !isOutOfStock,
        stockAvailable: stock?.quantity || 0,
        message: isOutOfStock ? `Only ${stock?.quantity || 0} left in stock` : null
      });

      if (isOutOfStock) {
        hasOutOfStock = true;
        outOfStockProducts.push(product.name);
      }
    }

    const deliveryCharges = 150;
    const totalAmount = subtotal + deliveryCharges;

    return res.status(200).json({
      success: true,
      message: hasOutOfStock
        ? `Warning: ${outOfStockProducts.join(', ')} ${outOfStockProducts.length > 1 ? 'have' : 'has'} low/no stock. Please reduce quantity or remove.`
        : 'Cart retrieved successfully',
      data: {
        items,
        subtotal,
        deliveryCharges,
        totalAmount,
        totalItems: cartItems.length,
        hasOutOfStock,
        outOfStockProducts: hasOutOfStock ? outOfStockProducts : null
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
};


const updateCartItem = async (req, res) => {
  try {

    const userId = req.user.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    const allUserCartItems = await Cart.find({ customerId: userId });



    const cartItemWithString = await Cart.findOne({
      customerId: userId,
      productId: productId
    });

    // Try with ObjectId conversion
    let productObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId);
    } catch (err) {
      // Ignore
    }


    const cartItemWithObjectId = await Cart.findOne({
      customerId: userId,
      productId: productObjectId
    });



    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
        debug: {
          receivedQuantity: quantity,
          quantityType: typeof quantity
        }
      });
    }


    let cartItem = await Cart.findOne({
      _id: productId,
      customerId: userId,
    }).populate('productId');


    if (!cartItem && productId) {
      cartItem = await Cart.findOne({
        customerId: userId,
        productId: productId
      }).populate('productId');
    }

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in your cart'
      });
    }

    const product = cartItem.productId;

    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available. Please remove from cart.'
      });
    }

    const stock = await Stock.findOne({ productId: product._id });

    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${stock?.quantity || 0}`,
        debug: {
          stockAvailable: stock?.quantity || 0,
          requestedQuantity: quantity
        }
      });
    }

    const oldQuantity = cartItem.quantity;
    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCart = await Cart.findById(cartItem._id).populate('productId');
    const selectedVariant = getVariantForSize(product, cartItem.size || '50ml');
    const unitPrice = selectedVariant?.price ?? product.variants?.[0]?.price ?? 0;
    const itemTotal = unitPrice * quantity;

    return res.status(200).json({
      success: true,
      message: `Cart updated. ${product.name} quantity set to ${quantity}`,
      data: {
        cartItem: updatedCart,
        product: {
          id: product._id,
          name: product.name,
          price: unitPrice,
          image: product.images?.[0] || ''
        },
        itemTotal,
        debug: {
          oldQuantity,
          newQuantity: quantity,
          pricePerUnit: product.variants?.[0]?.price || 0
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};


const removeCartItem = async (req, res) => {
  try {

    const userId = req.user.userId;
    // const userId = req.user._id;
    const productId = req.params.productId;

    let cartItem = await Cart.findOne({
      _id: productId,
      customerId: userId,
    }).populate('productId');

    if (!cartItem) {
      cartItem = await Cart.findOne({
        customerId: userId,
        productId: productId
      }).populate('productId');
    }

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in your cart'
      });
    }

    const productName = cartItem.productId?.name || 'Product';

    await Cart.deleteOne({ _id: cartItem._id });

    return res.status(200).json({
      success: true,
      message: `${productName} removed from cart successfully`,
      data: {
        removedProductId: productId,
        productName: productName
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};



module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};