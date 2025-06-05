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
    //console.error("Error logging activity:", error);
  }
};


// import { db } from "../../../../config/firebase.js";
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// export const logActivity = async (action, details, user) => {
//   try {
//     const activityLog = {
//       action,
//       details,
//       timestamp: new Date().toISOString(),
//       userEmail: user?.email || "anonymous",
//       userId: user?.uid,
//     };

//     const logsDocRef = doc(db, "activityLogs", "logs");

//     // Fetch the current logs document
//     const logsDoc = await getDoc(logsDocRef);
//     let currentLogs = [];

//     if (logsDoc.exists()) {
//       currentLogs = logsDoc.data().logs || [];
//     } else {
//       // Initialize the document if it doesn't exist
//       await setDoc(logsDocRef, { logs: [] });
//     }

//     // Cap the logs array at 1000
//     if (currentLogs.length >= 1000) {
//       currentLogs.shift(); // Remove the oldest log (first element)
//     }

//     // Append the new log
//     currentLogs.push(activityLog);

//     // Update the document with the new logs array
//     await updateDoc(logsDocRef, {
//       logs: currentLogs,
//     });
//   } catch (error) {
//     console.error("Error logging activity:", error);
//   }
// };