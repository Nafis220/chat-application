const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  let cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookie) {
    try {
      token = cookie[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      res.locals.loggedInUser = res.locals.html ? decoded : null;
      next();
    } catch (err) {
      console.log(err);
      if (res.locals.html) {
        res.render("index");
      } else {
        res
          .status(500)
          .json({ errors: { common: { msg: "Authentication Failed" } } });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(401).json({ error: "Authentication Failed" });
    }
  }
};

const redirectToInbox = (req, res, next) => {
  const cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  try {
    if (!cookie) {
      next();
    } else {
      res.redirect("/inbox");
    }
  } catch (err) {}
};
const requiredRole = (role) => {
  return (req, res, next) => {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html === true) {
        next(createError(401, "You are not authorized to access this page"));
      } else {
        res.status(401).json({
          errors: {
            common: { msg: "You are not authorized to access this page" },
          },
        });
      }
    }
  };
};
module.exports = { checkLogin, redirectToInbox, requiredRole };
