const imageRemove = require("../services/imageRemove")
let Ad = require("../models/Ad")


module.exports = (req, res) => {
  
  
  Ad.find({seller: req.params.id}, (err, ads) => {
    if (err) {
      res.json({message: "Error finding ads", error: true}) 
    } else {
      
      for(let i = 0; i < ads.length; i++) {
        Ad.findOneAndRemove({_id: ads[i]._id}, (err, ad) => {
          
          if(ad.images.length > 0) {
            for(let x = 0; x < ad.images.length; x++) {
              imageRemove(ad.images[x].path)
            }
          }

        })
      }

    }
  })
}