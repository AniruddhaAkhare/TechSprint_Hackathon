// // import React, { useState, useEffect } from 'react';
// // import './Calendar.css';
// // import { useNavigate } from 'react-router-dom';

// // const Calendar = () => {
// //     const navigate = useNavigate();
// //     const [currentDate, setCurrentDate] = useState(new Date());
    
// //     // Function to get week dates
// //     const getWeekDates = (date) => {
// //         const startOfWeek = new Date(date);
// //         const day = startOfWeek.getDay();
// //         const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
// //         startOfWeek.setDate(diff);
        
// //         const dates = [];
// //         for (let i = 0; i < 7; i++) {
// //             const newDate = new Date(startOfWeek);
// //             newDate.setDate(startOfWeek.getDate() + i);
// //             dates.push(newDate);
// //         }
// //         return dates;
// //     };

// //     const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));

// //     // Format date for display
// //     const formatDate = (date) => {
// //         return date.toLocaleDateString('en-US', {
// //             weekday: 'short',
// //             month: 'short',
// //             day: 'numeric'
// //         });
// //     };

// //     // Format month for sidebar
// //     const formatMonth = (date) => {
// //         return date.toLocaleDateString('en-US', {
// //             month: 'long',
// //             year: 'numeric'
// //         });
// //     };

// //     // Get week range for header
// //     const getWeekRange = (dates) => {
// //         const start = dates[0].toLocaleDateString('en-US', {
// //             month: 'short',
// //             day: 'numeric'
// //         });
// //         const end = dates[6].toLocaleDateString('en-US', {
// //             month: 'short',
// //             day: 'numeric',
// //             year: 'numeric'
// //         });
// //         return `${start} - ${end}`;
// //     };

// //     // Generate calendar days for sidebar
// //     const generateCalendarDays = () => {
// //         const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
// //         const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
// //         const days = [];
        
// //         // Add previous month's days
// //         const firstWeekday = firstDay.getDay();
// //         for (let i = firstWeekday - 1; i >= 0; i--) {
// //             const prevDay = new Date(firstDay);
// //             prevDay.setDate(firstDay.getDate() - (i + 1));
// //             days.push(<span key={`prev-${i}`} className="other-month">{prevDay.getDate()}</span>);
// //         }

// //         // Add current month's days
// //         for (let i = 1; i <= lastDay.getDate(); i++) {
// //             const isToday = i === new Date().getDate() && 
// //                           currentDate.getMonth() === new Date().getMonth() &&
// //                           currentDate.getFullYear() === new Date().getFullYear();
// //             days.push(
// //                 <span 
// //                     key={i} 
// //                     className={isToday ? 'selected' : ''}
// //                 >
// //                     {i}
// //                 </span>
// //             );
// //         }

// //         return days;
// //     };

// //     // Navigation handlers
// //     const handlePrev = () => {
// //         const newDate = new Date(currentDate);
// //         newDate.setMonth(newDate.getMonth() - 1);
// //         setCurrentDate(newDate);
// //         setWeekDates(getWeekDates(newDate));
// //     };

// //     const handleNext = () => {
// //         const newDate = new Date(currentDate);
// //         newDate.setMonth(newDate.getMonth() + 1);
// //         setCurrentDate(newDate);
// //         setWeekDates(getWeekDates(newDate));
// //     };

// //     // Calculate current time position
// //     const getCurrentTimePosition = () => {
// //         const now = new Date();
// //         const hours = now.getHours();
// //         const minutes = now.getMinutes();
// //         const startHour = 13; // 1PM
// //         const pixelsPerHour = 60; // Adjust based on your CSS
        
// //         if (hours < startHour || hours >= 23) return -1; // Outside visible range
        
// //         const hoursFromStart = hours - startHour;
// //         const minutesFraction = minutes / 60;
// //         return (hoursFromStart + minutesFraction) * pixelsPerHour;
// //     };

