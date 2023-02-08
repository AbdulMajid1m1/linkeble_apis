const mongoose = require('mongoose');
const ChatlistSchema = new mongoose.Schema(
    {
        usersList: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            default: [],
        }

    },
    { timestamps: true }
)
module.exports = mongoose.model("Chatlist", ChatlistSchema)