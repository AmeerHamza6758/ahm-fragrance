const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact.controller');

router.post('/create', contactController.createContact);
router.get('/all', contactController.getAllContacts);
router.delete('/delete', contactController.deleteContact);

module.exports = router;
