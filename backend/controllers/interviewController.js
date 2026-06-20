const Interview = require("../models/Interview");
const User = require("../models/User");
// const Interview = require("../models/Interview");

const { generateQuestions } = require("../services/interviewAIService");

const { evaluateAnswers } = require("../services/interviewEvaluationService");

const extractAndParseJSON = (str) => {
  if (!str) return null;
  const trimmed = str.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    const firstBrace = trimmed.indexOf('{');
    const firstBracket = trimmed.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = trimmed.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = trimmed.lastIndexOf(']');
    }
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonSub = trimmed.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(jsonSub);
      } catch (err) {
        throw new Error(`JSON block extraction succeeded but parsing failed: ${err.message}`);
      }
    }
    throw new Error("No JSON block found in AI response");
  }
};


exports.createInterview = async (req, res) => {
  try {
    const { interviewType, difficulty = "beginner" } = req.body;

    const allowedDifficulties = ["beginner", "intermediate", "advanced"];
    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      interviewType,
      difficulty,
    });

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getInterviewById = async (
  req,
  res
) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    const interview =
      await Interview.findOne(query);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

exports.generateInterview = async (req, res) => {
  try {
    const { interviewType, difficulty = "beginner" } = req.body;

    const allowedDifficulties = ["beginner", "intermediate", "advanced"];
    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    const user = await User.findById(req.user._id);

    const aiResponse = await generateQuestions(
      user.skills,
      interviewType,
      difficulty
    );

    const questions = extractAndParseJSON(aiResponse);

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.submitInterview = async (
  req,
  res
) => {
  try {
    const {
      questions,
      interviewType,
      difficulty,
    } = req.body;

    const aiResponse =
      await evaluateAnswers(
        questions
      );

    const result = extractAndParseJSON(aiResponse);

    const interview =
      await Interview.create({
        user: req.user._id,

        interviewType:
          interviewType ||
          "mern",

        difficulty:
          difficulty ||
          "beginner",

        questions,

        overallScore:
          result.overallScore,

        strengths:
          result.strengths,

        weaknesses:
          result.weaknesses,

        suggestions:
          result.suggestions,
      });

    res.status(200).json({
      success: true,
      result,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
