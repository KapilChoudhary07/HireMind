const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  college: {
    type: String,
    required: true,
  },

  degree: {
    type: String,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImage: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },

    education: [educationSchema],

    experience: [experienceSchema],
    
    github: {
  type: String,
  default: "",
},

linkedin: {
  type: String,
  default: "",
},

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  
  resetOtp: {
  type: String,
  default: null,
},

resetOtpExpire: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);