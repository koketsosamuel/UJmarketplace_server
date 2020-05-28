const mongoose = require("mongoose")

let messageSchema = new mongoose.Schema({

    senderEmail: {
        type: Sting,
        required: true
    },

    senderCellNo: String,

    message: {
        type: String,
        required: true
    },

    responded: {
        type: Boolean,
        default: false
    },

    response: String,

    read: {
        type: Boolean,
        default: false
    },
    
    date: {
        type: Date,
        default: Date.now
    }

})

let Message = mongoose.model("Message", messageSchema)
module.exports = Message