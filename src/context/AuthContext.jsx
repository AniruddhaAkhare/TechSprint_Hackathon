import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [instructorData, setInstructorData] = useState(null);

  const login = async (token, email) => {
    localStorage.setItem("token", token); // Store token
    setIsAuthenticated(true);

    try {
      const docRef = doc(db, "Instructors", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInstructorData(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout,
      instructorData 
    }}>

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
