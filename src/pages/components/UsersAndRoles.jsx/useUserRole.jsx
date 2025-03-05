// // import { useEffect, useState } from "react";
// // import { auth, db } from "../../../config/firebase";
// // import { collection, query, where, getDocs } from "firebase/firestore";

// // const useUserRole = () => {
// //   const [userRole, setUserRole] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchUserRole = async () => {
// //       setLoading(true);
// //       const user = auth.currentUser;  // Get logged-in user
// //       if (user) {
// //         const q = query(collection(db, "Instructor"), where("email", "==", user.email));
// //         const querySnapshot = await getDocs(q);
// //         if (!querySnapshot.empty) {
// //           const userData = querySnapshot.docs[0].data();
// //           setUserRole(userData.role);
// //         }
// //       }
// //       setLoading(false);
// //     };

// //     fetchUserRole();
// //   }, []);

// //   return { userRole, loading };
// // };

// // export default useUserRole;


// // useUserRole.js
// import { useState, useEffect } from "react";
// import { auth, db } from "../../../config/firebase";
// import { doc, getDoc } from "firebase/firestore";

// const useUserRole = () => {
//   const [userRole, setUserRole] = useState(null);
//   const [permissions, setPermissions] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch user document from 'Instructor' collection
//         const userDoc = await getDoc(doc(db, "Instructor", user.uid));
//         if (userDoc.exists()) {
//           const { role } = userDoc.data();
//           setUserRole(role);

//           // Fetch role document to get permissions
//           const roleSnapshot = await getDoc(doc(db, "roles", role));
//           if (roleSnapshot.exists()) {
//             setPermissions(roleSnapshot.data().permissions || {});
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user role:", error);
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   return { userRole, permissions, loading };
// };

// export default useUserRole;