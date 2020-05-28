const Ad = require("../models/Ad")
const imageRemove = require("./imageRemove")

async function remExp () {

  let allAds = []

  await Ad.find({}, (err, ads) => {

    allAds = ads

  })

  for(ad in allAds) {

    let advert = allAds[ad]

    // console.log(advert)

    if(advert.expiration == 'yes' && advert.expirationDays > 1) {

      let options = {
        expirationDays: Number(advert.expirationDays) - 1
      }

      Ad.updateOne({_id: advert._id}, options,  (err) => {
        return false
      })

    } else if(advert.expiration == 'yes' && advert.expirationDays <= 1) {

      Ad.findOneAndRemove({_id: advert._id}, (err, ad) => {
        if (!err) {
          
          for(let i = 0; i < ad.images.length; i++) {
            imageRemove(ad.images[i].path)
          }
  
        }
      })
    }

  }

}

module.exports = () => {

  setInterval(remExp, 1000 * 60 * 60 * 24)

}