const express = require("express");
const { getLogin } = require("../controller/loginController");
const decodeTitle = require("../middlewares/common/decodePageTitle");
const router = express.Router();

router.get("/", decodeTitle("Login"), getLogin);

module.exports = router;
