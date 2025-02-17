import React, { useState } from 'react';
import './Calendar.css'; // Create a CSS file for styling

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTrainer, setSelectedTrainer] = useState('');

    const handleDateChange = (newDate) => {
        setCurrentDate(newDate);
    };

    return (
        <div className="calendar-container">
            <div className="sidebar">
                <h2>Fireblaze</h2>
                <button>+ Schedule session</button>
                <h3>Select Trainers</h3>
                <select onChange={(e) => setSelectedTrainer(e.target.value)}>
                    <option value="">Select Trainer</option>
                    {/* Add trainer options here */}
                </select>
            </div>
            <div className="calendar">
                <h2>{currentDate.toDateString()}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Generate time slots and days here */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Calendar;
