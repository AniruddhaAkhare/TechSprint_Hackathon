import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase"; 

export const fetchUserPermissions = async (userId) => {
  try {
    // Get the user document
    const userDoc = await getDoc(doc(db, "Instructor", userId));
    if (!userDoc.exists()) throw new Error("User not found");

    const { roleId } = userDoc.data();
    if (!roleId) throw new Error("User has no assigned role");

    // Fetch role document
    const roleDoc = await getDoc(doc(db, "roles", roleId));
    if (!roleDoc.exists()) throw new Error("Role not found");

    return roleDoc.data().permissions; // Return permissions object
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return {}; // Return empty permissions if error occurs
  }
};
