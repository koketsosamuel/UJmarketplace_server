const express = require("express")
const bodyParser = require("body-parser")
const helmet = require("helmet")
const cors = require("cors")
const mongoose = require("mongoose")
const config = require("./config/config")

const app = express()


// REQUIRE SERVICES
const folderClean = require("./services/folderClean")
const removeExpired = require("./services/removeExpired")

// REQUIRE ROUTES
const user = require("./routes/User")
const ad = require("./routes/Ad")
const category = require("./routes/Category")
const campus = require("./routes/Campus")
const notification = require('./routes/Notification')
const total = require("./routes/Total")
const report = require("./routes/Report")

// MIDDLEWARE SETUP
app.use(helmet.xssFilter())
app.use(helmet.frameguard())
app.use(helmet.noSniff())
app.use(bodyParser.json())
app.use(cors())


// MONGO CONNECT
mongoose.set('useCreateIndex', true)
mongoose.set("useFindAndModify", false)
mongoose.connect(config.dbConnStr, {useNewUrlParser: true}, err => {
  if(err) console.log(err)
})

// STATIC FOLDER SETUP
app.use('/api/upload', express.static('./upload'))

// USE AND SETUP ROUTES
app.use("/api/user", user)
app.use("/api/ad", ad)
app.use("/api/category", category)
app.use("/api/campus", campus)
app.use("/api/notification", notification)
app.use("/api/totals", total)
app.use("/api/report", report)

app.use(express.static("./client"))
app.use(/.*/, (req, res) => {

  res.sendFile(__dirname + "/client/index.html")

})

// services
//folderClean(config.uploadDirTemp)
removeExpired()

let port  = process.env.PORT || config.serverPort

app.listen(port)