const mongoose = require("mongoose")

let visitSchema = new mongoose.Schema({
    
    date: {
        type: Date,
        default: Date.now
    }

})

let Visit = mongoose.model("Visit", visitSchema)
module.exports = Visit