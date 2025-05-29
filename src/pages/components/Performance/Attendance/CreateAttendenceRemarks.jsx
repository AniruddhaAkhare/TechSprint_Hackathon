import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export default function CreateAttendenceRemarks() {
    const location = useLocation();
    const student = location.state?.student; // Get selected student from state

    const [testDetails, setTestDetails] = useState({
        subject: '',
        present: '',
        remarks: '',
        admin: '',
        updatedOn: '',
    });

    const [attendanceRemarks, setAttendanceRemarks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    
    useEffect(() => {
        if (student?.id) {
            fetchAttendanceRemarks();
        }
    }, [student]);

    const fetchAttendanceRemarks = async () => {
        try {
            const studentRef = doc(db, "student", student.id);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setAttendanceRemarks(data.attendenceRemarks || []);
            } else {
                //console.error("Student document not found");
            }
        } catch (error) {
            //console.error("Error fetching attendance data:", error);
        }
    };

    const handleInputChange = (e) => {
        setTestDetails({ ...testDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!student || !student.first_name) {
            alert("Error: No student selected!");
            return;
        }

        const newAttenceRemarks = {
            subject: testDetails.subject,
            present: testDetails.present,
            remarks: testDetails.remarks,
            admin: testDetails.admin,
            updatedOn: testDetails.updatedOn,
            timestamp: new Date()
        };

        try {
            const studentRef = doc(db, "student", student.id);
            await updateDoc(studentRef, {
                attendenceRemarks: arrayUnion(newAttenceRemarks) // Append to the mockTests array
            });

            alert("Mock test added successfully!");
            setAttendanceRemarks([...attendanceRemarks, newAttenceRemarks]); // Update local state
        } catch (error) {
            //console.error("Error adding mock test:", error);
            alert("Failed to add mock test. See console for details.");
        }
    };

    const filteredRemarks = attendanceRemarks.filter(remark =>
        remark.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
       <div className="ml-[20rem] p-6 bg-gray-100 min-h-screen font-sans">
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">➕ Create Attendance Remarks</h1>
      {student ? (
        <p className="text-gray-600">
          Adding remarks for: <span className="text-blue-600 font-semibold">{student.first_name}</span>
        </p>
      ) : (
        <p className="text-red-600 font-medium">⚠ No student selected!</p>
      )}
    </div>

    <input
      type="text"
      placeholder="🔍 Search by subject..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          name="subject"
          value={testDetails.subject}
          onChange={handleInputChange}
          required
          className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Present session count</label>
        <input
          type="number"
          name="present"
          value={testDetails.present}
          onChange={handleInputChange}
          required
          className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Remarks</label>
        <input
          type="text"
          name="remarks"
          value={testDetails.remarks}
          onChange={handleInputChange}
          required
          className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Updated by</label>
        <input
          type="text"
          name="admin"
          value={testDetails.admin}
          onChange={handleInputChange}
          required
          className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Updated on</label>
        <input
          type="date"
          name="updatedOn"
          value={testDetails.updatedOn}
          onChange={handleInputChange}
          required
          className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
      >
        Add Attendance Remark
      </button>
    </form>

    <div>
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">🗂 Attendance Remark History</h2>
      {filteredRemarks.length > 0 ? (
        <ul className="space-y-3">
          {filteredRemarks.map((attendance, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-semibold text-indigo-700">{attendance.subject}</p>
                  <p className="text-sm text-gray-600 italic">"{attendance.remarks}"</p>
                  <p className="text-sm text-gray-500">Present: {attendance.present}</p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <p>By: <span className="font-medium">{attendance.admin}</span></p>
                  <p>{attendance.updatedOn}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No attendance remarks are added yet.</p>
      )}
    </div>
  </div>
</div>

    );
}
