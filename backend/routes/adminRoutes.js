const express =
  require("express");

const {
  getAllUsers,
  getAllResumes,
  getAllInterviews,
  deleteUser,
  deleteResume,
  deleteInterview,
} = require(
  "../controllers/adminController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  adminOnly,
} = require(
  "../middleware/adminMiddleware"
);

const router =
  express.Router();

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.get(
  "/resumes",
  protect,
  adminOnly,
  getAllResumes
);


router.get(
  "/interviews",
  protect,
  adminOnly,
  getAllInterviews
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

router.delete(
  "/resumes/:id",
  protect,
  adminOnly,
  deleteResume
);

router.delete(
  "/interviews/:id",
  protect,
  adminOnly,
  deleteInterview
);  

module.exports = router;