// //     return (
// //         <div className="flex w-screen ml-80 p-4 calendar-container">
// //             <div className="calendar-sidebar">
// //                 <div className="sidebar-header">
// //                     <div className="logo">Fireblaze</div>
// //                 </div>
// //                 <button className="schedule-button" onClick={() => navigate('/sessions')}>
// //                     + Schedule session
// //                 </button>
// //                 <button className="back-home">Back to home</button>
// //                 <div className="month-selector">
// //                     <div className="month-title">{formatMonth(currentDate)}</div>
// //                     <div className="month-arrows">
// //                         <button onClick={handlePrev}>{'<'}</button>
// //                         <button onClick={handleNext}>{'>'}</button>
// //                     </div>
// //                 </div>
// //                 <div className="calendar-grid">
// //                     <div className="day-names">
// //                         <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
// //                         <span>Th</span><span>Fr</span><span>Sa</span>
// //                     </div>
// //                     <div className="day-numbers">
// //                         {generateCalendarDays()}
// //                     </div>
// //                 </div>
// //                 <div className="select-trainers">Select Trainers</div>
// //             </div>
// //             <main className="calendar-main">
// //                 <div className="calendar-header">
// //                     <div className="date-range">{getWeekRange(weekDates)}</div>
// //                     <div className="header-arrows">
// //                         <button onClick={handlePrev}>{'<'}</button>
// //                         <button onClick={handleNext}>{'>'}</button>
// //                     </div>
// //                     <div className="view-options">
// //                         <button className="active">Today</button>
// //                         <button>List</button>
// //                         <button>Day</button>
// //                         <button>Week</button>
// //                         <button>Month</button>
// //                     </div>
// //                 </div>
// //                 <div className="time-grid">
// //                     <div className="time-slots">
// //                         <span>1PM</span><span>2PM</span><span>3PM</span><span>4PM</span>
// //                         <span>5PM</span><span>6PM</span><span>7PM</span><span>8PM</span>
// //                         <span>9PM</span><span>10PM</span><span>11PM</span>
// //                     </div>
// //                     <div className="day-columns">
// //                         {weekDates.map((date, index) => (
// //                             <div 
// //                                 key={index} 
// //                                 className={`day-column ${date.toDateString() === new Date().toDateString() ? 'selected' : ''}`}
// //                             >
// //                                 <span>{formatDate(date)}</span>
// //                             </div>
// //                         ))}
// //                     </div>
// //                     <div className="event-area">
// //                         {weekDates.map((date, index) => (
// //                             <div 
// //                                 key={index} 
// //                                 className={`event-column ${date.toDateString() === new Date().toDateString() ? 'selected' : ''}`}
// //                             >
// //                                 {date.toDateString() === new Date().toDateString() && 
// //                                     getCurrentTimePosition() >= 0 && (
// //                                         <div 
// //                                             className="current-time-line"
// //                                             style={{ top: `${getCurrentTimePosition()}px` }}
// //                                         />
// //                                     )}
// //                                 {/* Add your events here */}
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             </main>
// //         </div>
// //     );
// // };

// // export default Calendar;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Calendar = () => {
//     const navigate = useNavigate();
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));

//     // Function to get week dates
//     const getWeekDates = (date) => {
//         const startOfWeek = new Date(date);
//         const day = startOfWeek.getDay();
//         const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
//         startOfWeek.setDate(diff);
        
//         const dates = [];
//         for (let i = 0; i < 7; i++) {
//             const newDate = new Date(startOfWeek);
//             newDate.setDate(startOfWeek.getDate() + i);
//             dates.push(newDate);
//         }
//         return dates;
//     };

//     // Format date for display
//     const formatDate = (date) => {
//         return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
//     };

//     // Format month for sidebar
//     const formatMonth = (date) => {
//         return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//     };

//     // Get week range for header
//     const getWeekRange = (dates) => {
//         const start = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         const end = dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//         return `${start} - ${end}`;
//     };

//     // Generate calendar days for sidebar
//     const generateCalendarDays = () => {
//         const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//         const days = [];
        
//         const firstWeekday = firstDay.getDay();
//         for (let i = firstWeekday - 1; i >= 0; i--) {
//             const prevDay = new Date(firstDay);
//             prevDay.setDate(firstDay.getDate() - (i + 1));
//             days.push(
//                 <span key={`prev-${i}`} className="text-gray-400">{prevDay.getDate()}</span>
//             );
//         }

//         for (let i = 1; i <= lastDay.getDate(); i++) {
//             const isToday = i === new Date().getDate() && 
//                           currentDate.getMonth() === new Date().getMonth() &&
//                           currentDate.getFullYear() === new Date().getFullYear();
//             days.push(
//                 <span 
//                     key={i} 
//                     className={`flex items-center justify-center w-8 h-8 ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}`}
//                 >
//                     {i}
//                 </span>
//             );
//         }

