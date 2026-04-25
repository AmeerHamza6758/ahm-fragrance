const express = require('express');
const router = express.Router();
const tagController = require('../controller/tag.controller');

router.post('/createTag', tagController.createTag);
router.get('/getTags', tagController.getTags);
router.get('/getTagById', tagController.getTagById);
router.put('/updateTag', tagController.updateTag);
router.delete('/deleteTag', tagController.deleteTag);

module.exports = router;
