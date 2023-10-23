const { uploader } = require("../../utilities/multipleUploader");

const attachmentUpload = (req, res, next) => {
  const upload = uploader(
    "attachments",
    ["image/jpg", "image/jpeg", "image/png"],
    1000000,
    2,
    "Only .jpg jpeg png format allowed"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      console.log(err, "from attachmentupload");
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};
module.exports = { attachmentUpload };
