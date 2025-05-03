import { db } from "../../../../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";

export const logActivity = async (action, details, user) => {
  try {
    const activityLog = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user?.email || "anonymous",
      userId: user?.uid,
    };
    await addDoc(collection(db, "activityLogs"), activityLog);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};