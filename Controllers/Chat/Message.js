const Joi = require("joi")
const { uploadDocuments } = require("../../Utils/cloudinaryImgFunctions")
const File = require("../../Models/File")
const { Message } = require("../../Models/Message")
const sendMessage = async (req, res) => {

    const value = Joi.object({
        to: Joi.string().required(),  // to is the id of the user to whom the message is to be sent
        message: Joi.string().required()
    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, error: value.error.details[0].message })
    }
    try {
        // apply the logic to check if the user has sent the file with the message or not in the frontend genearte code accordingly
        // generate code to check if the user has sent the file with the message or not in the frontend
        const { to, message } = req.body
        if (!req.files) {
            const messageData = new Message({
                receiver: to,
                sender: req.payload.userData._id,
                message: message
            })
            const savedMessage = await messageData.save()
            if (savedMessage) {
                return res.status(200).json({ success: true, message: "Message sent successfully" })
            }
            else {
                return res.status(500).json({ success: false, message: "Message not sent" })
            }
        }

        else {
            // upload the file to the cloud and get the url of the files and save the url in the database
            const docsUrl = await uploadDocuments(req.files.images, 'chatDocuments');
            if (docsUrl) {

                const newFiles = new File({
                    // save the url of the file in the database comming from the cloud
                    filesUrl: docsUrl,
                })
                const savedFiles = await newFiles.save()
                if (!savedFiles) {
                    return res.status(500).json({ success: false, message: "file not saved" })
                }
                else {
                    const messageData = new Message({
                        receiver: to,
                        sender: req.payload.userData._id,
                        message: message,
                        file: savedFiles._id
                    })
                    const savedMessage = await messageData.save()
                    if (savedMessage) {
                        return res.status(200).json({ success: true, message: "Message sent successfully" })
                    }
                    else {
                        return res.status(500).json({ success: false, message: "Message not sent" })
                    }
                }
            }
        }

    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
}

const getMessages = async (req, res) => {
    // get the conversation between two users only
    // get the messages between the logged in user and the user whose id is passed in the query
    // vlaidate the query params
    // query will be like this /messages?to=123
    const value = Joi.object({
        to: Joi.string().required()
    }).validate(req.query)
    if (value.error) {
        return res.status(400).json({ success: false, error: value.error.details[0].message })
    }

    try {
        const { to } = req.query
        const messages = await Message.find({
            $or: [
                { sender: req.payload.userData._id, receiver: to },
                { sender: to, receiver: req.payload.userData._id }
            ]
        })
        if (messages) {
            return res.status(200).json({ success: true, messages })
        }
        else {
            return res.status(500).json({ success: false, message: "No messages found" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, error: err.message })
    }
}



module.exports = {
    sendMessage,
    getMessages
}