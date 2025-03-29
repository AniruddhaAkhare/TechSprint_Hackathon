// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // import { signOut, onAuthStateChanged } from "firebase/auth";
// // // // // // // import { auth } from "../../config/firebase.js";
// // // // // // // import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// // // // // // // import InstructorProfile from '../components/Performance/InstructorProfile.jsx';

// // // // // // // import {
// // // // // // //     Typography,
// // // // // // //     List,
// // // // // // //     ListItem,
// // // // // // //     ListItemPrefix,
// // // // // // //     Accordion,
// // // // // // //     AccordionHeader,
// // // // // // //     AccordionBody,
// // // // // // // } from "@material-tailwind/react";

// // // // // // // import {
// // // // // // //     InboxIcon,
// // // // // // //     PowerIcon,
// // // // // // //     Cog6ToothIcon,
// // // // // // //     PresentationChartBarIcon,
// // // // // // //     ChevronRightIcon
// // // // // // // } from "@heroicons/react/24/solid";

// // // // // // // export default function Sidebar() {
// // // // // // //     const navigate = useNavigate();
// // // // // // //     const [user, setUser] = useState(null);
// // // // // // //     const [instructorData, setInstructorData] = useState(null);
// // // // // // //     const firestore = getFirestore();
// // // // // // //     const [openCourseDelivery, setOpenCourseDelivery] = useState(false);
// // // // // // //     const [openRoles, setOpenRoles] = useState(false);
// // // // // // //     const [openUsers, setOpenUsers] = useState(false);
// // // // // // //     const [openSettings, setOpenSettings] = useState(false);

// // // // // // //     useEffect(() => {
// // // // // // //         const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
// // // // // // //             if (authUser) {
// // // // // // //                 setUser(authUser);
// // // // // // //                 await fetchInstructorData(authUser.email);
// // // // // // //             } else {
// // // // // // //                 setUser(null);
// // // // // // //                 setInstructorData(null);
// // // // // // //             }
// // // // // // //         });

// // // // // // //         return () => unsubscribe();
// // // // // // //     }, []);

// // // // // // //     const fetchInstructorData = async (email) => {
// // // // // // //         try {
// // // // // // //             const instructorRef = collection(firestore, "Instructor");
// // // // // // //             const q = query(instructorRef, where("email", "==", email));
// // // // // // //             const querySnapshot = await getDocs(q);

// // // // // // //             if (!querySnapshot.empty) {
// // // // // // //                 const instructor = querySnapshot.docs[0].data(); 
// // // // // // //                 setInstructorData(instructor);
// // // // // // //             } else {
// // // // // // //                 console.log("Instructor details not found for this email.");
// // // // // // //             }
// // // // // // //         } catch (error) {
// // // // // // //             console.error("Error fetching instructor data:", error);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const getUserInitials = () => {
// // // // // // //         if (instructorData?.f_name && instructorData?.l_name) {
// // // // // // //             return `${instructorData.f_name[0]}${instructorData.l_name[0]}`.toUpperCase();
// // // // // // //         }
// // // // // // //         return "U";
// // // // // // //     };

// // // // // // //     const handleSignOut = async () => {
// // // // // // //         try {
// // // // // // //             await signOut(auth);
// // // // // // //             window.location.href = "/login";
// // // // // // //         } catch (err) {
// // // // // // //             console.log("Error signing out", err);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <>
// // // // // // //         <div>
// // // // // // //             <div className="fixed h-screen p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-900 text-white overflow-y-auto w-80">
// // // // // // //                 <div className="mb-2 p-4">
// // // // // // //                     <div className="flex items-center mb-6" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
// // // // // // //                         <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center ">
// // // // // // //                             <img src="/img/fireblaze.jpg" alt="F" />
// // // // // // //                         </div>
// // // // // // //                         <Typography variant='h3' className="ml-3 text-3xl font-semibold pb-3">Fireblaze</Typography>
// // // // // // //                     </div>
// // // // // // //                 </div>

// // // // // // //                 <List>
// // // // // // //                     <ListItem onClick={() => navigate('/dashboard')}>
// // // // // // //                         <ListItemPrefix>
// // // // // // //                             <InboxIcon className="h-5 w-5" />
// // // // // // //                         </ListItemPrefix>
// // // // // // //                         Dashboard
// // // // // // //                     </ListItem>

// // // // // // //                     <Accordion open={openCourseDelivery}>
// // // // // // //                         <ListItem className="p-0" selected={openCourseDelivery}>
// // // // // // //                             <AccordionHeader onClick={() => {
// // // // // // //                                 setOpenCourseDelivery(!openCourseDelivery);
// // // // // // //                                 setOpenUsers(false);
// // // // // // //                                 setOpenSettings(false);
// // // // // // //                             }} className="border-b-0 p-3">
// // // // // // //                                 <ListItemPrefix>
// // // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // // //                                 </ListItemPrefix>
// // // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // // //                                     Course Delivery
// // // // // // //                                 </Typography>
// // // // // // //                             </AccordionHeader>
// // // // // // //                         </ListItem>
// // // // // // //                         <AccordionBody className="py-1">
// // // // // // //                             <List className="p-0 text-white">
// // // // // // //                                 <ListItem onClick={() => navigate('/courses')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Courses
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/batches')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Batches
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/calendar')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Sessions
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/curriculum')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Curriculum
// // // // // // //                                 </ListItem>

// // // // // // //                                 <ListItem onClick={() => navigate('/attendance')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Attendance
// // // // // // //                                 </ListItem>


// // // // // // //                                 <ListItem onClick={() => navigate('/assignment')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Assignment
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/addPerformance')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <PresentationChartBarIcon className="h-5 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Add Performance
// // // // // // //                                 </ListItem>
// // // // // // //                             </List>
// // // // // // //                         </AccordionBody>
// // // // // // //                     </Accordion>

// // // // // // //                     <Accordion open={openUsers}>
// // // // // // //                         <ListItem className="p-0" selected={openUsers}>
// // // // // // //                             <AccordionHeader onClick={() => {
// // // // // // //                                 setOpenUsers(!openUsers);
// // // // // // //                                 setOpenRoles(false);
// // // // // // //                                 setOpenCourseDelivery(false);
// // // // // // //                                 setOpenSettings(false);
// // // // // // //                             }} className="border-b-0 p-3">
// // // // // // //                                 <ListItemPrefix>
// // // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // // //                                 </ListItemPrefix>
// // // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // // //                                     Users
// // // // // // //                                 </Typography>
// // // // // // //                             </AccordionHeader>
// // // // // // //                         </ListItem>
// // // // // // //                         <AccordionBody className="py-1">
// // // // // // //                             <List className="p-0 text-white">
// // // // // // //                                 <ListItem onClick={() => navigate('/studentdetails')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Learners
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/instructor')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Admin & staff
// // // // // // //                                 </ListItem>
// // // // // // //                             </List>
// // // // // // //                         </AccordionBody>
// // // // // // //                     </Accordion>

// // // // // // //                     <ListItem onClick={() => navigate('/reports')}>
// // // // // // //                         <ListItemPrefix>
// // // // // // //                             <InboxIcon className="h-5 w-5" />
// // // // // // //                         </ListItemPrefix>
// // // // // // //                         Reports
// // // // // // //                     </ListItem>


// // // // // // //                     <ListItem onClick={() => navigate('/invoices')}>
// // // // // // //                         <ListItemPrefix>
// // // // // // //                             <InboxIcon className="h-5 w-5" />
// // // // // // //                         </ListItemPrefix>
// // // // // // //                         Invoices
// // // // // // //                     </ListItem>


