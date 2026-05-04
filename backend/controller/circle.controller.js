const Circle = require('../models/circle.model');

const joinCircle = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if already joined
    const existing = await Circle.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "This email is already part of our Fragrance Circle" });
    }

    const newMember = new Circle({ email });
    await newMember.save();

    res.status(201).json({
      success: true,
      message: "Welcome to the Fragrance Circle!",
      data: newMember
    });
  } catch (error) {
    console.error("Error joining circle:", error);
    res.status(500).json({ success: false, message: "Failed to join circle", error: error.message });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await Circle.find().sort({ subscribedAt: -1 });
    res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error("Error fetching circle members:", error);
    res.status(500).json({ success: false, message: "Failed to fetch members", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Member ID is required" });
    }

    await Circle.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Member removed from Fragrance Circle"
    });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ success: false, message: "Failed to remove member", error: error.message });
  }
};

module.exports = {
  joinCircle,
  getAllMembers,
  removeMember
};