//         return days;
//     };

//     // Navigation handlers
//     const handlePrev = () => {
//         const newDate = new Date(currentDate);
//         newDate.setMonth(newDate.getMonth() - 1);
//         setCurrentDate(newDate);
//         setWeekDates(getWeekDates(newDate));
//     };

//     const handleNext = () => {
//         const newDate = new Date(currentDate);
//         newDate.setMonth(newDate.getMonth() + 1);
//         setCurrentDate(newDate);
//         setWeekDates(getWeekDates(newDate));
//     };

//     // Calculate current time position
//     const getCurrentTimePosition = () => {
//         const now = new Date();
//         const hours = now.getHours();
//         const minutes = now.getMinutes();
//         const startHour = 13; // 1PM
//         const pixelsPerHour = 60; // 60px per hour
        
//         if (hours < startHour || hours >= 23) return -1;
        
//         const hoursFromStart = hours - startHour;
//         const minutesFraction = minutes / 60;
//         return (hoursFromStart + minutesFraction) * pixelsPerHour;
//     };

//     return (
//         <div className="flex flex-col md:flex-row w-full min-h-screen p-4 md:ml-80">
//             {/* Sidebar */}
//             <div className="w-full md:w-64 bg-gray-100 p-4 space-y-4 md:sticky md:top-4">
//                 <div className="flex items-center space-x-2">
//                     <div className="text-xl font-bold">Fireblaze</div>
//                 </div>
//                 <button
//                     className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
//                     onClick={() => navigate('/sessions')}
//                 >
//                     + Schedule session
//                 </button>
//                 <button
//                     className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
//                     onClick={() => navigate('/dashboard')}
//                 >
//                     Back to home
//                 </button>
//                 <div className="flex justify-between items-center">
//                     <div className="text-lg font-semibold">{formatMonth(currentDate)}</div>
//                     <div className="flex space-x-2">
//                         <button onClick={handlePrev} className="text-gray-600 hover:text-gray-800">&lt;</button>
//                         <button onClick={handleNext} className="text-gray-600 hover:text-gray-800">&gt;</button>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-7 gap-1 text-center">
//                     <div className="grid grid-cols-7 gap-1 text-sm text-gray-600">
//                         <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
//                         <span>Th</span><span>Fr</span><span>Sa</span>
//                     </div>
//                     <div className="grid grid-cols-7 gap-1">
//                         {generateCalendarDays()}
//                     </div>
//                 </div>
//                 <div className="text-sm text-gray-600">Select Trainers</div>
//             </div>

//             {/* Main Calendar */}
//             <main className="flex-1 w-full p-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//                     <div className="text-lg font-semibold">{getWeekRange(weekDates)}</div>
//                     <div className="flex space-x-2">
//                         <button onClick={handlePrev} className="text-gray-600 hover:text-gray-800">&lt;</button>
//                         <button onClick={handleNext} className="text-gray-600 hover:text-gray-800">&gt;</button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                         <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Today</button>
//                         <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">List</button>
//                         <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Day</button>
//                         <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Week</button>
//                         <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Month</button>
//                     </div>
//                 </div>

//                 <div className="relative overflow-x-auto">
//                     <div className="grid grid-cols-[60px_1fr] gap-0">
//                         {/* Time Slots */}
//                         <div className="flex flex-col text-sm text-gray-600">
//                             <span className="h-[30px]"></span> {/* Empty space for date header */}
//                             {['1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'].map((time, index) => (
//                                 <span key={index} className="h-[60px] flex items-center">{time}</span>
//                             ))}
//                         </div>