// // // // // // //                     <Accordion open={openSettings}>
// // // // // // //                         <ListItem className="p-0" selected={openSettings}>
// // // // // // //                             <AccordionHeader onClick={() => {
// // // // // // //                                 setOpenSettings(!openSettings);
// // // // // // //                                 setOpenCourseDelivery(false);
// // // // // // //                                 setOpenRoles(false);
// // // // // // //                                 setOpenUsers(false);
// // // // // // //                             }} className="border-b-0 p-3">
// // // // // // //                                 <ListItemPrefix>
// // // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // // //                                 </ListItemPrefix>
// // // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // // //                                     Settings
// // // // // // //                                 </Typography>
// // // // // // //                             </AccordionHeader>
// // // // // // //                         </ListItem>
// // // // // // //                         <AccordionBody className="py-1">
// // // // // // //                             <List className="p-0 text-white">
// // // // // // //                                 <ListItem onClick={() => navigate('/centers')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Add centers
// // // // // // //                                 </ListItem>

// // // // // // //                                 <ListItem onClick={() => navigate('/financePartners')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Finance Partner
// // // // // // //                                 </ListItem>


// // // // // // //                                 <ListItem onClick={() => navigate('/fee-template')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Fee Template
// // // // // // //                                 </ListItem>
// // // // // // //                             </List>
// // // // // // //                         </AccordionBody>
// // // // // // //                     </Accordion>


// // // // // // //                     <Accordion open={openRoles}>
// // // // // // //                         <ListItem className="p-0" selected={openRoles}>
// // // // // // //                             <AccordionHeader onClick={() => {
// // // // // // //                                 setOpenRoles(!openRoles);
// // // // // // //                                 setOpenCourseDelivery(false);
// // // // // // //                                 setOpenUsers(false);
// // // // // // //                                 setOpenSettings(false);
// // // // // // //                             }} className="border-b-0 p-3">
// // // // // // //                                 <ListItemPrefix>
// // // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // // //                                 </ListItemPrefix>
// // // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // // //                                     Users & Roles
// // // // // // //                                 </Typography>
// // // // // // //                             </AccordionHeader>
// // // // // // //                         </ListItem>
// // // // // // //                         <AccordionBody className="py-1">
// // // // // // //                             <List className="p-0 text-white">
// // // // // // //                                 <ListItem onClick={() => navigate('/users')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Users
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/roles')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Roles
// // // // // // //                                 </ListItem>
// // // // // // //                                 <ListItem onClick={() => navigate('/preferences')}>
// // // // // // //                                     <ListItemPrefix>
// // // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // // //                                     </ListItemPrefix>
// // // // // // //                                     Preferences
// // // // // // //                                 </ListItem>
// // // // // // //                             </List>
// // // // // // //                         </AccordionBody>
// // // // // // //                     </Accordion>

// // // // // // //                     <ListItem onClick={handleSignOut}>
// // // // // // //                         <ListItemPrefix>
// // // // // // //                             <PowerIcon className="h-5 w-5" />    
// // // // // // //                         </ListItemPrefix>      
// // // // // // //                         Log Out
// // // // // // //                     </ListItem>   
// // // // // // //                     <ListItem
// // // // // // //                         className="fixed bottom-0 left-0 w-70 bg-gray-800 p-2 rounded-lg flex items-center cursor-pointer"
// // // // // // //                         onClick={() => navigate(`/my-profile/${user?.uid}`)}

// // // // // // //                     >
// // // // // // //                         <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
// // // // // // //                             {getUserInitials()} 
// // // // // // //                         </div>                      
// // // // // // //                         <div className="ml-3">
// // // // // // //                             <p className="font-semibold">
// // // // // // //                                 {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "User"}
// // // // // // //                             </p>
// // // // // // //                             {instructorData?.specialization && (
// // // // // // //                                 <p className="text-xs text-gray-400">
// // // // // // //                                     {instructorData.role}
// // // // // // //                                 </p>
// // // // // // //                             )}
// // // // // // //                         </div>
// // // // // // //                     </ListItem>

// // // // // // //                 </List>

// // // // // // //             </div>
// // // // // // //             </div>

// // // // // // //         </>

// // // // // // //     );
// // // // // // // }


// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // import { signOut, onAuthStateChanged } from "firebase/auth";
// // // // // // import { auth } from "../../config/firebase.js";
// // // // // // import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// // // // // // import InstructorProfile from '../components/Performance/InstructorProfile.jsx';
// // // // // // import {
// // // // // //     Typography,
// // // // // //     List,
// // // // // //     ListItem,
// // // // // //     ListItemPrefix,
// // // // // //     Accordion,
// // // // // //     AccordionHeader,
// // // // // //     AccordionBody,
// // // // // // } from "@material-tailwind/react";
// // // // // // import {
// // // // // //     InboxIcon,
// // // // // //     PowerIcon,
// // // // // //     Cog6ToothIcon,
// // // // // //     PresentationChartBarIcon,
// // // // // //     ChevronRightIcon,
// // // // // //     Bars3Icon, // Hamburger icon from Heroicons
// // // // // // } from "@heroicons/react/24/solid";

// // // // // // export default function Sidebar() {
// // // // // //     const navigate = useNavigate();
// // // // // //     const [user, setUser] = useState(null);
// // // // // //     const [instructorData, setInstructorData] = useState(null);
// // // // // //     const firestore = getFirestore();
// // // // // //     const [openCourseDelivery, setOpenCourseDelivery] = useState(false);
// // // // // //     const [openRoles, setOpenRoles] = useState(false);
// // // // // //     const [openUsers, setOpenUsers] = useState(false);
// // // // // //     const [openSettings, setOpenSettings] = useState(false);
// // // // // //     const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar toggle

// // // // // //     useEffect(() => {
// // // // // //         const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
// // // // // //             if (authUser) {
// // // // // //                 setUser(authUser);
// // // // // //                 await fetchInstructorData(authUser.email);
// // // // // //             } else {
// // // // // //                 setUser(null);
// // // // // //                 setInstructorData(null);
// // // // // //             }
// // // // // //         });

// // // // // //         return () => unsubscribe();
// // // // // //     }, []);

// // // // // //     const fetchInstructorData = async (email) => {
// // // // // //         try {
// // // // // //             const instructorRef = collection(firestore, "Instructor");
// // // // // //             const q = query(instructorRef, where("email", "==", email));
// // // // // //             const querySnapshot = await getDocs(q);

// // // // // //             if (!querySnapshot.empty) {
// // // // // //                 const instructor = querySnapshot.docs[0].data();
// // // // // //                 setInstructorData(instructor);
// // // // // //             } else {
// // // // // //                 console.log("Instructor details not found for this email.");
// // // // // //             }
// // // // // //         } catch (error) {
// // // // // //             console.error("Error fetching instructor data:", error);
// // // // // //         }
// // // // // //     };

// // // // // //     const getUserInitials = () => {
// // // // // //         if (instructorData?.f_name && instructorData?.l_name) {
// // // // // //             return `${instructorData.f_name[0]}${instructorData.l_name[0]}`.toUpperCase();
// // // // // //         }
// // // // // //         return "U";
// // // // // //     };

// // // // // //     const handleSignOut = async () => {
// // // // // //         try {
// // // // // //             await signOut(auth);
// // // // // //             window.location.href = "/login";
// // // // // //         } catch (err) {
// // // // // //             console.log("Error signing out", err);
// // // // // //         }
// // // // // //     };

// // // // // //     const toggleSidebar = () => {
// // // // // //         setIsSidebarOpen(!isSidebarOpen);
// // // // // //     };

// // // // // //     return (
// // // // // //         <>
// // // // // //             {/* Hamburger Button (Visible on small screens only) */}
// // // // // //             <button
// // // // // //                 className="fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-900 text-white rounded-md"
// // // // // //                 onClick={toggleSidebar}
// // // // // //             >
// // // // // //                 <Bars3Icon className="h-6 w-6" />
// // // // // //             </button>

