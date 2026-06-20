const express = require("express");

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  generateInterview,
  submitInterview,
} = require("../controllers/interviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create",
  protect,
  createInterview
);

router.get(
  "/my-interviews",
  protect,
  getMyInterviews
);

router.get("/history", protect, getMyInterviews);

router.get(
  "/:id",
  protect,
  getInterviewById
);

router.post(
  "/generate",
  protect,
  generateInterview
);

router.post(
  "/submit",
  protect,
  submitInterview
);

module.exports = router;