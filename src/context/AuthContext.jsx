import { createContext, useContext, useState } from "react";

// Create the authentication context
const AuthContext = createContext();

// Provide authentication state and functions
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  // Function to log in
  const login = (token) => {
    localStorage.setItem("token", token); // Store token
    setIsAuthenticated(true);
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context
export function useAuth() {
  return useContext(AuthContext);
}
