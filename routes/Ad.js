const express = require('express')
const router = express.Router()
const Ad = require('../controllers/Ad')
const auth = require("../services/authenticate")
const upload = require("../services/upload")
const adminOrOwner = require("../services/adminOrOwnerAd")

// ROUTES
router.get('/one/:id', Ad.getOne)
router.get('/all/:page/:category/:campus', Ad.getAll)
router.get('/recent/:category', Ad.getRecent)
router.post('/add', auth, upload.array("adImages"), Ad.add)
router.delete('/rem/:id', auth, adminOrOwner, Ad.remove)
router.put('/update/:id', auth, adminOrOwner, Ad.update)
router.get('/myads/:page', auth, Ad.getMyAds)
router.put('/addpic/:id', auth, adminOrOwner, upload.single("image"), Ad.addPic)
router.post('/rempic/:id', auth, adminOrOwner, Ad.remPic)
router.get('/find/:query/:page', Ad.find)


// EXPORTATION
module.exports = router