// // // // // //             {/* Sidebar */}
// // // // // //             <div
// // // // // //                 className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-900 text-white p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
// // // // // //                     isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
// // // // // //                 } md:translate-x-0 md:w-80`}
// // // // // //             >
// // // // // //                 {/* Logo Section */}
// // // // // //                 <div className="mb-2 p-4">
// // // // // //                     <div className="flex items-center mb-6" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
// // // // // //                         <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
// // // // // //                             <img src="/img/fireblaze.jpg" alt="F" className="h-full w-full object-cover rounded-full" />
// // // // // //                         </div>
// // // // // //                         <Typography variant='h3' className="ml-3 text-2xl md:text-3xl font-semibold pb-3">
// // // // // //                             Fireblaze
// // // // // //                         </Typography>
// // // // // //                     </div>
// // // // // //                 </div>

// // // // // //                 {/* Navigation List */}
// // // // // //                 <List>
// // // // // //                     <ListItem onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }}>
// // // // // //                         <ListItemPrefix>
// // // // // //                             <InboxIcon className="h-5 w-5" />
// // // // // //                         </ListItemPrefix>
// // // // // //                         Dashboard
// // // // // //                     </ListItem>

// // // // // //                     <Accordion open={openCourseDelivery}>
// // // // // //                         <ListItem className="p-0" selected={openCourseDelivery}>
// // // // // //                             <AccordionHeader
// // // // // //                                 onClick={() => {
// // // // // //                                     setOpenCourseDelivery(!openCourseDelivery);
// // // // // //                                     setOpenUsers(false);
// // // // // //                                     setOpenSettings(false);
// // // // // //                                     setOpenRoles(false);
// // // // // //                                 }}
// // // // // //                                 className="border-b-0 p-3"
// // // // // //                             >
// // // // // //                                 <ListItemPrefix>
// // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // //                                 </ListItemPrefix>
// // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // //                                     Course Delivery
// // // // // //                                 </Typography>
// // // // // //                             </AccordionHeader>
// // // // // //                         </ListItem>
// // // // // //                         <AccordionBody className="py-1">
// // // // // //                             <List className="p-0 text-white">
// // // // // //                                 <ListItem onClick={() => { navigate('/courses'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Courses
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/batches'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Batches
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/calendar'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Sessions
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/curriculum'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Curriculum
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/attendance'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Attendance
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/assignment'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Assignment
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/addPerformance'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <PresentationChartBarIcon className="h-5 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Add Performance
// // // // // //                                 </ListItem>
// // // // // //                             </List>
// // // // // //                         </AccordionBody>
// // // // // //                     </Accordion>

// // // // // //                     <Accordion open={openUsers}>
// // // // // //                         <ListItem className="p-0" selected={openUsers}>
// // // // // //                             <AccordionHeader
// // // // // //                                 onClick={() => {
// // // // // //                                     setOpenUsers(!openUsers);
// // // // // //                                     setOpenRoles(false);
// // // // // //                                     setOpenCourseDelivery(false);
// // // // // //                                     setOpenSettings(false);
// // // // // //                                 }}
// // // // // //                                 className="border-b-0 p-3"
// // // // // //                             >
// // // // // //                                 <ListItemPrefix>
// // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // //                                 </ListItemPrefix>
// // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // //                                     Users
// // // // // //                                 </Typography>
// // // // // //                             </AccordionHeader>
// // // // // //                         </ListItem>
// // // // // //                         <AccordionBody className="py-1">
// // // // // //                             <List className="p-0 text-white">
// // // // // //                                 <ListItem onClick={() => { navigate('/studentdetails'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Learners
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/instructor'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Admin & staff
// // // // // //                                 </ListItem>
// // // // // //                             </List>
// // // // // //                         </AccordionBody>
// // // // // //                     </Accordion>

// // // // // //                     <ListItem onClick={() => { navigate('/reports'); setIsSidebarOpen(false); }}>
// // // // // //                         <ListItemPrefix>
// // // // // //                             <InboxIcon className="h-5 w-5" />
// // // // // //                         </ListItemPrefix>
// // // // // //                         Reports
// // // // // //                     </ListItem>

// // // // // //                     <ListItem onClick={() => { navigate('/invoices'); setIsSidebarOpen(false); }}>
// // // // // //                         <ListItemPrefix>
// // // // // //                             <InboxIcon className="h-5 w-5" />
// // // // // //                         </ListItemPrefix>
// // // // // //                         Invoices
// // // // // //                     </ListItem>

// // // // // //                     <Accordion open={openSettings}>
// // // // // //                         <ListItem className="p-0" selected={openSettings}>
// // // // // //                             <AccordionHeader
// // // // // //                                 onClick={() => {
// // // // // //                                     setOpenSettings(!openSettings);
// // // // // //                                     setOpenCourseDelivery(false);
// // // // // //                                     setOpenRoles(false);
// // // // // //                                     setOpenUsers(false);
// // // // // //                                 }}
// // // // // //                                 className="border-b-0 p-3"
// // // // // //                             >
// // // // // //                                 <ListItemPrefix>
// // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // //                                 </ListItemPrefix>
// // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // //                                     Settings
// // // // // //                                 </Typography>
// // // // // //                             </AccordionHeader>
// // // // // //                         </ListItem>
// // // // // //                         <AccordionBody className="py-1">
// // // // // //                             <List className="p-0 text-white">
// // // // // //                                 <ListItem onClick={() => { navigate('/centers'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Add centers
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/financePartners'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Finance Partner
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/fee-template'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Fee Template
// // // // // //                                 </ListItem>
// // // // // //                             </List>
// // // // // //                         </AccordionBody>
// // // // // //                     </Accordion>

// // // // // //                     <Accordion open={openRoles}>
// // // // // //                         <ListItem className="p-0" selected={openRoles}>
// // // // // //                             <AccordionHeader
// // // // // //                                 onClick={() => {
// // // // // //                                     setOpenRoles(!openRoles);
// // // // // //                                     setOpenCourseDelivery(false);
// // // // // //                                     setOpenUsers(false);
// // // // // //                                     setOpenSettings(false);
// // // // // //                                 }}
// // // // // //                                 className="border-b-0 p-3"
// // // // // //                             >
// // // // // //                                 <ListItemPrefix>
// // // // // //                                     <PresentationChartBarIcon className="h-5 w-5" />
// // // // // //                                 </ListItemPrefix>
// // // // // //                                 <Typography color="blue-gray" className="mr-auto font-normal">
// // // // // //                                     Users & Roles
// // // // // //                                 </Typography>
// // // // // //                             </AccordionHeader>
// // // // // //                         </ListItem>
// // // // // //                         <AccordionBody className="py-1">
// // // // // //                             <List className="p-0 text-white">
// // // // // //                                 <ListItem onClick={() => { navigate('/users'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Users
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/roles'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Roles
// // // // // //                                 </ListItem>
// // // // // //                                 <ListItem onClick={() => { navigate('/preferences'); setIsSidebarOpen(false); }}>
// // // // // //                                     <ListItemPrefix>
// // // // // //                                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
// // // // // //                                     </ListItemPrefix>
// // // // // //                                     Preferences
// // // // // //                                 </ListItem>
// // // // // //                             </List>
// // // // // //                         </AccordionBody>
// // // // // //                     </Accordion>

// // // // // //                     <ListItem onClick={() => { handleSignOut(); setIsSidebarOpen(false); }}>
// // // // // //                         <ListItemPrefix>
// // // // // //                             <PowerIcon className="h-5 w-5" />
// // // // // //                         </ListItemPrefix>
// // // // // //                         Log Out
// // // // // //                     </ListItem>

