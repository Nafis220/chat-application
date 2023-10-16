const express = require("express");
const { getInbox } = require("../controller/inboxController");
const decodeTitle = require("../middlewares/common/decodePageTitle");
const router = express.Router();

router.get("/", decodeTitle("Inbox"), getInbox);

module.exports = router;
