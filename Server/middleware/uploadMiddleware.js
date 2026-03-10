const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "soandita",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "jfif"],
    transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|jfif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only image files (jpg, png, webp, gif) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