// // // // // //                     <ListItem
// // // // // //                         className="fixed bottom-0 left-0 w-full bg-gray-800 p-2 rounded-lg flex items-center cursor-pointer"
// // // // // //                         onClick={() => { navigate(`/my-profile/${user?.uid}`); setIsSidebarOpen(false); }}
// // // // // //                     >
// // // // // //                         <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
// // // // // //                             {getUserInitials()}
// // // // // //                         </div>
// // // // // //                         <div className="ml-3">
// // // // // //                             <p className="font-semibold text-sm md:text-base">
// // // // // //                                 {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "User"}
// // // // // //                             </p>
// // // // // //                             {instructorData?.specialization && (
// // // // // //                                 <p className="text-xs text-gray-400">
// // // // // //                                     {instructorData.role}
// // // // // //                                 </p>
// // // // // //                             )}
// // // // // //                         </div>
// // // // // //                     </ListItem>
// // // // // //                 </List>
// // // // // //             </div>

// // // // // //             {/* Overlay for mobile when sidebar is open */}
// // // // // //             {isSidebarOpen && (
// // // // // //                 <div
// // // // // //                     className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
// // // // // //                     onClick={toggleSidebar}
// // // // // //                 />
// // // // // //             )}
// // // // // //         </>
// // // // // //     );
// // // // // // }


// // // // // import React, {useState, useEffect} from 'react';
// // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // import './Sidebar.css';
// // // // // import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
// // // // // import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase Auth imports
// // // // // const Sidebar = () => {
// // // // //   const navigate = useNavigate();
// // // // //   const auth = getAuth();
// // // // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // // // //   const [showMenu, setShowMenu] = useState(false);


// // // // //   useEffect(()=>{
// // // // //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// // // // //       if(user){
// // // // //         setIsLoggedIn(true);
// // // // //       }else{
// // // // //         setIsLoggedIn(false);
// // // // //       }
// // // // //   });
// // // // //   return () => 
// // // // //     unsubscribe();
// // // // // }, [auth]);

// // // // // const toggleMenu=()=>{
// // // // //   setShowMenu(!showMenu);
// // // // // }
// // // // // // Handle logout
// // // // // const handleLogout = async () => {
// // // // //   try {
// // // // //     await signOut(auth);
// // // // //     setShowMenu(false); // Close the menu
// // // // //     navigate('/login'); // Redirect to login page after logout
// // // // //   } catch (error) {
// // // // //     console.error('Error logging out: ', error);
// // // // //   }
// // // // // };

// // // // // // Handle login redirect
// // // // // const handleLogin = () => {
// // // // //   setShowMenu(false); // Close the menu
// // // // //   navigate('/login'); // Redirect to login page
// // // // // };

// // // // //   return (

// // // // //     <div className="sidebar">
// // // // //       {/* Logo Section */}
// // // // //       <div className="logo">
// // // // //         <img src="/img/fireblaze.jpg" alt="F" className="logo-icon" />
// // // // //         {/* <FaGraduationCap className="logo-icon" /> */}
// // // // //         <span>Fireblaze</span>
// // // // //       </div>

// // // // //       {/* Navigation Items */}
// // // // //       <ul className="nav-list">
// // // // //         <Link to="/dashboard">
// // // // //         <li className="nav-item">
// // // // //           <FaTachometerAlt className="nav-icon" />
// // // // //           <span>Dashboard</span>
// // // // //         </li>
// // // // //         </Link> 

// // // // //         <Link to="/institute-setup" className="nav-link">
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-building-columns nav-icon"></i>
// // // // //             {/* <FaBook className="" /> */}
// // // // //             <span>Institute Setup</span>
// // // // //           </li>
// // // // //         </Link>

// // // // //         {/* Academic Section */}
// // // // //         <li className="nav-section">Academic</li>
// // // // //         <Link to="/courses" className="nav-link">
// // // // //           <li className="nav-item">
// // // // //             <FaBook className="nav-icon" />
// // // // //             <span>Course Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <Link to='/curriculum' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaClipboardList className="nav-icon" />
// // // // //             <span>Curriculum Management</span>
// // // // //           </li>
// // // // //         </Link>

// // // // //         <Link to='/batches' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaCalendarAlt className="nav-icon" />
// // // // //             <span>Batch Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <Link to='/sessions' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaCalendarAlt className="nav-icon" />
// // // // //             <span>Session Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <Link to='/attendance' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-clipboard-user nav-icon"></i>
// // // // //             {/* <FaCalendarAlt className="nav-icon" /> */}
// // // // //             <span>Attendance Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <Link to='/assignment' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-book nav-icon"></i>
// // // // //             {/* <FaCalendarAlt className="nav-icon" /> */}
// // // // //             <span>Assignment Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <Link to='/addPerformance' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-chart-simple nav-icon"></i>
// // // // //             {/* <FaCalendarAlt className="nav-icon" /> */}
// // // // //             <span>Performance Management</span>
// // // // //           </li>
// // // // //         </Link>

// // // // //         {/* Users Section */}
// // // // //         <li className="nav-section">Users</li>
// // // // //         <li className="nav-item">
// // // // //           <FaUsers className="nav-icon" />
// // // // //           <span>User Management</span>
// // // // //         </li>

// // // // //         <Link to='/studentdetails' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaUserGraduate className="nav-icon" />
// // // // //             <span>Learner Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <li className="nav-item">
// // // // //           <FaQuestionCircle className="nav-icon" />
// // // // //           <span>Enquiry Management</span>
// // // // //         </li>


// // // // //         <Link to='/instructor' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaUserGraduate className="nav-icon" />
// // // // //             <span>Staff Management</span>
// // // // //           </li>
// // // // //         </Link>

// // // // //         <Link to='/roles' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-user nav-icon"></i>
// // // // //             {/* <FaUserGraduate className="nav-icon" /> */}
// // // // //             <span>Roles Management</span>
// // // // //           </li>
// // // // //         </Link>




// // // // //         {/* Finance Section */}
// // // // //         <li className="nav-section">Finance</li>
// // // // //         <Link to='/reports ' className='nav-link'>
// // // // //         <li className="nav-item">
// // // // //           <FaMoneyBillAlt className="nav-icon" />
// // // // //           <span>Fee Management</span>
// // // // //         </li>
// // // // //         </Link>

// // // // //         {/* <Link to='/reports ' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaUserGraduate className="nav-icon" />
// // // // //             <span>Reports Management</span>
// // // // //           </li>
// // // // //         </Link> */}



// // // // //         <Link to='/invoices' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-money-bill-trend-up nav-icon"></i>
// // // // //             {/* <FaUserGraduate className="nav-icon" /> */}
// // // // //             <span>Invoice Management</span>
// // // // //           </li>
// // // // //         </Link>


// // // // //         <Link to='/financePartners' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //           <i class="fa-solid fa-money-check-dollar nav-icon"></i>
// // // // //             {/* <FaUserGraduate className="nav-icon" /> */}
// // // // //             <span>Finance Partner</span>
// // // // //           </li>
// // // // //         </Link>



// // // // //         <Link to='/fee-template' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaUserGraduate className="nav-icon" />
// // // // //             <span>Fee Template</span>
// // // // //           </li>
// // // // //         </Link>



// // // // //         {/* Settings Section */}
// // // // //         <li className="nav-section">Setting</li>
// // // // //         <Link to='/centers' className='nav-link'>
// // // // //           <li className="nav-item">
// // // // //             <FaMoneyBillAlt className="nav-icon" />
// // // // //             <span>Center Management</span>
// // // // //           </li>
// // // // //         </Link>



