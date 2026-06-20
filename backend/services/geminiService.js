const { GoogleGenAI } = require("@google/genai");

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const analyzeResume = async (resumeText) => {
  // If no API key available, return a safe default analysis
  if (!ai) {
    return JSON.stringify({
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      profile: {
        bio: "",
        skills: [],
        education: [],
        experience: []
      }
    });
  }

  try {
    const prompt = `Analyze this resume. Extract both the assessment scores/feedback and candidate details (bio, skills, education, experience) into the specified JSON format.
Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "profile": {
    "bio": "A brief professional summary parsed from the resume",
    "skills": ["Skill1", "Skill2"],
    "education": [
      {
        "college": "College/University Name",
        "degree": "Degree Name",
        "year": "Graduation Year (e.g. 2024)"
      }
    ],
    "experience": [
      {
        "company": "Company Name",
        "role": "Role Title",
        "duration": "Duration (e.g. 2 Years, 2022-2024)"
      }
    ]
  }
}

Resume:

${resumeText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    // On failure, return a safe default JSON string
    return JSON.stringify({
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      profile: {
        bio: "",
        skills: [],
        education: [],
        experience: []
      }
    });
  }
};

module.exports = {
  analyzeResume,
};