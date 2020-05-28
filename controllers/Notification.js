let Notification = require("../models/Notification")
const imageRemove = require("../services/imageRemove")

module.exports = {


  addNotification: (req, res) => {

    let newNotification = new Notification({

      title: req.body.title,
      link: req.body.link,
      image: req.file.path

    })

    newNotification.save(err => {
      
      if(err) {
        console.log(err)
        res.json({message: "Error making notification", error: true})
      } else {
        res.json({message: "Notification successfully made", error: false})
      }

    })

  },

  removeNotification: (req, res) => {

    Notification.findByIdAndDelete(req.params.id, (err) => {
      
      if(err) {
        res.json({message: `Error removing notification`, error: true})
      } else {
        res.json({message: `notification has been removed`, error: false})
      }

    })

  },


  getAll: (req, res) => {

    Notification.find({})
                .sort({created: -1}) 
                .exec((err, notifications) => {
                  if(err) {
                    res.json({message: 'Error fetching notifications', error: true})
                  } else {
                    res.json({message: 'fetch notifications successful', notifications, error: false})
                  }
                })

  },

  getOne: (req, res) => {

    Notification.findOne({_id: req.params.id}, (err, notification) => {
      if(err) {
        res.json({message: `Error fetching notification`, error: true})
      } else {
        res.json({message: `notification fetched successfully`, notification, error: false})
      }
    })

  },
  

  updateNotification: (req, res) => {

    let updateValues = {
      title: req.body.title,
      shortDesc: req.body.shortDesc,
      notification: req.body.notification
    }

    Notification.findOneAndUpdate({_id: req.params.id}, updateValues, (err) => {
      if(err) {
        res.json({message: `Error updating notification`, error: true})
      } else {
        res.json({message: `Notification updated successfully`, error: false})
      }
    })

  },

  updateNotificationImage: (req, res) => {

    Notification.findOneAndUpdate({_id: req.params.id}, {image: req.file.path}, (err, cat) => {
      if(err) {
        console.log(err)
        res.json({message: `Error updating notification image`, error: true})
      } else {
        imageRemove(cat.link)
        res.json({message: `Notification image updated`, error: false})
      }
    })

  }


}