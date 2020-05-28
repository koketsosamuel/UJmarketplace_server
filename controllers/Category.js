const Category = require("../models/Category")
const imageRem = require("../services/imageRemove")

module.exports = {


  addCategory: (req, res) => {

    let newCategory = new Category({
      name: req.body.name,
      expiration: req.body.expiration,
      expirationDays: req.body.expirationDays,
      image: req.file.path
    })
    
    newCategory.save(err => {
      if(err) {
        res.json({message: "Error adding category", error:true})
      } else {
        res.json({message: "Category added", error: false})
      }
    })

  },

  removeCategory: (req, res) => {


      Category.findByIdAndRemove(req.params.id, (err, cat) => {

        try {

          if(err) {
            res.json({message: err, error: true})
          } else {
  
  
            if(cat.image) {
  
              imageRem(cat.image)
  
            }
  
            res.json({message: "Category has been removed", error:false})
          }  

        } catch(err) {        
          res.json({message: err, error: true})
        }


      })
    

  },

  updateCategory: (req, res) => {

    Category.findOneAndUpdate({_id: req.params.id},
      {
        name: req.body.name, 
        expiration: req.body.expiration,
        expirationDays: req.body.expirationDays
      }, (err) => {
      if(err) {
        console.log(err)
        
        res.json({message: "Error updating category", error: true})
      } else {
        res.json({message: "Category has been updated", error:false})
      }
    })

  },

  updateCategoryImage: (req, res) => {
    
    let query = {_id: req.params.id}

    Category.findOne(query, async (err, cat) => {

      if(!err) {
        
        await imageRem(cat.image)
        Category.updateOne(query, {image: req.file.path}, err2 => {
          res.json({error: false, message: "updated"})
        })

      } else {
        res.json({error: true, message: err})
      }

    })

  },

  getOne: (req, res) => {

    Category.findOne({_id: req.params.id}, (err, category) => {
      if(err || category == null) {
        res.json({category:{_id:"other", name:"Other"}, message: err, error: true})
      } else {
        res.json({category, message: "Category fetch successful", error:false})
      }
    })

  },

  getAll: (req, res) => {
    Category.find({})
            .sort({name: 1})
            .exec((err, categories) => {
              if(err) {
                res.json({message: err, error: true})
              } else {
                res.json({categories: categories, message: "Categories fetched successfully", error:false})
              }
            })
    
  }


}