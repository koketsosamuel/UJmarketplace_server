const jwt = require("jsonwebtoken")
const User = require("../models/User")
const config = require("../config/config")


module.exports = async (req, res, next) => {

  try {
    
    
    const token =  await req.headers.authorization.split(" ")[1]
    const decoded = await jwt.verify(token, config.tokenKey)
    req.user = decoded

    await User.findOne({_id: req.user._id}, (err, user) => {

      if(err || user == null) {        
        res.json({message: "Error accessing this route, please make sure you are logged in", error: true})
      } else if(user.banned) {
        res.json({message: "You were banned!", error: true})
      } else {
        next();
      }

    })

  } catch (error) {
    res.json({message: "Error accessing this route, please make sure you are logged in", error: true})
  }

}