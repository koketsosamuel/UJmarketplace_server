const mongoose = require("mongoose")

let reportSchema = new mongoose.Schema({

    message: String,
    ad: String,
    reporter: String,
    category: String,

    response: String,

    attendedBy: String,

    reporter: String,

    attended: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    }

})

let Report = mongoose.model("Report", reportSchema)
module.exports = Report