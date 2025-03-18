import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Enrollments from "./Enrollments";
import Fees from "./Fees";
import Grades from "./Grades";
import Attendance from "./Attendance";
import StudentProfile from "./StudentProfile";
import Result from "./Result";
import "./Profile.css";

export default function StudentInfo() {
    const navigate = useNavigate();
    const { studentId } = useParams();

    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
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
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        phone: data.phone,
                        date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "N/A", // Handle undefined
                        admission_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "N/A", // Handle undefined

                        batch: data.batch,
                        branch: data.branch
                    });
                } else {
                    alert("Student not found.");
                    navigate(-1);
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchStudent();
    }, [studentId, navigate]);

    const handleFormSelection = (formNumber) => {
        setSelectedForm(formNumber);
    };

    const getButtonStyle = (formNumber) => {
        return formNumber === selectedForm ? { color: "rgb(0, 102, 255)", textDecoration: "underline" } : {};
    };

    return (
        <>
            <div className="flex flex-col w-screen ml-80 p-4">
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => navigate("/studentdetails")}
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 mr-4"
                    >
                        Back
                    </button>
                    <div className="flex flex-col">
                        <b className="text-2xl font-bold">
                            {student.first_name} {student.last_name}
                        </b>
                        <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                </div>
                
                <div className="mb-6">
                    <p className="text-lg">Registered on: {student.admission_date}</p>
                    <p className="text-lg">Reg. ID: {studentId}</p>
                    <p className="text-lg">Phone: {student.phone}</p>
                </div>

                <div className="flex space-x-4 mb-4">
                    <button
                        className="enrollment text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
                        onClick={() => handleFormSelection(1)}
                        style={getButtonStyle(1)}
                    >
                        Profile
                    </button>
                    <button
                        className="addmission text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
                        onClick={() => handleFormSelection(2)}
                        style={getButtonStyle(2)}
                    >
                        Enrollment
                    </button>
                    <button
                        className="payments text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
                        onClick={() => handleFormSelection(3)}
                        style={getButtonStyle(3)}
                    >
                        Fees
                    </button>
                    <button
                        className="exams text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
                        onClick={() => handleFormSelection(4)}
                        style={getButtonStyle(4)}
                    >
                        Grades
                    </button>
                    <button
                        className="certificates text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
                        onClick={() => handleFormSelection(5)}
                        style={getButtonStyle(5)}
                    >
                        Result
                    </button>
                    <button
                        className="activity text-black bg-transparent border-none p-2 hover:bg-gray-100 rounded transition duration-200"
                        onClick={() => handleFormSelection(6)}
                        style={getButtonStyle(6)}
                    >
                        Attendance
                    </button>
                </div>

                <div>
                    {selectedForm === 2 && <Enrollments studentId={studentId} />}
                    {selectedForm === 3 && <Fees studentId={studentId} />}
                    {selectedForm === 4 && <Grades studentId={studentId} />}
                    {selectedForm === 6 && <Attendance studentId={studentId} />}
                    {selectedForm === 5 && <Result studentId={studentId} />}
                    {selectedForm === 1 && <StudentProfile />}
                </div>
            </div>
        </>

    )
}
