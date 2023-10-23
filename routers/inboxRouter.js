const express = require("express");
const {
  getInbox,
  searchUser,
  getMessages,
  sendMessage,
  addConversation,
} = require("../controller/inboxController");
const decodeTitle = require("../middlewares/common/decodePageTitle");
const { checkLogin } = require("../middlewares/common/checkLogin");
const router = express.Router();
const { attachmentUpload } = require("../middlewares/inbox/attachmentUpload");

// inbox page
router.get(
  "/",
  decodeTitle("Inbox"),

  checkLogin,
  getInbox
);
// search user for conversation
router.post("/search", checkLogin, searchUser);

// get all the messages for a specific conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);
// add conversation
router.post("/conversation", checkLogin, addConversation);

// send a message
router.post("/message", checkLogin, attachmentUpload, sendMessage);
module.exports = router;
