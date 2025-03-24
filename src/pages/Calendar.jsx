// import React, { useState } from 'react';
// import './Calendar.css'; // Create a CSS file for styling

// const Calendar = () => {
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [selectedTrainer, setSelectedTrainer] = useState('');

//     const handleDateChange = (newDate) => {
//         setCurrentDate(newDate);
//     };

//     return (
//         <div className="calendar-container">
//             <div className="sidebar">
//                 <h2>Fireblaze</h2>
//                 <button>+ Schedule session</button>
//                 <h3>Select Trainers</h3>
//                 <select onChange={(e) => setSelectedTrainer(e.target.value)}>
//                     <option value="">Select Trainer</option>
//                     {/* Add trainer options here */}
//                 </select>
//             </div>
//             <div className="calendar">
//                 <h2>{currentDate.toDateString()}</h2>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Time</th>
//                             <th>Sun</th>
//                             <th>Mon</th>
//                             <th>Tue</th>
//                             <th>Wed</th>
//                             <th>Thu</th>
//                             <th>Fri</th>
//                             <th>Sat</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {/* Generate time slots and days here */}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Calendar;


// import React from 'react';
// import './Calendar.css'; // Create this CSS file
// import { useNavigate } from 'react-router-dom';

// const Calendar = () => {
//     const navigate = useNavigate();
//     return (
//         <div className="flex- w-screen ml-80 p-4 calendar-container">
//             <div className="calendar-sidebar">
//                 <div className="sidebar-header">
//                     <div className="logo">Fireblaze</div>
//                 </div>
//                 <button className="schedule-button" onClick={() => navigate('/sessions')}>
//                     + Schedule session
//                 </button>
//                 {/* <button className="schedule-button">+ Schedule session</button> */}
//                 <button className="back-home">Back to home</button>
//                 <div className="month-selector">
//                     <div className="month-title">February 2025</div>
//                     <div className="month-arrows">
//                         <button>&lt;</button>
//                         <button>&gt;</button>
//                     </div>
//                 </div>
//                 <div className="calendar-grid">
//                     <div className="day-names">
//                         <span>Su</span>
//                         <span>Mo</span>
//                         <span>Tu</span>
//                         <span>We</span>
//                         <span>Th</span>
//                         <span>Fr</span>
//                         <span>Sa</span>
//                     </div>
//                     <div className="day-numbers">
//                         {/* Replace with actual logic to generate days */}
//                         <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span>01</span>
//                         <span>02</span><span>03</span><span>04</span><span className="selected">05</span><span>06</span><span>07</span><span>08</span>
//                         <span>09</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span>15</span>
//                         <span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span>
//                         <span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span><span>01</span>
//                         <span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span>
//                     </div>
//                 </div>
//                 <div className="select-trainers">Select Trainers</div>
//             {/* </aside> */}
//             </div>
//             <main className="calendar-main">
//                 <div className="calendar-header">
//                     <div className="date-range">Feb 2 - 8, 2025</div>
//                     <div className="header-arrows">
//                         <button>&lt;</button>
//                         <button>&gt;</button>
//                     </div>
//                     <div className="view-options">
//                         <button className="active">Today</button>
//                         <button>List</button>
//                         <button>Day</button>
//                         <button>Week</button>
//                         <button>Month</button>
//                     </div>
//                 </div>
//                 <div className="time-grid">
//                     <div className="time-slots">
//                         <span>1PM</span>
//                         <span>2PM</span>
//                         <span>3PM</span>
//                         <span>4PM</span>
//                         <span>5PM</span>
//                         <span>6PM</span>
//                         <span>7PM</span>
//                         <span>8PM</span>
//                         <span>9PM</span>
//                         <span>10PM</span>
//                         <span>11PM</span>
//                     </div>
//                     <div className="day-columns">
//                         <div className="day-column"><span>Sun 2/2</span></div>
//                         <div className="day-column"><span>Mon 2/3</span></div>
//                         <div className="day-column"><span>Tue 2/4</span></div>
//                         <div className="day-column selected"><span>Wed 2/5</span></div>
//                         <div className="day-column"><span>Thu 2/6</span></div>
//                         <div className="day-column"><span>Fri 2/7</span></div>
//                         <div className="day-column"><span>Sat 2/8</span></div>
//                     </div>
//                     <div className="event-area">
//                         <div className="event-column selected">
//                             <div className="event" style={{ top: '120px', height: '60px' }}></div>
//                         </div>
//                         {/* Add other event columns similarly */}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Calendar;

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


