const mongoose = require('mongoose')


// CHILD SCHEMAS
let categorySchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },

  faIcon: {
    type: String,
    default: ""
  }
  
})


let noticeSchema =  new mongoose.Schema({
  title: String,
  body: String,
  date: Date
})


let campusSchema = new mongoose.Schema({
  
  name : {
    type: String,
    required: true
  },

  abv: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: false,
    default: "NULL"
  }

})


// SCHEMA
let setSchema = new mongoose.Schema({
  
  about: {
    type: String,
    required: true
  },

  quotes: {
    type: Array,
    default: []
  },

  category: [categorySchema],

  campus: [campusSchema]


})

//MODEL
let Settings = mongoose.model('model', setSchema)

//EXPORT
module.exports = Settings