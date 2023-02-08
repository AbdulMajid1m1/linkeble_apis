const Chatlist = require("../../Models/Chatlist");

const addToChatlist = async (req, res) => {
    // get user id from payload and chat id from payload
    const { userId, chatId } = req.payload;
    const { chatWith } = req.body;
    try {
        const ifUserExit = await Chatlist.findOne({ usersList: { $in: [chatWith] } })
        if (ifUserExit) {
            return res.status(200).json({ message: "User already exist in chatlist" });
        }
        else {

            const userChatlist = await Chatlist.findByIdAndUpdate(userId, { $push: { usersList: chatWith } }, { new: true });
            if (!userChatlist) {
                return res.status(500).json({ message: "User chatlist not updated" });
            }
            const chatWithChatList = await Chatlist.findByIdAndUpdate(chatWith, { $push: { usersList: userId } }, { new: true });
            if (!chatWithChatList) {
                return res.status(500).json({ message: "Chat with chatlist not updated" })
            }
            return res.status(200).json({ message: "User added to chatlist" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getChatlist = async (req, res) => {
    try {
        const chatlist = await Chatlist.findById(req.payload.chatlistId).populate('usersList');
        if (chatlist) {
            return res.status(200).json({ message: "Chatlist", data: chatlist });
        }
        else {
            return res.status(400).json({ message: "Chatlist not found" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const deleteFromChatlist = async (req, res) => {

    const { userId, chatId } = req.payload;
    const { chatWith } = req.body;
    try {
        const deleteChatWith = Chatlist.findByIdAndUpdate(chatId, { $pull: { usersList: chatWith } }, { new: true });
        if (!deleteChatWith) {
            return res.status(500).json({ message: "Chat with not deleted" });
        }
        // TODO: delete all the chat messages between the two users
        return res.status(200).json({ message: "Chat with deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}


module.exports = {
    addToChatlist,
    getChatlist,
    deleteFromChatlist
}