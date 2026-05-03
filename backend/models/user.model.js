const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
   userName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   phone: {
      type: String,
      required: false
   },
   password: {
      type: String,
      required: true
   },
   gender: {
      type: String,
      required: false
   },
   dateOfBirth: {
      type: Date,
      required: false
   },
   otpCode: {
      type: String,
      default: null
   },
   otpType: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      default: null
   },
   otpExpiresAt: {
      type: Date,
      default: null
   },
   otpVerifiedAt: {
      type: Date,
      default: null
   },
   isEmailVerified: {
      type: Boolean,
      default: false
   },

   // otp: {
   //    type: Number,
   // },
   role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
   },
   address: {
      street: String,
      city: String,
      province: String,
      postalCode: String
   },
   isActive: {
      type: Boolean,
      default: true
   },
   resetToken: {
      type: String,
      default: null
   },
   resetTokenExpiresAt: {
      type: Date,
      default: null
   },
   isCircleMember: {
      type: Boolean,
      default: false
   },
   createdAt: (Date),
   updatedAt: (Date),
   
}, 
  { timestamps: true });
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;