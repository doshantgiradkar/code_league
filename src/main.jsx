import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";
import App from "./App.jsx";
import About from "./pages/About.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Hello from "./pages/Hello.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UploadResumeExample from "./pages/UploadResumeExample.jsx";
import UploadResume from "./pages/UploadResume.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import SkillDashboard from "./pages/SkillDashboard.jsx";
import SkillGapsPage from "./pages/SkillGapsPage.jsx";
import CareerRoadmap from "./pages/CareerRoadmap.jsx";
import LearningRecommendations from "./pages/LearningRecommendations.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import JobMarketDashboard from "./pages/JobMarketDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "hello/:name", element: <Hello /> },
      { path: "chat", element: <ChatRoom /> },
      { path: "upload-resume-example", element: <UploadResumeExample /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Protected learner routes
      {
        path: "dashboard",
        element: <SkillDashboard />
      },
      {
        path: "dashboard",
        element: <SkillDashboard />
      },
      {
        path: "profile",
        element: <UserProfile />
      },
      {
        path: "skill-gaps",
        element: <SkillGapsPage />
      },
      {
        path: "learning",
        element: <LearningRecommendations />
      },
      {
        path: "job-market",
        element: <JobMarketDashboard />
      },
      {
        path: "career-roadmap",
        element: <CareerRoadmap />
      },
      {
        path: "upload-resume",
        element: <UploadResume />
      },
      {
        path: "password-reset",
        element: <PasswordReset />
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      theme="dark"
      autoClose={3000}
    />
  </AuthProvider>
);