// // // // //         {/* Admin Profile */}
// // // // //         <div className="admin-profile">
// // // // //           <FaUser className="nav-icon" />
// // // // //           <span>Admin Profile</span>
// // // // //           <span className="admin-initials">AD</span>
// // // // //           <FaEllipsisV className="menu-icon" onClick={toggleMenu} />
// // // // //           {showMenu && (
// // // // //             <div className="dropdown-menu">
// // // // //               <Link to="/settings" className="dropdown-item" onClick={() => setShowMenu(false)}>
// // // // //                 Settings
// // // // //               </Link>
// // // // //               {isLoggedIn ? (
// // // // //                 <div className="dropdown-item" onClick={handleLogout}>
// // // // //                   Logout
// // // // //                 </div>
// // // // //               ) : (
// // // // //                 <div className="dropdown-item" onClick={handleLogin}>
// // // // //                   Login
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </ul>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Sidebar;
// // // // // {/* <div className="admin-profile">
// // // // // <FaUser className="nav-icon" />
// // // // // <span>Admin Profile</span>
// // // // // <span className="admin-initials">AD</span>
// // // // // </div> */}
// // // // // {/* <li className="nav-item admin-profile">
// // // // //   <FaUser className="nav-icon" />
// // // // //   <span>Admin Profile</span>
// // // // //   <span className="admin-initials">AD</span>
// // // // // </li> */}



// // // // import React, { useState, useEffect } from 'react';
// // // // import { Link, useNavigate } from 'react-router-dom';
// // // // import './Sidebar.css';
// // // // import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
// // // // import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase Auth imports

// // // // const Sidebar = () => {
// // // //   const navigate = useNavigate();
// // // //   const auth = getAuth(); // Initialize Firebase Auth
// // // //   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
// // // //   const [showMenu, setShowMenu] = useState(false); // Toggle dropdown menu

// // // //   // Check if the user is logged in
// // // //   useEffect(() => {
// // // //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// // // //       if (user) {
// // // //         setIsLoggedIn(true); // User is logged in
// // // //       } else {
// // // //         setIsLoggedIn(false); // User is not logged in
// // // //       }
// // // //     });

// // // //     // Cleanup subscription on unmount
// // // //     return () => unsubscribe();
// // // //   }, [auth]);

// // // //   // Toggle the dropdown menu
// // // //   const toggleMenu = () => {
// // // //     setShowMenu(!showMenu);
// // // //   };

// // // //   // Handle logout
// // // //   const handleLogout = async () => {
// // // //     try {
// // // //       await signOut(auth);
// // // //       setShowMenu(false); // Close the menu
// // // //       navigate('/login'); // Redirect to login page after logout
// // // //     } catch (error) {
// // // //       console.error('Error logging out: ', error);
// // // //     }
// // // //   };

// // // //   // Handle login redirect
// // // //   const handleLogin = () => {
// // // //     setShowMenu(false); // Close the menu
// // // //     navigate('/login'); // Redirect to login page
// // // //   };

// // // //   return (
// // // //     <div className="sidebar">
// // // //       {/* Logo Section */}
// // // //       <div className="logo">
// // // //         <img src="/img/fireblaze.jpg" alt="F" className="logo-icon" />
// // // //         <span>Fireblaze</span>
// // // //       </div>

// // // //       {/* Navigation Items */}
// // // //       <ul className="nav-list">
// // // //         <Link to="/dashboard">
// // // //           <li className="nav-item">
// // // //             <FaTachometerAlt className="nav-icon" />
// // // //             <span>Dashboard</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/institute-setup" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-building-columns nav-icon"></i>
// // // //             <span>Institute Setup</span>
// // // //           </li>
// // // //         </Link>

// // // //         {/* Academic Section */}
// // // //         <li className="nav-section">Academic</li>
// // // //         <Link to="/courses" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaBook className="nav-icon" />
// // // //             <span>Course Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/curriculum" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaClipboardList className="nav-icon" />
// // // //             <span>Curriculum Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/batches" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaCalendarAlt className="nav-icon" />
// // // //             <span>Batch Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/sessions" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaCalendarAlt className="nav-icon" />
// // // //             <span>Session Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/attendance" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-clipboard-user nav-icon"></i>
// // // //             <span>Attendance Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/assignment" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-book nav-icon"></i>
// // // //             <span>Assignment Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/addPerformance" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-chart-simple nav-icon"></i>
// // // //             <span>Performance Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         {/* Users Section */}
// // // //         <li className="nav-section">Users</li>
// // // //         <li className="nav-item">
// // // //           <FaUsers className="nav-icon" />
// // // //           <span>User Management</span>
// // // //         </li>

// // // //         <Link to="/studentdetails" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaUserGraduate className="nav-icon" />
// // // //             <span>Learner Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <li className="nav-item">
// // // //           <FaQuestionCircle className="nav-icon" />
// // // //           <span>Enquiry Management</span>
// // // //         </li>

// // // //         <Link to="/instructor" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaUserGraduate className="nav-icon" />
// // // //             <span>Staff Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/roles" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-user nav-icon"></i>
// // // //             <span>Roles Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         {/* Finance Section */}
// // // //         <li className="nav-section">Finance</li>
// // // //         <Link to="/reports" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaMoneyBillAlt className="nav-icon" />
// // // //             <span>Fee Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/invoices" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
// // // //             <span>Invoice Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/financePartners" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <i className="fa-solid fa-money-check-dollar nav-icon"></i>
// // // //             <span>Finance Partner</span>
// // // //           </li>
// // // //         </Link>

// // // //         <Link to="/fee-template" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaUserGraduate className="nav-icon" />
// // // //             <span>Fee Template</span>
// // // //           </li>
// // // //         </Link>

// // // //         {/* Settings Section */}
// // // //         <li className="nav-section">Setting</li>
// // // //         <Link to="/centers" className="nav-link">
// // // //           <li className="nav-item">
// // // //             <FaMoneyBillAlt className="nav-icon" />
// // // //             <span>Center Management</span>
// // // //           </li>
// // // //         </Link>

// // // //         {/* Admin Profile with Three Dots */}
// // // //         <div className="admin-profile">
// // // //           <FaUser className="nav-icon" />
// // // //           <span>Admin Profile</span>
// // // //           <span className="admin-initials">AD</span>
// // // //           <FaEllipsisV className="menu-icon" onClick={toggleMenu} />
// // // //           {showMenu && (
// // // //             <div className="dropdown-menu">
// // // //               <Link to="/settings" className="dropdown-item" onClick={() => setShowMenu(false)}>
// // // //                 Settings
// // // //               </Link>
// // // //               {isLoggedIn ? (
// // // //                 <div className="dropdown-item" onClick={handleLogout}>
// // // //                   Logout
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="dropdown-item" onClick={handleLogin}>
// // // //                   Login
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </ul>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Sidebar;



// // // import React, { useState, useEffect } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import './Sidebar.css';
// // // import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
// // // import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase Auth imports
// // // import { getFirestore, doc, getDoc } from 'firebase/firestore'; 


// // // const Sidebar = () => {
// // //   const navigate = useNavigate();
// // //   const auth = getAuth();
// // //   const db = getFirestore();
// // //   const [user, setUser] = useState(null);
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   const [showMenu, setShowMenu] = useState(false);


// // //   useEffect(() => {
// // //     const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
// // //       if (authUser) {
// // //         console.log("Authenticated user:", authUser.email); // Debugging

// // //         const userDocRef = doc(db, "Instructor", authUser.email);
// // //         const userDocSnap = await getDoc(userDocRef);

// // //         if (userDocSnap.exists()) {
// // //           const userData = userDocSnap.data();
// // //           console.log("Fetched user data:", userData); // Debugging
// // //           setUser({
// // //             f_name: userData.f_name || '',
// // //             l_name: userData.l_name || '',
// // //             initials: `${userData.f_name?.charAt(0) || ''}${userData.l_name?.charAt(0) || ''}`.toUpperCase(),
// // //           });
// // //         } else {
// // //           console.log("No user document found in Firestore.");
// // //           setUser({ f_name: "User", l_name: "", initials: "U" });
// // //         }
// // //       } else {
// // //         console.log("No authenticated user.");
// // //         setUser(null);
// // //       }
// // //     });

