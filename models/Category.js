const mongoose = require('mongoose')

// SCHEMA
let categorySchema = new mongoose.Schema({

  name: {
    type: String,
    unique: true,
    required: true
  },

  expiration: {
    type: String,
    required: true
  },

  expirationDays: {
    type: Number,
    default: 120
  },

  image: {
    type: String,
    required: true
  }
  
})

//MODEL
let Category = mongoose.model('Category', categorySchema)

//EXPORT
module.exports = Category