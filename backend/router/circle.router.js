const express = require('express');
const router = express.Router();
const circleController = require('../controller/circle.controller');

router.post('/join', circleController.joinCircle);
router.get('/all', circleController.getMembers);
router.delete('/remove', circleController.removeMember);

module.exports = router;
