const Stock = require('../models/stock.model');
const Product = require('../models/product.model');


const manageStock = async (req, res) => {
  try {
    const { 
      productId, 
      quantity, 
      operation,  // 'add' ya 'deduct' only
      reason = 'manual_update'
    } = req.body;
    
    const userId = req.user.userId;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!operation) {
      return res.status(400).json({
        success: false,
        message: 'Operation is required. Use: add or deduct'
      });
    }

    if (operation !== 'add' && operation !== 'deduct') {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use: add or deduct'
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Positive quantity is required'
      });
    }

    // Check product exists
    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found or is inactive`
      });
    }

    // Find existing stock
    let stock = await Stock.findOne({ productId });

    // CREATE if no stock exists
    if (!stock) {
      if (operation === 'deduct') {
        return res.status(400).json({
          success: false,
          message: 'Cannot deduct. No stock exists. Please add stock first.'
        });
      }
      
      // Create new stock (only for add operation)
      stock = new Stock({
        productId,
        quantity: quantity,
        lowStockThreshold: 10,
        lastUpdatedBy: userId,
        lastRestockedAt: new Date(),
        stockHistory: [{
          previousQuantity: 0,
          newQuantity: quantity,
          changedBy: userId,
          reason: 'initial_stock_creation',
          changedAt: new Date()
        }]
      });
      
      await stock.save();
      
      return res.status(201).json({
        success: true,
        message: `✅ Stock created for ${product.name}: ${quantity} units`,
        data: {
          productId: product._id,
          productName: product.name,
          operation: 'create',
          currentStock: quantity
        }
      });
    }

    // UPDATE existing stock
    const previousQuantity = stock.quantity;
    let newQuantity;

    if (operation === 'add') {
      newQuantity = previousQuantity + quantity;
      stock.lastRestockedAt = new Date();
    } else { // deduct
      if (previousQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock! Available: ${previousQuantity}, Requested: ${quantity}`
        });
      }
      newQuantity = previousQuantity - quantity;
    }

    stock.quantity = newQuantity;
    stock.lastUpdatedBy = userId;
    
    stock.stockHistory.push({
      previousQuantity,
      newQuantity,
      changedBy: userId,
      reason: `${operation}_${quantity}_${reason}`,
      changedAt: new Date()
    });
    
    await stock.save();

    // Warning for low stock
    let warning = null;
    if (newQuantity === 0) {
      warning = '⚠️ Product is now OUT OF STOCK!';
    } else if (newQuantity <= stock.lowStockThreshold) {
      warning = `⚠️ LOW STOCK: Only ${newQuantity} units remaining`;
    }

    const message = operation === 'add' 
      ? `✅ Added ${quantity} units to ${product.name}. New stock: ${newQuantity} units`
      : `✅ Deducted ${quantity} units from ${product.name}. New stock: ${newQuantity} units`;

    return res.status(200).json({
      success: true,
      message,
      warning,
      data: {
        productId: product._id,
        productName: product.name,
        operation,
        previousQuantity,
        newQuantity,
        currentStock: newQuantity
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to manage stock',
      error: error.message
    });
  }
};




