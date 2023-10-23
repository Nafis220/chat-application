const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/People");
const createError = require("http-errors");

const getLogin = (req, res, next) => {
  res.render("index");
};
const login = async (req, res, next) => {
  try {
    // find user with username or user email
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (checkPassword) {
        const userObj = {
          user_id: user._id,
          username: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          avatar: user.avatar,
        };

        const token = jwt.sign(userObj, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          maxage: process.env.JWT_EXPIRES,
          httpOnly: true,
          signed: true,
        });

        // send user ifto to the client side
        res.locals.loggedInUser = userObj;

        // res.locals.nafis = userObj;

        res.redirect("/inbox");
      } else {
        // res.render("/inbox", { errors: { username: "Incorrect password" } });
        throw createError({ password: "Incorrect password" });
      }
    } else {
      // res.render("/inbox", {
      //   errors: { password: "Login failed, User not found" },
      // });
      throw createError({ username: "User not found" });
    }
  } catch (error) {
    res.render("index", {
      data: {
        username: req.body.username,
      },

      error: {
        password: error.password,
        username: error.username,
      },

      errors: {
        common: { message: error },
      },
    });
  }
};

const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);

  res.send("Logged Out");
};
module.exports = { getLogin, login, logout };
