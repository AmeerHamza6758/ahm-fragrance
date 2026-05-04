const Stock = require('../models/stock.model');
const Product = require('../models/product.model');


const manageStock = async (req, res) => {
  try {
    const { 
      productId, 
      variantId,
      variantSize,
      quantity, 
      operation,  // 'add' or 'deduct'
      reason = 'manual_update'
    } = req.body;
    
    const userId = req.user.userId;

    // Validation
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    if (!operation) {
      return res.status(400).json({ success: false, message: 'Operation is required. Use: add or deduct' });
    }

    if (operation !== 'add' && operation !== 'deduct') {
      return res.status(400).json({ success: false, message: 'Invalid operation. Use: add or deduct' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Positive quantity is required' });
    }

    // Check product exists
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found or is inactive` });
    }

    // Find existing stock for this product and variant
    let stock = await Stock.findOne({ productId, variantId: variantId || null });

    // CREATE if no stock exists
    if (!stock) {
      if (operation === 'deduct') {
        return res.status(400).json({
          success: false,
          message: 'Cannot deduct. No stock exists. Please add stock first.'
        });
      }
      
      // Create new stock
      stock = new Stock({
        productId,
        variantId: variantId || null,
        variantSize: variantSize || (variantId ? product.variants.find(v => v._id.toString() === variantId.toString())?.size : null),
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
        message: `✅ Stock created for ${product.name} ${variantSize || ''}: ${quantity} units`,
        data: {
          productId: product._id,
          productName: product.name,
          variantSize,
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
      productId, 
      status,         
      search = "",
      page = 1, 
      limit = 10,
    } = req.query;

    const pPage = Math.max(1, parseInt(page));
    const pLimit = Math.max(1, parseInt(limit));
    const skip = (pPage - 1) * pLimit;

    // CASE 1: Get specific product stock details (returns all variant stocks for that product)
    if (productId) {
      const product = await Product.findById(productId).populate('category_id', 'name');
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      const variants = product.variants || [];
      const stockDetails = await Promise.all(variants.map(async (v) => {
        const s = await Stock.findOne({ productId, variantId: v._id });
        return {
          _id: s?._id || `new_${productId}_${v._id}`,
          productId: {
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category_id?.name,
            images: product.image_id
          },
          variantId: v._id,
          variantSize: v.size,
          variantPrice: v.price,
          quantity: s?.quantity || 0,
          reservedQuantity: s?.reservedQuantity || 0,
          lowStockThreshold: s?.lowStockThreshold || 10,
          lastRestockedAt: s?.lastRestockedAt,
          stockHistory: s?.stockHistory || []
        };
      }));

      return res.status(200).json({
        success: true,
        data: stockDetails,
        pagination: { totalItems: stockDetails.length, totalPages: 1, currentPage: 1 }
      });
    }

    // CASE 2: Registry List with filtering and pagination
    const productMatch = { isActive: true };
    if (search) {
      productMatch.name = { $regex: search, $options: 'i' };
    }

    const basePipeline = [
      { $match: productMatch },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$variants', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'stocks',
          let: { pId: '$_id', vId: '$variants._id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$productId', '$$pId'] }, { $eq: ['$variantId', '$$vId'] }] } } }
          ],
          as: 's'
        }
      },
      { $unwind: { path: '$s', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: {
            _id: '$_id',
            name: '$name',
            images: '$image_id',
            category: '$category.name'
          },
          variantId: '$variants._id',
          variantSize: '$variants.size',
          variantPrice: '$variants.price',
          quantity: { $ifNull: ['$s.quantity', 0] },
          reservedQuantity: { $ifNull: ['$s.reservedQuantity', 0] },
          lowStockThreshold: { $ifNull: ['$s.lowStockThreshold', 10] },
          lastRestockedAt: '$s.lastRestockedAt',
          stockHistory: '$s.stockHistory'
        }
      }
    ];

    if (status === 'lowStock') {
      basePipeline.push({ $match: { $expr: { $and: [{ $lte: ['$quantity', '$lowStockThreshold'] }, { $gt: ['$quantity', 0] }] } } });
    } else if (status === 'outOfStock') {
      basePipeline.push({ $match: { quantity: 0 } });
    } else if (status === 'inStock') {
      basePipeline.push({ $match: { $expr: { $gt: ['$quantity', '$lowStockThreshold'] } } });
    }

    const countRes = await Product.aggregate([...basePipeline, { $count: 'total' }]);
    const totalEntries = countRes.length > 0 ? countRes[0].total : 0;

    const dataPipeline = [
      ...basePipeline,
      { $sort: { quantity: 1, 'productId.name': 1 } },
      { $skip: skip },
      { $limit: pLimit }
    ];
    const stocks = await Product.aggregate(dataPipeline);

    const summaryRes = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$variants' },
      {
        $lookup: {
          from: 'stocks',
          let: { pId: '$_id', vId: '$variants._id' },
          pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$productId', '$$pId'] }, { $eq: ['$variantId', '$$vId'] }] } } }],
          as: 's'
        }
      },
      { $unwind: { path: '$s', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          lowStock: {
            $sum: {
              $cond: [
                { $and: [{ $lte: [{ $ifNull: ['$s.quantity', 0] }, { $ifNull: ['$s.lowStockThreshold', 10] }] }, { $gt: [{ $ifNull: ['$s.quantity', 0] }, 0] }] },
                1, 0
              ]
            }
          },
          outOfStock: { $sum: { $cond: [{ $eq: [{ $ifNull: ['$s.quantity', 0] }, 0] }, 1, 0] } }
        }
      }
    ]);

    const summary = summaryRes.length > 0 ? summaryRes[0] : { total: 0, lowStock: 0, outOfStock: 0 };

    return res.status(200).json({
      success: true,
      data: stocks,
      pagination: {
        currentPage: pPage,
        totalPages: Math.ceil(totalEntries / pLimit),
        totalItems: totalEntries,
        itemsPerPage: pLimit
      },
      summary
    });

  } catch (error) {
    console.error('GetStock Error:', error);
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



