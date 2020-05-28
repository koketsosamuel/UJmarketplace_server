const fs = require("fs")

module.exports = (imageUrl) => {

  try {
    fs.unlink(imageUrl, err => {
      if(err) {
        return false
      }
      return false
    })
  } catch(err) {
    console.log(err)
  }

}