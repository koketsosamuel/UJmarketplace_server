const mongoose = require("mongoose")
const searchable = require("mongoose-regex-search")

let userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    searchable: true,
    index: true
  },

  studentNo: {
    type: Number,
    unique: true,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    searchable: true,
    index: true
  },

  password: {
    type: String,
    required: true
  },

  whatsAppNo: {
    type: String,
    searchable: true,
    index: true
  },

  cellNo: {
   type: String,
   searchable: true,
   index: true
  },

  campus: {
    type: String,
    required: true,
    searchable: true,
    index: true
  },

  pos: {
    type: String,
    required: true,
    searchable: true,
    index: true
  },

  joined: {
    type: Date,
    default: Date.now
  },

  banned: {
    type: Boolean,
    default: false
  },

  strokes: {
    type: Number,
    default: 0
  }

})

userSchema.plugin(searchable)

let User = mongoose.model("User", userSchema)
module.exports = User