// // //     return () => unsubscribe();
// // //   }, [auth, db]);

// // //   const toggleMenu = () => {
// // //     console.log('Toggling menu, current showMenu:', showMenu);
// // //     setShowMenu(!showMenu);
// // //   };

// // //   const handleLogout = async () => {
// // //     try {
// // //       await signOut(auth);
// // //       setShowMenu(false);
// // //       navigate('/login');
// // //     } catch (error) {
// // //       console.error('Error logging out: ', error);
// // //     }
// // //   };

// // //   const handleLogin = () => {
// // //     setShowMenu(false);
// // //     navigate('/login');
// // //   };

// // //   return (
// // //     <div className="sidebar">
// // //       <div className="logo">
// // //         <img src="/img/fireblaze.jpg" alt="F" className="logo-icon" />
// // //         <span>Fireblaze</span>
// // //       </div>

// // //       <ul className="nav-list">
// // //         <Link to="/dashboard">
// // //           <li className="nav-item">
// // //             <FaTachometerAlt className="nav-icon" />
// // //             <span>Dashboard</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/institute-setup" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-building-columns nav-icon"></i>
// // //             <span>Institute Setup</span>
// // //           </li>
// // //         </Link>

// // //         <li className="nav-section">Academic</li>
// // //         <Link to="/courses" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaBook className="nav-icon" />
// // //             <span>Course Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/curriculum" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaClipboardList className="nav-icon" />
// // //             <span>Curriculum Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/batches" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaCalendarAlt className="nav-icon" />
// // //             <span>Batch Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/sessions" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaCalendarAlt className="nav-icon" />
// // //             <span>Session Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/attendance" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-clipboard-user nav-icon"></i>
// // //             <span>Attendance Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/assignment" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-book nav-icon"></i>
// // //             <span>Assignment Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/addPerformance" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-chart-simple nav-icon"></i>
// // //             <span>Performance Management</span>
// // //           </li>
// // //         </Link>

// // //         <li className="nav-section">Users</li>
// // //         <li className="nav-item">
// // //           <FaUsers className="nav-icon" />
// // //           <span>User Management</span>
// // //         </li>

// // //         <Link to="/studentdetails" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaUserGraduate className="nav-icon" />
// // //             <span>Learner Management</span>
// // //           </li>
// // //         </Link>

// // //         <li className="nav-item">
// // //           <FaQuestionCircle className="nav-icon" />
// // //           <span>Enquiry Management</span>
// // //         </li>

// // //         <Link to="/instructor" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaUserGraduate className="nav-icon" />
// // //             <span>Staff Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/roles" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-user nav-icon"></i>
// // //             <span>Roles Management</span>
// // //           </li>
// // //         </Link>

// // //         <li className="nav-section">Finance</li>
// // //         <Link to="/reports" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaMoneyBillAlt className="nav-icon" />
// // //             <span>Fee Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/invoices" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
// // //             <span>Invoice Management</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/financePartners" className="nav-link">
// // //           <li className="nav-item">
// // //             <i className="fa-solid fa-money-check-dollar nav-icon"></i>
// // //             <span>Finance Partner</span>
// // //           </li>
// // //         </Link>

// // //         <Link to="/fee-template" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaUserGraduate className="nav-icon" />
// // //             <span>Fee Template</span>
// // //           </li>
// // //         </Link>

// // //         <li className="nav-section">Setting</li>
// // //         <Link to="/centers" className="nav-link">
// // //           <li className="nav-item">
// // //             <FaMoneyBillAlt className="nav-icon" />
// // //             <span>Center Management</span>
// // //           </li>
// // //         </Link>

// // //         <div className="admin-profile" onClick={toggleMenu}>
// // //           <FaUser className="nav-icon" />
// // //           <span>{user ? `${user.f_name} ${user.l_name}` : "Admin Profile"}</span>
// // //           <span className="admin-initials">{user ? user.initials : "AD"}</span>
// // //           <FaEllipsisV className="menu-icon" />

// // //           <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
// // //             <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
// // //               Settings
// // //             </Link>
// // //             {user ? (
// // //               <div className="dropdown-item" onClick={handleLogout}>
// // //                 Logout
// // //               </div>
// // //             ) : (
// // //               <Link to="/login" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
// // //                 Login
// // //               </Link>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* <div className="admin-profile" onClick={toggleMenu}>
// // //           <FaUser className="nav-icon" />
// // //           <span>Admin Profile</span>
// // //           <span className="admin-initials">AD</span>
// // //           <FaEllipsisV className="menu-icon" />

// // //           <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
// // //             <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
// // //               Settings
// // //             </Link>
// // //             {isLoggedIn ? (
// // //               <div className="dropdown-item" onClick={handleLogout}>
// // //                 Logout
// // //               </div>
// // //             ) : (
// // //               <div className="dropdown-item" onClick={handleLogin}>
// // //                 Login
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div> */}

// // //       </ul>
// // //     </div>
// // //   );
// // // };

// // // export default Sidebar;



// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import './Sidebar.css';
// // import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
// // import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase Auth imports
// // import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

// // const Sidebar = () => {
// //   const navigate = useNavigate();
// //   const auth = getAuth();
// //   const db = getFirestore();
// //   const [user, setUser] = useState(null);
// //   const [showMenu, setShowMenu] = useState(false);

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
// //       if (authUser) {
// //         console.log("Authenticated user:", authUser.email); // Debugging

// //         const userDocRef = doc(db, "Instructor", authUser.email);
// //         const userDocSnap = await getDoc(userDocRef);

// //         if (userDocSnap.exists()) {
// //           const userData = userDocSnap.data();
// //           console.log("Fetched user data:", userData); // Debugging
// //           setUser({
// //             f_name: userData.f_name || '',
// //             l_name: userData.l_name || '',
// //             initials: `${userData.f_name?.charAt(0) || ''}${userData.l_name?.charAt(0) || ''}`.toUpperCase(),
// //           });
// //         } else {
// //           console.log("No user document found in Firestore.");
// //           setUser({ f_name: "User", l_name: "", initials: "U" });
// //         }
// //       } else {
// //         console.log("No authenticated user.");
// //         setUser(null);
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, [auth, db]);

// //   const toggleMenu = () => {
// //     console.log('Toggling menu, current showMenu:', showMenu);
// //     setShowMenu(!showMenu);
// //   };

// //   const handleLogout = async () => {
// //     try {
// //       await signOut(auth);
// //       setShowMenu(false);
// //       navigate('/login');
// //     } catch (error) {
// //       console.error('Error logging out: ', error);
// //     }
// //   };

// //   const handleLogin = () => {
// //     setShowMenu(false);
// //     navigate('/login');
// //   };

// //   return (
// //     <div className="sidebar">
// //       <div className="logo">
// //         <img src="/img/fireblaze.jpg" alt="F" className="logo-icon" />
// //         <span>Fireblaze</span>
// //       </div>

// //       <ul className="nav-list">
// //         <Link to="/dashboard">
// //           <li className="nav-item">
// //             <FaTachometerAlt className="nav-icon" />
// //             <span>Dashboard</span>
// //           </li>
// //         </Link>

// //         <Link to="/instituteSetup" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-building-columns nav-icon"></i>
// //             <span>Institute Setup</span>
// //           </li>
// //         </Link>

