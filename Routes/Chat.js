const { addToChatlist, getChatlist, deleteFromChatlist } = require('../Controllers/Chat/Chat');
const { sendMessage, getMessages } = require('../Controllers/Chat/Message');
const { auth } = require('../Middlewares/auth');

// Middleware to handle file upload
const router = require('express').Router();
// TODO: test the routes
router.post('/add-to-chatlist', auth, addToChatlist);
router.get("/get-chatlist", auth, getChatlist);
router.delete('/delete-from-chatlist', auth, deleteFromChatlist);
router.post('/send-message', auth, sendMessage);
// TODO: how to pass params in the url to
router.get('/get-messages', auth, getMessages);
module.exports = router;