//                         {/* Day Columns */}
//                         <div className="grid grid-cols-7 gap-0 min-w-[700px]">
//                             {weekDates.map((date, index) => (
//                                 <div
//                                     key={index}
//                                     className={`flex flex-col border-r ${date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}`}
//                                 >
//                                     <span className="text-center text-sm font-medium p-2 border-b">{formatDate(date)}</span>
//                                     <div className="relative h-[660px]">
//                                         {date.toDateString() === new Date().toDateString() && getCurrentTimePosition() >= 0 && (
//                                             <div
//                                                 className="absolute w-full h-0.5 bg-red-500"
//                                                 style={{ top: `${getCurrentTimePosition()}px` }}
//                                             />
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Calendar;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Function to get week dates (moved before useState)
    const getWeekDates = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);
        
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const newDate = new Date(startOfWeek);
            newDate.setDate(startOfWeek.getDate() + i);
            dates.push(newDate);
        }
        return dates;
    };

    // Now safe to use getWeekDates
    const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));

    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Format month for sidebar
    const formatMonth = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Get week range for header
    const getWeekRange = (dates) => {
        const start = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const end = dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${start} - ${end}`;
    };

    // Generate calendar days for sidebar
    const generateCalendarDays = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const days = [];
        
        const firstWeekday = firstDay.getDay();
        for (let i = firstWeekday - 1; i >= 0; i--) {
            const prevDay = new Date(firstDay);
            prevDay.setDate(firstDay.getDate() - (i + 1));
            days.push(
                <span key={`prev-${i}`} className="text-gray-400">{prevDay.getDate()}</span>
            );
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const isToday = i === new Date().getDate() && 
                          currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear();
            days.push(
                <span 
                    key={i} 
                    className={`flex items-center justify-center w-8 h-8 ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}`}
                >
                    {i}
                </span>
            );
        }

        return days;
    };

    // Navigation handlers
    const handlePrev = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
        setWeekDates(getWeekDates(newDate));
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
        setWeekDates(getWeekDates(newDate));
    };

    // Calculate current time position
    const getCurrentTimePosition = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const startHour = 13; // 1PM
        const pixelsPerHour = 60; // 60px per hour
        
        if (hours < startHour || hours >= 23) return -1;
        
        const hoursFromStart = hours - startHour;
        const minutesFraction = minutes / 60;
        return (hoursFromStart + minutesFraction) * pixelsPerHour;
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen p-4 md:ml-80">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-100 p-4 space-y-4 md:sticky md:top-4">
                <div className="flex items-center space-x-2">
                    <div className="text-xl font-bold">Fireblaze</div>
                </div>
                <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={() => navigate('/sessions')}
                >
                    + Schedule session
                </button>
                <button
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to home
                </button>
                <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">{formatMonth(currentDate)}</div>
                    <div className="flex space-x-2">
                        <button onClick={handlePrev} className="text-gray-600 hover:text-gray-800">&lt;</button>
                        <button onClick={handleNext} className="text-gray-600 hover:text-gray-800">&gt;</button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                    <div className="grid grid-cols-7 gap-1 text-sm text-gray-600">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
                        <span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays()}
                    </div>
                </div>
                <div className="text-sm text-gray-600">Select Trainers</div>
            </div>

            {/* Main Calendar */}
            <main className="flex-1 w-full p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div className="text-lg font-semibold">{getWeekRange(weekDates)}</div>
                    <div className="flex space-x-2">
                        <button onClick={handlePrev} className="text-gray-600 hover:text-gray-800">&lt;</button>
                        <button onClick={handleNext} className="text-gray-600 hover:text-gray-800">&gt;</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Today</button>
                        <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">List</button>
                        <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Day</button>
                        <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Week</button>
                        <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Month</button>
                    </div>
                </div>

                <div className="relative overflow-x-auto">
                    <div className="grid grid-cols-[60px_1fr] gap-0">
                        {/* Time Slots */}
                        <div className="flex flex-col text-sm text-gray-600">
                            <span className="h-[30px]"></span> {/* Empty space for date header */}
                            {['1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'].map((time, index) => (
                                <span key={index} className="h-[60px] flex items-center">{time}</span>
                            ))}
                        </div>

                        {/* Day Columns */}
                        <div className="grid grid-cols-7 gap-0 min-w-[700px]">
                            {weekDates.map((date, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col border-r ${date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}`}
                                >
                                    <span className="text-center text-sm font-medium p-2 border-b">{formatDate(date)}</span>
                                    <div className="relative h-[660px]">
                                        {date.toDateString() === new Date().toDateString() && getCurrentTimePosition() >= 0 && (
                                            <div
                                                className="absolute w-full h-0.5 bg-red-500"
                                                style={{ top: `${getCurrentTimePosition()}px` }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Calendar;