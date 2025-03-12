// import { db, auth } from "../config/firebase";
// import { doc, getDoc } from "firebase/firestore";

// const fetchUserRolePermissions = async () => {
//   if (!auth.currentUser) return null;

//   // Fetch user role from Firestore
//   const userRef = doc(db, "Instructor", auth.currentUser.email);
//   const userDoc = await getDoc(userRef);

//   if (!userDoc.exists()) return null;

//   const { role } = userDoc.data(); // Get user's role

//   // Fetch role permissions from Firestore
//   const roleRef = doc(db, "roles", role);
//   const roleDoc = await getDoc(roleRef);

//   if (!roleDoc.exists()) return null;

//   return roleDoc.data().permissions; // Return the permissions map
// };

// export default fetchUserRolePermissions;
