const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");




// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

const normalizeEmail = (email) => email?.trim().toLowerCase();


// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed on the server",
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );
     

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    user.password = undefined;

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get
    exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      bio,
      skills,
      education,
      experience,
      github,
      linkedin,
    } = req.body;

    const cleanEducation = Array.isArray(education)
      ? education
          .map((item) => ({
            college: item.college?.trim(),
            degree: item.degree?.trim(),
            year: item.year?.trim(),
          }))
          .filter((item) => item.college && item.degree && item.year)
      : undefined;

    const cleanExperience = Array.isArray(experience)
      ? experience
          .map((item) => ({
            company: item.company?.trim(),
            role: item.role?.trim(),
            duration: item.duration?.trim(),
          }))
          .filter((item) => item.company && item.role && item.duration)
      : undefined;

    const updateData = {
      name,
      bio,
      skills,
      github,
      linkedin,
    };

    if (Array.isArray(education)) {
      updateData.education = cleanEducation;
    }

    if (Array.isArray(experience)) {
      updateData.experience = cleanExperience;
    }

    const user =
      await User.findByIdAndUpdate(
  req.user._id,
  updateData,
  {
    new: true,
  }

      ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


exports.forgotPassword =
  async (req, res) => {
    let user;

    try {
      const email = normalizeEmail(req.body.email);

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      user = await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      const otp =
        generateOTP();

      user.resetOtp = otp;

      user.resetOtpExpire =
        Date.now() +
        10 * 60 * 1000;

      await user.save();

      console.log("Forgot password email send attempt:", {
        email: user.email,
        hasEmailjsServiceId: Boolean(process.env.EMAILJS_SERVICE_ID?.trim()),
        hasEmailjsTemplateId: Boolean(process.env.EMAILJS_TEMPLATE_ID?.trim()),
        hasEmailjsPublicKey: Boolean(process.env.EMAILJS_PUBLIC_KEY?.trim()),
        hasEmailjsPrivateKey: Boolean(process.env.EMAILJS_PRIVATE_KEY?.trim()),
      });

      await sendEmail(
        user.email,
        "HireMind Password Reset OTP",
        otp
      );

      res.status(200).json({
        success: true,
        message:
          "OTP sent successfully",
      });
    } catch (error) {
      console.error("Forgot password email failed:", {
        message: error.message,
        stack: error.stack,
        email: user?.email,
      });

      if (user) {
        user.resetOtp = null;
        user.resetOtpExpire = null;
        await user.save().catch(() => {});
      }

      res.status(500).json({
        success: false,
        message: error.message || "Email service is temporarily unavailable. Please try again.",
      });
    }
  };


exports.resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      user.resetOtpExpire <
      Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    user.resetOtp = null;
    user.resetOtpExpire =
      null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


exports.testEmail = async (
  req,
  res
) => {
  try {
    await sendEmail(
      "YOUR_EMAIL@gmail.com",
      "HireMind Test",
      "Email service working successfully"
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.verifyOTP = async (
  req,
  res
) => {
  try {
    const { email, otp } =
      req.body;
    const normalizedEmail = normalizeEmail(email);

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (
      user.resetOtp !== otp
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });
    }

    if (
      user.resetOtpExpire <
      Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP expired",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
