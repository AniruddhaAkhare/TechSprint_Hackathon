// import { useNavigate, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { db } from "./firebase";
// import { doc, getDoc } from "firebase/firestore";
// import Enrollments from "./StudentInformation/Enrollments";
// import Fees from "./StudentInformation/Fees";
// import "./Profile.css"
// import Grades from "./StudentInformation/Grades";
// import Attendance from "./StudentInformation/Attendance";
// import StudentProfile from "./StudentInformation/StudentProfile";
// import Result from "./StudentInformation/Result";

// export default function  StudentInfo ()  {
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
//                 console.error("Error fetching student data:", error);
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
//         <div className="flex-col w-screen ml-80 p-4">
//             <div>
//                 <div>
//                     <div>
//                         <button onClick={() => navigate("/studentdetails")} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Back</button>
//                         <div>
//                             <b className="size-6">
//                             {student.first_name} {student.last_name}
//                             </b>
//                             <p>{student.email}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="learner-details-info">
//                     <div>
//                         <p>Registered on: {student.admission_date}</p>
//                     </div>
//                     <div>
//                         <p>Reg. ID: {studentId}</p>
//                     </div>
//                     <div>
//                         <p>Phone: {student.phone}</p>
//                     </div>
//                 </div>
//                 <div style={{ display: "flex" }}>
//                     <button className="enrollment" style={{color:"black", background: "none", border: "none", ...getButtonStyle(1) }} onClick={() => handleFormSelection(1)}>Profile</button>&emsp;
//                     <button className="addmission" style={{color:"black", background: "none", border: "none", ...getButtonStyle(2) }} onClick={() => handleFormSelection(2)}>Enrollment</button>&emsp;
//                     <button className="payments" style={{color:"black", background: "none", border: "none", ...getButtonStyle(3) }} onClick={() => handleFormSelection(3)}>Fees</button>&emsp;
//                     <button className="exams" style={{color:"black", background: "none", border: "none", ...getButtonStyle(4) }} onClick={() => handleFormSelection(4)}>Grades</button>&emsp;
//                     <button className="certificates" style={{color:"black", background: "none", border: "none", ...getButtonStyle(5) }} onClick={() => handleFormSelection(5)}>Result</button>&emsp;
//                     <button className="activity" style={{color:"black", background: "none", border: "none", ...getButtonStyle(6) }} onClick={() => handleFormSelection(6)}>Attendence</button>
//                 </div>

//                 <div>
//                 {selectedForm === 2 && <Enrollments studentId={studentId} />}
//                 {selectedForm === 3 && <Fees studentId={studentId} />}
//                 {selectedForm === 4 && <Grades studentId={studentId}/>}
//                 {selectedForm === 6 && <Attendance studentId={studentId}/>}
//                 {selectedForm === 5 && <Result studentId={studentId}/>}
//                 {selectedForm === 1 && <StudentProfile />}
//             </div>
//             </div>
//         </div>
//     )
// }
