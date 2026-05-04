const CMS = require('../models/cms.model');

const cmsController = {
  // Get content by key (public)
  getContent: async (req, res) => {
    try {
      const { key } = req.params;
      const content = await CMS.findOne({ key });
      if (!content) {
        return res.status(404).json({
          status: 0,
          message: 'Content not found'
        });
      }
      res.status(200).json({
        status: 1,
        data: content
      });
    } catch (error) {
      res.status(500).json({
        status: 0,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Update or Create content (admin)
  updateContent: async (req, res) => {
    try {
      const { key, title, content } = req.body;
      
      if (!key || !content) {
        return res.status(400).json({
          status: 0,
          message: 'Key and content are required'
        });
      }

      const updatedCMS = await CMS.findOneAndUpdate(
        { key },
        { title: title || '', content },
        { new: true, upsert: true }
      );

      res.status(200).json({
        status: 1,
        message: 'Content updated successfully',
        data: updatedCMS
      });
    } catch (error) {
      res.status(500).json({
        status: 0,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get all keys (admin)
  getAllKeys: async (req, res) => {
    try {
      const contents = await CMS.find({}, 'key title');
      res.status(200).json({
        status: 1,
        data: contents
      });
    } catch (error) {
      res.status(500).json({
        status: 0,
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = cmsController;
