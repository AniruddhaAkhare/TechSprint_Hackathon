// import { createContext, useContext, useState, useEffect } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../config/firebase";

// import { onAuthStateChanged } from "firebase/auth";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     localStorage.getItem("token") ? true : false
//   );
//   const [instructorData, setInstructorData] = useState(null);

//   const login = async (token, email) => {
//     localStorage.setItem("token", token); // Store token
//     setIsAuthenticated(true);

//     try {
//       const docRef = doc(db, "Instructors", email);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setInstructorData(docSnap.data());
//       }
//     } catch (error) {
//       console.error("Error fetching instructor data:", error);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token"); // Remove token
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated, 
//       login, 
//       logout,
//       instructorData 
//     }}>

//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }


import { useEffect, useState, createContext, useContext } from "react";
import { auth, db } from "../config/firebase"; // Firebase setup
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchUserRole = async (uid) => {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);

        // Fetch role permissions
        const roleRef = doc(db, "roles", userData.role);
        const roleSnap = await getDoc(roleRef);

        if (roleSnap.exists()) {
          setRolePermissions(roleSnap.data().permissions);
        }
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) fetchUserRole(user.uid);
      else setUser(null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, rolePermissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

