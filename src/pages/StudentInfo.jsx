import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../config/firebase.js";
import { doc, getDoc } from "firebase/firestore";
const StudentInfo = () => {
    const navigate = useNavigate();
    const { adminId, studentId } = useParams();

    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
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
                const studentRef = doc(db, "Admin", adminId, "students", studentId);
                const studentSnap = await getDoc(studentRef);

                if (studentSnap.exists()) {
                    const data = studentSnap.data();
                    setStudent({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        phone: data.phone,
                        street: data.address.street,
                        city: data.address.city,
                        state: data.address.state,
                        zip: data.address.zip,
                        date_of_birth: data.date_of_birth.toDate().toISOString().split("T")[0], // Format date
                        admission_date: data.admission_date.toDate().toISOString().split("T")[0], // Format date
                        course_name: data.course_name.join(", "), // Convert array to comma-separated string
                        batch: data.batch,
                        branch: data.branch
                    });
                } else {
                    alert("Student not found.");
                    navigate(-1); // Redirect back if student not found
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchStudent();
    }, [adminId, studentId, navigate]);

    const handleFormSelection = (formNumber) => {
        setSelectedForm(formNumber);
    };

    const getButtonStyle = (formNumber) => {
        return formNumber === selectedForm ? { color: "rgb(0, 102, 255)", textDecoration: "underline" } : {};
    };

    return (
        <>
            <div>
                <div>
                    <div>
                        <button onClick={() => navigate(-1)} style={{ border: "none", background: "none" }}><b>{'<'}</b></button>
                        <div>
                            <h1>{student?.first_name} {student?.last_name}</h1>
                            <p>{student?.email}</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignContent: "center", gap: "1rem", width: "100%" }}>
                        <div className="action-dropdown">
                            <select>
                                <option value="">Actions</option>
                                <option value="send-password-reset">Send Password Reset Link</option>
                                <option value="change-password">Change Password</option>
                                <option value="update-status">Update Status</option>
                                <option value="session-cleared">Session Cleared Successfully</option>
                            </select>
                        </div>
                        <button className='btn btn-primary'> + Add to Course</button>
                    </div>
                </div>
                <div className="learner-details-info">
                    <div>
                        <p>Registered on <br /> {student?.admission_date}</p>
                    </div>
                    <div>
                        <p>Reg. ID <br />{student?.studentId}</p>
                    </div>
                    <div>
                        <p>Username <br /> username</p>
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <button className="enrollment" style={{ background: "none", border: "none", ...getButtonStyle(1) }} onClick={() => handleFormSelection(1)}>Enrollments</button>
                    <button className="addmission" style={{ background: "none", border: "none", ...getButtonStyle(2) }} onClick={() => handleFormSelection(2)}>Admission/Fees</button>
                    <button className="payments" style={{ background: "none", border: "none", ...getButtonStyle(3) }} onClick={() => handleFormSelection(3)}>Payments</button>
                    <button className="exams" style={{ background: "none", border: "none", ...getButtonStyle(4) }} onClick={() => handleFormSelection(4)}>Exams</button>
                    <button className="certificates" style={{ background: "none", border: "none", ...getButtonStyle(5) }} onClick={() => handleFormSelection(5)}>Certificates</button>
                    <button className="activity" style={{ background: "none", border: "none", ...getButtonStyle(6) }} onClick={() => handleFormSelection(6)}>Activity</button>
                    <button className="profile" style={{ background: "none", border: "none", ...getButtonStyle(7) }} onClick={() => handleFormSelection(7)}>Profile</button>
                </div>

                {/* <div>
                {selectedForm === 1 && <Enrollments />}
                {selectedForm === 2 && <Admission />}
                {selectedForm === 3 && <Payments />}
                {selectedForm === 4 && <Exams />}
                {selectedForm === 5 && <Certificate />}
                {selectedForm === 6 && <Activity />}
                {selectedForm === 7 && <Profile />}
            </div> */}
            </div>
        </>
    )
}
export default StudentInfo;