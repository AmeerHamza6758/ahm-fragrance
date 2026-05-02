const CMS = require('../models/cms.model');

const cmsController = {
  // Get content by key
  getContent: async (req, res) => {
    try {
      const { key } = req.params;
      let content = await CMS.findOne({ key });
      
      if (!content) {
        // Return empty structure if not found
        return res.status(200).json({
          status: 1,
          data: { key, title: '', content: '' },
          message: 'Content not initialized'
        });
      }

      res.status(200).json({
        status: 1,
        data: content,
        message: 'Content fetched successfully'
      });
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  },

  // Create or Update content
  updateContent: async (req, res) => {
    try {
      const { key, title, content } = req.body;

      if (!key || !title || !content) {
        return res.status(400).json({ status: 0, message: 'Missing required fields' });
      }

      let cmsItem = await CMS.findOneAndUpdate(
        { key },
        { title, content },
        { new: true, upsert: true }
      );

      res.status(200).json({
        status: 1,
        data: cmsItem,
        message: `${title} updated successfully`
      });
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  },

  // Get all CMS keys (for admin overview)
  getAllKeys: async (req, res) => {
    try {
      const contents = await CMS.find({}, 'key title updatedAt');
      res.status(200).json({ status: 1, data: contents });
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  }
};

module.exports = cmsController;
