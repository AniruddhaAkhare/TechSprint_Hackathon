// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { signOut, onAuthStateChanged } from "firebase/auth";
// // import { auth } from "../../config/firebase.js";
// // import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// // import InstructorProfile from '../components/Performance/InstructorProfile.jsx';

// // import {
// //     Typography,
// //     List,
// //     ListItem,
// //     ListItemPrefix,
// //     Accordion,
// //     AccordionHeader,
// //     AccordionBody,
// // } from "@material-tailwind/react";

// // import {
// //     InboxIcon,
// //     PowerIcon,
// //     Cog6ToothIcon,
// //     PresentationChartBarIcon,
// //     ChevronRightIcon
// // } from "@heroicons/react/24/solid";

// // export default function Sidebar() {
// //     const navigate = useNavigate();
// //     const [user, setUser] = useState(null);
// //     const [instructorData, setInstructorData] = useState(null);
// //     const firestore = getFirestore();
// //     const [openCourseDelivery, setOpenCourseDelivery] = useState(false);
// //     const [openRoles, setOpenRoles] = useState(false);
// //     const [openUsers, setOpenUsers] = useState(false);
// //     const [openSettings, setOpenSettings] = useState(false);

// //     useEffect(() => {
// //         const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
// //             if (authUser) {
// //                 setUser(authUser);
// //                 await fetchInstructorData(authUser.email);
// //             } else {
// //                 setUser(null);
// //                 setInstructorData(null);
// //             }
// //         });

// //         return () => unsubscribe();
// //     }, []);

// //     const fetchInstructorData = async (email) => {
// //         try {
// //             const instructorRef = collection(firestore, "Instructor");
// //             const q = query(instructorRef, where("email", "==", email));
// //             const querySnapshot = await getDocs(q);

// //             if (!querySnapshot.empty) {
// //                 const instructor = querySnapshot.docs[0].data(); 
// //                 setInstructorData(instructor);
// //             } else {
// //                 console.log("Instructor details not found for this email.");
// //             }
// //         } catch (error) {
// //             console.error("Error fetching instructor data:", error);
// //         }
// //     };

// //     const getUserInitials = () => {
// //         if (instructorData?.f_name && instructorData?.l_name) {
// //             return `${instructorData.f_name[0]}${instructorData.l_name[0]}`.toUpperCase();
// //         }
// //         return "U";
// //     };

// //     const handleSignOut = async () => {
// //         try {
// //             await signOut(auth);
// //             window.location.href = "/login";
// //         } catch (err) {
// //             console.log("Error signing out", err);
// //         }
// //     };

// //     return (
// //         <>
// //         <div>
// //             <div className="fixed h-screen p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-900 text-white overflow-y-auto w-80">
// //                 <div className="mb-2 p-4">
// //                     <div className="flex items-center mb-6" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
// //                         <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center ">
// //                             <img src="/img/fireblaze.jpg" alt="F" />
// //                         </div>
// //                         <Typography variant='h3' className="ml-3 text-3xl font-semibold pb-3">Fireblaze</Typography>
// //                     </div>
// //                 </div>

// //                 <List>
// //                     <ListItem onClick={() => navigate('/dashboard')}>
// //                         <ListItemPrefix>
// //                             <InboxIcon className="h-5 w-5" />
// //                         </ListItemPrefix>
// //                         Dashboard
// //                     </ListItem>

// //                     <Accordion open={openCourseDelivery}>
// //                         <ListItem className="p-0" selected={openCourseDelivery}>
// //                             <AccordionHeader onClick={() => {
// //                                 setOpenCourseDelivery(!openCourseDelivery);
// //                                 setOpenUsers(false);
// //                                 setOpenSettings(false);
// //                             }} className="border-b-0 p-3">
// //                                 <ListItemPrefix>
// //                                     <PresentationChartBarIcon className="h-5 w-5" />
// //                                 </ListItemPrefix>
// //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// //                                     Course Delivery
// //                                 </Typography>
// //                             </AccordionHeader>
// //                         </ListItem>
// //                         <AccordionBody className="py-1">
// //                             <List className="p-0 text-white">
// //                                 <ListItem onClick={() => navigate('/courses')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Courses
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/batches')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Batches
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/calendar')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Sessions
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/curriculum')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Curriculum
// //                                 </ListItem>

