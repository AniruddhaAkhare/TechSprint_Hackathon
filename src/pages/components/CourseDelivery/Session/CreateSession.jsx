import React, { useState, useEffect } from 'react';
import { db } from "../../../../config/firebase.js";
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import getZoomAccessToken from "../../../../utils/getZoomAccessToken";

const CreateSession = ({ isOpen, toggleSidebar, session }) => {
    const [sessionName, setSessionName] = useState('');
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);
    const [mode, setMode] = useState('');
    const [generateLink, setGenerateLink] = useState('');
    const [sessionLink, setSessionLink] = useState('');
    const [approvalRequired, setApprovalRequired] = useState('');
    const [meetingPlatform, setMeetingPlatform] = useState('');
    const [sessionType, setSessionType] = useState('');
    const [subjects, setSubjects] = useState([]);

    const [batchID, setBatchID] = useState('');
    const [batches, setBatches] = useState([]);

    const [curriculumID, setCurriculumID] = useState('');
    const [curriculums, setCurriculums] = useState([]);
    // const [generateLink, setGenerateLink] = useState(false);
    const [allowWithoutLogin, setAllowWithoutLogin] = useState(false);


    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedInstructors, setSelectedInstructors] = useState([]);


    useEffect(() => {
        const fetchInstructors = async () => {
            const snapshot = await getDocs(collection(db, "Instructor")); // Fetch instructors from Firestore
            const instructorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInstructors(instructorData); // Set the instructors state
        };

        fetchInstructors();

        const fetchStudents = async () => {
            const snapshot = await getDocs(collection(db, "student")); // Fetch instructors from Firestore
            const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentData); // Set the instructors state
        };

        fetchStudents();

        const fetchCurriculum = async () => {
            const snapshot = await getDocs(collection(db, "Curriculum")); // Fetch instructors from Firestore
            const curriculumData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCurriculums(curriculumData); // Set the instructors state
        };

        fetchCurriculum();

        const fetchBatches = async () => {
            const snapshot = await getDocs(collection(db, "Batch")); // Fetch batches from Firestore
            const batchData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBatches(batchData); // Set the batches state
        };

        fetchBatches(); // Call the function to fetch batches
    }, []);

    const navigate = useNavigate();


    const handleInstructorSelection = (instructor) => {
        setSelectedInstructors(prev =>
            prev.includes(instructor) ? prev.filter(i => i !== instructor) : [...prev, instructor]
        );
    };

    const handleStudentSelection = (student) => {
        setSelectedStudents(prev =>
            prev.includes(student) ? prev.filter(s => s !== student) : [...prev, student]
        );
    };


    const createZoomMeeting = async () => {
        const accessToken = await getZoomAccessToken();
      
        if (!accessToken) {
          console.error("Failed to obtain access token");
          return;
        }
      
        try {
          const response = await axios.post(
            "https://api.zoom.us/v2/users/me/meetings",
            {
              topic: "My Zoom Meeting",
              type: 2, // 2 for scheduled meeting, 1 for instant meeting
              duration: 30,
              timezone: "UTC",
              agenda: "Discuss project",
              settings: {
                host_video: true,
                participant_video: true,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          console.log("Meeting created:", response.data);
          return response.data;
        } catch (error) {
          console.error("Error creating Zoom meeting:", error.response.data);
        }
      };
   
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let zoomLink = "";
        if (meetingPlatform === "Zoom") {
            zoomLink = await createZoomMeeting();
        }
    
        const sessionData = {
            name: sessionName,
            curriculumID,
            batchID: selectedBatches,
            date,
            startTime,
            endTime,
            instructors: instructors.map(i => i.email),
            students: students.map(s => s.email),
            sessionType,
            meetingPlatform,
            sessionLink: zoomLink,  // Store the Zoom link
        };
    
        await addDoc(collection(db, "Sessions"), sessionData);
        console.log("Session created successfully", sessionData);
    
        if (meetingPlatform === "Zoom" && zoomLink) {
            window.open(zoomLink, "_blank");  // Open Zoom meeting in new tab
        } else {
            toggleSidebar();
        }
    };
   
    return (
        <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <button type="button" className="close-button" onClick={toggleSidebar}>
                    Back
                </button>

                <h1 className="text-xl font-bold mb-6">Create Session</h1>


                <div className='mb-6'>
                    <label htmlFor='sessionName' className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>Enter session name</label>
                    <input type="text" value={sessionName} placeholder="session Name" onChange={(e) => setSessionName(e.target.value)} required />
                </div>
                <div className="mb-6">
                    <label htmlFor="curriculumID" className="block text-gray-700">Select Curriculum</label>
                    <select
                        id="curriculumID"
                        value={curriculumID}
                        onChange={(e) => setCurriculumID(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <option value="">Select a Curriculum</option>
                        {curriculums.map(curriculum => (
                            <option key={curriculum.id} value={curriculum.id}>{curriculum.name}</option>
                        ))}
                    </select>

                    <label htmlFor="date" className="block text-gray-700">Session Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>


                <label htmlFor="batchID" className="block text-gray-700">Select batch</label>
                <select
                    id="batchID"
                    value={batchID}
                    onChange={(e) => setBatchID(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <option value="">Select a batch</option>
                    {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                </select>


                <div className="mb-6 subfields">
                    <label className="form-label">Instructor</label>
                    {instructors.map(instructor => (
                        <div key={instructor.id} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={instructor.id}
                                id={`instructor-${instructor.id}`}
                                onChange={() => handleInstructorSelection(instructor)}
                                checked={selectedInstructors.includes(instructor)}
                            />
                            <label className="form-check-label" htmlFor={`instructor-${instructor.id}`}>
                                {instructor.f_name} {/* Assuming 'f_name' is the instructor's first name */}
                            </label>
                        </div>
                    ))}
                </div>


                <div className="mb-6 subfields">
                    <label className="form-label">Students</label>
                    {students.map(student => (
                        <div key={student.id} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={student.id}
                                id={`student-${student.id}`}
                                onChange={() => handleStudentSelection(student)}
                                checked={selectedStudents.includes(student)}
                            />
                            <label className="form-check-label" htmlFor={`student-${student.id}`}>
                                {student.first_name} {/* Assuming 'first_name' is the student's first name */}
                            </label>
                        </div>
                    ))}

                </div>


                <div className="mb-6 subfields">
                    <label className="form-label">Select Curriculum</label>
                    {curriculums.map(curriculum => (
                        <div key={curriculum.id} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={curriculum.id}
                                id={`curriculum-${curriculum.id}`}
                            />
                            <label className="form-check-label" htmlFor={`curriculum-${curriculum.id}`}>
                                {curriculum.name} {/* Assuming instructor has a name field */}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Session Type</label>
                    <div className="flex items-center mt-2">
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="sessionType"
                                value="batch"
                                checked={sessionType === "batch"}
                                onChange={() => setSessionType("batch")}
                                className="mr-1"
                            />
                            Schedule by Batch
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="sessionType"
                                value="subject"
                                checked={sessionType === "subject"}
                                onChange={() => setSessionType("subject")}
                                className="mr-1"
                            />
                            Schedule by Subject
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Mode of Conducting</label>
                    <div className="flex items-center mt-2">
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="mode"
                                value="online"
                                checked={mode === "online"}
                                onChange={() => setMode("online")}
                                className="mr-1"
                            />
                            Online Session
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="mode"
                                value="offline"
                                checked={mode === "offline"}
                                onChange={() => setMode("offline")}
                                className="mr-1"
                            />
                            Offline Session
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Meeting Platform</label>
                    <select
                        value={meetingPlatform}
                        onChange={(e) => {
                            console.log("Meeting platform selected:", e.target.value); // Debugging
                            setMeetingPlatform(e.target.value);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <option value="">Select a platform</option> {/* Ensure there's an empty option */}
                        <option value="Zoom">Zoom Meetings</option>
                        <option value="Google">Google Meet</option>
                        <option value="Teams">Microsoft Teams</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={approvalRequired}
                            onChange={(e) => setApprovalRequired(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2">Approval required to join</span>
                    </label>
                </div>

                <div className="mb-6">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={generateLink}
                            onChange={(e) => setGenerateLink(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2">Generate shareable link</span>
                    </label>
                    {generateLink && (
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={allowWithoutLogin}
                                    onChange={(e) => setAllowWithoutLogin(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2">Allow learners to join the session without logging in</span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Save Session
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSession;
