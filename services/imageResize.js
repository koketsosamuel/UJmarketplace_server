const sharp = require("sharp")
const fs = require("fs")
const config = require("../config/config")

module.exports = async function optimize(inputUrl, outputUrl) {

  try {

    await sharp(inputUrl)
      .resize(config.imageResizeWidth)
      .toFile(outputUrl)

    fs.unlink(inputUrl, err => {
      return false
    })


  } catch(err) {
    console.log(err)
  }

}

