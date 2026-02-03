import { createContext, useContext } from "react";

// Create the GlobalContext
export const GlobalContext = createContext();

// Create a custom hook to use the GlobalContext
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  
  if (!context) {
    throw new Error("useGlobalContext must be used within a ContextProvider");
  }
  
  return context;
};