const getStock = async (req, res) => {
  try {
    const { 
      productId,      // Get by specific product
      getAll,         // Get all stock (true/false)
      alerts,         // Get low stock alerts (true/false)
      status,         // 'lowStock', 'outOfStock', 'inStock'
      page = 1, 
      limit = 20,
      minQuantity,
      maxQuantity
    } = req.query;

    // CASE 1: Get low stock alerts
    if (alerts === 'true') {
      const stocks = await Stock.find()
        .populate('productId', 'name price sku images isActive')
        .sort({ quantity: 1 });

      const lowStockItems = stocks.filter(stock => 
        stock.quantity <= stock.lowStockThreshold && stock.quantity > 0
      );
      
      const outOfStockItems = stocks.filter(stock => stock.quantity === 0);
      
      const criticalItems = stocks.filter(stock => 
        stock.quantity <= stock.lowStockThreshold / 2 && stock.quantity > 0
      );

      if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
        return res.status(200).json({
          success: true,
          message: '✅ No stock alerts. All products have sufficient stock.',
          data: {
            alerts: [],
            summary: {
              totalProducts: stocks.length,
              lowStock: 0,
              outOfStock: 0,
              critical: 0,
              healthy: stocks.length
            }
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: `⚠️ ${lowStockItems.length + outOfStockItems.length} stock alert(s) found`,
        data: {
          alerts: {
            lowStock: lowStockItems,
            outOfStock: outOfStockItems,
            critical: criticalItems
          },
          summary: {
            totalProducts: stocks.length,
            lowStock: lowStockItems.length,
            outOfStock: outOfStockItems.length,
            critical: criticalItems.length,
            healthy: stocks.length - (lowStockItems.length + outOfStockItems.length)
          }
        }
      });
    }

    // CASE 2: Get stock by specific product ID
    if (productId) {
      const stock = await Stock.findOne({ productId })
        .populate('productId', 'name price sku images description isActive')
        .populate('lastUpdatedBy', 'userName email');

      if (!stock) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${productId} not found`
          });
        }
        return res.status(404).json({
          success: false,
          message: `No stock entry found for ${product.name}`,
          suggestion: 'Use POST /api/stock/manage with operation: "create" to add stock'
        });
      }

      const stockStatus = {
        isLowStock: stock.quantity <= stock.lowStockThreshold && stock.quantity > 0,
        isOutOfStock: stock.quantity === 0,
        isInStock: stock.quantity > 0,
        needsRestock: stock.quantity <= stock.lowStockThreshold
      };

      return res.status(200).json({
        success: true,
        message: 'Stock details retrieved',
        data: { ...stock.toObject(), stockStatus }
      });
    }

    // CASE 3: Get all stock (with filters)
    if (getAll === 'true' || !productId) {
      const query = {};
      
      if (minQuantity) query.quantity = { $gte: parseInt(minQuantity) };
      if (maxQuantity) query.quantity = { ...query.quantity, $lte: parseInt(maxQuantity) };

      let stocks = await Stock.find(query)
        .populate('productId', 'name price sku images isActive')
        .populate('lastUpdatedBy', 'userName email')
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

      // Apply status filter
      if (status === 'lowStock') {
        stocks = stocks.filter(s => s.quantity <= s.lowStockThreshold && s.quantity > 0);
      } else if (status === 'outOfStock') {
        stocks = stocks.filter(s => s.quantity === 0);
      } else if (status === 'inStock') {
        stocks = stocks.filter(s => s.quantity > 0);
      }

      const totalCount = await Stock.countDocuments(query);
      const lowStockCount = stocks.filter(s => s.quantity <= s.lowStockThreshold && s.quantity > 0).length;
      const outOfStockCount = stocks.filter(s => s.quantity === 0).length;
      const inStockCount = stocks.filter(s => s.quantity > 0).length;

      return res.status(200).json({
        success: true,
        message: `${stocks.length} stock entries found`,
        data: stocks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        },
        summary: {
          total: totalCount,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
          inStock: inStockCount
        }
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stock',
      error: error.message
    });
  }
};




const getLowStockCount = async (req, res) => {
  try {
    const lowStockCount = await Stock.countDocuments({
      $expr: {
        $and: [
          { $lte: ['$quantity', '$lowStockThreshold'] }, // quantity <= threshold
          { $gt: ['$quantity', 0] } // exclude out of stock (optional but recommended)
        ]
      }
    });

    res.status(200).json({
      success: true,
      lowStockCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock count',
      error: error.message
    });
  }
};

module.exports = { getLowStockCount };


// const deleteStock = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const stock = await Stock.findOne({ productId }).populate('productId', 'name');

//     if (!stock) {
//       return res.status(404).json({
//         success: false,
//         message: `Stock entry not found for product ID: ${productId}`
//       });
//     }

//     if (stock.quantity > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot delete stock for ${stock.productId.name}. ${stock.quantity} units still in stock.`,
//         suggestion: 'Use operation: "deduct" to reduce stock to 0 first'
//       });
//     }

//     await Stock.deleteOne({ _id: stock._id });

//     return res.status(200).json({
//       success: true,
//       message: `Stock entry deleted for ${stock.productId.name}`,
//       data: {
//         productId: stock.productId?._id,
//         productName: stock.productId?.name,
//         deletedAt: new Date()
//       }
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to delete stock',
//       error: error.message
//     });
//   }
// };

module.exports = {
  manageStock,
  getStock,
  getLowStockCount
  // deleteStock
};



