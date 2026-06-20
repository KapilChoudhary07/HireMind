const express = require("express");

const {
  uploadResume,
  getMyResume,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);

router.get("/my-resumes", protect, getMyResume);

router.get("/:id", protect, getResumeById);

router.delete("/:id", protect, deleteResume);

module.exports = router;
