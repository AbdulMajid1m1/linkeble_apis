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
        chatlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chatlist'
        },
        
    },
    { timestamps: true }
)
module.exports = mongoose.model("User", UserSchema)