// //                                 <ListItem onClick={() => navigate('/attendance')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Attendance
// //                                 </ListItem>


// //                                 <ListItem onClick={() => navigate('/assignment')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Assignment
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/addPerformance')}>
// //                                     <ListItemPrefix>
// //                                         <PresentationChartBarIcon className="h-5 w-5" />
// //                                     </ListItemPrefix>
// //                                     Add Performance
// //                                 </ListItem>
// //                             </List>
// //                         </AccordionBody>
// //                     </Accordion>

// //                     <Accordion open={openUsers}>
// //                         <ListItem className="p-0" selected={openUsers}>
// //                             <AccordionHeader onClick={() => {
// //                                 setOpenUsers(!openUsers);
// //                                 setOpenRoles(false);
// //                                 setOpenCourseDelivery(false);
// //                                 setOpenSettings(false);
// //                             }} className="border-b-0 p-3">
// //                                 <ListItemPrefix>
// //                                     <PresentationChartBarIcon className="h-5 w-5" />
// //                                 </ListItemPrefix>
// //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// //                                     Users
// //                                 </Typography>
// //                             </AccordionHeader>
// //                         </ListItem>
// //                         <AccordionBody className="py-1">
// //                             <List className="p-0 text-white">
// //                                 <ListItem onClick={() => navigate('/studentdetails')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Learners
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/instructor')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Admin & staff
// //                                 </ListItem>
// //                             </List>
// //                         </AccordionBody>
// //                     </Accordion>

// //                     <ListItem onClick={() => navigate('/reports')}>
// //                         <ListItemPrefix>
// //                             <InboxIcon className="h-5 w-5" />
// //                         </ListItemPrefix>
// //                         Reports
// //                     </ListItem>


// //                     <ListItem onClick={() => navigate('/invoices')}>
// //                         <ListItemPrefix>
// //                             <InboxIcon className="h-5 w-5" />
// //                         </ListItemPrefix>
// //                         Invoices
// //                     </ListItem>


// //                     <Accordion open={openSettings}>
// //                         <ListItem className="p-0" selected={openSettings}>
// //                             <AccordionHeader onClick={() => {
// //                                 setOpenSettings(!openSettings);
// //                                 setOpenCourseDelivery(false);
// //                                 setOpenRoles(false);
// //                                 setOpenUsers(false);
// //                             }} className="border-b-0 p-3">
// //                                 <ListItemPrefix>
// //                                     <PresentationChartBarIcon className="h-5 w-5" />
// //                                 </ListItemPrefix>
// //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// //                                     Settings
// //                                 </Typography>
// //                             </AccordionHeader>
// //                         </ListItem>
// //                         <AccordionBody className="py-1">
// //                             <List className="p-0 text-white">
// //                                 <ListItem onClick={() => navigate('/centers')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Add centers
// //                                 </ListItem>

// //                                 <ListItem onClick={() => navigate('/financePartners')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Finance Partner
// //                                 </ListItem>


// //                                 <ListItem onClick={() => navigate('/fee-template')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Fee Template
// //                                 </ListItem>
// //                             </List>
// //                         </AccordionBody>
// //                     </Accordion>


// //                     <Accordion open={openRoles}>
// //                         <ListItem className="p-0" selected={openRoles}>
// //                             <AccordionHeader onClick={() => {
// //                                 setOpenRoles(!openRoles);
// //                                 setOpenCourseDelivery(false);
// //                                 setOpenUsers(false);
// //                                 setOpenSettings(false);
// //                             }} className="border-b-0 p-3">
// //                                 <ListItemPrefix>
// //                                     <PresentationChartBarIcon className="h-5 w-5" />
// //                                 </ListItemPrefix>
// //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// //                                     Users & Roles
// //                                 </Typography>
// //                             </AccordionHeader>
// //                         </ListItem>
// //                         <AccordionBody className="py-1">
// //                             <List className="p-0 text-white">
// //                                 <ListItem onClick={() => navigate('/users')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Users
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/roles')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Roles
// //                                 </ListItem>
// //                                 <ListItem onClick={() => navigate('/preferences')}>
// //                                     <ListItemPrefix>
// //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// //                                     </ListItemPrefix>
// //                                     Preferences
// //                                 </ListItem>
// //                             </List>
// //                         </AccordionBody>
// //                     </Accordion>

