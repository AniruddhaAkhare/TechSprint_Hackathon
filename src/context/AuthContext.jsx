


// import { useEffect, useState, createContext, useContext } from "react";
// import { auth, db } from "../config/firebase"; // Firebase setup
// import { doc, getDoc } from "firebase/firestore";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [rolePermissions, setRolePermissions] = useState({});

//   useEffect(() => {
//     const fetchUserRole = async (uid) => {
//       const userRef = doc(db, "Users", uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         setUser(userData);

//         // Fetch role permissions
//         const roleRef = doc(db, "roles", userData.role);
//         const roleSnap = await getDoc(roleRef);

//         if (roleSnap.exists()) {
//           setRolePermissions(roleSnap.data().permissions);
//         }
//       }
//     };

//     auth.onAuthStateChanged((user) => {
//       if (user) fetchUserRole(user.uid);
//       else setUser(null);
//     });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, rolePermissions }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




// import { useEffect, useState, createContext, useContext } from "react";
// import { auth, db } from "../config/firebase"; // Firebase setup
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Authenticated user data from Firestore
//   const [rolePermissions, setRolePermissions] = useState({}); // Permissions from role
//   const [loading, setLoading] = useState(true); // Loading state for initial fetch

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       try {
//         if (firebaseUser) {
//           const userRef = doc(db, "Users", firebaseUser.uid);
//           const userSnap = await getDoc(userRef);

//           if (userSnap.exists()) {
//             const userData = { uid: firebaseUser.uid, ...userSnap.data() };
//             setUser(userData);

//             // Fetch role permissions
//             const roleRef = doc(db, "roles", userData.role);
//             // const roleRef = doc(db, "roles", userData.role);
//             const roleSnap = await getDoc(roleRef);

//             if (roleSnap.exists()) {
//               setRolePermissions(roleSnap.data().permissions || {});
//             } else {
//               console.warn(`Role document for ${userData.role} not found`);
//               setRolePermissions({});
//             }
//           } else {
//             // If user doesn't exist in Firestore, create a default entry
//             const defaultUserData = {
//               email: firebaseUser.email,
//               displayName: firebaseUser.displayName || "Unnamed User",
//               role: "kPlDMnmI8YBXQLhJLas1", // Default role ID
//               createdAt: new Date().toISOString(),
//             };
//             await setDoc(userRef, defaultUserData);
//             setUser({ uid: firebaseUser.uid, ...defaultUserData });

//             // Fetch default role permissions
//             const roleRef = doc(db, "roles", "kPlDMnmI8YBXQLhJLas1");
//             const roleSnap = await getDoc(roleRef);
//             if (roleSnap.exists()) {
//               setRolePermissions(roleSnap.data().permissions || {});
//             } else {
//               setRolePermissions({});
//             }
//           }
//         } else {
//           // User signed out
//           setUser(null);
//           setRolePermissions({});
//         }
//       } catch (error) {
//         console.error("Error in AuthContext:", error);
//         setUser(null);
//         setRolePermissions({});
//       } finally {
//         setLoading(false); // Done loading, whether success or failure
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, rolePermissions, loading }}>
//       {!loading && children} {/* Render children only when not loading */}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };




// src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import { auth, db } from '../config/firebase'; // Adjust path
// import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc, setDoc } from 'firebase/firestore';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [rolePermissions, setRolePermissions] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const userDocRef = doc(db, 'Users', currentUser.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (!userDoc.exists()) {
//           // If user doesn't exist in Firestore, create their document
//           const defaultRole = '7Tl5zWnEZgkJR9rcVp5r'; // Default role ID
//           await setDoc(userDocRef, {
//             email: currentUser.email,
//             displayName: currentUser.displayName || currentUser.email.split('@')[0],
//             role: defaultRole,
//             createdAt: new Date().toISOString(),
//           });
//         }

//         // Fetch user data and role permissions
//         const updatedUserDoc = await getDoc(userDocRef);
//         const userData = updatedUserDoc.data();
//         const roleDoc = await getDoc(doc(db, 'roles', userData.role));
//         setUser(currentUser);
//         setRolePermissions(roleDoc.exists() ? roleDoc.data().permissions : {});
//       } else {
//         setUser(null);
//         setRolePermissions({});
//       }
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   const login = async (email, password) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, rolePermissions, login }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase'; // Adjust path
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Create authentication context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      try {
        if (currentUser) {
          const userDocRef = doc(db, 'Users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          // If user doesn't exist in Firestore, create their document
          if (!userDoc.exists()) {
            const defaultRole = '7Tl5zWnEZgkJR9rcVp5r';
            const userData = {
              uid: currentUser.uid, // Explicitly store UID
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email.split('@')[0],
              role: defaultRole,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };

            await setDoc(userDocRef, userData);
          } else {
            // Optional: Update last login timestamp for existing users
            await setDoc(userDocRef, {
              lastLogin: new Date().toISOString()
            }, { merge: true });
          }

          // Fetch updated user data and role permissions
          const updatedUserDoc = await getDoc(userDocRef);
          const userData = updatedUserDoc.data();
          const roleDoc = await getDoc(doc(db, 'roles', userData.role));

          setUser(currentUser);
          setRolePermissions(roleDoc.exists() ? roleDoc.data().permissions : {});
        } else {
          setUser(null);
          setRolePermissions({});
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setRolePermissions({});
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, rolePermissions }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);