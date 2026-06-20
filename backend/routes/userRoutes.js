const express = require("express");

const {
  getProfile,
  updateProfile,
  addEducation,
  addExperience,
  deleteEducation,
  deleteExperience,
  updateEducation,
  updateExperience,
  changePassword,
  uploadProfileImage,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/profileUploadMiddleware");
const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post("/education", protect, addEducation);

router.post("/experience", protect, addExperience);

router.delete("/education/:id", protect, deleteEducation);

router.delete("/experience/:id", protect, deleteExperience);

router.put("/education/:id", protect, updateEducation);

router.put("/experience/:id", protect, updateExperience);

router.put("/change-password", protect, changePassword);

router.post(
  "/upload-profile",
  protect,
  upload.single("image"),
  uploadProfileImage,
);

module.exports = router;
