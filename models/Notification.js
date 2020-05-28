const mongoose = require("mongoose")

let notificationSchema = new mongoose.Schema({

  title: String,

  image: {
    type: String,
    required: true
  },

  link: {
    type: String,
    default: "javascript:void(0)"
  },

  created: {
    type: Date,
    default: Date.now
  }

})

let Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification