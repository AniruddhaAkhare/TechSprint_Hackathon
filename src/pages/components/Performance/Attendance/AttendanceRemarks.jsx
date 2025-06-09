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
                section: "Attendance",
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
            // await logActivity("Navigated to create attendance remark", {
            //     studentId: student.id,
            //     studentName: student.first_name || 'Unknown'
            // });
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
   <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 font-sans">
  <ToastContainer position="top-right" autoClose={3000} />

  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">📋 Attendance Remarks</h1>
      {student ? (
        <p className="text-gray-600">
          Showing remarks for: <span className="font-semibold text-blue-600">{student.first_name}</span>
        </p>
      ) : (
        <p className="text-red-600 font-medium">⚠ No student selected!</p>
      )}
    </div>

    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">🕒 Remarks History</h2>
      {attendanceRemarks.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {attendanceRemarks.map((attendance, index) => (
            <li key={index} className="py-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-1">
                  <p><strong className="text-indigo-700">{attendance.subject}</strong></p>
                  <p className="text-sm text-gray-600">Remarks: <span className="italic">{attendance.remarks}</span></p>
                  <p className="text-sm text-gray-500">Present sessions: {attendance.present}</p>
                </div>
                <div className="text-sm text-right text-gray-500">
                  <p>By: <span className="font-medium">{attendance.admin}</span></p>
                  <p>{attendance.updatedOn}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No attendance remarks available yet.</p>
      )}
    </div>

    {canCreate && student && (
      <div className="text-right">
        <button
          onClick={handleCreateAttendanceRemarks}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition duration-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Remark
        </button>
      </div>
    )}
  </div>
</div>

    );
}