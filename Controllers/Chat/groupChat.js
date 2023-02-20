const Joi = require('joi')
const { GroupChatList } = require('../../Models/Chatlist')
const mongoose = require('mongoose');

const { GroupChat, GroupMessage } = require('../../Models/Message')
const User = require('../../Models/User')
const { uploadDocuments } = require('../../Utils/cloudinaryImgFunctions');
const File = require('../../Models/File');
const createGroupChat = async (req, res) => {
    const value = Joi.object({
        name: Joi.string().required(),
        members: Joi.array().items(Joi.string()).required(),
    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, error: value.error.details[0].message })
    }
    try {
        const { name, members } = req.body
        // create mongodb id for messagesList
        const messagesList = new mongoose.Types.ObjectId();
        const groupChat = new GroupChat({
            name,
            members,
            admin: req.payload.userData._id,
            messagesList,
        })
        const savedGroupChat = await groupChat.save()
        if (savedGroupChat) {
            // get the id of the group chat and save it in the members array of the group chat in the database
            const groupChatId = savedGroupChat._id
            // get the grup chat list of the members and push the group chat id in the group chat list of the members
            const getMembersGroupChatIds = await User.find({ _id: { $in: members } }, { groupChatListId: 1 })
            if (!getMembersGroupChatIds) {
                return res.status(500).json({ success: false, message: "Cannot fetch users from members list" })
            }

            const membersGroupChatIds = getMembersGroupChatIds.map((member) => member.groupChatListId)
            console.log(membersGroupChatIds)

            // update the group chat list of the members
            const updateGroupChatList = await GroupChatList.updateMany(
                {
                    _id: { $in: membersGroupChatIds }
                },
                {
                    $push: { groupChatList: groupChatId }
                })
            if (!updateGroupChatList) {
                return res.status(500).json({ success: false, message: "Cannot update group chat list" })
            }
            return res.status(200).json({ success: true, message: "Group chat created successfully" })
        }
        else {
            // delete the group chat if any of the above steps fail
            const deleteGroupChat = await GroupChat.deleteOne({ _id: savedGroupChat._id })
            if (!deleteGroupChat) {
                return res.status(500).json({ success: false, message: "Group chat not deleted!" })
            }
            return res.status(500).json({ success: false, message: "Group chat not created" })

        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, error: err.message })
    }
}

// TODO:  send message to the group chat

const sendGroupMessage = async (req, res) => {
    const value = Joi.object({
        message: Joi.string().required(),
        groupChatId: Joi.string().required(),
    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, error: value.error.details[0].message })
    }
    try {
        const { message, groupChatId } = req.body
        // get the group chat
        if (!req.file) {
          
            const groupMessage = new GroupMessage({
                sender: req.payload.userData._id,
                groupChat: groupChatId,
                message,
            })
            const savedGroupMessage = await groupMessage.save()
            if (!savedGroupMessage) {
                return res.status(500).json({ success: false, message: "Cannot save group message" })
            }
            const updateGroupChat = await GroupChat.updateOne(
                { _id: groupChatId },
                {
                    $push: { messagesList: savedGroupMessage._id }
                }
            )
            if (!updateGroupChat) {
                return res.status(500).json({ success: false, message: "Cannot update group chat" })
            }
            return res.status(200).json({ success: true, message: "Message sent successfully" })
        }
        else {
            const docsUrl = await uploadDocuments(req.file.files, 'chatDocuments');
            if (!docsUrl) {
                return res.status(500).json({ success: false, message: "Cannot upload documents" })
            }

            const MsgFiles = new File({
                filesUrl: docsUrl,
            })
            const savedMsgFiles = await MsgFiles.save()
            if (!savedMsgFiles) {
                return res.status(500).json({ success: false, message: "Cannot save files" })
            }
            const groupMessage = new GroupMessage({
                sender: req.payload.userData._id,
                groupChat: groupChatId,
                message,
                files: savedMsgFiles._id,
            })
            const savedGroupMessage = await groupMessage.save()
            if (!savedGroupMessage) {
                return res.status(500).json({ success: false, message: "Cannot save group message" })
            }
            const updateGroupChat = await GroupChat.updateOne(
                { _id: groupChatId },
                {
                    $push: { messagesList: savedGroupMessage._id }
                }
            )
            if (!updateGroupChat) {
                return res.status(500).json({ success: false, message: "Cannot update group chat" })

            }
            return res.status(200).json({ success: true, message: "Message sent successfully" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, error: err.message })
    }
}

module.exports = { createGroupChat, sendGroupMessage }

