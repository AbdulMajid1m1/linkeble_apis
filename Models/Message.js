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

const GroupChatSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                min: [3, 'Group must have at least 3 members'],
            }
        ],
        groupPictrue: {
            type: String,
            default: null
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // isDeleted: {
        //     type: Boolean,
        //     default: false
        // }
        messagesList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupMessage',
                required: true
            }]
    },
    { timestamps: true }
)


const GrupMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        groupChat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GroupChat',
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

    },
    { timestamps: true }
)



const Message = mongoose.model('Message', MessageSchema);
const GroupMessage = mongoose.model('GroupMessage', GrupMessageSchema);
const GroupChat = mongoose.model('GroupChat', GroupChatSchema);

module.exports = { Message, GroupMessage, GroupChat };