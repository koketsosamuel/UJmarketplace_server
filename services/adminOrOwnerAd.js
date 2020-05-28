const Ad = require("../models/Ad")

module.exports = (req, res, next) => {

  Ad.findOne({_id: req.params.id}, (err, ad) => {

    if(req.user.pos == 'admin' || req.user._id == ad.seller) {
      next()
    } else {
      res.json({message: "Action not authorized", error: true})
    }

  })

}