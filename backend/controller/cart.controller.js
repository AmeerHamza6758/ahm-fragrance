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
        console.log('Full req.user:', req.user);
    console.log('req.user._id:', req.user?._id);
    console.log('req.user.id:', req.user?.id);
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
            price: getVariantForSize(product, normalizedSize)?.price ?? product.price,
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
          price: getVariantForSize(product, normalizedSize)?.price ?? product.price,
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
      const currentPrice = selectedVariant?.price ?? product.price;
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

    console.log('========== UPDATE CART ITEM DEBUG ==========');
    console.log('1. Request params:', req.params);
    console.log('2. Request body:', req.body);
    console.log('3. userId from token:', userId);
    console.log('4. productId from params:', productId);
    console.log('5. productId type:', typeof productId);
    console.log('6. quantity:', quantity);
    console.log('7. quantity type:', typeof quantity);
    
    const allUserCartItems = await Cart.find({ customerId: userId });
    console.log('8. Total cart items for user:', allUserCartItems.length);
    console.log('9. All cart items details:', allUserCartItems.map(item => ({
      _id: item._id.toString(),
      customerId: item.customerId.toString(),
      productId: item.productId.toString(),
      quantity: item.quantity
    })));
    


    const cartItemWithString = await Cart.findOne({
      customerId: userId,
      productId: productId
    });
    console.log('10. Search with string productId result:', cartItemWithString ? 'Found' : 'Not found');
    
    // Try with ObjectId conversion
    let productObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId);
      console.log('11. Converted to ObjectId:', productObjectId);
    } catch (err) {
      console.log('11. Failed to convert to ObjectId:', err.message);
    }
    

    const cartItemWithObjectId = await Cart.findOne({
      customerId: userId,
      productId: productObjectId
    });
    console.log('12. Search with ObjectId productId result:', cartItemWithObjectId ? 'Found' : 'Not found');

    

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
        message: 'Product not found in your cart',
        debug: {
          userId: userId,
          productId: productId,
          productIdAsObjectId: productObjectId?.toString(),
          totalItemsInCart: allUserCartItems.length,
          cartItemIds: allUserCartItems.map(item => item.productId.toString())
        }
      });
    }

    console.log('13. Found cart item:', {
      _id: cartItem._id,
      customerId: cartItem.customerId,
      productId: cartItem.productId?._id || cartItem.productId,
      currentQuantity: cartItem.quantity
    });

    const product = cartItem.productId;

    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available. Please remove from cart.',
        debug: {
          productExists: !!product,
          isActive: product?.isActive
        }
      });
    }

    console.log('14. Product details:', {
      id: product._id,
      name: product.name,
      maxPerOrder: product.maxPerOrder,
      price: product.price
    });


    const stock = await Stock.findOne({ productId: product._id });
    console.log('15. Stock info:', {
      found: !!stock,
      availableQuantity: stock?.quantity || 0,
      requestedQuantity: quantity
    });

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

    console.log('16. Cart updated successfully:', {
      productName: product.name,
      oldQuantity: oldQuantity,
      newQuantity: quantity
    });

    const updatedCart = await Cart.findById(cartItem._id).populate('productId');
    const selectedVariant = getVariantForSize(product, cartItem.size || '50ml');
    const unitPrice = selectedVariant?.price ?? product.price;
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
          pricePerUnit: product.price
        }
      }
    });

  } catch (error) {
    console.error('========== UPDATE CART ITEM ERROR ==========');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message,
      debug: {
        userId: req.user?.userId,
        productId: req.params?.productId,
        body: req.body
      }
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