// //                     <ListItem onClick={handleSignOut}>
// //                         <ListItemPrefix>
// //                             <PowerIcon className="h-5 w-5" />    
// //                         </ListItemPrefix>      
// //                         Log Out
// //                     </ListItem>   
// //                     <ListItem
// //                         className="fixed bottom-0 left-0 w-70 bg-gray-800 p-2 rounded-lg flex items-center cursor-pointer"
// //                         onClick={() => navigate(`/my-profile/${user?.uid}`)}

// //                     >
// //                         <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
// //                             {getUserInitials()} 
// //                         </div>                      
// //                         <div className="ml-3">
// //                             <p className="font-semibold">
// //                                 {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "User"}
// //                             </p>
// //                             {instructorData?.specialization && (
// //                                 <p className="text-xs text-gray-400">
// //                                     {instructorData.role}
// //                                 </p>
// //                             )}
// //                         </div>
// //                     </ListItem>

// //                 </List>

// //             </div>
// //             </div>

// //         </>

// //     );
// // }


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signOut, onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../config/firebase.js";
// import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import InstructorProfile from '../components/Performance/InstructorProfile.jsx';
// import {
//     Typography,
//     List,
//     ListItem,
//     ListItemPrefix,
//     Accordion,
//     AccordionHeader,
//     AccordionBody,
// } from "@material-tailwind/react";
// import {
//     InboxIcon,
//     PowerIcon,
//     Cog6ToothIcon,
//     PresentationChartBarIcon,
//     ChevronRightIcon,
//     Bars3Icon, // Hamburger icon from Heroicons
// } from "@heroicons/react/24/solid";

