const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // This ensures compatibility with some production environments
    rejectUnauthorized: false,
  },
});

// Verify the connection on startup to catch errors early
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer Verification Failed:", error.message);
  } else {
    console.log("Nodemailer is configured and ready for production");
  }
});

module.exports = transporter;