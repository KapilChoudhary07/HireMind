# 🧠 HireMind - AI-Powered Mock Interview & Resume Evaluator
HireMind is a cutting-edge web application designed to help job seekers supercharge their interview preparation and optimize their resumes using the power of AI. Leveraging the **Gemini 2.5 Flash** model, HireMind provides personalized resume scoring, automatic profile building, and custom mock technical interviews with real-time evaluation and feedback.

---

🌐 **Live Demo**: https://hiremindin.vercel.app/

---

## 🚀 Key Features
*   **🔒 Secure Authentication & Profile Management**: Complete sign-up, sign-in, forgot-password flow, and user profile management.
*   **📄 AI Resume Analysis (PDF)**:
    *   Upload PDF resumes to get an instant evaluation.
    *   Extracts text using `pdf-parse` and evaluates strengths, weaknesses, and a score out of 100 using Gemini.
    *   **Auto-Profile Builder**: Automatically extracts bio, skills, education, and work experience from your resume to populate your profile.
*   **💻 AI-Powered Mock Interviews**:
    *   Generate customized technical interviews tailored to specific roles/skills (e.g. MERN, Python, frontend, etc.) and difficulty levels (Beginner, Intermediate, Advanced).
    *   Generates 10 dynamic, relevant questions.
*   **📊 Automated Interview Evaluation**:
    *   Submit answers and get an instant score.
    *   Provides granular feedback including key strengths, weaknesses, and actionable recommendations.
*   **📈 User Dashboard**: Track your performance history, average interview scores, resume analytics, and past interview reports.
*   **🛠️ Admin Panel**: Admin dashboard to manage and view user contact messages and platform statistics.

---

## 🛠️ Tech Stack
### Frontend
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Notifications**: [React Hot Toast](https://reacthottoast.com/)
*   **API Client**: [Axios](https://axios-http.com/)

---
### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDBAtlas](https://www.mongodb.com/products/platform/atlas-database/)
*   **File Uploads**: [Multer](https://github.com/expressjs/multer)
*   **PDF Parsing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
### Artificial Intelligence
*   **AI Engine**: [Gemini 2.5 Flash](https://ai.google.dev/)
*   **SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai)

---
## 👨‍💻 Author
- **Developer:** Kapil Choudhary
- **Email:** [kapilchoudhary9171@gmail.com](mailto:kapilchoudhary9171@gmail.com)
- **GitHub:** [@KapilChoudhary07](https://github.com/KapilChoudhary07)
---

## 📂 Folder Structure
```text
HireMind/
├── backend/
│   ├── config/             # DB connection configuration
│   ├── controllers/        # Express request handlers (Auth, Resume, Interview, etc.)
│   ├── middleware/         # Auth verification & file upload middlewares
│   ├── models/             # Mongoose schemas (User, Resume, Interview, Contact)
│   ├── routes/             # API endpoint definitions
│   ├── services/           # Gemini AI services & PDF parser
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies & scripts
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (Auth context)
│   │   ├── pages/          # Page views (Dashboard, Resume, Interview, Admin, etc.)
│   │   ├── services/       # Frontend API calling utilities (Axios instance)
│   │   ├── App.jsx         # App router and routes setup
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Tailwind CSS import
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite configuration
└── README.md               # Root documentation (this file)


