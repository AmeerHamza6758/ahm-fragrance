const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboard.controller');

router.get('/graphs', dashboardController.getGraphData);
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
