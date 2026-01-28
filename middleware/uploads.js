const multer = require("multer");
const path = require("path");

// Max file sizes
const maxSize = 2 * 1024 * 1024; // 2MB
const maxVideoSize = 50 * 1024 * 1024; // 50MB

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "profilePicture":
        cb(null, path.join("public", "profile_pictures"));
        break;
      case "itemPhoto":
        cb(null, path.join("public", "item_photos"));
        break;
      case "itemVideo":
        cb(null, path.join("public", "item_videos"));
        break;
      default:
        cb(new Error("Invalid field name for upload."), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let prefix = "file";
    if (file.fieldname === "profilePicture") prefix = "pro-pic";
    else if (file.fieldname === "itemPhoto") prefix = "itm-pic";
    else if (file.fieldname === "itemVideo") prefix = "item-vid";
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "itemVideo") {
    if (!file.originalname.match(/\.(mp4|avi|mov|wmv)$/i))
      return cb(new Error("Video format not supported."), false);
    cb(null, true);
  } else if (file.fieldname === "profilePicture" || file.fieldname === "itemPhoto") {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i))
      return cb(new Error("Image format not supported."), false);
    cb(null, true);
  } else {
    cb(new Error("Invalid field name for upload."), false);
  }
};

// Multer instances
const uploadImage = multer({ storage, fileFilter, limits: { fileSize: maxSize } });
const uploadVideo = multer({ storage, fileFilter, limits: { fileSize: maxVideoSize } });

module.exports = { uploadImage, uploadVideo };
