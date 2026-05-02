const Faq = require('../models/faq.model');

const mongoose = require('mongoose');


const faqController = {
    addFaq: async (req, res) => {
        try {
            const { question, answer } = req.body;

            const faq = new Faq({
                question,
                answer
            });

            await faq.save();
            res.status(201).json({ status: 1, data: faq, message: 'FAQ added successfully' });
        } catch (err) {
            res.status(400).json({ status: 0, data: err.message, message: 'Error in FAQ creation' });
        }
    },

    getAllFaq: async (req, res) => {
        try {
            const faqs = await Faq.find().sort({ createdAt: -1 });

            res.status(200).json({
                status: 1,
                data: faqs,
                message: 'FAQs fetched successfully'
            });

        } catch (err) {
            res.status(500).json({
                status: 0,
                data: err.message,
                message: 'Error in fetching FAQs'
            });
        }
    },








    getFaqById: async (req, res) => {
        try {
            const { id } = req.query;

            const faq = await Faq.findById(id);

            if (!faq) {
                return res.status(404).json({ message: 'FAQ not found' });
            }

            res.json(faq);

        } catch (err) {
            res.status(400).json({ status: 0, data: err.message, message: 'Error in FAQ creation' });
        }
    },


    updateFaq: async (req, res) => {
        try {
            const { id } = req.query;
            const { question, answer } = req.body;

            const faq = await Faq.findById(id);

            if (!faq) {
                return res.status(404).json({ message: 'FAQ not found' });
            }

            faq.question = question;
            faq.answer = answer;

            await faq.save();
            res.json({ status: 1, data: faq, message: 'FAQ updated successfully' });

        } catch (err) {
            res.status(400).json({ status: 0, data: err.message, message: 'Error in FAQ update' });
        }
    },

    deleteFaq: async (req, res) => {
        try {
            const { id } = req.query;

            const faq = await Faq.findById(id);

            if (!faq) {
                return res.status(404).json({ message: 'FAQ not found' });
            }

            await Faq.findByIdAndDelete(id);
            res.json({ status: 1, message: 'FAQ deleted successfully' });

        } catch (err) {
            res.status(400).json({ status: 0, data: err.message, message: 'Error in FAQ deletion' });
        }
    }
};



module.exports = faqController;