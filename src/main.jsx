import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
