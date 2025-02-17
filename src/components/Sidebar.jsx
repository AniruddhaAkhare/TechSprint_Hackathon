import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import {
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";


export default function Sidebar() {
    const [open, setOpen] = React.useState(0);
    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const navigate = useNavigate();
    const OnSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (err) {
            console.log("Error in signing out", err);
        }
    };

    return (
        <div className=" fixed h-screen max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-900 text-white w-full overflow-y-auto">
            {/* <Card className="bg-gray-900"> */}
            <div className="mb-2 p-4">
                <div className="flex items-center mb-6" onClick={() => { navigate("/") }} style={{ cursor: 'pointer' }}>
                    <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center" >
                        <img src="fireblaze.jpg" alt="F" />
                    </div>
                    <Typography variant='h3' className="ml-3 text-xl font-semibold">Fireblaze</Typography>
                </div>
            </div>
            <List >
                <ListItem onClick={() => navigate('/dashboard')}>
                    <ListItemPrefix>
                        <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Dashboard
                    <ListItemSuffix>
                        <Chip value="" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                    </ListItemSuffix>
                </ListItem>
                <Accordion
                    open={open === 1}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 1}>
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
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
                            <ListItem onClick={() => navigate('/scheduleui')}>
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
                            <ListItem onClick={() => navigate('#')}>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Question Bank
                            </ListItem>
                            <ListItem onClick={() => navigate('/classRec')}>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Live Class Recording
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
                    <ListItemSuffix>
                        <Chip value="" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                    </ListItemSuffix>
                </ListItem>
                <ListItem onClick={() => navigate('#')}>
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Submissions
                </ListItem>
                <ListItem onClick={() => navigate('/feedback')}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Feedback Forms
                </ListItem>
                <ListItem onClick={() => navigate('/studentdetails')}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Students
                </ListItem>
                <ListItem onClick={() => navigate('/invoices')}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Invoices
                </ListItem>
                <ListItem onClick={() => { navigate('#') }}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Marketing
                </ListItem>
                <ListItem onClick={OnSignOut}>
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                </ListItem>
            </List>
            <div className='mt-11'>
                <div className="bg-purple-600 text-white p-3 rounded mb-4">
                    <p>Trial expires in 10 days</p>
                    <a href="#" className="underline">Choose a plan </a>
                </div>
                <div className="flex items-center">
                    <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
                        <span className="text-xl font-bold">AK</span>
                    </div>
                    <div className="ml-3">
                        <p className="font-semibold">Anirudh Kalbande</p>
                        <p className="text-sm">SUPER ADMIN</p>
                        {/* <button onClick = {handleLogout}></button> */}
                    </div>
                </div>
            </div>
        </div>
    );


};
