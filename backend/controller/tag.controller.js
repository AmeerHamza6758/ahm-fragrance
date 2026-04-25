const Tag = require('../models/tag.model');
const tagController = {
  createTag: async (req, res) => {
    try {
      const { name, description } = req.body;
      const tag = new Tag({ name, description });
      await tag.save();
      res.status(201).json(tag);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getTags: async (req, res) => {
    try {
      const tags = await Tag.find();
      res.json(tags);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getTagById: async (req, res) => {
    try {
      const tag = await Tag.findById(req.query.id);
      if (!tag) return res.status(404).json({ message: 'Tag not found' });
      res.json(tag);
    } catch (err) {
      res.status(400).json({ error: 'Invalid tag ID' });
    }
  },

  updateTag: async (req, res) => {
    try {
      const { name, description } = req.body;
      const tag = await Tag.findByIdAndUpdate(
        req.query.id,
        { name, description },
        { new: true }
      );
      if (!tag) return res.status(404).json({ message: 'Tag not found' });
      res.json(tag);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteTag: async (req, res) => {
    try {
      const tag = await Tag.findByIdAndDelete(req.query.id);
      if (!tag) return res.status(404).json({ message: 'Tag not found' });
      res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

}

module.exports = tagController;