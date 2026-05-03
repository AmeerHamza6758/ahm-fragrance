const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact.controller');

router.post('/submit', contactController.submitContact);
router.get('/all', contactController.getContacts);
router.delete('/delete', contactController.deleteContact);

module.exports = router;
