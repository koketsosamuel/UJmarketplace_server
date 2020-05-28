const express = require("express")
const Router = express.Router()
const Report = require("../controllers/Report")
const auth = require("../services/authenticate")
const adminOnly = require("../services/adminOnly")

Router.post("/add", Report.add)
Router.get("/:id", auth, adminOnly, Report.getOne)
Router.get("/all/:page", auth, adminOnly, Report.getAll)
Router.post("/attend/:id", auth, adminOnly, Report.attend)
Router.delete("/remove/:id", auth, adminOnly, Report.remove)

module.exports = Router