const express = require('express')
const router = express.Router()
const Notification = require('../controllers/Notification')
const auth = require("../services/authenticate")
const upload = require("../services/upload")
const adminOnly = require("../services/adminOnly")

router.get('/one/:id', Notification.getOne)
router.get('/all', Notification.getAll)
router.post('/add', auth, adminOnly, upload.single("notificationImg"), Notification.addNotification)
router.put('/update/:id', auth, adminOnly, Notification.updateNotification)
router.put('/update/image/:id', auth, adminOnly,upload.single("notificationImg") , Notification.updateNotificationImage)
router.delete('/remove/:id', auth, adminOnly, Notification.removeNotification)

module.exports = router