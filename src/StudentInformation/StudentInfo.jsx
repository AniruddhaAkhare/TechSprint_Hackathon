// import { useNavigate, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { db } from "../config/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import Enrollments from "./Enrollments";
// import Fees from "./Fees";
// import Grades from "./Grades";
// import Attendance from "./Attendance";
// import StudentProfile from "./StudentProfile";
// import Result from "./Result";
// import "./Profile.css";

// export default function StudentInfo() {
//     const navigate = useNavigate();
//     const { studentId } = useParams();

//     const [student, setStudent] = useState({
//         first_name: "",
//         last_name: "",
//         email: "",
//         phone: "",
//         residential_address: [],
//         billing_address: [],
//         installment: [],
//         courses: [],
//         experience: [],
//         date_of_birth: "",
//         admission_date: "",
//         course_name: "",
//         batch: "",
//         branch: ""
//     });

//     const [selectedForm, setSelectedForm] = useState(1);

//     useEffect(() => {
//         const fetchStudent = async () => {
//             try {
//                 const studentRef = doc(db, "student", studentId);
//                 const studentSnap = await getDoc(studentRef);

//                 if (studentSnap.exists()) {
//                     const data = studentSnap.data();
//                     setStudent({
//                         first_name: data.first_name,
//                         last_name: data.last_name,
//                         email: data.email,
//                         phone: data.phone,
//                         date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "N/A", // Handle undefined
//                         admission_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "N/A", // Handle undefined

//                         batch: data.batch,
//                         branch: data.branch
//                     });
//                 } else {
//                     alert("Student not found.");
//                     navigate(-1);
//                 }
//             } catch (error) {
//                 //console.error("Error fetching student data:", error);
//             }
//         };

//         fetchStudent();
//     }, [studentId, navigate]);

//     const handleFormSelection = (formNumber) => {
//         setSelectedForm(formNumber);
//     };

//     const getButtonStyle = (formNumber) => {
//         return formNumber === selectedForm ? { color: "rgb(0, 102, 255)", textDecoration: "underline" } : {};
//     };

//     return (
//         <>
//             <div className="flex flex-col w-screen ml-80 p-4">
//                 <div className="flex items-center mb-4">
//                     <button
//                         onClick={() => navigate("/studentdetails")}
//                         className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 mr-4"
//                     >
//                         Back
//                     </button>
//                     <div className="flex flex-col">
//                         <b className="text-2xl font-bold">
//                             {student.first_name} {student.last_name}
//                         </b>
//                         <p className="text-sm text-gray-600">{student.email}</p>
//                     </div>
//                 </div>

//                 <div className="mb-6">
//                     <p className="text-lg">Registered on: {student.admission_date}</p>
//                     <p className="text-lg">Reg. ID: {studentId}</p>
//                     <p className="text-lg">Phone: {student.phone}</p>
//                 </div>

//                 <div className="flex space-x-4 mb-4">
//                     <button
//                         className="enrollment text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
//                         onClick={() => handleFormSelection(1)}
//                         style={getButtonStyle(1)}
//                     >
//                         Profile
//                     </button>
//                     <button
//                         className="addmission text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
//                         onClick={() => handleFormSelection(2)}
//                         style={getButtonStyle(2)}
//                     >
//                         Enrollment
//                     </button>
//                     <button
//                         className="payments text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
//                         onClick={() => handleFormSelection(3)}
//                         style={getButtonStyle(3)}
//                     >
//                         Fees
//                     </button>
//                     <button
//                         className="exams text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
//                         onClick={() => handleFormSelection(4)}
//                         style={getButtonStyle(4)}
//                     >
//                         Grades
//                     </button>
//                     <button
//                         className="certificates text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
//                         onClick={() => handleFormSelection(5)}
//                         style={getButtonStyle(5)}
//                     >
//                         Result
//                     </button>
//                     <button
//                         className="activity text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
//                         onClick={() => handleFormSelection(6)}
//                         style={getButtonStyle(6)}
//                     >
//                         Attendance
//                     </button>
//                 </div>

//                 <div>
//                     {selectedForm === 1 && <StudentProfile />}
//                     {selectedForm === 2 && <Enrollments studentId={studentId} />}
//                     {selectedForm === 3 && <Fees studentId={studentId} />}
//                     {selectedForm === 4 && <Grades studentId={studentId} />}
//                     {selectedForm === 5 && <Result studentId={studentId} />}
//                     {selectedForm === 6 && <Attendance studentId={studentId} />}
//                 </div>
//             </div>
//         </>

//     )
// }

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Enrollments from "./Enrollments";
import Fees from "./Fees";
import Batches from "./Batches";
import StudentProfile from "./StudentProfile";
import Result from "./Result";
import Placement from "./Placement";

export default function StudentInfo() {
    const navigate = useNavigate();
    const { studentId } = useParams();

    const [student, setStudent] = useState({
        Name: "",
        email: "",
        phone: "",
        residential_address: [],
        billing_address: [],
        installment: [],
        courses: [],
        experience: [],
        date_of_birth: "",
        admission_date: "",
        course_name: "",
        batch: "",
        branch: ""
    });

    const [selectedForm, setSelectedForm] = useState(1);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const studentRef = doc(db, "student", studentId);
                const studentSnap = await getDoc(studentRef);

                if (studentSnap.exists()) {
                    const data = studentSnap.data();
                    setStudent({
                        Name: data.Name || "",
                        // last_name: data.last_name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "N/A",
                        admission_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "N/A",
                        batch: data.batch || "",
                        branch: data.branch || ""
                    });
                } else {
                    alert("Student not found.");
                    navigate(-1);
                }
            } catch (error) {
                //console.error("Error fetching student data:", error);
            }
        };

        fetchStudent();
    }, [studentId, navigate]);

    const handleFormSelection = (formNumber) => {
        setSelectedForm(formNumber);
    };

    return (
        <div className="p-4 fixed inset-0 left-[300px] min-h-screen overflow-scroll">
        {/* <div className="min-h-screen bg-gray-50 p-6 ml-80 w-[calc(100vw-20rem)]"> */}
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate("/studentdetails")}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 mb-0 p-0 ml-0">
                                {student.Name}
                            </h1>
                            <p className="text-sm text-gray-600 mt-0 p-0 ml-0">{student.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/add-course/${studentId}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Courses
                    </button>
                </div>

                {/* Student Info */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Registered on:</span> {student.admission_date}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Reg. ID:</span> {studentId}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {student.phone}
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex space-x-6 border-b border-gray-200">
                        <button
                            onClick={() => handleFormSelection(1)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 1 ? "text-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Profile
                        </button>
                        {/* <button
                            onClick={() => handleFormSelection(2)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 2 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Enrollment
                        </button> */}
                        <button
                            onClick={() => handleFormSelection(3)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 3 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Enrollments
                        </button>
                        <button
                            onClick={() => handleFormSelection(4)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 4 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Batches
                        </button>
                        <button
                            onClick={() => handleFormSelection(5)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 5 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Result
                        </button>
                        <button
                            onClick={() => handleFormSelection(6)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 6 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Placements
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {selectedForm === 1 && <StudentProfile />}
                    {/* {selectedForm === 2 && <Enrollments studentId={studentId} />} */}
                    {selectedForm === 3 && <Fees studentId={studentId} />}
                    {selectedForm === 4 && <Batches studentId={studentId} />}
                    {selectedForm === 5 && <Result studentId={studentId} />}
                    {selectedForm === 6 && <Placement studentId={studentId} />}

                </div>
            </div>
        </div>
    );
}