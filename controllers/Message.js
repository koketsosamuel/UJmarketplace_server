const Message = require("../models/Message")
const email = require("../services/email")

module.exports = {

    add: (req, res) => {

        let newMsg = new Message({
            senderEmail: req.body.senderEmail,
            senderCellNo: req.body.senderCellNo,
            message: req.body.message
        })

        newMsg.save(err => {
            if(err) {
                res.json({error: true, message: "Error sending message"})
            } else {
                res.json({error: false, message: "Message sent"})
            }
        })

    },

    read: (req, res) => {
        
        Message.updateOne({_id: req.params.id},{read:true}, err => {
            if(err) {
                res.json({error:true, message: "Error reading"})
            } else {
                res.json({error: false})
            }
        })

    },

    respond: async (req, res) => {

        let sent = await email(req.body.email, req.body.subject, req.body.body)
        if(sent) {
            Message.updateOne({_id:req.params.id}, {read: true, responded: true, response:req.body.body}, err => {
                if(err) {
                    res.json({error:true, message: "Message sent, Error making db query"})
                } else {
                    res.json({error: false, message: "Responded"})
                }
            })
        } else {
            res.json({error: true, message: "Error Responding"})
        }

    }, 

    getAll: async (req, res) => {

        let page = req.params.page || 1
        let pages
        let perpage = 10

        await Message.estimatedDocumentCount((err, count) => {
            pages = Math.ceil(count/perpage)
        })

        Message.find({})
            .sort({read: 1})
            .skip((page - 1) * perpage)
            .limit(perpage)
            .exec((err, docs) => {
                if(err) {
                    res.json({error: true, messagr: "Error fetching docs"})
                } else {
                    res.json({error: false, message: "Messages fetched", messages: docs, pages, page})
                }
            })

    }

}