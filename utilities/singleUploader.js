const multer = require("multer");
const path = require("path");
const uploader = (
  sufolder_path,
  allowed_file_types,
  max_file_size,
  error_message
) => {
  // file uload folder
  const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${sufolder_path}/`;

  //define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLocaleLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });
  // prepae the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_message));
      }
    },
  });
  return upload;
};
module.exports = uploader;
