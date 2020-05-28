let Setting = require("../models/Setting")

module.exports = {


  addSetting: (req, res) => {

    let newSetting = new Setting({

      about: req.body.about,

    })

    newSetting.save()
      .then(() => res.status(201).json({message: "Settings object created", error: false}))
      .catch(err => res.status(201).json({message: "Error creating settings object", error: true}))

  }


}