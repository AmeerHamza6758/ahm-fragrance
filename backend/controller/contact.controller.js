const Contact = require('../models/contact.model');

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required fields" });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact inquiry sent successfully",
      data: savedContact
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contact inquiries", error: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact inquiry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, message: "Failed to delete contact inquiry", error: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact
};
