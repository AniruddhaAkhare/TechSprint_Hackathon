


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




import { useEffect, useState, createContext, useContext } from "react";
import { auth, db } from "../config/firebase"; // Firebase setup
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Authenticated user data from Firestore
  const [rolePermissions, setRolePermissions] = useState({}); // Permissions from role
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user data from Firestore
          const userRef = doc(db, "Users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = { uid: firebaseUser.uid, ...userSnap.data() };
            setUser(userData);

            // Fetch role permissions
            const roleRef = doc(db, "roles", userData.role);
            const roleSnap = await getDoc(roleRef);

            if (roleSnap.exists()) {
              setRolePermissions(roleSnap.data().permissions || {});
            } else {
              console.warn(`Role document for ${userData.role} not found`);
              setRolePermissions({});
            }
          } else {
            // If user doesn't exist in Firestore, create a default entry
            const defaultUserData = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Unnamed User",
              role: "role_default", // Default role ID
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, defaultUserData);
            setUser({ uid: firebaseUser.uid, ...defaultUserData });

            // Fetch default role permissions
            const roleRef = doc(db, "roles", "role_default");
            const roleSnap = await getDoc(roleRef);
            if (roleSnap.exists()) {
              setRolePermissions(roleSnap.data().permissions || {});
            } else {
              setRolePermissions({});
            }
          }
        } else {
          // User signed out
          setUser(null);
          setRolePermissions({});
        }
      } catch (error) {
        console.error("Error in AuthContext:", error);
        setUser(null);
        setRolePermissions({});
      } finally {
        setLoading(false); // Done loading, whether success or failure
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, rolePermissions, loading }}>
      {!loading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};