const express = require("express");
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/userController");
const decodeTitle = require("../middlewares/common/decodePageTitle");
const avatarUplaods = require("../middlewares/users/avatarUploads");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middlewares/users/userValidator");
const {
  checkLogin,
  requiredRole,
} = require("../middlewares/common/checkLogin");
const router = express.Router();

//*users page, it's a html response and can change the html of a page from ejs
router.get(
  "/",
  decodeTitle("Users"),
  checkLogin,
  requiredRole(["admin"]),
  getUsers
);

//* add user with validation and handling all the errors. it's a json response
router.post(
  "/",
  checkLogin,
  avatarUplaods,
  addUserValidator,
  addUserValidationHandler,
  requiredRole(["admin"]),
  addUser
);

router.delete("/:id", requiredRole(["admin"]), removeUser);
module.exports = router;
