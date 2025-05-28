import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

          if (!userDoc.exists()) {
            const defaultRole = '9dWp6jTZwysa90GWV4sB';
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