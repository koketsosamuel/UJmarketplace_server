let Ad = require("../models/Ad")
let Category = require('../models/Category')
let User = require('../models/User')
let imageResize = require("../services/imageResize")
const imageRemove = require("../services/imageRemove")
const config = require("../config/config")

module.exports = {
  
  // add Ad
  add: (req, res) => {

    
    let images = []
    let expiration
    let expirationDays
    let resizedDir
    
    for(let i = 0; i < req.files.length; i++) {
     
      resizedDir = config.uploadDir+req.files[i].filename

      imageResize(req.files[i].path, resizedDir)
      images.push({path: resizedDir, name: req.files[i].filename})

    }

    // find user and set campus
    User.findOne({_id: req.user._id}).exec((err, user) => {

      if(err || user == null) {
        res.json({message: "Error identifying you", error: true})
      } else {

        let campus = user.campus

        // find category and set expiration details
        Category.findOne({_id: req.body.categoryId}, (err, category) => {
      
          if(err || category == null) {
            res.json({message: "Post not added, please fill all the fields", error: true})
          } else {
    
            expiration = category.expiration || "yes"
            expirationDays = category.expirationDays || 120

            // save ad
            let newAd = new Ad({
              name: req.body.name,
              price: Number(req.body.price),
              description: req.body.description,
              images: images,
              campus: campus,
              category: req.body.categoryId,
              seller: req.user._id,  
              expiration: expiration,
              expirationDays: expirationDays
            })
            
            newAd.save(err => {
              if(err) {
                res.json({message: err.message, error: true})
              } else {
                res.json({message: "Ad added", error: false})
              }
            })

          }
      
        })

      }

    })
  
  
  },


  getOne: (req, res) => {

    Ad.findOne({_id: req.params.id}, (err, ad) => {
      
      if (err) {
        res.json({message: err, error: true})
      } else {
        res.json({message: "ad fetched sucessfully", ad, error: false})
      }

    })
  
  },


  getMyAds: (req, res) => {

    let perPage = 20
    let page = req.params.page || 1

    let conditions = {seller: req.user._id}

    Ad
      .find(conditions)
      .sort({added: -1})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, ads) {
        Ad.find(conditions).exec(function(err, docs) {

          let count = docs.length

          if (err) {
            res.json({message: "Error counting ads", error: true})
          } else {

            let results = {
              ads,
              page,
              pages: Math.ceil(count / perPage)
            }

            res.status(200).json(
              results
            )

          }
        })
      })

  },


  getAll: (req, res) => {
      
    let perPage = 12
    let page = req.params.page || 1
    let campus = req.params.campus
    let category =  req.params.category
    let conditions

    if(campus == "all" && category == "all") {
      conditions = {}
    } else if(campus == "all" && category != "all") {
      conditions = {category: category}
    } else if(campus != "all" && category == "all") {
      conditions = {campus: campus} 
    } else if(campus != "all" && category != "all") {
      conditions = {campus: campus, category:category} 
    } else {
      conditions = {
        
      }
    }
    
    Ad
      .find(conditions)
      .sort({added: -1})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, ads) {
        Ad.find(conditions).exec(function(err, docs) {

          let count = docs.length

          if (err) {
            res.json({message: "Error finding ads", error: true})
          } else {

            let results = {
              ads,
              page,
              pages: Math.ceil(count / perPage)
            }

            res.status(200).json(
              results
            )
            
          }
        })
      })

  },


  remove: (req, res) => {

    let conditions = {
      _id: req.params.id
    }
    
    Ad.findOneAndRemove(conditions, (err, ad) => {
      if (err) {
        res.json({message: "Error removig Ad", error: true})      
      } else {
        
        for(let i = 0; i < ad.images.length; i++) {
          imageRemove(ad.images[i].path)
        }

        res.status(200).json({message: "Ad removed", error: false})        
      }
    })
    

  },

  update: async (req, res) => {
    
    let conditions = {
      _id: req.params.id
    }

    let expiration = null
    let expDays = null

    await Category.findOne({_id: req.body.category}, (err, category) => {

      expiration = category.expiration
      expDays = category.expirationDays

    })
    
    let update = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
      expiration: expiration,
      expirationDays: expDays
    }
    
    Ad.updateOne(conditions, update,  (err) => {
      if (err) {
        res.json({message: "Error updating ad", error: true, err})
      } else {
        res.json({message: "Ad updated", error: false})        
      }
    })
    
  },


  addPic: (req, res) => {

    let update = {
      images: []
    }

    let image = {path: config.uploadDir+req.file.filename, name: req.file.filename}

    Ad.findOne({_id: req.params.id}, (err, ad) => {

      if (err || ad.images.length >= 6) {

        imageRemove(req.file.path)
        res.json({message: "Error uploading picture", error: true, err})
        
      } else {

        imageResize(req.file.path, config.uploadDir+req.file.filename)
        update.images = [...ad.images, image]

        Ad.updateOne({_id: req.params.id}, update, err => {

          if(err) {
            console.log(err)
            res.json({message: "Error uploading picture", error: true, err})
          } else {
            res.json({message: "Picture uploaded", error: false, image})        
          }

        })

      }

    })

  },


  remPic: (req, res) => {

    imageRemove(req.body.imgUrl)
    let images = []

    Ad.findById(req.params.id, (err, ad) => {

      if(err) {
        res.json({message: "Error removing picture", error: true, err})
      } else {

        images = ad.images

        images.splice(req.body.index, 1)

        Ad.updateOne({_id: req.params.id}, {images}, err => {
          if(err) {
            res.json({message: "Error removing picture", error: true, err})
          } else { 
            res.json({message: "Picture removed", error: false})
          }
        })

      }

    })


  },

  find: (req, res) => {

    let page = req.params.page || 1
    let pages
    let perPage = 12
    var ads = []

    Ad.search(req.params.query, (err, resp) => {

      for(let i = 0; i < resp.length; i++) {
        ads.push(resp[i])
      }

      pages = Math.ceil(ads.length / perPage)

      if(pages <= 1) {
        res.json({page: 1, pages, ads: ads})
      } else if(pages > 1 && page < pages) {
  
        let tAds = []
  
        for(let i = ((page*perPage) -  1); i < (page*perPage); i++) {
          tAds.push(ads[i])
        }
  
        res.json({page, pages, ads: tAds})
  
      } else if(page == pages) {
  
        let tAds = []
  
        for(let i = ((page*perPage) -  1); i < ads.length; i++) {
          tAds.push(ads[i])
        }
  
        res.json({page, pages, ads: tAds})
  
      }

    })


    



  },

  getRecent: async (req, res) => {

    let uvAds = []
    let vAds = []

    let opts = {
      category: req.params.category
    }

    if(req.params.category == "none") {
      opts = {}
    }

    await Ad.find(opts, (err, ads) => {
      

      // get ads that have images
      for(ad in ads) {

        if(ads[ad].images.length > 0) {
          uvAds.push(ads[ad])
        }

      }

      // check if we have 6
      if(uvAds.length <= 6) {
        vAds = uvAds
      } 
      
      // if we have more then, randomly select and push
      else {

        let i
        while(vAds.length < 6) {

          i = Math.ceil(Math.random() * (uvAds.length) - 1)

          if(!vAds.includes(uvAds[i])) {
            vAds.push(uvAds[i])
          }

        }

      }


    })
      
    res.json({ads: vAds})

  }


}