const Resume = require("../models/Resume");
const User = require("../models/User");
const fs = require("fs");

const {
  extractTextFromPDF,
} = require("../services/pdfService");

const {
  analyzeResume,
} = require("../services/geminiService");
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required",
      });
    }

    const extractedText =
      await extractTextFromPDF(
        req.file.path
      );

    const aiResult = await analyzeResume(extractedText);

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(aiResult);
    } catch (e) {
      // Attempt to extract JSON block from AI output (handles code fences or extra text)
      const match = aiResult && aiResult.match(/{[\s\S]*}/);
      if (match) {
        try {
          parsedAnalysis = JSON.parse(match[0]);
        } catch (err) {
          parsedAnalysis = { score: 0, strengths: [], weaknesses: [], suggestions: [] };
        }
      } else {
        parsedAnalysis = { score: 0, strengths: [], weaknesses: [], suggestions: [] };
      }
    }

    const resume =
      await Resume.create({
        user: req.user._id,

        fileName:
          req.file.filename,

        filePath:
          req.file.path,

        extractedText,

        analysis:
          parsedAnalysis,
      });

    // Auto-fill user profile details if they were parsed
    if (parsedAnalysis && parsedAnalysis.profile) {
      try {
        const user = await User.findById(req.user._id);
        if (user) {
          let updated = false;
          if (parsedAnalysis.profile.bio && !user.bio) {
            user.bio = parsedAnalysis.profile.bio;
            updated = true;
          }
          if (parsedAnalysis.profile.skills && parsedAnalysis.profile.skills.length > 0) {
            const existingSkills = new Set(user.skills || []);
            parsedAnalysis.profile.skills.forEach(s => {
              if (s && s.trim()) existingSkills.add(s.trim());
            });
            user.skills = Array.from(existingSkills);
            updated = true;
          }
          if (parsedAnalysis.profile.education && parsedAnalysis.profile.education.length > 0) {
            if (!user.education || user.education.length === 0) {
              user.education = parsedAnalysis.profile.education;
              updated = true;
            }
          }
          if (parsedAnalysis.profile.experience && parsedAnalysis.profile.experience.length > 0) {
            if (!user.experience || user.experience.length === 0) {
              user.experience = parsedAnalysis.profile.experience;
              updated = true;
            }
          }
          if (updated) {
            await user.save();
          }
        }
      } catch (userErr) {
        console.error("Failed to auto-fill user profile:", userErr);
      }
    }

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
exports.getMyResume = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
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


exports.getResumeById =
  async (req, res) => {
    try {
      const query = { _id: req.params.id };
      if (req.user.role !== "admin") {
        query.user = req.user._id;
      }

      const resume =
        await Resume.findOne(query);

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found",
        });
      }

      res.status(200).json({
        success: true,
        resume,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
exports.deleteResume =
  async (req, res) => {
    try {
      const query = { _id: req.params.id };
      if (req.user.role !== "admin") {
        query.user = req.user._id;
      }

      const resume =
        await Resume.findOne(query);

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found",
        });
      }

      if (
        resume.filePath &&
        fs.existsSync(
          resume.filePath
        )
      ) {
        fs.unlinkSync(
          resume.filePath
        );
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
