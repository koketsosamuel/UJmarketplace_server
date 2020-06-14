const express = require("express")
const router = express.Router()
const user = require("../controllers/User")
const auth = require('../services/authenticate')
const adminOnly = require("../services/adminOnly")
const adminOrOwner = require("../services/adminOrOwner")


//add user
router.post("/register", user.register)

//user login
router.post("/login", user.login)

// verify email and add user
router.post("/verify/:token", user.verifyemail)

//remove user
router.delete("/rem/:id", auth, adminOrOwner, user.removeUser)

//reset password link
router.post('/resetlink', user.resetLink)

//reset 
router.post('/reset/:token', user.resetPwd)

//get all
router.post('/all/:page', auth, adminOnly, user.getAllUsers)

//get seller info
router.get('/seller/:id', user.getSeller)

//get profile
router.get('/profile', auth, user.getProfile)

//change password
router.post('/passwordchange', auth, user.pwdChange)

//update profile
router.post('/profileupdate', auth, user.updateProfile)

//find user
router.get('/find/:query/:page', auth, adminOnly, user.find)

//stroke user 
router.put('/stroke/:id', auth, adminOnly, user.stroke)

module.exports = router