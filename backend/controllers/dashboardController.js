const Resume = require("../models/Resume");
const Interview = require("../models/Interview");

exports.getDashboardStats =
  async (req, res) => {
    try {
      const totalResumes =
        await Resume.countDocuments({
          user: req.user._id,
        });

      const totalInterviews =
        await Interview.countDocuments({
          user: req.user._id,
        });

      const interviews =
        await Interview.find({
          user: req.user._id,
        });

      let averageScore = 0;
      let highestScore = 0;

      if (interviews.length > 0) {
        const totalScore =
          interviews.reduce(
            (acc, item) =>
              acc +
              (item.overallScore || 0),
            0
          );

        averageScore =
          totalScore /
          interviews.length;

        highestScore =
          Math.max(
            ...interviews.map(
              (i) =>
                i.overallScore || 0
            )
          );
      }

      const recentInterviews =
        await Interview.find({
          user: req.user._id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(5);

      const recentResumes =
        await Resume.find({
          user: req.user._id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(5);

      res.status(200).json({
        success: true,
        stats: {
          totalResumes,
          totalInterviews,
          averageScore:
            Math.round(
              averageScore
            ),
          highestScore,
          recentInterviews,
          recentResumes,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };