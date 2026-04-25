const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Images = require('../models/images.model');
const mongoose = require('mongoose');


const productController = {
    addProduct: async (req, res) => {
        try {
            const { name, price, discountPrice, description, brand_id, category_id, tag_id, image_id, variants  } = req.body;

            const product = new Product({
                name,
                price,
                discountPrice,
                description,
                brand_id,
                category_id,
                tag_id,
                image_id,
                variants 
            });

            await product.save();
            res.status(201).json({ status: 1, data: product, message: 'Product added successfully' });
        } catch (err) {
            res.status(400).json({ status: 0, data: err.message, message: 'Error in product creation' });
        }
    },


    // getProductById: async (req, res) => {
    //     try {
    //         const product = await Product.findById(req.query.id)
    //             .populate('brand_id')
    //             .populate('category_id')
    //             .populate('tag_id')
    //             .populate('image_id');
    //         if (!product) return res.status(404).json({ message: 'Product not found' });
    //         res.json(product);
    //     } catch (err) {
    //         res.status(400).json({ error: 'Invalid product ID' });
    //     }
    // },





    getProductById: async (req, res) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid ObjectId format" });
            }

            const product = await Product.findById(id)
                .populate('brand_id')
                .populate('category_id')
                .populate('tag_id')
                // .populate('image_id');
                .populate({
                    path: 'image_id',
                    model: 'images',   // 👈 force correct model name
                    select: 'filename path'
                })
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(product);

        } catch (err) {
            console.log(err); // 🔥 IMPORTANT
            res.status(500).json({ error: 'Server error' });
        }
    },


    // updateProduct: async (req, res) => {
    //     try {
    //         const { id } = req.query;
    //         const { price, discountPercentage, ...rest } = req.body;

    //         if (!id) {
    //             return res.status(400).json({ message: 'Product ID is required' });
    //         }

    //         const product = await Product.findById(id);

    //         if (!product) {
    //             return res.status(404).json({ message: 'Product not found' });
    //         }

    //         // 🔹 Use existing values if not provided
    //         const finalPrice = price ?? product.price;
    //         const finalDiscount = discountPercentage ?? product.discountPercentage ?? 0;

    //         // 🔹 Calculate current price
    //         const currentPrice = finalPrice - (finalPrice * finalDiscount / 100);

    //         const updatedProduct = await Product.findByIdAndUpdate(
    //             id,
    //             {
    //                 ...rest,
    //                 price: finalPrice,
    //                 discountPercentage: finalDiscount,
    //                 currentPrice
    //             },
    //             { new: true }
    //         );

    //         res.json(updatedProduct);

    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },




    updateProduct: async (req, res) => {
    try {
        const { id } = req.query;
        const { price, discountPercentage, variants, ...rest } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const finalPrice = price ?? product.price;
        const finalDiscount = discountPercentage ?? product.discountPercentage ?? 0;

        let updatedVariants = product.variants;

        if (variants && Array.isArray(variants)) {
            updatedVariants = variants.map(v => {
                const vPrice = v.price ?? 0;
                const vDiscount = v.discountPercentage ?? 0;

                return {
                    size: v.size,
                    price: vPrice,
                    discountPercentage: vDiscount
                };
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...rest,
                price: finalPrice,
                discountPercentage: finalDiscount,
                variants: updatedVariants
            },
            { new: true }
        );

        res.json(updatedProduct);

    } catch (error) {
        res.status(500).json({ error: error.message });
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
            const { filter, rating, price, tag } = req.query;

            let query = {};
            let sortOption = {};

            // 🔹 CATEGORY FILTER (him/her/unisex)
            if (filter) {
                const map = {
                    him: 'men',
                    her: 'women',
                    unisex: 'unisex'
                };

                const filtersArray = Array.isArray(filter)
                    ? filter
                    : filter.split(',');

                const categoryNames = filtersArray
                    .map(f => map[f.toLowerCase()])
                    .filter(Boolean);

                if (categoryNames.length > 0) {
                    const categories = await Category.find({
                        name: { $in: categoryNames }
                    });

                    query.category_id = {
                        $in: categories.map(c => c._id)
                    };
                }
            }

            // 🔹 TAG FILTER
            if (tag) {
                const tagsArray = Array.isArray(tag) ? tag : tag.split(',');

                const tags = await Tag.find({
                    name: { $in: tagsArray }
                });

                query.tag_id = {
                    $in: tags.map(t => t._id)
                };
            }

            // 🔹 SORTING: RATING
            if (rating) {
                sortOption.rating = rating === 'asc' ? 1 : -1;
            }

            // 🔹 SORTING: PRICE
            if (price) {
                sortOption.price = price === 'asc' ? 1 : -1;
            }

            // 🔹 DEFAULT SORT (if nothing provided)
            if (Object.keys(sortOption).length === 0) {
                sortOption.createdAt = -1;
            }

            // 🔹 FINAL QUERY
            const products = await Product.find(query)
                .populate('brand_id', 'brandName')
                .populate('category_id', 'name')
                .populate('tag_id', 'name')
                // .populate('image_id', 'filename path')
                .populate({
                    path: 'image_id',
                    model: 'images',   // 👈 force correct model name
                    select: 'filename path'
                })
                .sort(sortOption);

            res.json(products);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}

module.exports = productController;