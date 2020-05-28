const express = require('express')
const router = express.Router()
const Category = require('../controllers/Category')
const auth = require("../services/authenticate")
const adminOnly = require("../services/adminOnly")
const upload = require("../services/upload")


router.get('/one/:id', Category.getOne)
router.get('/all', Category.getAll)
router.put('/update/image/:id', auth, adminOnly, upload.single("categoryImg"), Category.updateCategoryImage)
router.put('/update/:id', auth, adminOnly,  Category.updateCategory)
router.post('/add',auth, adminOnly, upload.single("categoryImg"),  Category.addCategory)
router.delete('/remove/:id', auth, adminOnly, Category.removeCategory)

module.exports = router