const mongoose = require('mongoose');
const Brand = require('../models/brand.model');

const brandController = {
    createBrand: async (req, res) => {
        try {
            const { brandName, country, address, description
            } = req.body;

            console.log("Request body:", req.body);



            const brand = new Brand({
                brandName, country, address, description
            });

            await brand.save();

            return res.status(201).json({
                message: 'Brand created successfully',
                brand
            });

        } catch (err) {
            console.error('Create Brand Error:', err.message);
            return res.status(500).json({ error: 'Server error. Could not create brand.' });
        }
    },







    getBrands: async (req, res) => {
        try {
            const brands = await Brand.find()
                .populate('product_id')
                .populate('category_id')
                .populate('account_id');
            res.json(brands);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBrandById: async (req, res) => {
        try {
            const brand = await Brand.findById(req.query.id)

            if (!brand) return res.status(404).json({ message: 'Brand not found' });
            res.json(brand);
        } catch (error) {
            res.status(400).json({ error: 'Invalid brand ID' });
        }
    },

    updateBrand: async (req, res) => {
        try {
            const { brandName, description, address, country } = req.body;

            const brand = await Brand.findByIdAndUpdate(
                req.query.id,
                { brandName, description, address, country },
                { new: true }
            );
            console.log(brand)


            if (!brand) return res.status(404).json({ message: 'Brand not found' });
            res.json(brand);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const brand = await Brand.findByIdAndDelete(req.query.id);
            if (!brand) return res.status(404).json({ message: 'Brand not found' });
            res.json({ message: 'Brand deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = brandController