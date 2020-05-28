const Report = require("../models/Report")

module.exports = {

    add: (req, res) => {

        let body = req.body

        let newReport = new Report({
            
            category: body.category,
            ad: body.ad,
            adOwner: body.adOwner,
            message: body.message

        })

        newReport.save(err => {

            if(err) {
                res.json({error: true, message: "Error making report"})
            } else {
                res.json({error:false, message: "Report made"})
            }

        })

    },

    remove: (req, res) => {

        Report.remove({_id: req.params.id}, err => {

            if(err) {
                res.json({error: true, message: "Error deleting report"})
            } else {
                res.json({error: false, message: "deleting report successful"})
            }

        })

    },

    attend: (req, res) => {

        Report.updateOne({_id: req.params.id}, {attended: true, attendedBy: req.user._id}, err => {
            if (err) {
                res.json({error: true, message: "Error attending report"})
            } else {
                res.json({error: false, message: "attended"})
            }
        })

    },

    getAll: async (req, res) => {

        let page = req.params.page || 1
        let pages
        let perPage = 10

        await Report.estimatedDocumentCount((err, count) => {

            pages = Math.ceil(count / perPage)

            if(err) {
                res.json({error: true, message: "Error fetching reports"})
            }

        })

        Report.find({attended: false})
            .sort({attended: 1})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec((err, docs) => {
                if(err) {
                    console.log(err)
                    res.json({error: true, message: "Error fetching reports"})
                } else {
                    res.json({error: false, message: "Reports fetched", reports: docs, pages, page})
                }
            })

    },

    getOne: (req, res) => {
        Report.findOne({_id: req.params.id}, (err, doc) => {
            if(err) {
                res.json({error: true, message: "Error fetching report"})
            } else {
                res.json({error: false, message:"Report Fetched", report:doc})
            }
        })
    }

}