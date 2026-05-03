const Contact = require('../models/contact.model');

const contactController = {
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const contact = new Contact({ name, email, subject, message });
      await contact.save();
      res.status(201).json({ success: true, message: 'Message sent successfully', contact });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  getContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json({ success: true, data: contacts });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.query.id);
      if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
      res.json({ success: true, message: 'Contact message deleted successfully' });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};

module.exports = contactController;
