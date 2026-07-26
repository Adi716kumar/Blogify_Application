const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = CloudinaryStorage({
  cloudinary,
  folder: "blogify",
  allowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = upload;