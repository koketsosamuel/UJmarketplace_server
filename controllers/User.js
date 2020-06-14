const jwt = require("jsonwebtoken")
const config = require("../config/config")
const removeUserAds = require("../services/removeUserAds")
const mail = require("../services/email")

let User = require("../models/User")
let Ad = require("../models/Ad")

module.exports = {

    // register
    register: async (req, res) => {

      let position = req.body.pos

      let htmlBody

      if(position != 'employee' && position != 'student') {

        if(position == config.adminPhrase) {
          position = 'admin'
        } else {
          position = 'other'
        }

      }

      let user = {
        name: req.body.name,
        studentNo: req.body.studentNo,
        email: req.body.email,
        password: req.body.password,
        whatsAppNo: req.body.whatsAppNo,
        cellNo: req.body.cellNo,
        campus: req.body.campus,
        pos: position
      }

      let token = await jwt.sign(user, config.emailVerificationKey, {expiresIn: "2h"})
      console.log(token, "@@")

      htmlBody = `
      
      <body>

        <div>
          <p>Welcome to the UJmarketplace</p>
          <p>Please verify your email by clicking on the link below</p>
          <a href="${config.server}/verifyemail/${token}">Verify Email</a> 
        </div>

      </body>

      `

      let mailSent = await mail(req.body.email, "UJmarketplace: Verify Email", htmlBody)
      if(mailSent) res.json({error: false, message: `Please verify your email. A link has been sent to ${req.body.email}`})
      res.json({error: true, message: "Please try again"})
      
    },

    verifyemail: async (req, res) => {

      let htmlBody = `
      
        <h1>Email Verified</h1>
        <p>You can now login and sell!</p>

      `

      let user = await jwt.verify(req.params.token, config.emailVerificationKey)

      let newUser = new User(user)
      
      newUser.save(async err => {
        if(err) {
          res.json({message: "Unable to register", error: true, err})
        } else {
          await mail(req, res, req.body.email, "Welcome to UJmarketplace", htmlBody)
          res.json({message: "Successfully registered, you can now login", error: false})
        }
      })

    },

    // get user info
    getSeller: (req, res) => {

      User.findOne({_id: req.params.id}, (err, user) => {
        if(err || user == null) {
          res.json({message: "Seller info not found", error: true})
        } else {
          res.json({message: "Seller found", error: false, seller: {
            email: user.email,
            pos: user.pos,
            whatsAppNo: user.whatsAppNo,
            cellNo: user.cellNo,
            campus: user.campus
          }})
        }
      })

    },

    // get profile info
    getProfile: (req, res) => {

      User.findOne({_id: req.user._id}, (err, user) => {
        if(err || user == null) {
          res.json({message: "User info not found", error: true})
        } else {
          res.json({message: "User found", error: false, profile: {
            email: user.email,
            pos: user.pos,
            whatsAppNo: user.whatsAppNo,
            cellNo: user.cellNo,
            campus: user.campus,
            name: user.name,
            studentNo: user.studentNo,
            _id: user._id
          }})
        }
      })

    },

     // update profile
     updateProfile: (req, res) => {
      
      let conditions = {
        _id: req.user._id
      }

      let update

      if(req.body.update == 'profile') {
      
        update = {
          name: req.body.values.name,
          email: req.body.values.email,
          whatsAppNo: req.body.values.whatsAppNo,
          cellNo: req.body.values.cellNo,
          campus: req.body.values.campus
        }
        
        User.updateOne(conditions, update,  (err) => {
          if (err) {
            res.json({message: "Error updating profile", error: true, err})
          } else {
            res.json({message: "Profile updated", error: false})
          }
        })

      } else if(req.body.update == 'position') {

        let position = req.body.values.pos

        if(position != 'employee' && position != 'student') {

          if(position == config.adminPhrase) {
            position = 'admin'
          } else {
            position = 'other'
          }

        }

        update = {
          pos: position
        }

        User.updateOne(conditions, update,  (err) => {
          if (err) {
            res.json({message: "Error updating position", error: true, err})
          } else {
            res.json({message: "Position updated", error: false})
          }
        })

      }

      
    },

    // password reset
    pwdChange: (req, res) => {

      User.findOne({_id: req.user._id}, (err, user) => {

        if(err || user == null || !user) {
          res.json({message: "Unexpected error", error: true, err})
        } else {

          if(user.password == req.body.oldPwd) {

            User.updateOne({_id: req.user._id}, {password: req.body.newPwd}, err => {
              if(err) {
                res.json({message: "Unexpected error", error: true, err})
              } else {
                res.json({message: "Password changed", error: false})
              }
            })

          } else {
            res.json({message: "Incorrect old password", error: true})
          }

        }

      })

    },


    // user login
    login: (req, res) => {

      User.findOne({studentNo: req.body.studentNo}, (err, user) => {

        if (!user || err || user == null)  {
          res.json({message: "Not registered, register first or check if you entered the correct credentials", error: true})
        } else if(user.banned) {
          res.json({message: "You have been banned!", error: true})
        } else if(user.password == req.body.password) {
      
          jwt.sign({
             
            email: user.email,
            name: user.name,
            _id: user._id,
            pos: user.pos,
            banned: user.banned
            
          }, config.tokenKey,{expiresIn: "365 days"}, function(err, token) {
            res.status(200).json({message: "Logged In", error: false, token, authData: {pos: user.pos, name: user.name, _id: user._id}}) 
      

          })

        } else {
          res.json({message: "Incorrect password", error: true})
        }
          
      })


    },

    // retrieve users
    getAllUsers: (req, res) => {

      let perPage = 20
      let page = Number(req.params.page) || 1

      // console.log(req.body.query)

      
      User
        .find({})
        .sort(req.body.sort)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
          User.countDocuments().exec(function(err, count) {
              if (err) {
                res.json({message: "Error finding users", error: true})
              } else {

                let results = {
                  users,
                  page,
                  pages: Math.ceil(count / perPage)
                }

                // console.log(results)
  
                res.json(
                  {results, error: false}
                )
              }
          })
          })
  

    },


    // remove user
    removeUser: (req, res) => {
      
      User.findOneAndRemove({_id: req.params.id}, (err) => {
        if (err) {
          res.json({message: "Error removing user", error: true})          
        } else {
          removeUserAds(req, res)
          res.json({message: "User Successfully removed", error: false})
        }
      })
      

    },


    // reset password
    resetLink: (req,res) => {


      User.findOne({studentNo: req.body.sNo}, (err,user) => {

        if(err || !user ||user == null) {

          res.json({message: "Account not found", error: true}) 

        } else {

          jwt.sign({             
            email: user.email,
            _id: user._id,
            purpose: "PWDRESET"        
          }, config.emailTokenKey,{expiresIn: "1h"}, async (err, token) => {

            let htmlBody = `
      
            <body>
            
              <div>                
                <p>Click on the link below to reset password</p>
                <a href="${config.server}/pwdreset/${token}"> Reset Password</a>
                <p>If you received this message by mistake. Kindly ignore this email</p>
              </div>

            </body>

            `
            
            let email = await mail(user.email, "Password Reset", htmlBody)

            
          })    

        }

      })

      
    },

    resetPwd: async (req, res) => {

      let token = req.params.token
      let pwd = req.body.pwd

      jwt.verify(token, config.emailTokenKey, (err, decoded) => {

        if (err) {
          res.json({message: "Error accessing this route, your link might have expired, generate a new one", error: true})
        } else {

          User.findOneAndUpdate({email: decoded.email}, {password: pwd}, (err, user) => {

            if(err || !user || user == null) {
              res.json({message: "Error finding data that relates to your link, link could have expired", error: true})
            } else {
              res.json({message: "Your password reset was successful", error: false})
            }

          })

        }
      })

    },

    find: (req, res) => {

      let page = req.params.page || 1
      let pages = 0
      let perPage = 10
      var users = []

      User.search(req.params.query, (err, response) => {

        for(let i = 0; i < response.length; i++) {
          users.push(response[i])
        }

        pages = Math.ceil(users.length / perPage)

        if(pages <= 1) {
          res.json({page: 1, pages, users: users})
        } else if(pages > 1 && page < pages) {
    
          let tUsers = []
    
          for(let i = ((page*perPage) -  1); i < (page*perPage); i++) {
            tUsers.push(users[i])
          }
    
          res.json({page, pages, users: tUsers})
    
        } else if(page == pages) {
    
          let tUsers = []
    
          for(let i = ((page*perPage) -  1); i < users.length; i++) {
            tUsers.push(users[i])
          }
    
          res.json({page, pages, users: tUsers})
    
        }

      })
  
    },

    stroke: async (req, res) => {

      let strokedUser = await strokeUser(req.params.id)
      
      if(strokeUser.banned) {
        
        let adsDeleted = false
        let mailSent = false
        let body = `
        
          <p>After multiple reports on the entities thou hast posted we have decided to ban thee off our platform.</p>
          <p>Please note, all your products have been removed as well</p>


        `
      
        await removeUserAds(req, res)
        if(adsDeleted) mailSent = await mail(strokedUser.email, "You have been banned", body)
        if(mailSent) res.json({error: false, message: "User Banned!"})

      } else if(strokedUser) {
        res.json({error: false, message: "User stroked!"})
      } else {
        res.json({error: true, message: "Unexpected Error!"})
      }

    }


}


// FUNCTIONS
async function strokeUser(id) {

  let strokes
  let updateQuery = {}
  let userData

  await User.findOne({_id: id}, (err, user) => {

    if(!err) {
      strokes = user.strokes
      userData = user
    } else {
      return false
    }

  })

  updateQuery.strokes = strokes + 1
  updateQuery.banned = false

  if(strokes >= 3) updateQuery.banned = true

  userData.banned = updateQuery.banned

  User.updateOne({_id: id}, updateQuery, err => {
    if(err) return false
    return userData
  })

}