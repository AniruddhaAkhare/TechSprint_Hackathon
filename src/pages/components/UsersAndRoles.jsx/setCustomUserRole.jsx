// const admin = require("firebase-admin");

// async function setCustomUserRole(email, role) {
//   try {
//     const user = await admin.auth().getUserByEmail(email);
//     await admin.auth().setCustomUserClaims(user.uid, { role });
//     console.log(`✅ Role '${role}' assigned to '${email}'`);
//   } catch (error) {
//     console.error("❌ Error setting custom claims:", error);
//   }
// }

// // Assign roles
// setCustomUserRole("dummy@gmail.com", "Super Admin");
// setCustomUserRole("instructor@example.com", "Instructor");
