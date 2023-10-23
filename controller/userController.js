const bcrypt = require("bcrypt");
const User = require("../models/People");
const fs = require("fs");
const path = require("path");
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.render("users", { users: users });
  } catch (err) {
    next(err);
  }
};

// add user function
const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }
  console.log(newUser);
  try {
    const result = await newUser.save();

    res.status(200).json({ message: " user was added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: {
        common: {
          message: "Unknown error occured ",
        },
      },
    });
  }
};

//Delete user
const removeUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: req.params.id });

    // remove the avatar
    if (deletedUser.avatar) {
      fs.unlink(
        path.join(__dirname, `../public/uploads/avatar/${deletedUser.avatar}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(200).json({ message: "User successfully removed" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errors: { common: { message: "Could not delete the user" } } });
  }
};

module.exports = { getUsers, addUser, removeUser };
