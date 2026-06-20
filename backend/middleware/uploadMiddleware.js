const multer = require("multer");
const path = require("path");

// memoryStorage use karo — Vercel ka filesystem read-only hai
// disk pe save karne ki zaroorat nahi
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf"];

  const ext = path.extname(
    file.originalname
  ).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
