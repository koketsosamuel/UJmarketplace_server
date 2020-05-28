const fs = require("fs")
const path = require("path")
const imageRemove = require("./imageRemove")

module.exports = (folder) => {

  setInterval(()=> {

    fs.readdir(folder, (err, files) => {

      if(files.length > 0) {

        for(const file in files) {
          imageRemove(path.join(folder, files[file]))
        }
        
      }
      
    })

  }, 1000 * 60 * 60 * 24)

}