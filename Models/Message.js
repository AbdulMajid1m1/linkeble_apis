const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            default: null
        },
        
        // isRead: {
        //     type: Boolean,
        //     default: false
        // },
        // isDeleted: {
        //     type: Boolean,
        //     default: false
        // },

    },
    { timestamps: true }

)
module.exports = mongoose.model("Message", MessageSchema)