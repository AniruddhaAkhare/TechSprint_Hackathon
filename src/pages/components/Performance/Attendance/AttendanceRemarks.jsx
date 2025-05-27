import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../../../config/firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AttendanceRemarks() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, rolePermissions } = useAuth();
    const student = location.state?.student;
    const [attendanceRemarks, setAttendanceRemarks] = useState([]);

    // Permission checks (aligned with other components)
    const canCreate = rolePermissions.AttendanceRemarks?.create || false;
    const canDisplay = rolePermissions.AttendanceRemarks?.display || false;

    const logActivity = useCallback(async (action, details) => {
        if (!user) {
            //console.error("No user logged in for logging activity");
            return;
        }
        try {
            const logDocRef = doc(db, "activityLogs", "currentLog");
            const logEntry = {
                timestamp: serverTimestamp(),
                userId: user.uid,
                userEmail: user.email || 'Unknown',
                action,
                details
            };
            await updateDoc(logDocRef, {
                logs: arrayUnion(logEntry),
                count: increment(1)
            }).catch(async (err) => {
                if (err.code === 'not-found') {
                    await setDoc(logDocRef, { logs: [logEntry], count: 1 });
                } else {
                    throw err;
                }
            });
        } catch (err) {
            //console.error("Error logging activity:", err.message);
            toast.error("Failed to log activity.");
        }
    }, [user]);

    useEffect(() => {
        if (!canDisplay || !student?.id) {
            if (!canDisplay) {
                toast.error("Access Denied: You do not have permission to view attendance remarks.");
            } else if (!student?.id) {
                toast.error("No student selected!");
            }
            return;
        }

        const studentRef = doc(db, "student", student.id);
        const unsubscribe = onSnapshot(studentRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAttendanceRemarks(data.attendanceRemarks || []);
                toast.success("Attendance remarks loaded successfully.");
            } else {
                //console.error("Student document not found");
                toast.error("Student document not found.");
                setAttendanceRemarks([]);
            }
        }, (error) => {
            //console.error("Error fetching attendance remarks:", error.message);
            toast.error("Failed to fetch attendance remarks.");
        });

        return () => unsubscribe();
    }, [canDisplay, student]);

    const handleCreateAttendanceRemarks = async () => {
        if (!canCreate) {
            toast.error("You do not have permission to create attendance remarks.");
            return;
        }
        try {
            await logActivity("Navigated to create attendance remark", {
                studentId: student.id,
                studentName: student.first_name || 'Unknown'
            });
            navigate("/createAttendanceRemarks", { state: { student, attendanceRemarks } });
        } catch (error) {
            //console.error("Error logging navigation:", error.message);
            toast.error("Failed to initiate create attendance remark.");
        }
    };

    if (!canDisplay) {
        return (
            <div className="p-6 text-center text-red-600 font-semibold">
                Access Denied: You do not have permission to view attendance remarks.
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen font-sans">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Attendance Remarks</h1>
            
            {student ? (
                <p className="text-gray-700 mb-6">
                    Attendance remarks for: <strong>{student.first_name}</strong>
                </p>
            ) : (
                <p className="text-red-600 mb-6">⚠ No student selected!</p>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Remarks History</h2>
            {attendanceRemarks.length > 0 ? (
                <ul className="bg-white p-4 rounded-lg shadow-md">
                    {attendanceRemarks.map((attendance, index) => (
                        <li key={index} className="border-b py-2 last:border-b-0">
                            <strong className="text-gray-800">{attendance.subject}</strong> - 
                            Present session count: {attendance.present} - 
                            Remarks: {attendance.remarks} - 
                            Updated by: {attendance.admin} - 
                            Updated on: {attendance.updatedOn}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 mb-6">No attendance remarks are added yet.</p>
            )}

            {canCreate && student && (
                <button
                    onClick={handleCreateAttendanceRemarks}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4"
                >
                    + Create Attendance Remark
                </button>
            )}
        </div>
    );
}