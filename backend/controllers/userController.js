const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        bio,
        skills,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.addEducation = async (
  req,
  res
) => {
  try {
    const {
      college,
      degree,
      year,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    user.education.push({
      college,
      degree,
      year,
    });

    await user.save();

    res.status(200).json({
      success: true,
      education:
        user.education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


exports.addExperience = async (
  req,
  res
) => {
  try {
    const {
      company,
      role,
      duration,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    user.experience.push({
      company,
      role,
      duration,
    });

    await user.save();

    res.status(200).json({
      success: true,
      experience:
        user.experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


exports.deleteEducation = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    user.education =
      user.education.filter(
        (edu) =>
          edu._id.toString() !==
          req.params.id
      );

    await user.save();

    res.status(200).json({
      success: true,
      education: user.education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteExperience = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    user.experience =
      user.experience.filter(
        (exp) =>
          exp._id.toString() !==
          req.params.id
      );

    await user.save();

    res.status(200).json({
      success: true,
      experience: user.experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateEducation = async (
  req,
  res
) => {
  try {
    const {
      college,
      degree,
      year,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    const education =
      user.education.id(
        req.params.id
      );

    if (!education) {
      return res.status(404).json({
        success: false,
        message:
          "Education not found",
      });
    }

    education.college =
      college ||
      education.college;

    education.degree =
      degree ||
      education.degree;

    education.year =
      year ||
      education.year;

    await user.save();

    res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

exports.updateExperience = async (
  req,
  res
) => {
  try {
    const {
      company,
      role,
      duration,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    const experience =
      user.experience.id(
        req.params.id
      );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message:
          "Experience not found",
      });
    }

    experience.company =
      company ||
      experience.company;

    experience.role =
      role ||
      experience.role;

    experience.duration =
      duration ||
      experience.duration;

    await user.save();

    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};



exports.changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

exports.uploadProfileImage =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      user.profileImage =
        req.file.path;

      await user.save();

      res.status(200).json({
        success: true,
        profileImage:
          user.profileImage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
