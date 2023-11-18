const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "pdf"],
  params: {
    folder: "users",
  },
});

const assignmentStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["pdf"],
  params: {
    folder: "assignments",
  },
});

const uploadUser = multer({ storage: userStorage });
const uploadAssignment = multer({ storage: assignmentStorage });
module.exports = { uploadUser, uploadAssignment };
