// // import { db, auth } from "../../../config/firebase";
// // import { doc, getDoc } from "firebase/firestore";

// // export const checkPermissions = async (requiredPermissions) => {
// //     try {
// //         const user = auth.currentUser;
// //         if (!user) return false;

// //         const instructorDoc = await getDoc(doc(db, "Instructor", user.uid));
// //         if (!instructorDoc.exists()) return false;

// //         const instructorData = instructorDoc.data();
// //         const roleName = instructorData.role;

// //         const roleDoc = await getDoc(doc(db, "roles", roleName));
// //         if (!roleDoc.exists()) return false;

// //         const roleData = roleDoc.data();
// //         const userPermissions = roleData.permissions || [];

// //         return requiredPermissions.every((permission) =>
// //             userPermissions.includes(permission)
// //         );
// //     } catch (error) {
// //         console.error("Error checking permissions:", error);
// //         return false;
// //     }
// // };

// export const checkPermissions = async (requiredPermissions) => {
//     try {
//       const user = auth.currentUser;
//       console.log("Current User:", user);
//       if (!user) return false;
  
//       const instructorDoc = await getDoc(doc(db, "Instructor", user.uid));
//       console.log("Instructor Doc:", instructorDoc.data());
//       if (!instructorDoc.exists()) return false;
  
//       const instructorData = instructorDoc.data();
//       const roleName = instructorData.role;
//       console.log("Role Name:", roleName);
  
//       const roleDoc = await getDoc(doc(db, "roles", roleName));
//       console.log("Role Doc:", roleDoc.data());
//       if (!roleDoc.exists()) return false;
  
//       const roleData = roleDoc.data();
//       const userPermissions = roleData.permissions || [];
//       console.log("User Permissions:", userPermissions);
  
//       const hasPermissions = requiredPermissions.every((permission) =>
//         userPermissions.includes(permission)
//       );
//       console.log("Has Permissions:", hasPermissions);
  
//       return hasPermissions;
//     } catch (error) {
//       console.error("Error checking permissions:", error);
//       return false;
//     }
//   };