import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../hooks/useGlobalContext";

// Create a provider component
export const ContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleToast = (message, status) => {
    const toastType = {
      success: toast.success,
      error: toast.error,
      info: toast.info,
    };

    if (toastType[status]) {
      toastType[status](message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // register function
  const register = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    console.log(data);
    try {
      // handle user registration
      handleToast(
        "Registration successful! Please verify your OTP.",
        "success"
      );

      await checkAuth();

      navigate("/verify-otp");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);

      handleToast(errorMessage, "error");

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    // Implement login
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    // Implement logout
  };

  // Email Verification function
  const verifyEmail = async (code) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    console.log(code)

    // Implement email verification
  };

  // Create user profile
  const createProfile = async (formData) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    // Implement create profile
  };

  // Check Auth Status function
  const checkAuth = async () => {
    setIsCheckingAuth(true);
    setError(null);

    // Implement check auth
  };

  // Forgot Password function
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    // Implement forgot password
  };

  // Reset Password function
  const resetPassword = async (token, password) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    // Implement reset password
  };


  // Delete Profile
  const deleteProfile = async (password, userId) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    // Implement delete profile
  };

  // Get all users
  const getAllUsers = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    // Implement get all users
  };

  // Execute checkAuth when the component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = {
    users,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    error,
    setError,
    isLoading,
    setIsLoading,
    isCheckingAuth,
    setIsCheckingAuth,
    message,
    setMessage,
    register,
    login,
    verifyEmail,
    logout,
    checkAuth,
    forgotPassword,
    resetPassword,
    deleteProfile,
    createProfile,
    getAllUsers,
    handleToast,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
