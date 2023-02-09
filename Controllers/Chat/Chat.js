const { Chatlist, GroupChatList } = require("../../Models/Chatlist");
const { Message } = require("../../Models/Message");

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




// get chatlist of a user by id
const getChatlist = async (req, res) => {
    try {
        // get the chatlist of the user and gruop chatlist and get the last message of each chat and sort them by date and time of the last message

        // const chatlist = await Chatlist.findById(req.payload.chatlistId).populate('chatlistId');
        // we only new name and profile pic of the user
        const chatlist = await Chatlist.findById(req.payload.chatlistId).populate('usersList');
        if (!chatlist) {
            return res.status(400).json({ message: "Chatlist not found" });
        }
        // group chatlist will contain the group chat id and the name of the group and the profile pic of the group and members of the group
        const groupChatlist = await GroupChatList.findById(req.payload.groupChatlistId).populate('groupChatlistId');

        if (!groupChatlist) {
            return res.status(400).json({ message: "Group chatlist not found" });
        }
        const ChatListWithLastMsg = chatlist.map(async user => {
            //    // get the last message of the chat of the user with other user using the chat id based on time and date of the message

            const lastMessage = await Message.find(
                {
                    $or: [{ senderId: req.payload._id, receiverId: user._id },
                    { senderId: user._id, receiverId: req.payload._id }]
                }).sort({ createdAt: -1 }).limit(1);

            user.lastMessage = lastMessage;
            return user;
        });
        // sort the chatlist by the date and time of the last message
        const sortedChatList = ChatListWithLastMsg.sort((a, b) => {
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        const groupChatListWithLastMsg = groupChatlist.map(async group => {
            //    // get the last message of the chat of the user with other user using the chat id based on time and date of the message

            const lastMessage = await Message.find(
                {
                    groupChat: group._id
                }
            ).sort({ createdAt: -1 }).limit(1);

            group.lastMessage = lastMessage;
            return group;
        });


        // sort the chatlist by the date and time of the last message
        const sortedGroupChatList = groupChatListWithLastMsg.sort((a, b) => {
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        // TODO: return the sorted chatlist and group chatlist with the last message of each chat together

        return res.status(200).json({ message: "Chatlist", data: { chatlist: sortedChatList, groupChatlist: sortedGroupChatList } });

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