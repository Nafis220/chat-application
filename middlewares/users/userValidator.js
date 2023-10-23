const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../../models/People");
const { unlink } = require("fs");
const path = require("path");

//! the addUserValidator middleware is responsible for validation the info that the user will provide by using express-validator

const addUserValidator = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabates")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", { strictMode: true })
    .withMessage("Mobile Number must be a valid Bangladeshi Moibile Number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Number already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and should atleast one lowercase, one uppercase, one symbol and one number"
    ),
];

//! this middleware is responsible for handling all the errors using express-validator. it will also delete the file from the database that is uploaded by a user who's other info is not valid.

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    //? remove uploaded files because the other info that the user has provided was not valid
    if (req.files.length > 0) {
      const { filename } = req.files[0];

      unlink(
        path.join(__dirname, `../../public/uploads/avatar/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    } else {
      // response the errors
      res.status(500).json({ errors: mappedErrors });
    }
  }
};

module.exports = { addUserValidator, addUserValidationHandler };
