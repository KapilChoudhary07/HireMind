import { useNavigate } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
// import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Interview from "./pages/Interview";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewDetails from "./pages/InterviewDetail";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminMessages
from "./pages/AdminMessages";


import ProtectedRoute from "./components/ProtectedRoute";
import { getToken } from "./utils/auth";

const PublicDashboard = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getToken());

  const requireLogin = () => {
    if (!isLoggedIn) {
      navigate("/login", { replace: false });
    }
  };

  return (
    <div
      onClickCapture={requireLogin}
    >
      <Dashboard />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

       <Route
  path="/"
  element={<PublicDashboard />}

/>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

       <Route
  path="/dashboard"
  element={<PublicDashboard />}
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
  path="/resume"
  element={
    <ProtectedRoute>
      <Resume />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/interview"
  element={
    <ProtectedRoute>
      <Interview />
    </ProtectedRoute>
  }
/>

<Route
  path="/interview-history"
  element={
    <ProtectedRoute>
      <InterviewHistory />
    </ProtectedRoute>
  }
/>

<Route
  path="/interview/:id"
  element={
    <ProtectedRoute>
      <InterviewDetails />
    </ProtectedRoute>
  }
/>


<Route
  path="/about"
  element={
    <ProtectedRoute>
      <About />
    </ProtectedRoute>
  }
/>

<Route
  path="/faq"
  element={
    <ProtectedRoute>
      <FAQ />
    </ProtectedRoute>
  }
/>

<Route
  path="/privacy-policy"
  element={
    <ProtectedRoute>
      <PrivacyPolicy />
    </ProtectedRoute>
  }
/>

<Route
  path="/terms"
  element={
    <ProtectedRoute>
      <Terms />
    </ProtectedRoute>
  }
/>

<Route
  path="/contact"
  element={
    <ProtectedRoute>
      <Contact />
    </ProtectedRoute>
  }
/>

<Route
  path="*"
  element={<NotFound />}
/>

<Route
  path="/admin/messages"
  element={
    <ProtectedRoute>
      <AdminMessages />
    </ProtectedRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
