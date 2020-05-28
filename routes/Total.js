const express = require('express')
const router = express.Router()
const Total = require('../controllers/Total')
const auth = require("../services/authenticate")

router.get("/", auth, Total)

module.exports = router