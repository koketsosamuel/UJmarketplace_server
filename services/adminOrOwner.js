module.exports = (req, res, next) => {

  if(req.user.pos == 'admin' || req.user._id == req.params.id) {
    //console.log("yep")
    next()
  } else {
    res.json({message: "Action not authorized", error: true})
  }
  

}