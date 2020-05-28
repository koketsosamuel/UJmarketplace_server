const mongoose = require("mongoose")
const searchable = require("mongoose-regex-search")

// SCHEMA
let productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    searchable: true,
    index: true
  },

  images: {
    type:[Object]
  },

  price: {
    type: Number,
    required: true
  },

  campus: {
    type: String,
    required: true,
    searchable: true,
    index: true
  },

  category: {
    type: String,
    required: true
  },

  seller: {
    type: String,
    required: true
  },

  expiration: {
    type: String,
    required: true
  },

  expirationDays: Number,

  quantity: {
    type: Number,
    default: 1
  },

  added: {
    type: Date,
    default: Date.now
  },

  description: {
    type: String,
    default: "No description given"
  }

})

productSchema.plugin(searchable)

let Product = mongoose.model("Product", productSchema)
module.exports = Product