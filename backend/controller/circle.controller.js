const Circle = require('../models/circle.model');
const User = require('../models/user.model');

const circleController = {
  joinCircle: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

      // Check if already in circle
      const existing = await Circle.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'You are already a member of the Fragrance Circle' });

      const member = new Circle({ email });
      await member.save();

      // Tag existing user as member if they exist
      await User.findOneAndUpdate({ email }, { isCircleMember: true });

      res.status(201).json({ success: true, message: 'Welcome to the Fragrance Circle!' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getMembers: async (req, res) => {
    try {
      const members = await Circle.find().sort({ subscribedAt: -1 });
      res.json({ success: true, data: members });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  removeMember: async (req, res) => {
    try {
      const member = await Circle.findByIdAndDelete(req.query.id);
      if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
      
      // Untag user if they exist
      await User.findOneAndUpdate({ email: member.email }, { isCircleMember: false });
      
      res.json({ success: true, message: 'Member removed successfully' });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};

module.exports = circleController;
