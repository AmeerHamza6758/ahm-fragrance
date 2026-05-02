const express = require('express');
const router = express.Router();
const cmsController = require('../controller/cms.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Public access for frontend display
router.get('/:key', cmsController.getContent);

// Admin protected routes
router.get('/all/keys', authMiddleware, cmsController.getAllKeys);
router.post('/update', authMiddleware, cmsController.updateContent);

module.exports = router;
