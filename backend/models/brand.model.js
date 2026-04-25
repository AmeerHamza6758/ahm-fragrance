const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: false
  },
  country:{
    type: String,
    required: false
  },
  address:{
    type: String,
    required: false
  },
  brandRating: {
    type : Number,
    default :0
  },
description:{
    type: String
},

}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