// //         <li className="nav-section">Academic</li>
// //         <Link to="/courses" className="nav-link">
// //           <li className="nav-item">
// //             <FaBook className="nav-icon" />
// //             <span>Course Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/curriculum" className="nav-link">
// //           <li className="nav-item">
// //             <FaClipboardList className="nav-icon" />
// //             <span>Curriculum Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/batches" className="nav-link">
// //           <li className="nav-item">
// //             <FaCalendarAlt className="nav-icon" />
// //             <span>Batch Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/sessions" className="nav-link">
// //           <li className="nav-item">
// //             <FaCalendarAlt className="nav-icon" />
// //             <span>Session Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/attendance" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-clipboard-user nav-icon"></i>
// //             <span>Attendance Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/assignment" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-book nav-icon"></i>
// //             <span>Assignment Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/addPerformance" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-chart-simple nav-icon"></i>
// //             <span>Performance Management</span>
// //           </li>
// //         </Link>

// //         <li className="nav-section">Users</li>
// //         <li className="nav-item">
// //           <FaUsers className="nav-icon" />
// //           <span>User Management</span>
// //         </li>

// //         <Link to="/studentdetails" className="nav-link">
// //           <li className="nav-item">
// //             <FaUserGraduate className="nav-icon" />
// //             <span>Learner Management</span>
// //           </li>
// //         </Link>

// //         <li className="nav-item">
// //           <FaQuestionCircle className="nav-icon" />
// //           <span>Enquiry Management</span>
// //         </li>

// //         <Link to="/instructor" className="nav-link">
// //           <li className="nav-item">
// //             <FaUserGraduate className="nav-icon" />
// //             <span>Staff Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/roles" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-user nav-icon"></i>
// //             <span>Roles Management</span>
// //           </li>
// //         </Link>

// //         <li className="nav-section">Finance</li>
// //         <Link to="/reports" className="nav-link">
// //           <li className="nav-item">
// //             <FaMoneyBillAlt className="nav-icon" />
// //             <span>Fee Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/invoices" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
// //             <span>Invoice Management</span>
// //           </li>
// //         </Link>

// //         <Link to="/financePartners" className="nav-link">
// //           <li className="nav-item">
// //             <i className="fa-solid fa-money-check-dollar nav-icon"></i>
// //             <span>Finance Partner</span>
// //           </li>
// //         </Link>

// //         {/* <Link to="/fee-template" className="nav-link">
// //           <li className="nav-item">
// //             <FaUserGraduate className="nav-icon" />
// //             <span>Fee Template</span>
// //           </li>
// //         </Link> */}

// //          <li className="nav-section">Setting</li>
// //         {/* <Link to="/centers" className="nav-link">
// //           <li className="nav-item">
// //             <FaMoneyBillAlt className="nav-icon" />
// //             <span>Center Management</span>
// //           </li>
// //         </Link> */}

// //         <div className="admin-profile" onClick={toggleMenu}>
// //           <FaUser className="nav-icon" />
// //           <span>{user ? `${user.f_name} ${user.l_name}` : "Admin Profile"}</span>
// //           <span className="admin-initials">{user ? user.initials : "AD"}</span>
// //           <FaEllipsisV className="menu-icon" />

// //           <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
// //             <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
// //               Settings
// //             </Link>
// //             {user ? (
// //               <div className="dropdown-item" onClick={handleLogout}>
// //                 Logout
// //               </div>
// //             ) : (
// //               <Link to="/login" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
// //                 Login
// //               </Link>
// //             )}
// //           </div>
// //         </div>
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Sidebar;


// // src/Sidebar.js
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Sidebar.css';
// import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const db = getFirestore();
//   const [user, setUser] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [instituteLogo, setInstituteLogo] = useState('/img/fireblaze.jpg'); // Default logo

//   useEffect(() => {
//     // Fetch user data
//     const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
//       if (authUser) {
//         console.log("Authenticated user:", authUser.email);

//         const userDocRef = doc(db, "Instructor", authUser.email);
//         const userDocSnap = await getDoc(userDocRef);

//         if (userDocSnap.exists()) {
//           const userData = userDocSnap.data();
//           console.log("Fetched user data:", userData);
//           setUser({
//             f_name: userData.f_name || '',
//             l_name: userData.l_name || '',
//             initials: `${userData.f_name?.charAt(0) || ''}${userData.l_name?.charAt(0) || ''}`.toUpperCase(),
//           });
//         } else {
//           console.log("No user document found in Firestore.");
//           setUser({ f_name: "User", l_name: "", initials: "U" });
//         }
//       } else {
//         console.log("No authenticated user.");
//         setUser(null);
//       }
//     });

//     // Fetch institute logo
//     const fetchInstituteLogo = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "instituteSetup"));
//         if (!querySnapshot.empty) {
//           const instituteData = querySnapshot.docs[0].data();
//           if (instituteData.logoUrl) {
//             setInstituteLogo(instituteData.logoUrl);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching institute logo:", error);
//       }
//     };

//     fetchInstituteLogo();

//     return () => unsubscribe();
//   }, [auth, db]);

//   const toggleMenu = () => {
//     console.log('Toggling menu, current showMenu:', showMenu);
//     setShowMenu(!showMenu);
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setShowMenu(false);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error logging out: ', error);
//     }
//   };

//   const handleLogin = () => {
//     setShowMenu(false);
//     navigate('/login');
//   };

//   return (
//     <div className="sidebar">
//       <div className="logo">
//         <img src={instituteLogo} alt="Institute Logo" className="logo-icon" />
//         <span>Fireblaze</span>
//       </div>

//       <ul className="nav-list">
//         <Link to="/dashboard">
//           <li className="nav-item">
//             <FaTachometerAlt className="nav-icon" />
//             <span>Dashboard</span>
//           </li>
//         </Link>

//         <Link to="/instituteSetup" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-building-columns nav-icon"></i>
//             <span>Institute Setup</span>
//           </li>
//         </Link>

//         <li className="nav-section">Academic</li>
//         <Link to="/courses" className="nav-link">
//           <li className="nav-item">
//             <FaBook className="nav-icon" />
//             <span>Course Management</span>
//           </li>
//         </Link>

//         <Link to="/curriculum" className="nav-link">
//           <li className="nav-item">
//             <FaClipboardList className="nav-icon" />
//             <span>Curriculum Management</span>
//           </li>
//         </Link>

//         <Link to="/batches" className="nav-link">
//           <li className="nav-item">
//             <FaCalendarAlt className="nav-icon" />
//             <span>Batch Management</span>
//           </li>
//         </Link>

//         <Link to="/sessions" className="nav-link">
//           <li className="nav-item">
//             <FaCalendarAlt className="nav-icon" />
//             <span>Session Management</span>
//           </li>
//         </Link>

//         <Link to="/attendance" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-clipboard-user nav-icon"></i>
//             <span>Attendance Management</span>
//           </li>
//         </Link>

//         <Link to="/assignment" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-book nav-icon"></i>
//             <span>Assignment Management</span>
//           </li>
//         </Link>

//         <Link to="/addPerformance" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-chart-simple nav-icon"></i>
//             <span>Performance Management</span>
//           </li>
//         </Link>

//         <li className="nav-section">Users</li>
//         <li className="nav-item">
//           <FaUsers className="nav-icon" />
//           <span>User Management</span>
//         </li>

//         <Link to="/studentdetails" className="nav-link">
//           <li className="nav-item">
//             <FaUserGraduate className="nav-icon" />
//             <span>Learner Management</span>
//           </li>
//         </Link>

//         <li className="nav-item">
//           <FaQuestionCircle className="nav-icon" />
//           <span>Enquiry Management</span>
//         </li>

//         <Link to="/instructor" className="nav-link">
//           <li className="nav-item">
//             <FaUserGraduate className="nav-icon" />
//             <span>Staff Management</span>
//           </li>
//         </Link>

//         <Link to="/roles" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-user nav-icon"></i>
//             <span>Roles Management</span>
//           </li>
//         </Link>

