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
    const [open, setOpen] = useState(0);
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
            console.log("Fetching instructor data for:", email); // Debugging log
            const instructorRef = collection(firestore, "Instructor");
            const q = query(instructorRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const instructor = querySnapshot.docs[0].data(); // Get first matching instructor
                console.log("Instructor Data:", instructor); // Debugging log
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
        <div className="fixed h-screen max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-900 text-white w-full overflow-y-auto">
            <div className="mb-2 p-4">
                <div className="flex items-center mb-6" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                   
                    <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center" >
                        <img src="../../fireblaze.jpg" alt="F" />
                    </div>


                    <Typography variant='h3' className="ml-3 text-xl font-semibold">Fireblaze</Typography>
                </div>
            </div>
            
            <List>
                <ListItem onClick={() => navigate('/dashboard')}>
                    <ListItemPrefix>
                        <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Dashboard
                </ListItem>

                <Accordion open={open === 1}>
                    <ListItem className="p-0" selected={open === 1}>
                        <AccordionHeader onClick={() => setOpen(open === 1 ? 0 : 1)} className="border-b-0 p-3">
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
                            <ListItem onClick={() => navigate('/sessions')}>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Sessions
                            </ListItem>
                        </List>
                    </AccordionBody>
                </Accordion>

                <hr className="my-2 border-blue-gray-50" />

                <ListItem onClick={() => navigate('/instructor')}>
                    <ListItemPrefix>
                        <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Instructor
                </ListItem>
                <ListItem onClick={() => navigate('/feedback')}>
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Feedback Forms
                </ListItem>
                <ListItem onClick={() => navigate('/studentdetails')}>
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Students
                </ListItem>
                <ListItem onClick={() => navigate('/addPerformance')}>
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Add Performance
                </ListItem>
                <ListItem onClick={handleSignOut}>
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                </ListItem>
            </List>
            {/* Bottom Section for Instructor Info */}
            <div className="absolute bottom-5 left-4 w-full">
                <div className="bg-gray-800 p-4 rounded-lg flex items-center cursor-pointer" onClick={() => navigate(`/my-profile/${user?.uid}`)}>

                    <div className="bg-purple-600 text-white rounded-full h-12 w-12 flex items-center justify-center text-lg font-bold">
                        {getUserInitials()}
                    </div>

                    <div className="ml-3">
                        <p className="font-semibold">
                            {instructorData ? `${instructorData.f_name} ${instructorData.l_name}` : "User"}
                        </p>
                        {instructorData?.specialization && (
                            <p className="text-xs text-gray-400">
                                {instructorData.specialization}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
