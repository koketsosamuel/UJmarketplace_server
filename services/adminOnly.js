module.exports = (req, res, next) => {

  if(req.user.pos != 'admin') {
    //console.log(req.user)
    res.json({message: "Action not authorized", error: true})
  } else {
    next()
  }

}