//         <li className="nav-section">Finance</li>
//         <Link to="/reports" className="nav-link">
//           <li className="nav-item">
//             <FaMoneyBillAlt className="nav-icon" />
//             <span>Fee Management</span>
//           </li>
//         </Link>

//         <Link to="/invoices" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
//             <span>Invoice Management</span>
//           </li>
//         </Link>

//         <Link to="/financePartners" className="nav-link">
//           <li className="nav-item">
//             <i className="fa-solid fa-money-check-dollar nav-icon"></i>
//             <span>Finance Partner</span>
//           </li>
//         </Link>

//         <li className="nav-section">Setting</li>

//         <div className="admin-profile" onClick={toggleMenu}>
//           <FaUser className="nav-icon" />
//           <span>{user ? `${user.f_name} ${user.l_name}` : "Admin Profile"}</span>
//           <span className="admin-initials">{user ? user.initials : "AD"}</span>
//           <FaEllipsisV className="menu-icon" />

//           <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
//             <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
//               Settings
//             </Link>
//             {user ? (
//               <div className="dropdown-item" onClick={handleLogout}>
//                 Logout
//               </div>
//             ) : (
//               <Link to="/login" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

// src/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { user, rolePermissions } = useAuth(); // Use AuthContext
  const [showMenu, setShowMenu] = useState(false);
  const [instituteLogo, setInstituteLogo] = useState('/img/fireblaze.jpg'); // Default logo
  const [logoError, setLogoError] = useState(null);

  // Permission checks
  const canViewCourses = rolePermissions.Course?.display || false;
  const canViewInstitute = rolePermissions.instituteSetup?.display || false;
  const canViewCurriculum = rolePermissions.Curriculum?.display || false;
  const canViewBatches = rolePermissions.Batch?.display || false;
  const canViewSessions = rolePermissions.Sessions?.display || false;
  const canViewAttendance = rolePermissions.attendance?.display || false;
  const canViewAssignments = rolePermissions.assignments?.display || false;
  const canViewPerformance = rolePermissions.performance?.display || false;
  const canViewUsers = rolePermissions.Users?.display || false;
  const canViewStudents = rolePermissions.student?.display || false;
  const canViewInstructors = rolePermissions.Instructor?.display || false;
  const canViewRoles = rolePermissions.roles?.display || false; // Assuming roles fall under users
  const canViewFees = rolePermissions.reports?.display || false;
  const canViewInvoices = rolePermissions.invoice?.display || false;
  const canViewFee = rolePermissions.fee?.display || false;
  const canViewFinancePartners = rolePermissions.FinancePartner?.display || false;

  useEffect(() => {
    const fetchInstituteLogo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!querySnapshot.empty) {
          const instituteData = querySnapshot.docs[0].data();
          if (instituteData.logoUrl) {
            setInstituteLogo(instituteData.logoUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching institute logo:", error);
        setLogoError("Failed to fetch institute logo due to permissions or data issue.");
      }
    };

    if (user) fetchInstituteLogo(); // Only fetch if user is authenticated
  }, [user, db]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const handleImageError = (e) => {
    console.error("Error loading image:", instituteLogo);
    setLogoError("Failed to load logo image.");
    e.target.src = '/img/fireblaze.jpg'; // Fallback to default logo
  };

  if (!user) return null; // Don't render sidebar if no user is logged in

  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src={instituteLogo}
          alt="Institute Logo"
          className="logo-icon"
          onError={handleImageError}
          onLoad={() => setLogoError(null)}
        />
        <span>Fireblaze</span>
        {logoError && <div style={{ color: 'red', fontSize: '12px' }}>{logoError}</div>}
      </div>

      <ul className="nav-list">
        <Link to="/dashboard">
          <li className="nav-item">
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </li>
        </Link>

        {canViewInstitute && 
        <Link to="/instituteSetup" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-building-columns nav-icon"></i>
            <span>Institute Setup</span>
          </li>
        </Link>
        }

        <li className="nav-section">Academic</li>
        {canViewCourses && (
          <Link to="/courses" className="nav-link">
            <li className="nav-item">
              <FaBook className="nav-icon" />
              <span>Course Management</span>
            </li>
          </Link>
         )} 

        {canViewCurriculum && (
          <Link to="/curriculum" className="nav-link">
            <li className="nav-item">
              <FaClipboardList className="nav-icon" />
              <span>Curriculum Management</span>
            </li>
          </Link>
        )}

        {canViewBatches && (
          <Link to="/batches" className="nav-link">
            <li className="nav-item">
              <FaCalendarAlt className="nav-icon" />
              <span>Batch Management</span>
            </li>
          </Link>
        )}

        {canViewSessions && (
          <Link to="/sessions" className="nav-link">
            <li className="nav-item">
              <FaCalendarAlt className="nav-icon" />
              <span>Session Management</span>
            </li>
          </Link>
        )}

        {canViewAttendance && (
          <Link to="/attendance" className="nav-link">
            <li className="nav-item">
              <i className="fa-solid fa-clipboard-user nav-icon"></i>
              <span>Attendance Management</span>
            </li>
          </Link>
        )}

        {canViewAssignments && (
          <Link to="/assignment" className="nav-link">
            <li className="nav-item">
              <i className="fa-solid fa-book nav-icon"></i>
              <span>Assignment Management</span>
            </li>
          </Link>
        )}

        {canViewPerformance && (
          <Link to="/addPerformance" className="nav-link">
            <li className="nav-item">
              <i className="fa-solid fa-chart-simple nav-icon"></i>
              <span>Performance Management</span>
            </li>
          </Link>
        )}

        <li className="nav-section">Users</li>
        {canViewUsers && (
          <Link to="/users" className="nav-link">
          <li className="nav-item">
            <FaUsers className="nav-icon" />
            <span>User Management</span>
          </li>
          </Link>
        )}

        {canViewStudents && (
          <Link to="/studentdetails" className="nav-link">
            <li className="nav-item">
              <FaUserGraduate className="nav-icon" />
              <span>Learner Management</span>
            </li>
          </Link>
        )}

        <li className="nav-item">
          <FaQuestionCircle className="nav-icon" />
          <span>Enquiry Management</span>
        </li>

        {canViewInstructors && (
          <Link to="/instructor" className="nav-link">
            <li className="nav-item">
              <FaUserGraduate className="nav-icon" />
              <span>Staff Management</span>
            </li>
          </Link>
        )}

        {canViewRoles && (
          <Link to="/roles" className="nav-link">
            <li className="nav-item">
              <i className="fa-solid fa-user nav-icon"></i>
              <span>Roles Management</span>
            </li>
          </Link>
        )}

        <li className="nav-section">Finance</li>
        {canViewFee && (
          <Link to="/reports" className="nav-link">
            <li className="nav-item">
              <FaMoneyBillAlt className="nav-icon" />
              <span>Fee Management</span>
            </li>
          </Link>
        )}

        {canViewInvoices && (
          <Link to="/invoices" className="nav-link">
            <li className="nav-item">
              <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
              <span>Invoice Management</span>
            </li>
          </Link>
        )}

        {canViewFinancePartners && (
          <Link to="/financePartners" className="nav-link">
            <li className="nav-item">
              <i className="fa-solid fa-money-check-dollar nav-icon"></i>
              <span>Finance Partner</span>
            </li>
          </Link>
        )}

        <li className="nav-section">Setting</li>

        <div className="admin-profile" onClick={toggleMenu}>
          <FaUser className="nav-icon" />
          <span>{user?.displayName || "Admin Profile"}</span>
          <span className="admin-initials">
            {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : "AD"}
          </span>
          <FaEllipsisV className="menu-icon" />

          <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
            <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
              Settings
            </Link>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;