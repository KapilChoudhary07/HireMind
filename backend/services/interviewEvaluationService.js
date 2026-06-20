// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const evaluateAnswers = async (
//   questions
// ) => {
//   const prompt = `
// You are a senior technical interviewer.

// Evaluate these interview answers.

// Return ONLY valid JSON.

// {
//   "overallScore": 0,
//   "strengths": [],
//   "weaknesses": [],
//   "suggestions": []
// }

// Questions and Answers:

// ${JSON.stringify(questions)}
// `;

//   const response =
//     await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: prompt,
//     });

//   return response.text;
// };

// module.exports = {
//   evaluateAnswers,
// };



// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const evaluateAnswers = async (
//   questions
// ) => {
//   try {
//     const prompt = `
// You are a senior technical interviewer.

// Evaluate these interview answers.

// Return ONLY valid JSON.

// {
//   "overallScore": 0,
//   "strengths": [],
//   "weaknesses": [],
//   "suggestions": []
// }

// Questions and Answers:

// ${JSON.stringify(questions)}
// `;

//     const response =
//       await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: prompt,
//       });

//     return response.text;
//   } catch (error) {
//     console.log(
//       "Gemini Error:",
//       error.message
//     );

//     return JSON.stringify({
//       overallScore: 75,
//       strengths: [
//         "Good communication"
//       ],
//       weaknesses: [
//         "Need stronger technical depth"
//       ],
//       suggestions: [
//         "Practice DSA",
//         "Improve MERN concepts"
//       ]
//     });
//   }
// };

// module.exports = {
//   evaluateAnswers,
// };


const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const evaluateAnswers = async (questions) => {
  try {
    const prompt = `
You are a senior technical interviewer.

Evaluate these interview answers.

Return ONLY valid JSON.

{
  "overallScore": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Questions and Answers:

${JSON.stringify(questions)}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    return response.text;
  } catch (error) {
    throw new Error("Unable to evaluate interview answers");
  }
};

module.exports = {
  evaluateAnswers,
};
