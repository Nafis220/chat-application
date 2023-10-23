const express = require("express");
const { getLogin, login, logout } = require("../controller/loginController");
const decodeTitle = require("../middlewares/common/decodePageTitle");
const pageTitle = "login";

const {
  logInValidation,
  loginValidatorHandler,
} = require("../middlewares/login/loginValidators");
const { redirectToInbox } = require("../middlewares/common/checkLogin");
const router = express.Router();

router.get("/", decodeTitle(pageTitle), redirectToInbox, getLogin);
router.post(
  "/",

  decodeTitle(pageTitle),
  logInValidation,
  loginValidatorHandler,
  login
);
router.delete("/", logout);
module.exports = router;
