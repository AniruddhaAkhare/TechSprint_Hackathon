import { useEffect, useState } from "react";
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [adminDetails, setAdminDetails] = useState(null);
    const navigate = useNavigate();
    const admin = auth.currentUser;
    console.log("ADMIN",admin);

    useEffect(() => {
        const fetchAdminData = async () => {
            auth.onAuthStateChanged(async (admin) => {
                if (admin) {
                    const docRef = doc(db, "Instructor", admin.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setAdminDetails({ id: admin.uid, ...docSnap.data() });
                    } else {
                        console.log("Admin is not logged in");
                    }
                } else {
                    navigate('/login');
                }
            });
        };

        fetchAdminData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
                {adminDetails ? (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Welcome, {adminDetails.f_name} {adminDetails.l_name}!
                            </h2>
                            <p className="text-gray-500 mt-1">Instructor Dashboard</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium w-24">Email:</span>
                                <span className="text-gray-800">{adminDetails.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium w-24">Mobile:</span>
                                <span className="text-gray-800">{adminDetails.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium w-24">Specialization:</span>
                                <span className="text-gray-800">{adminDetails.specialization}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/courses')}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                            >
                                View Courses
                            </button>
                            <button
                                onClick={() => navigate('/students')}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                            >
                                Manage Students
                            </button>
                            <button
                                onClick={() => navigate('/logout')}
                                className="bg-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    
                          <div className="flex justify-center items-center h-screen p-4 fixed inset-0 left-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                          </div>
                        
                      
                )}
            </div>
        </div>
    );
};


// // // import { useEffect, useState } from "react";
// // // import { auth, db } from '../../config/firebase';
// // // import { doc, getDoc } from "firebase/firestore";
// // // import { useNavigate } from "react-router-dom";

// // // export default function Profile() {
// // //     const [adminDetails, setAdminDetails] = useState(null);
// // //     const navigate = useNavigate();

// // //     useEffect(() => {
// // //         console.log("useEffect triggered");
// // //         const unsubscribe = auth.onAuthStateChanged(async (user) => {
// // //             console.log("Auth State Changed, User:", user);
// // //             if (user) {
// // //                 try {
// // //                     const docRef = doc(db, "Instructor", user.uid);
// // //                     const docSnap = await getDoc(docRef);
// // //                     if (docSnap.exists()) {
// // //                         const data = docSnap.data();
// // //                         console.log("Firestore Data:", data);
// // //                         setAdminDetails({ id: user.uid, ...data });
// // //                     } else {
// // //                         console.log("No document found for UID:", user.uid);
// // //                         setAdminDetails(null); // Optionally handle this case
// // //                     }
// // //                 } catch (error) {
// // //                     console.error("Error fetching Firestore data:", error);
// // //                 }
// // //             } else {
// // //                 console.log("No user authenticated, redirecting to login");
// // //                 navigate('/login');
// // //             }
// // //         });

// // //         // Cleanup subscription on unmount
// // //         return () => unsubscribe();
// // //     }, [navigate]);

// // //     return (
// // //         <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
// // //             <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
// // //                 {adminDetails ? (
// // //                     <>
// // //                         <div className="text-center mb-6">
// // //                             <h2 className="text-2xl font-semibold text-gray-800">
// // //                                 Welcome, {adminDetails.f_name} {adminDetails.l_name}!
// // //                             </h2>
// // //                             <p className="text-gray-500 mt-1">Instructor Dashboard</p>
// // //                         </div>
// // //                         <div className="space-y-4">
// // //                             <div className="flex items-center space-x-2">
// // //                                 <span className="text-gray-600 font-medium w-24">Email:</span>
// // //                                 <span className="text-gray-800">{adminDetails.email}</span>
// // //                             </div>
// // //                             <div className="flex items-center space-x-2">
// // //                                 <span className="text-gray-600 font-medium w-24">Mobile:</span>
// // //                                 <span className="text-gray-800">{adminDetails.phone || "Not provided"}</span>
// // //                             </div>
// // //                             <div className="flex items-center space-x-2">
// // //                                 <span className="text-gray-600 font-medium w-24">Specialization:</span>
// // //                                 <span className="text-gray-800">{adminDetails.specialization || "Not provided"}</span>
// // //                             </div>
// // //                         </div>
// // //                        <div className="mt-8 flex justify-center space-x-4">
// // //                            <button
// // //                                 onClick={() => navigate('/courses')}
// // //                                 className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
// // //                             >
// // //                                 View Courses
// // //                             </button>
// // //                             <button
// // //                                 onClick={() => navigate('/students')}
// // //                                 className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
// // //                             >
// // //                                 Manage Students
// // //                             </button> 
// // //                             <button
// // //                                 onClick={() => navigate('/logout')}
// // //                                 className="bg-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
// // //                             >
// // //                                 Logout
// // //                             </button>
// // //                         </div> 
// // //                     </>
// // //                 ) : (
// // //                     <div className="text-center">
// // //                         <p className="text-gray-500 text-lg">Loading your profile...</p>
// // //                         <div className="mt-4 flex justify-center">
// // //                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// // //                         </div>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // // // import { useEffect, useState } from "react";
// // // // // import { auth, db } from '../../config/firebase';
// // // // // import { doc, getDoc } from "firebase/firestore";
// // // // // import { useNavigate } from "react-router-dom";

// // // // // export default function Profile() {
// // // // //     const [adminDetails, setAdminDetails] = useState(null);
// // // // //     const [loading, setLoading] = useState(true); // Explicit loading state
// // // // //     const navigate = useNavigate();

// // // // //     useEffect(() => {
// // // // //         console.log("useEffect triggered");
// // // // //         const unsubscribe = auth.onAuthStateChanged(async (user) => {
// // // // //             console.log("Auth State Changed, User:", user);
// // // // //             if (user) {
// // // // //                 try {
// // // // //                     const docRef = doc(db, "Instructor", user.uid);
// // // // //                     console.log("Fetching document for UID:", user.uid);
// // // // //                     const docSnap = await getDoc(docRef);
// // // // //                     if (docSnap.exists()) {
// // // // //                         const data = docSnap.data();
// // // // //                         console.log("Firestore Data:", data);
// // // // //                         setAdminDetails({ id: user.uid, ...data });
// // // // //                     } else {
// // // // //                         console.log("No document found for UID:", user.uid);
// // // // //                         setAdminDetails(null); // No data found
// // // // //                     }
// // // // //                 } catch (error) {
// // // // //                     console.error("Error fetching Firestore data:", error);
// // // // //                     setAdminDetails(null); // Handle error case
// // // // //                 } finally {
// // // // //                     setLoading(false); // Stop loading regardless of outcome
// // // // //                 }
// // // // //             } else {
// // // // //                 console.log("No user authenticated, redirecting to login");
// // // // //                 navigate('/login');
// // // // //                 setLoading(false); // Stop loading on redirect
// // // // //             }
// // // // //         });

// // // // //         return () => unsubscribe();
// // // // //     }, [navigate]);

// // // // //     return (
// // // // //         <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
// // // // //             <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
// // // // //                 {loading ? (
// // // // //                     <div className="text-center">
// // // // //                         <p className="text-gray-500 text-lg">Loading your profile...</p>
// // // // //                         <div className="mt-4 flex justify-center">
// // // // //                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 ) : adminDetails ? (
// // // // //                     <>
// // // // //                         <div className="text-center mb-6">
// // // // //                             <h2 className="text-2xl font-semibold text-gray-800">
// // // // //                                 Welcome, {adminDetails.f_name} {adminDetails.l_name}!
// // // // //                             </h2>
// // // // //                             <p className="text-gray-500 mt-1">Instructor Dashboard</p>
// // // // //                         </div>
// // // // //                         <div className="space-y-4">
// // // // //                             <div className="flex items-center space-x-2">
// // // // //                                 <span className="text-gray-600 font-medium w-24">Email:</span>
// // // // //                                 <span className="text-gray-800">{adminDetails.email}</span>
// // // // //                             </div>
// // // // //                             <div className="flex items-center space-x-2">
// // // // //                                 <span className="text-gray-600 font-medium w-24">Mobile:</span>
// // // // //                                 <span className="text-gray-800">{adminDetails.phone || "Not provided"}</span>
// // // // //                             </div>
// // // // //                             <div className="flex items-center space-x-2">
// // // // //                                 <span className="text-gray-600 font-medium w-24">Specialization:</span>
// // // // //                                 <span className="text-gray-800">{adminDetails.specialization || "Not provided"}</span>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </>
// // // // //                 ) : (
// // // // //                     <div className="text-center">
// // // // //                         <p className="text-red-500 text-lg">No profile data found. Please ensure your account is set up correctly.</p>
// // // // //                     </div>
// // // // //                 )}
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // import { useEffect, useState } from "react";
// // // // import { auth, db } from '../../config/firebase';
// // // // import { doc, getDoc } from "firebase/firestore";
// // // // import { useNavigate } from "react-router-dom";

// // // // export default function Profile() {
// // // //     const [instructorData, setInstructorData] = useState(null);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const navigate = useNavigate();

// // // //     useEffect(() => {
// // // //         console.log("useEffect triggered");
// // // //         const unsubscribe = auth.onAuthStateChanged(async (user) => {
// // // //             console.log("Auth State Changed, User:", user);
// // // //             if (user) {
// // // //                 console.log("Authenticated User Email:", user.email);
// // // //                 try {
// // // //                     const q = query(collection(db, "Instructor"), where("email", "==", user.email));
// // // //                     const querySnapshot = await getDocs(q);
// // // //                     if (!querySnapshot.empty) {
// // // //                         const docSnap = querySnapshot.docs[0];
// // // //                         const data = docSnap.data();
// // // //                         console.log("Firestore Data:", data);
// // // //                         setAnstructorData({ id: docSnap.id, ...data });
// // // //                     } else {
// // // //                         console.log("No document found for email:", user.email);
// // // //                         setInstructorData(null);
// // // //                     }
// // // //                 } catch (error) {
// // // //                     console.error("Error fetching Firestore data:", error);
// // // //                     setInstructorData(null);
// // // //                 } finally {
// // // //                     setLoading(false);
// // // //                 }
// // // //             } else {
// // // //                 console.log("No user authenticated, redirecting to login");
// // // //                 navigate('/login');
// // // //                 setLoading(false);
// // // //             }
// // // //         });
    
// // // //         return () => unsubscribe();
// // // //     }, [navigate]);

// // // //     // useEffect(() => {
// // // //     //     console.log("useEffect triggered");
// // // //     //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
// // // //     //         console.log("Auth State Changed, User:", user);
// // // //     //         if (user) {
// // // //     //             console.log("Authenticated User UID:", user.uid);
// // // //     //             console.log("Expected Document ID:", "X5dEadcRloQM3SPGgzgw"); // Your document ID
// // // //     //             try {
// // // //     //                 const docRef = doc(db, "Instructor", user.uid);
// // // //     //                 console.log("Querying Firestore for document:", user.uid);
// // // //     //                 const docSnap = await getDoc(docRef);
// // // //     //                 if (docSnap.exists()) {
// // // //     //                     const data = docSnap.data();
// // // //     //                     console.log("Firestore Data:", data);
// // // //     //                     setAdminDetails({ id: user.uid, ...data });
// // // //     //                 } else {
// // // //     //                     console.log("No document found for UID:", user.uid);
// // // //     //                     setAdminDetails(null);
// // // //     //                 }
// // // //     //             } catch (error) {
// // // //     //                 console.error("Error fetching Firestore data:", error);
// // // //     //                 setAdminDetails(null);
// // // //     //             } finally {
// // // //     //                 setLoading(false);
// // // //     //             }
// // // //     //         } else {
// // // //     //             console.log("No user authenticated, redirecting to login");
// // // //     //             navigate('/login');
// // // //     //             setLoading(false);
// // // //     //         }
// // // //     //     });

// // // //     //     return () => unsubscribe();
// // // //     // }, [navigate]);

// // // //     return (
// // // //         <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
// // // //             <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
// // // //                 {loading ? (
// // // //                     <div className="text-center">
// // // //                         <p className="text-gray-500 text-lg">Loading your profile...</p>
// // // //                         <div className="mt-4 flex justify-center">
// // // //                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// // // //                         </div>
// // // //                     </div>
// // // //                 ) : instructorData ? (
// // // //                     <>
// // // //                         <div className="text-center mb-6">
// // // //                         <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
// // // //                                 {getUserInitials()}
// // // //                             </div>
// // // //                             <div className="ml-3">
// // // //                                 <p className="font-semibold">
// // // //                                     {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "Loading..."}
// // // //                                 </p>
// // // //                                 {instructorData?.role ? (
// // // //                                     <p className="text-xs text-gray-400">{instructorData.role}</p>
// // // //                                 ) : (
// // // //                                     <p className="text-xs text-gray-400">Role not available</p>
// // // //                                 )}
// // // //                             </div>
// // // //                             {/* <h2 className="text-2xl font-semibold text-gray-800">
// // // //                                 Welcome, {adminDetails.f_name} {adminDetails.l_name}!
// // // //                             </h2>
// // // //                             <p className="text-gray-500 mt-1">Instructor Dashboard</p>
// // // //                         </div>
// // // //                         <div className="space-y-4">
// // // //                             <div className="flex items-center space-x-2">
// // // //                                 <span className="text-gray-600 font-medium w-24">Email:</span>
// // // //                                 <span className="text-gray-800">{adminDetails.email}</span>
// // // //                             </div>
// // // //                             <div className="flex items-center space-x-2">
// // // //                                 <span className="text-gray-600 font-medium w-24">Mobile:</span>
// // // //                                 <span className="text-gray-800">{adminDetails.phone || "Not provided"}</span>
// // // //                             </div>
// // // //                             <div className="flex items-center space-x-2">
// // // //                                 <span className="text-gray-600 font-medium w-24">Specialization:</span>
// // // //                                 <span className="text-gray-800">{adminDetails.specialization || "Not provided"}</span>
// // // //                             </div> */}
// // // //                         </div>
// // // //                     </>
// // // //                 ) : (
// // // //                     <div className="text-center">
// // // //                         <p className="text-red-500 text-lg">No profile data found. Please ensure your account is set up correctly.</p>
// // // //                     </div>
// // // //                 )}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }

// // // import { useEffect, useState } from "react";
// // // import { auth, db } from '../../config/firebase';
// // // import { doc, getDoc } from "firebase/firestore";
// // // import { useNavigate } from "react-router-dom";

// // // export default function Profile() {
// // //     const [adminDetails, setAdminDetails] = useState(null);
// // //     const [loading, setLoading] = useState(true);
// // //     const navigate = useNavigate();

// // //     useEffect(() => {
// // //         console.log("useEffect triggered");
// // //         const unsubscribe = auth.onAuthStateChanged(async (user) => {
// // //             console.log("Auth State Changed, User:", user);
// // //             if (user) {
// // //                 console.log("Authenticated User UID:", user.uid);
// // //                 console.log("Authenticated User Email:", user.email);
// // //                 console.log("Expected Document ID:", "X5dEadcRloQM3SPGgzgw"); // Your known document ID
// // //                 try {
// // //                     const docRef = doc(db, "Instructor", user.uid);
// // //                     console.log("Querying Firestore for document:", user.uid);
// // //                     const docSnap = await getDoc(docRef);
// // //                     if (docSnap.exists()) {
// // //                         const data = docSnap.data();
// // //                         console.log("Firestore Data:", data);
// // //                         setAdminDetails({ id: user.uid, ...data });
// // //                     } else {
// // //                         console.log("No document found for UID:", user.uid);
// // //                         setAdminDetails(null);
// // //                     }
// // //                 } catch (error) {
// // //                     console.error("Error fetching Firestore data:", error);
// // //                     setAdminDetails(null);
// // //                 } finally {
// // //                     setLoading(false);
// // //                 }
// // //             } else {
// // //                 console.log("No user authenticated, redirecting to login");
// // //                 navigate('/login');
// // //                 setLoading(false);
// // //             }
// // //         });

// // //         return () => unsubscribe();
// // //     }, [navigate]);

// // //     return (
// // //         <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
// // //             <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
// // //                 {loading ? (
// // //                     <div className="text-center">
// // //                         <p className="text-gray-500 text-lg">Loading your profile...</p>
// // //                         <div className="mt-4 flex justify-center">
// // //                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// // //                         </div>
// // //                     </div>
// // //                 ) : adminDetails ? (
// // //                     <>
// // //                         <div className="text-center mb-6">
// // //                             <h2 className="text-2xl font-semibold text-gray-800">
// // //                                 Welcome, {adminDetails.f_name} {adminDetails.l_name}!
// // //                             </h2>
// // //                             <p className="text-gray-500 mt-1">Instructor Dashboard</p>
// // //                         </div>
// // //                         <div className="space-y-4">
// // //                             <div className="flex items-center space-x-2">
// // //                                 <span className="text-gray-600 font-medium w-24">Email:</span>
// // //                                 <span className="text-gray-800">{adminDetails.email}</span>
// // //                             </div>
// // //                             <div className="flex items-center space-x-2">
// // //                                 <span className="text-gray-600 font-medium w-24">Mobile:</span>
// // //                                 <span className="text-gray-800">{adminDetails.phone || "Not provided"}</span>
// // //                             </div>
// // //                             <div className="flex items-center space-x-2">
// // //                                 <span className="text-gray-600 font-medium w-24">Specialization:</span>
// // //                                 <span className="text-gray-800">{adminDetails.specialization || "Not provided"}</span>
// // //                             </div>
// // //                         </div>
// // //                     </>
// // //                 ) : (
// // //                     <div className="text-center">
// // //                         <p className="text-red-500 text-lg">No profile data found. Please ensure your account is set up correctly.</p>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // }


// import { useEffect, useState } from "react";
// import { auth, db } from '../../config/firebase';
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function Profile() {
//     const [adminDetails, setAdminDetails] = useState(null);
//     const [loading, setLoading] = useState(true); // Explicit loading state
//     const navigate = useNavigate();

//     useEffect(() => {
//         console.log("useEffect triggered");
//         const unsubscribe = auth.onAuthStateChanged(async (user) => {
//             console.log("Auth State Changed, User:", user);
//             if (user) {
//                 console.log("Authenticated User UID:", user.uid);
//                 console.log("Authenticated User Email:", user.email);
//                 try {
//                     const docRef = doc(db, "Instructor", user.uid);
//                     console.log("Querying Firestore for document:", user.uid);
//                     const docSnap = await getDoc(docRef);
//                     if (docSnap.exists()) {
//                         const data = docSnap.data();
//                         console.log("Firestore Data:", data);
//                         setAdminDetails({ id: user.uid, ...data });
//                     } else {
//                         console.log("No document found for UID:", user.uid);
//                         setAdminDetails(null); // No data found
//                     }
//                 } catch (error) {
//                     console.error("Error fetching Firestore data:", error);
//                     setAdminDetails(null); // Handle error case
//                 } finally {
//                     setLoading(false); // Stop loading
//                 }
//             } else {
//                 console.log("No user authenticated, redirecting to login");
//                 navigate('/login');
//                 setLoading(false);
//             }
//         });

//         // Cleanup subscription on unmount
//         return () => unsubscribe();
//     }, [navigate]);

//     return (
//         <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
//             <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
//                 {loading ? (
//                     <div className="text-center">
//                         <p className="text-gray-500 text-lg">Loading your profile...</p>
//                         <div className="mt-4 flex justify-center">
//                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                         </div>
//                     </div>
//                 ) : adminDetails ? (
//                     <>
//                         <div className="text-center mb-6">
//                             <h2 className="text-2xl font-semibold text-gray-800">
//                                 Welcome, {adminDetails.f_name} {adminDetails.l_name}!
//                             </h2>
//                             <p className="text-gray-500 mt-1">Instructor Dashboard</p>
//                         </div>
//                         <div className="space-y-4">
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-gray-600 font-medium w-24">Email:</span>
//                                 <span className="text-gray-800">{adminDetails.email}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-gray-600 font-medium w-24">Mobile:</span>
//                                 <span className="text-gray-800">{adminDetails.phone || "Not provided"}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-gray-600 font-medium w-24">Specialization:</span>
//                                 <span className="text-gray-800">{adminDetails.specialization || "Not provided"}</span>
//                             </div>
//                         </div>
//                         <div className="mt-8 flex justify-center space-x-4">
//                             <button
//                                 onClick={() => navigate('/courses')}
//                                 className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
//                             >
//                                 View Courses
//                             </button>
//                             <button
//                                 onClick={() => navigate('/students')}
//                                 className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
//                             >
//                                 Manage Students
//                             </button>
//                             <button
//                                 onClick={() => navigate('/logout')}
//                                 className="bg-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
//                             >
//                                 Logout
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="text-center">
//                         <p className="text-red-500 text-lg">No profile data found. Please ensure your account is set up correctly.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


// import { useEffect, useState } from "react";
// import { auth, db } from '../../config/firebase';
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Profile() {
//     const [adminDetails, setAdminDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const { uid } = useParams(); // Get UID from URL params

//     useEffect(() => {
//         console.log("useEffect triggered");
//         const unsubscribe = auth.onAuthStateChanged(async (user) => {
//             console.log("Auth State Changed, User:", user);
//             if (user && user.uid === uid) { // Ensure the UID matches the route
//                 console.log("Authenticated User UID:", user.uid);
//                 console.log("Authenticated User Email:", user.email);
//                 try {
//                     const docRef = doc(db, "Instructor", user.uid);
//                     console.log("Querying Firestore for document:", user.uid);
//                     const docSnap = await getDoc(docRef);
//                     if (docSnap.exists()) {
//                         const data = docSnap.data();
//                         console.log("Firestore Data:", data);
//                         setAdminDetails({ id: user.uid, ...data });
//                     } else {
//                         console.log("No document found for UID:", user.uid);
//                         setAdminDetails(null);
//                     }
//                 } catch (error) {
//                     console.error("Error fetching Firestore data:", error);
//                     setAdminDetails(null);
//                 } finally {
//                     setLoading(false);
//                 }
//             } else {
//                 console.log("No user authenticated or UID mismatch, redirecting to login");
//                 navigate('/login');
//                 setLoading(false);
//             }
//         });

//         return () => unsubscribe();
//     }, [navigate, uid]);

//     return (
//         <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
//             <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
//                 {loading ? (
//                     <div className="text-center">
//                         <p className="text-gray-500 text-lg">Loading your profile...</p>
//                         <div className="mt-4 flex justify-center">
//                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                         </div>
//                     </div>
//                 ) : adminDetails ? (
//                     <>
//                         <div className="text-center mb-6">
//                             <h2 className="text-2xl font-semibold text-gray-800">
//                                 Welcome, {adminDetails.f_name} {adminDetails.l_name}!
//                             </h2>
//                             <p className="text-gray-500 mt-1">Instructor Dashboard</p>
//                         </div>
//                         <div className="space-y-4">
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-gray-600 font-medium w-24">Email:</span>
//                                 <span className="text-gray-800">{adminDetails.email}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-gray-600 font-medium w-24">Mobile:</span>
//                                 <span className="text-gray-800">{adminDetails.phone || "Not provided"}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-gray-600 font-medium w-24">Specialization:</span>
//                                 <span className="text-gray-800">{adminDetails.specialization || "Not provided"}</span>
//                             </div>
//                         </div>
//                         <div className="mt-8 flex justify-center space-x-4">
//                             <button
//                                 onClick={() => navigate('/courses')}
//                                 className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
//                             >
//                                 View Courses
//                             </button>
//                             <button
//                                 onClick={() => navigate('/students')}
//                                 className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
//                             >
//                                 Manage Students
//                             </button>
//                             <button
//                                 onClick={() => navigate('/')}
//                                 className="bg-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
//                             >
//                                 Back to Dashboard
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="text-center">
//                         <p className="text-red-500 text-lg">No profile data found. Please ensure your account is set up correctly.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }