const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Images = require('../models/images.model');
const Stock = require('../models/stock.model');
const mongoose = require('mongoose');

const formatError = (err) => {
    if (err.name === 'ValidationError') {
        return Object.values(err.errors).map(val => val.message).join(', ');
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return `A fragrance with this ${field} already exists or there is an inventory conflict.`;
    }
    return err.message;
};

const getBaseUrl = () => {
    return (process.env.API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, "");
};

const formatProductWithImages = (product) => {
    if (!product) return product;
    const baseUrl = getBaseUrl();
    const p = product.toObject ? product.toObject({ virtuals: true }) : product;

    if (p.image_id && Array.isArray(p.image_id)) {
        p.image_id = p.image_id.map(img => {
            if (img && img.path) {
                const normalizedPath = img.path.replace(/\\/g, "/").replace(/^publics?\//, "");
                return {
                    ...img,
                    url: `${baseUrl}/${normalizedPath}`
                };
            }
            return img;
        });
    }
    return p;
};

const productController = {
    addProduct: async (req, res) => {
        try {
            const { name, description, category_id, tag_id, image_id, variants } = req.body;

            const product = new Product({
                name,
                description,
                category_id,
                tag_id,
                image_id: Array.isArray(image_id) ? image_id : (image_id ? [image_id] : []),
                variants: variants.map(v => ({
                    _id: new mongoose.Types.ObjectId(),
                    size: v.size,
                    price: v.price ?? 0,
                    discountPercentage: v.discountPercentage ?? 0,
                    stock: v.stock ?? 0
                }))
            });

            await product.save();

            // ✅ Re-fetch product to ensure we have canonical IDs from the database
            const savedProduct = await Product.findById(product._id);
            if (!savedProduct) throw new Error("Failed to retrieve product after save");

            // ✅ Create initial stock entries for each variant
            if (savedProduct.variants && savedProduct.variants.length > 0) {
                console.log(`[Stock Sync] Syncing ${savedProduct.variants.length} variants for: ${savedProduct.name}`);

                for (const v of savedProduct.variants) {
                    try {
                        console.log(`[Stock Sync] Creating entry for Variant: ${v.size} | ID: ${v._id} | ProductID: ${savedProduct._id}`);

                        await Stock.create({
                            productId: savedProduct._id,
                            variantId: v._id,
                            variantSize: v.size,
                            quantity: v.stock || 0,
                            lowStockThreshold: 10,
                            stockHistory: [{
                                previousQuantity: 0,
                                newQuantity: v.stock || 0,
                                reason: 'Initial stock creation',
                                changedAt: new Date()
                            }]
                        });
                        console.log(`[Stock Sync] ✅ Successfully created stock for ${v.size}`);
                    } catch (variantErr) {
                        console.error(`[Stock Sync] ❌ Failed for variant ${v.size}:`, variantErr.message);
                        // If it's a duplicate key error, we log it clearly
                        if (variantErr.code === 11000) {
                            console.error(`[Stock Sync] Duplicate Key Error: ${JSON.stringify(variantErr.keyValue)}`);
                        }
                    }
                }
            }

            const populatedProduct = await Product.findById(savedProduct._id)
                .populate('category_id')
                .populate('tag_id')
                .populate({
                    path: 'image_id',
                    model: 'images'
                });

            const formatted = formatProductWithImages(populatedProduct);

            res.status(201).json({
                status: 1,
                data: formatted,
                message: 'Product added successfully'
            });
        } catch (err) {
            console.error("[AddProduct Error]", err);
            res.status(400).json({ status: 0, message: formatError(err) });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid ObjectId format" });
            }

            const product = await Product.findById(id)
                .populate('category_id')
                .populate('tag_id')
                .populate({
                    path: 'image_id',
                    model: 'images',
                    select: 'filename path'
                });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json({ status: 1, data: formatProductWithImages(product) });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 0, message: 'Server error' });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.query;
            const { variants, image_id, ...rest } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            let updatedVariants = product.variants;
            if (variants && Array.isArray(variants)) {
                updatedVariants = variants.map(v => ({
                    _id: v._id || new mongoose.Types.ObjectId(),
                    size: v.size,
                    price: v.price ?? 0,
                    discountPercentage: v.discountPercentage ?? 0,
                    stock: v.stock ?? 0
                }));
            }

            const updateData = {
                ...rest,
                variants: updatedVariants
            };

            if (image_id) {
                updateData.image_id = Array.isArray(image_id) ? image_id : [image_id];
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true })
                .populate('category_id')
                .populate('tag_id')
                .populate({
                    path: 'image_id',
                    model: 'images'
                });

            // ✅ Sync stock entries for updated variants
            try {
                if (updatedProduct.variants && updatedProduct.variants.length > 0) {
                    for (const v of updatedProduct.variants) {
                        const existingStock = await Stock.findOne({ productId: id, variantId: v._id });

                        if (existingStock) {
                            if (existingStock.quantity !== v.stock || existingStock.variantSize !== v.size) {
                                const previousQuantity = existingStock.quantity;
                                existingStock.quantity = v.stock || 0;
                                existingStock.variantSize = v.size;

                                if (previousQuantity !== v.stock) {
                                    existingStock.stockHistory.push({
                                        previousQuantity,
                                        newQuantity: v.stock || 0,
                                        reason: 'Product update via admin',
                                        changedAt: new Date()
                                    });
                                }
                                await existingStock.save();
                            }
                        } else {
                            await Stock.create({
                                productId: id,
                                variantId: v._id,
                                variantSize: v.size,
                                quantity: v.stock || 0,
                                lowStockThreshold: 10,
                                stockHistory: [{
                                    previousQuantity: 0,
                                    newQuantity: v.stock || 0,
                                    reason: 'New variant stock creation',
                                    changedAt: new Date()
                                }]
                            });
                        }
                    }
                }
            } catch (stockSyncError) {
                console.error("[Stock Sync Error during Update]:", stockSyncError);
                // We don't fail the whole request here since the product itself was updated
            }


            console.log(updatedProduct);
            res.json({ status: 1, data: formatProductWithImages(updatedProduct) });
        } catch (error) {
            console.log("[Update Product Error]: ", error);
            res.status(400).json({ status: 0, message: formatError(error) });

        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            // Delete associated images from the images collection
            if (product.image_id && product.image_id.length > 0) {
                await Images.imageModel.deleteMany({ _id: { $in: product.image_id } });
            }

            // Delete associated stock entries to maintain data integrity
            await Stock.deleteMany({ productId: req.params.id });

            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getProducts: async (req, res) => {
        try {
            const { filter, rating, price, tag, page, limit } = req.query;
            let query = {};
            let sortOption = {};

            if (filter) {
                const map = { him: 'men', her: 'women', unisex: 'unisex' };
                const filtersArray = Array.isArray(filter) ? filter : filter.split(',');
                const categoryNames = filtersArray.map(f => map[f.toLowerCase()]).filter(Boolean);

                if (categoryNames.length > 0) {
                    const categories = await Category.find({ name: { $in: categoryNames } });
                    query.category_id = { $in: categories.map(c => c._id) };
                }
            }

            if (tag) {
                const tagsArray = Array.isArray(tag) ? tag : tag.split(',');
                const tags = await Tag.find({ name: { $in: tagsArray } });
                query.tag_id = { $in: tags.map(t => t._id) };
            }

            if (rating) {
                sortOption.rating = rating === 'asc' ? 1 : -1;
            }

            if (price) {
                sortOption['variants.0.price'] = price === 'asc' ? 1 : -1;
            }

            if (Object.keys(sortOption).length === 0) {
                sortOption.createdAt = -1;
            }

            const shouldPaginate = page !== undefined || limit !== undefined;
            const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
            const requestedLimit = parseInt(limit, 10) || 50;
            const parsedLimit = Math.min(Math.max(requestedLimit, 1), 50);
            const skip = (parsedPage - 1) * parsedLimit;

            let productsQuery = Product.find(query)
                .populate('category_id', 'name')
                .populate('tag_id', 'name')
                .populate({
                    path: 'image_id',
                    model: 'images',
                    select: 'filename path'
                })
                .sort(sortOption);

            if (shouldPaginate) {
                productsQuery = productsQuery.skip(skip).limit(parsedLimit);
            }

            const products = await productsQuery;
            const formattedProducts = products.map(p => formatProductWithImages(p));

            if (!shouldPaginate) {
                return res.json(formattedProducts);
            }

            const totalItems = await Product.countDocuments(query);
            const totalPages = Math.ceil(totalItems / parsedLimit) || 1;

            return res.json({
                status: 1,
                data: formattedProducts,
                pagination: {
                    page: parsedPage,
                    limit: parsedLimit,
                    totalItems,
                    totalPages,
                    hasMore: parsedPage < totalPages
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getTotalProducts: async (req, res) => {
        try {
            const totalProducts = await Product.countDocuments();
            res.status(200).json({ success: true, totalProducts });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get total products', error: error.message });
        }
    },

    getProductStats: async (req, res) => {
        try {
            const categories = await Category.find({ name: { $in: ['men', 'women', 'unisex'] } });
            const stats = { men: 0, women: 0, unisex: 0 };

            for (const cat of categories) {
                const count = await Product.countDocuments({ category_id: cat._id });
                stats[cat.name.toLowerCase()] = count;
            }

            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get product stats', error: error.message });
        }
    }
};

module.exports = productController;