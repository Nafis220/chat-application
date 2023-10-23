const { check, validationResult } = require("express-validator");

// middleware to check the validation of username and password
const logInValidation = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Mobile number or email is required"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];
// middleware to handle the error if the validation is failed
const loginValidatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  // check if there is any error or not
  if (errors.isEmpty()) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  }
};

module.exports = { logInValidation, loginValidatorHandler };
