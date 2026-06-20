const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateQuestions = async (
  skills,
  interviewType,
  difficulty = "beginner"
) => {
  try {
    const prompt = `
Generate 10 interview questions.

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Skills:
${Array.isArray(skills) && skills.length ? skills.join(", ") : "General software development"}

Difficulty guidance:
- beginner: fundamentals, definitions, and simple practical scenarios
- intermediate: applied concepts, debugging, trade-offs, and architecture basics
- advanced: complex scenarios, system design, performance, security, and deep trade-offs

Generate questions that strictly match the selected difficulty.

Return ONLY valid JSON.

{
  "questions": [
    ""
  ]
}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    return response.text;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  generateQuestions,
};
