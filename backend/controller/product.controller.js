const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Images = require('../models/images.model');
const mongoose = require('mongoose');

const formatError = (err) => {
    if (err.name === 'ValidationError') {
        return Object.values(err.errors).map(val => val.message).join(', ');
    }
    if (err.code === 11000) {
        return 'A fragrance with this name already exists';
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
                variants
            });

            await product.save();
            const populatedProduct = await Product.findById(product._id)
                .populate('category_id')
                .populate('tag_id')
                .populate({
                    path: 'image_id',
                    model: 'images'
                });

            res.status(201).json({ 
                status: 1, 
                data: formatProductWithImages(populatedProduct), 
                message: 'Product added successfully' 
            });
        } catch (err) {
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
                    size: v.size,
                    price: v.price ?? 0,
                    discountPercentage: v.discountPercentage ?? 0
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

            res.json({ status: 1, data: formatProductWithImages(updatedProduct) });
        } catch (error) {
            res.status(400).json({ status: 0, message: formatError(error) });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
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