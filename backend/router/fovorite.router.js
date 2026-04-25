const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { toggleFavorite, getFavorites } = require("../controller/favorite.controller");

router.post('/toggle', authMiddleware, toggleFavorite);  
router.get('/get', authMiddleware, getFavorites);       

module.exports = router;