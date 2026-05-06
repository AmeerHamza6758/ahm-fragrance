    const express = require('express');
const router = express.Router();
const faqController = require('../controller/faq.controller');

router.post('/addFaq', faqController.addFaq);
router.get('/getFaqById', faqController.getFaqById);
router.put('/updateFaq/:id', faqController.updateFaq);
router.delete('/deleteFaq/:id', faqController.deleteFaq);
router.get('/getAllFaq', faqController.getAllFaq);
module.exports = router;
