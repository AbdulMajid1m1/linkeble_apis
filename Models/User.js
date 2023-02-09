const { required } = require('joi');
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'password is required']
        },
        username: {
            type: String,
            required: true, unique: true
        },
        profileImg: {
            type: String,
            default: ""
        },
        token: {
            type: String
        },
        location: {
            type: String,
            default: "Pakistan"
        },
        status: {
            type: String,
            default: 'client satisfiction is my main moto'
        },
        // chatlistId references the Chatlist model. ChatList model is used to store the list of chats of a user.
        chatlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chatlist',
            required: true
        },
        // groupChatListId references the GroupChatList model. GroupChatList model is used to store the list of group chats of a user.
        groupChatListId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GroupChatList'
        },


    },
    { timestamps: true }
)
module.exports = mongoose.model("User", UserSchema)
