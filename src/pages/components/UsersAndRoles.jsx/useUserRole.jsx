import { useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      const user = auth.currentUser;  // Get logged-in user
      if (user) {
        const q = query(collection(db, "Instructor"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserRole(userData.role);
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return { userRole, loading };
};

export default useUserRole;
