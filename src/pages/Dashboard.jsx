import React, { useState } from 'react';
import moment from 'moment'; // For date formatting
import { useNavigate } from 'react-router-dom';
import Calender from './Calendar.jsx'; // Importing the calendar component

// Sample Data
const sampleWeeklyPerformance = {
    averageTimeSpent: '05m 17s',
    totalViews: 0,
    averageRating: 0,
    averageAttendance: 0,
};

const sampleTodaySessions = {
    sessionsScheduled: 0,
    sessionsCancelled: 0,
    totalSignIns: 0,
    notSignedIn: 0,
    averageAttendance: 0,
};

const sampleSessionsData = []; // Your sessions data

const Dashboard = () => {
    const [weeklyPerformance, setWeeklyPerformance] = useState(sampleWeeklyPerformance);
    const [selectedDate, setSelectedDate] = useState(moment('2025-02-05')); // Initial date

    const handleDateChange = (event) => {
        setSelectedDate(moment(event.target.value));
    };

    const navigate = useNavigate();

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Welcome Samiksha!</h1>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Schedule session
                </button>
            </div>

            <section className="bg-white p-4 rounded shadow mt-6">
                <h2 className="text-lg font-semibold">Weekly Performance (Last 7 Days)</h2>
                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="border p-4 rounded">
                        <h3 className="font-semibold">Average time spent</h3>
                        <p>{weeklyPerformance.averageTimeSpent}</p>
                    </div>
                    {/* Add other cards here as needed */}
                </div>
            </section>

            {/* ... (Charts and other sections) */}

            <section className="bg-white p-4 rounded shadow mt-6">
                <h2 className="text-lg font-semibold">Today's Sessions</h2>
                <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => setSelectedDate(moment(selectedDate).subtract(1, 'day'))} className="border p-2 rounded">
                        &lt;
                    </button>
                    <input
                        type="date"
                        value={selectedDate.format('YYYY-MM-DD')}
                        onChange={handleDateChange}
                        className="border p-2 rounded"
                    />
                    <button onClick={() => setSelectedDate(moment(selectedDate).add(1, 'day'))} className="border p-2 rounded">
                        &gt;
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Mark as holiday</button>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                    {/* ... Today's Sessions cards */}
                </div>

                <table className="w-full mt-4 border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-4 border-b">#</th>
                            <th className="p-4 border-b">Sessions</th>
                            <th className="p-4 border-b">Attendance</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b">Topics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleSessionsData.map((session, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="p-4 border-b">{index + 1}</td>
                                <td className="p-4 border-b">{session.title}</td>
                                <td className="p-4 border-b">{session.attendance}</td>
                                <td className="p-4 border-b">
                                    <span 
                                        className={`inline-block w-2 h-2 rounded-full mr-2 ${session.status === 'in-time' ? 'bg-green-500' : session.status === 'late' ? 'bg-orange-500' : 'bg-gray-500'}`}
                                    ></span>
                                    {session.status}
                                </td>
                                <td className="p-4 border-b">{session.topics}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Dashboard;
