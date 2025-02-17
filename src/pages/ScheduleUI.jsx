import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ScheduleUI() {
    const navigate = useNavigate(); // Initialize navigate

    return (
        <div className="flex h-screen ml-80 p-4">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-900 text-white flex flex-col p-4">
                <div className="mb-4 text-lg font-bold">Fireblaze</div>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4"
                    onClick={() => navigate('/createSession')} // Navigate to CreateSession
                >
                    + Schedule session
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mb-6">
                    Back to home
                </button>

                <div className="text-sm font-semibold mb-4">February 2025</div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }, (_, i) => (
                        <div
                            key={i}
                            className={`p-2 text-center rounded ${i + 1 === 5 ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}>
                            {i + 1}
                        </div>
                    ))}
                </div>

                <select className="mt-6 bg-gray-800 text-white p-2 rounded w-full">
                    <option>Select Trainers</option>
                </select>
            </div>

            {/* Main Calendar */}
            <div className="flex-1 bg-white">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="text-lg font-bold">Feb 2 - 8, 2025</div>
                    <div className="space-x-2">
                        <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">Today</button>
                        <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">List</button>
                        <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">Day</button>
                        <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">Week</button>
                        <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">Month</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-t">
                    {["Sun 2/2", "Mon 2/3", "Tue 2/4", "Wed 2/5", "Thu 2/6", "Fri 2/7", "Sat 2/8"].map((day, index) => (
                        <div
                            key={index}
                            className="border-r last:border-r-0 border-gray-300 py-4 text-center font-medium"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 h-[calc(100%-100px)]">
                    {Array.from({ length: 7 }, (_, dayIndex) => (
                        <div
                            key={dayIndex}
                            className={`border-r last:border-r-0 border-gray-300`}
                        >
                            {dayIndex === 3 && (
                                <div className="bg-yellow-200 h-40 border-t border-red-500"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
