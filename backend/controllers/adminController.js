const User = require("../models/User");
const Resume = require("../models/Resume");


const Interview = require("../models/Interview");


// const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().populate("user", "name email").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.deleteResume =
  async (req, res) => {
    try {
      const resume =
        await Resume.findById(
          req.params.id
        );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found",
        });
      }

      await resume.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Resume deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };




exports.deleteInterview =
  async (req, res) => {
    try {
      const interview =
        await Interview.findById(
          req.params.id
        );

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      await interview.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Interview deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };