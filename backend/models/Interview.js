const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    interviewType: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "fullstack",
        "react",
        "node",
        "java",
        "python",
        "mern",
        "custom",
      ],
      default: "custom",
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    questions: [
      {
        question: String,

        answer: {
          type: String,
          default: "",
        },

        feedback: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);
