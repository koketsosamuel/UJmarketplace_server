const Ad = require("../models/Ad")
const Campus = require("../models/Campus")
const User = require("../models/User")
const Category = require("../models/Category")
const Report = require("../models/Report")
const Notification = require("../models/Notification")

let totals = {
  ads: null,
  campuses: null,
  categories: null,
  users: null,
  reports: null,
  newReports: null
}

module.exports = async (req, res) => {

  await Ad.estimatedDocumentCount((err, count) => {
    totals.ads = count
  })

  await Campus.estimatedDocumentCount((err, count) => {
    totals.campuses = count
  })

  await User.estimatedDocumentCount((err, count) => {
    totals.users = count
  })

  await Category.estimatedDocumentCount((err, count) => {
    totals.categories = count
  })

  await Report.estimatedDocumentCount((err, count) => {
    totals.reports = count
  })

  await Report.find({attended: false}, (err, docs) => {
    totals.newReports = docs.length
  })

  await Notification.estimatedDocumentCount((err, count) => {
    totals.notifications = count
  })
  
  res.json(totals)

}