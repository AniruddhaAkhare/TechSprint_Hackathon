import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../Profile.css';
import EditStudent from '../Students/EditStudent';

export default function  StudentProfile  () {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching student data for ID:", studentId);

        const fetchStudentData = async () => {
            const docRef = doc(db, 'student', studentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setStudent(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchStudentData();
    }, [studentId]);

    if (!student) return <div className="loading">Loading...</div>;

    return (
        <div className="student-info">
            <p><strong>First Name:</strong> {student.first_name}</p>
            <p><strong>Last Name:</strong> {student.last_name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Status:</strong> {student.status}</p>
            <p><strong>Student Goal:</strong> {student.goal}</p>

            <p><strong>Residential Address</strong></p>
            <p>{student.residential_address.street}, {student.residential_address.area}, {student.residential_address.city}, {student.residential_address.state}, {student.residential_address.country} - {student.residential_address.zip}</p>

            <p><strong>Billing Address</strong></p>
            <p>{student.billing_address.street}, {student.billing_address.area}, {student.billing_address.city}, {student.billing_address.state}, {student.billing_address.country} - {student.billing_address.zip}</p>
            <p><strong>GST No:</strong> {student.billing_address.gstNo}</p>

            <p><strong>Course Details</strong></p>
            {student.course_details && student.course_details.length > 0 ? (
                <table className='data-table table'>
                    <thead className='table-secondary'>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Course Name</th>
                            <th>Batch</th>
                            <th>Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.course_details.map((course, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{course.courseName}</td>
                                <td>{course.batch}</td>
                                <td>{course.branch}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No courses enrolled.</p>
            )}

            <p><strong>Education Details</strong></p>
            {student.education_details && student.education_details.length > 0 ? (
                <table className='table-data table'>
                    <thead className='table-secondary'>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Level</th>
                            <th>Institute</th>
                            <th>Degree</th>
                            <th>Specialization</th>
                            <th>Grade</th>
                            <th>Passing Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.education_details.map((edu, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{edu.level}</td>
                                <td>{edu.institute}</td>
                                <td>{edu.degree}</td>
                                <td>{edu.specialization}</td>
                                <td>{edu.grade}</td>
                                <td>{edu.passingyr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No education mentioned.</p>
            )}

            <p><strong>Experience Details</strong></p>
            {student.experience_details && student.experience_details.length > 0 ? (
                <table className='table-data table'>
                    <thead className='table-secondary'>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Company Name</th>
                            <th>Designation</th>
                            <th>Salary</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.experience_details.map((exp, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{exp.companyName}</td>
                                <td>{exp.designation}</td>
                                <td>{exp.salary}</td>
                                <td>{exp.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No experience.</p>
            )}


            <p><strong>Installment Details</strong></p>
            {student.installment_details && student.installment_details.length > 0 ? (
                <table className='data-table table'>
                    <thead className='table-secondary'>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Due Amount</th>
                            <th>Due Date</th>
                            <th>Paid On</th>
                            <th>Paid Amount</th>
                            <th>Mode Of Payment</th>
                            <th>PDC Status</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.installment_details.map((installment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{installment.dueAmount}</td>
                                <td>{installment.dueDate}</td>
                                <td>{installment.paidOn}</td>
                                <td>{installment.amtPaid}</td>
                                <td>{installment.modeOfPayment}</td>
                                <td>{installment.pdcStatus}</td>
                                <td>{installment.remark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No experience.</p>
            )}

            <div>
                <button onClick={()=>{navigate(`/studentdetails/updatestudent/${studentId}`);}} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Edit</button>
                <button onClick={() => navigate('/studentdetails')} className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Back</button>
            </div>
        </div>
    );
};