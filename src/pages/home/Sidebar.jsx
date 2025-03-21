import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase.js";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import InstructorProfile from '../components/Performance/InstructorProfile.jsx';

import {
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";

import {
    InboxIcon,
    PowerIcon,
    Cog6ToothIcon,
    PresentationChartBarIcon,
    ChevronRightIcon
} from "@heroicons/react/24/solid";

export default function Sidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [instructorData, setInstructorData] = useState(null);
    const firestore = getFirestore();
    const [openCourseDelivery, setOpenCourseDelivery] = useState(false);
    const [openRoles, setOpenRoles] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                await fetchInstructorData(authUser.email);
            } else {
                setUser(null);
                setInstructorData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchInstructorData = async (email) => {
        try {
            const instructorRef = collection(firestore, "Instructor");
            const q = query(instructorRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const instructor = querySnapshot.docs[0].data(); 
                setInstructorData(instructor);
            } else {
                console.log("Instructor details not found for this email.");
            }
        } catch (error) {
            console.error("Error fetching instructor data:", error);
        }
    };

    const getUserInitials = () => {
        if (instructorData?.f_name && instructorData?.l_name) {
            return `${instructorData.f_name[0]}${instructorData.l_name[0]}`.toUpperCase();
        }
        return "U";
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (err) {
            console.log("Error signing out", err);
        }
    };

    return (
        <>
        <div>
            <div className="fixed h-screen p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-900 text-white overflow-y-auto w-80">
                <div className="mb-2 p-4">
                    <div className="flex items-center mb-6" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                        <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center ">
                            <img src="/img/fireblaze.jpg" alt="F" />
                        </div>
                        <Typography variant='h3' className="ml-3 text-3xl font-semibold pb-3">Fireblaze</Typography>
                    </div>
                </div>

                <List>
                    <ListItem onClick={() => navigate('/dashboard')}>
                        <ListItemPrefix>
                            <InboxIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Dashboard
                    </ListItem>

                    <Accordion open={openCourseDelivery}>
                        <ListItem className="p-0" selected={openCourseDelivery}>
                            <AccordionHeader onClick={() => {
                                setOpenCourseDelivery(!openCourseDelivery);
                                setOpenUsers(false);
                                setOpenSettings(false);
                            }} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Course Delivery
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0 text-white">
                                <ListItem onClick={() => navigate('/courses')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Courses
                                </ListItem>
                                <ListItem onClick={() => navigate('/batches')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Batches
                                </ListItem>
                                <ListItem onClick={() => navigate('/calendar')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Sessions
                                </ListItem>
                                <ListItem onClick={() => navigate('/curriculum')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Curriculum
                                </ListItem>

                                <ListItem onClick={() => navigate('/attendance')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Attendance
                                </ListItem>


                                <ListItem onClick={() => navigate('/assignment')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Assignment
                                </ListItem>
                                <ListItem onClick={() => navigate('/addPerformance')}>
                                    <ListItemPrefix>
                                        <PresentationChartBarIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    Add Performance
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>

                    <Accordion open={openUsers}>
                        <ListItem className="p-0" selected={openUsers}>
                            <AccordionHeader onClick={() => {
                                setOpenUsers(!openUsers);
                                setOpenRoles(false);
                                setOpenCourseDelivery(false);
                                setOpenSettings(false);
                            }} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Users
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0 text-white">
                                <ListItem onClick={() => navigate('/studentdetails')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Learners
                                </ListItem>
                                <ListItem onClick={() => navigate('/instructor')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Admin & staff
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>

                    <ListItem onClick={() => navigate('/reports')}>
                        <ListItemPrefix>
                            <InboxIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Reports
                    </ListItem>


                    <ListItem onClick={() => navigate('/invoices')}>
                        <ListItemPrefix>
                            <InboxIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Invoices
                    </ListItem>


                    <Accordion open={openSettings}>
                        <ListItem className="p-0" selected={openSettings}>
                            <AccordionHeader onClick={() => {
                                setOpenSettings(!openSettings);
                                setOpenCourseDelivery(false);
                                setOpenRoles(false);
                                setOpenUsers(false);
                            }} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Settings
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0 text-white">
                                <ListItem onClick={() => navigate('/centers')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Add centers
                                </ListItem>

                                <ListItem onClick={() => navigate('/financePartners')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Finance Partner
                                </ListItem>


                                <ListItem onClick={() => navigate('/fee-template')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Fee Template
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>


                    <Accordion open={openRoles}>
                        <ListItem className="p-0" selected={openRoles}>
                            <AccordionHeader onClick={() => {
                                setOpenRoles(!openRoles);
                                setOpenCourseDelivery(false);
                                setOpenUsers(false);
                                setOpenSettings(false);
                            }} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Users & Roles
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0 text-white">
                                <ListItem onClick={() => navigate('/users')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Users
                                </ListItem>
                                <ListItem onClick={() => navigate('/roles')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Roles
                                </ListItem>
                                <ListItem onClick={() => navigate('/preferences')}>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Preferences
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>

                    <ListItem onClick={handleSignOut}>
                        <ListItemPrefix>
                            <PowerIcon className="h-5 w-5" />    
                        </ListItemPrefix>      
                        Log Out
                    </ListItem>   
                    <ListItem
                        className="fixed bottom-0 left-0 w-70 bg-gray-800 p-2 rounded-lg flex items-center cursor-pointer"
                        onClick={() => navigate(`/my-profile/${user?.uid}`)}
                        
                    >
                        <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                            {getUserInitials()} 
                        </div>                      
                        <div className="ml-3">
                            <p className="font-semibold">
                                {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "User"}
                            </p>
                            {instructorData?.specialization && (
                                <p className="text-xs text-gray-400">
                                    {instructorData.role}
                                </p>
                            )}
                        </div>
                    </ListItem>

                </List>

            </div>
            </div>

        </>

    );
}