// export default function Sidebar() {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [instructorData, setInstructorData] = useState(null);
//     const firestore = getFirestore();
//     const [openCourseDelivery, setOpenCourseDelivery] = useState(false);
//     const [openRoles, setOpenRoles] = useState(false);
//     const [openUsers, setOpenUsers] = useState(false);
//     const [openSettings, setOpenSettings] = useState(false);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar toggle

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
//             if (authUser) {
//                 setUser(authUser);
//                 await fetchInstructorData(authUser.email);
//             } else {
//                 setUser(null);
//                 setInstructorData(null);
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     const fetchInstructorData = async (email) => {
//         try {
//             const instructorRef = collection(firestore, "Instructor");
//             const q = query(instructorRef, where("email", "==", email));
//             const querySnapshot = await getDocs(q);

//             if (!querySnapshot.empty) {
//                 const instructor = querySnapshot.docs[0].data();
//                 setInstructorData(instructor);
//             } else {
//                 console.log("Instructor details not found for this email.");
//             }
//         } catch (error) {
//             console.error("Error fetching instructor data:", error);
//         }
//     };

//     const getUserInitials = () => {
//         if (instructorData?.f_name && instructorData?.l_name) {
//             return `${instructorData.f_name[0]}${instructorData.l_name[0]}`.toUpperCase();
//         }
//         return "U";
//     };

//     const handleSignOut = async () => {
//         try {
//             await signOut(auth);
//             window.location.href = "/login";
//         } catch (err) {
//             console.log("Error signing out", err);
//         }
//     };

//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     return (
//         <>
//             {/* Hamburger Button (Visible on small screens only) */}
//             <button
//                 className="fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-900 text-white rounded-md"
//                 onClick={toggleSidebar}
//             >
//                 <Bars3Icon className="h-6 w-6" />
//             </button>

//             {/* Sidebar */}
//             <div
//                 className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-900 text-white p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//                     isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//                 } md:translate-x-0 md:w-80`}
//             >
//                 {/* Logo Section */}
//                 <div className="mb-2 p-4">
//                     <div className="flex items-center mb-6" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
//                         <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
//                             <img src="/img/fireblaze.jpg" alt="F" className="h-full w-full object-cover rounded-full" />
//                         </div>
//                         <Typography variant='h3' className="ml-3 text-2xl md:text-3xl font-semibold pb-3">
//                             Fireblaze
//                         </Typography>
//                     </div>
//                 </div>

//                 {/* Navigation List */}
//                 <List>
//                     <ListItem onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }}>
//                         <ListItemPrefix>
//                             <InboxIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Dashboard
//                     </ListItem>

//                     <Accordion open={openCourseDelivery}>
//                         <ListItem className="p-0" selected={openCourseDelivery}>
//                             <AccordionHeader
//                                 onClick={() => {
//                                     setOpenCourseDelivery(!openCourseDelivery);
//                                     setOpenUsers(false);
//                                     setOpenSettings(false);
//                                     setOpenRoles(false);
//                                 }}
//                                 className="border-b-0 p-3"
//                             >
//                                 <ListItemPrefix>
//                                     <PresentationChartBarIcon className="h-5 w-5" />
//                                 </ListItemPrefix>
//                                 <Typography color="blue-gray" className="mr-auto font-normal">
//                                     Course Delivery
//                                 </Typography>
//                             </AccordionHeader>
//                         </ListItem>
//                         <AccordionBody className="py-1">
//                             <List className="p-0 text-white">
//                                 <ListItem onClick={() => { navigate('/courses'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Courses
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/batches'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Batches
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/calendar'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Sessions
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/curriculum'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Curriculum
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/attendance'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Attendance
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/assignment'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Assignment
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/addPerformance'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <PresentationChartBarIcon className="h-5 w-5" />
//                                     </ListItemPrefix>
//                                     Add Performance
//                                 </ListItem>
//                             </List>
//                         </AccordionBody>
//                     </Accordion>

//                     <Accordion open={openUsers}>
//                         <ListItem className="p-0" selected={openUsers}>
//                             <AccordionHeader
//                                 onClick={() => {
//                                     setOpenUsers(!openUsers);
//                                     setOpenRoles(false);
//                                     setOpenCourseDelivery(false);
//                                     setOpenSettings(false);
//                                 }}
//                                 className="border-b-0 p-3"
//                             >
//                                 <ListItemPrefix>
//                                     <PresentationChartBarIcon className="h-5 w-5" />
//                                 </ListItemPrefix>
//                                 <Typography color="blue-gray" className="mr-auto font-normal">
//                                     Users
//                                 </Typography>
//                             </AccordionHeader>
//                         </ListItem>
//                         <AccordionBody className="py-1">
//                             <List className="p-0 text-white">
//                                 <ListItem onClick={() => { navigate('/studentdetails'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Learners
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/instructor'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Admin & staff
//                                 </ListItem>
//                             </List>
//                         </AccordionBody>
//                     </Accordion>

//                     <ListItem onClick={() => { navigate('/reports'); setIsSidebarOpen(false); }}>
//                         <ListItemPrefix>
//                             <InboxIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Reports
//                     </ListItem>

//                     <ListItem onClick={() => { navigate('/invoices'); setIsSidebarOpen(false); }}>
//                         <ListItemPrefix>
//                             <InboxIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Invoices
//                     </ListItem>

//                     <Accordion open={openSettings}>
//                         <ListItem className="p-0" selected={openSettings}>
//                             <AccordionHeader
//                                 onClick={() => {
//                                     setOpenSettings(!openSettings);
//                                     setOpenCourseDelivery(false);
//                                     setOpenRoles(false);
//                                     setOpenUsers(false);
//                                 }}
//                                 className="border-b-0 p-3"
//                             >
//                                 <ListItemPrefix>
//                                     <PresentationChartBarIcon className="h-5 w-5" />
//                                 </ListItemPrefix>
//                                 <Typography color="blue-gray" className="mr-auto font-normal">
//                                     Settings
//                                 </Typography>
//                             </AccordionHeader>
//                         </ListItem>
//                         <AccordionBody className="py-1">
//                             <List className="p-0 text-white">
//                                 <ListItem onClick={() => { navigate('/centers'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Add centers
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/financePartners'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Finance Partner
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/fee-template'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Fee Template
//                                 </ListItem>
//                             </List>
//                         </AccordionBody>
//                     </Accordion>

//                     <Accordion open={openRoles}>
//                         <ListItem className="p-0" selected={openRoles}>
//                             <AccordionHeader
//                                 onClick={() => {
//                                     setOpenRoles(!openRoles);
//                                     setOpenCourseDelivery(false);
//                                     setOpenUsers(false);
//                                     setOpenSettings(false);
//                                 }}
//                                 className="border-b-0 p-3"
//                             >
//                                 <ListItemPrefix>
//                                     <PresentationChartBarIcon className="h-5 w-5" />
//                                 </ListItemPrefix>
//                                 <Typography color="blue-gray" className="mr-auto font-normal">
//                                     Users & Roles
//                                 </Typography>
//                             </AccordionHeader>
//                         </ListItem>
//                         <AccordionBody className="py-1">
//                             <List className="p-0 text-white">
//                                 <ListItem onClick={() => { navigate('/users'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Users
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/roles'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Roles
//                                 </ListItem>
//                                 <ListItem onClick={() => { navigate('/preferences'); setIsSidebarOpen(false); }}>
//                                     <ListItemPrefix>
//                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                                     </ListItemPrefix>
//                                     Preferences
//                                 </ListItem>
//                             </List>
//                         </AccordionBody>
//                     </Accordion>

//                     <ListItem onClick={() => { handleSignOut(); setIsSidebarOpen(false); }}>
//                         <ListItemPrefix>
//                             <PowerIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Log Out
//                     </ListItem>

//                     <ListItem
//                         className="fixed bottom-0 left-0 w-full bg-gray-800 p-2 rounded-lg flex items-center cursor-pointer"
//                         onClick={() => { navigate(`/my-profile/${user?.uid}`); setIsSidebarOpen(false); }}
//                     >
//                         <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
//                             {getUserInitials()}
//                         </div>
//                         <div className="ml-3">
//                             <p className="font-semibold text-sm md:text-base">
//                                 {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "User"}
//                             </p>
//                             {instructorData?.specialization && (
//                                 <p className="text-xs text-gray-400">
//                                     {instructorData.role}
//                                 </p>
//                             )}
//                         </div>
//                     </ListItem>
//                 </List>
//             </div>

//             {/* Overlay for mobile when sidebar is open */}
//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//                     onClick={toggleSidebar}
//                 />
//             )}
//         </>
//     );
// }


import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo">
        <img src="/img/fireblaze.jpg" alt="F" className="logo-icon" />
        {/* <FaGraduationCap className="logo-icon" /> */}
        <span>Fireblaze</span>
      </div>

      {/* Navigation Items */}
      <ul className="nav-list">
        <Link to="/dashboard">
        <li className="nav-item">
          <FaTachometerAlt className="nav-icon" />
          <span>Dashboard</span>
        </li>
        </Link> 

        <Link to="/institute-setup" className="nav-link">
          <li className="nav-item">
          <i class="fa-solid fa-building-columns nav-icon"></i>
            {/* <FaBook className="" /> */}
            <span>Institute Setup</span>
          </li>
        </Link>

        {/* Academic Section */}
        <li className="nav-section">Academic</li>
        <Link to="/courses" className="nav-link">
          <li className="nav-item">
            <FaBook className="nav-icon" />
            <span>Course Management</span>
          </li>
        </Link>


        <Link to='/curriculum' className='nav-link'>
          <li className="nav-item">
            <FaClipboardList className="nav-icon" />
            <span>Curriculum Management</span>
          </li>
        </Link>

        <Link to='/batches' className='nav-link'>
          <li className="nav-item">
            <FaCalendarAlt className="nav-icon" />
            <span>Batch Management</span>
          </li>
        </Link>


        <Link to='/sessions' className='nav-link'>
          <li className="nav-item">
            <FaCalendarAlt className="nav-icon" />
            <span>Session Management</span>
          </li>
        </Link>


        <Link to='/attendance' className='nav-link'>
          <li className="nav-item">
          <i class="fa-solid fa-clipboard-user nav-icon"></i>
            {/* <FaCalendarAlt className="nav-icon" /> */}
            <span>Attendance Management</span>
          </li>
        </Link>


        <Link to='/assignment' className='nav-link'>
          <li className="nav-item">
          <i class="fa-solid fa-book nav-icon"></i>
            {/* <FaCalendarAlt className="nav-icon" /> */}
            <span>Assignment Management</span>
          </li>
        </Link>


        <Link to='/addPerformance' className='nav-link'>
          <li className="nav-item">
          <i class="fa-solid fa-chart-simple nav-icon"></i>
            {/* <FaCalendarAlt className="nav-icon" /> */}
            <span>Performance Management</span>
          </li>
        </Link>

        {/* Users Section */}
        <li className="nav-section">Users</li>
        <li className="nav-item">
          <FaUsers className="nav-icon" />
          <span>User Management</span>
        </li>

        <Link to='/studentdetails' className='nav-link'>
          <li className="nav-item">
            <FaUserGraduate className="nav-icon" />
            <span>Learner Management</span>
          </li>
        </Link>


        <li className="nav-item">
          <FaQuestionCircle className="nav-icon" />
          <span>Enquiry Management</span>
        </li>


        <Link to='/instructor' className='nav-link'>
          <li className="nav-item">
            <FaUserGraduate className="nav-icon" />
            <span>Staff Management</span>
          </li>
        </Link>

        <Link to='/roles' className='nav-link'>
          <li className="nav-item">
          <i class="fa-solid fa-user nav-icon"></i>
            {/* <FaUserGraduate className="nav-icon" /> */}
            <span>Roles Management</span>
          </li>
        </Link>




        {/* Finance Section */}
        <li className="nav-section">Finance</li>
        <Link to='/reports ' className='nav-link'>
        <li className="nav-item">
          <FaMoneyBillAlt className="nav-icon" />
          <span>Fee Management</span>
        </li>
        </Link>

        {/* <Link to='/reports ' className='nav-link'>
          <li className="nav-item">
            <FaUserGraduate className="nav-icon" />
            <span>Reports Management</span>
          </li>
        </Link> */}



        <Link to='/invoices' className='nav-link'>
          <li className="nav-item">
          <i class="fa-solid fa-money-bill-trend-up nav-icon"></i>
            {/* <FaUserGraduate className="nav-icon" /> */}
            <span>Invoice Management</span>
          </li>
        </Link>


        <Link to='/financePartners' className='nav-link'>
          <li className="nav-item">
          <i class="fa-solid fa-money-check-dollar nav-icon"></i>
            {/* <FaUserGraduate className="nav-icon" /> */}
            <span>Finance Partner</span>
          </li>
        </Link>



        <Link to='/fee-template' className='nav-link'>
          <li className="nav-item">
            <FaUserGraduate className="nav-icon" />
            <span>Fee Template</span>
          </li>
        </Link>



        {/* Settings Section */}
        <li className="nav-section">Setting</li>
        <Link to='/centers' className='nav-link'>
          <li className="nav-item">
            <FaMoneyBillAlt className="nav-icon" />
            <span>Center Management</span>
          </li>
        </Link>



        {/* Admin Profile */}
        <div className="admin-profile">
        <FaUser className="nav-icon" />
        <span>Admin Profile</span>
        <span className="admin-initials">AD</span>
      </div>
        {/* <li className="nav-item admin-profile">
          <FaUser className="nav-icon" />
          <span>Admin Profile</span>
          <span className="admin-initials">AD</span>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;