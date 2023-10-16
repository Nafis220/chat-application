const express = require("express");
const { getUsers } = require("../controller/userController");
const decodeTitle = require("../middlewares/common/decodePageTitle");
const router = express.Router();

router.get("/", decodeTitle("Users"), getUsers);

module.exports = router;
