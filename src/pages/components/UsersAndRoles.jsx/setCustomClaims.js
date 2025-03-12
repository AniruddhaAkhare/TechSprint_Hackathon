// const admin = require("firebase-admin");

// // Load Firebase Admin credentials
// const serviceAccount = require("./serviceAccountKey.json"); // Replace with your actual path

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// async function setCustomUserClaim() {
//   const uid = "USER_UID_HERE"; // Replace with the actual UID of the user
//   try {
//     await admin.auth().setCustomUserClaims(uid, { role: "Super Admin" });
//     console.log(`Custom claim set successfully for user: ${uid}`);
//   } catch (error) {
//     console.error("Error setting custom claim:", error);
//   }
// }

// // Run the function
// setCustomUserClaim();
