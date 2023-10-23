//! this middleware is responsible for uploading the file(image) to the databage
const uploader = require("../../utilities/singleUploader");

const avatarUplaods = (req, res, next) => {
  const upload = uploader(
    "avatar",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "only jpg, jpeg and png formet allowed"
  );
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: { msg: err.message },
        },
      });
    } else {
      next();
    }
  });
};
module.exports = avatarUplaods;
