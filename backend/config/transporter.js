const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
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