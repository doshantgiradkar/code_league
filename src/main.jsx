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
import UploadResume from "./pages/UploadResume.jsx";

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
      { path: "upload-resume", element: <UploadResume /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
