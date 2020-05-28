const express = require('express')
const router = express.Router()
const Campus = require('../controllers/Campus')
const auth = require("../services/authenticate")
const upload = require("../services/upload")
const adminOnly = require("../services/adminOnly")

router.get('/one/:id', Campus.getOne)
router.get('/all', Campus.getAll)
router.post('/add', auth, adminOnly, upload.single("campusImg"),Campus.addCampus)
router.delete('/remove/:id', auth, adminOnly, Campus.removeCampus)
router.put('/update/:id', auth, adminOnly, Campus.updateCampus)
router.post('/update/image/:id', auth, adminOnly, upload.single("campusImg"), Campus.updateCampusImage)

module.exports = router