import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Function to get week dates
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

    const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));

    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format month for sidebar
    const formatMonth = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    // Get week range for header
    const getWeekRange = (dates) => {
        const start = dates[0].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        const end = dates[6].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        return `${start} - ${end}`;
    };

    // Generate calendar days for sidebar
    const generateCalendarDays = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const days = [];
        
        // Add previous month's days
        const firstWeekday = firstDay.getDay();
        for (let i = firstWeekday - 1; i >= 0; i--) {
            const prevDay = new Date(firstDay);
            prevDay.setDate(firstDay.getDate() - (i + 1));
            days.push(<span key={`prev-${i}`} className="other-month">{prevDay.getDate()}</span>);
        }

        // Add current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const isToday = i === new Date().getDate() && 
                          currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear();
            days.push(
                <span 
                    key={i} 
                    className={isToday ? 'selected' : ''}
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
        const pixelsPerHour = 60; // Adjust based on your CSS
        
        if (hours < startHour || hours >= 23) return -1; // Outside visible range
        
        const hoursFromStart = hours - startHour;
        const minutesFraction = minutes / 60;
        return (hoursFromStart + minutesFraction) * pixelsPerHour;
    };

    return (
        <div className="flex w-screen ml-80 p-4 calendar-container">
            <div className="calendar-sidebar">
                <div className="sidebar-header">
                    <div className="logo">Fireblaze</div>
                </div>
                <button className="schedule-button" onClick={() => navigate('/sessions')}>
                    + Schedule session
                </button>
                <button className="back-home">Back to home</button>
                <div className="month-selector">
                    <div className="month-title">{formatMonth(currentDate)}</div>
                    <div className="month-arrows">
                        <button onClick={handlePrev}>{'<'}</button>
                        <button onClick={handleNext}>{'>'}</button>
                    </div>
                </div>
                <div className="calendar-grid">
                    <div className="day-names">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
                        <span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="day-numbers">
                        {generateCalendarDays()}
                    </div>
                </div>
                <div className="select-trainers">Select Trainers</div>
            </div>
            <main className="calendar-main">
                <div className="calendar-header">
                    <div className="date-range">{getWeekRange(weekDates)}</div>
                    <div className="header-arrows">
                        <button onClick={handlePrev}>{'<'}</button>
                        <button onClick={handleNext}>{'>'}</button>
                    </div>
                    <div className="view-options">
                        <button className="active">Today</button>
                        <button>List</button>
                        <button>Day</button>
                        <button>Week</button>
                        <button>Month</button>
                    </div>
                </div>
                <div className="time-grid">
                    <div className="time-slots">
                        <span>1PM</span><span>2PM</span><span>3PM</span><span>4PM</span>
                        <span>5PM</span><span>6PM</span><span>7PM</span><span>8PM</span>
                        <span>9PM</span><span>10PM</span><span>11PM</span>
                    </div>
                    <div className="day-columns">
                        {weekDates.map((date, index) => (
                            <div 
                                key={index} 
                                className={`day-column ${date.toDateString() === new Date().toDateString() ? 'selected' : ''}`}
                            >
                                <span>{formatDate(date)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="event-area">
                        {weekDates.map((date, index) => (
                            <div 
                                key={index} 
                                className={`event-column ${date.toDateString() === new Date().toDateString() ? 'selected' : ''}`}
                            >
                                {date.toDateString() === new Date().toDateString() && 
                                    getCurrentTimePosition() >= 0 && (
                                        <div 
                                            className="current-time-line"
                                            style={{ top: `${getCurrentTimePosition()}px` }}
                                        />
                                    )}
                                {/* Add your events here */}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Calendar;