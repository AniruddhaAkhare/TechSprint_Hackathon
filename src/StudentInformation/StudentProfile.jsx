import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './Profile.css';
import EditStudent from '../pages/components/Students/EditStudent';

export default function StudentProfile() {
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
            <div className='flex w-full'>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">First Name</label>
                    <input
                        type="text"
                        value={student.first_name}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Last Name</label>
                    <input
                        type="text"
                        value={student.last_name}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>

            </div>
            <div className='flex'>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        type="text"
                        value={student.email}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Phone</label>
                    <input
                        type="text"
                        value={student.phone}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
            </div>
            <div className='flex'>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Status</label>
                    <input
                        type="text"
                        value={student.status}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Goal</label>
                    <input
                        type="text"
                        value={student.goal}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
            </div>
            <div className='flex'>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Residential Address</label>
                    <input
                        type="text"
                        value={student.residential_address ?
                            `${student.residential_address.street}, ${student.residential_address.area}, ${student.residential_address.city}, ${student.residential_address.state}, ${student.residential_address.country} - ${student.residential_address.zip}`
                            : "Address not available"}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
                <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">Billing Address</label>
                    <input
                        type="text"
                        value={student.billing_address ?
                            `${student.billing_address.name}, ${student.billing_address.street}, ${student.billing_address.area}, ${student.billing_address.city}, ${student.billing_address.state}, ${student.billing_address.country} - ${student.billing_address.zip}`
                            : "Address not available"}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
            </div>
            <div className='w-2/4'>
                    <label className="block text-sm font-semibold mb-1">GST No.</label>
                    <input
                        type="text"
                        value={student.billing_address ? student.billing_address.gstNo : "N/A"}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 w-12"
                    />
                </div>
            <br/>

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
            <br/>
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
            <br/>
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
            <br/>
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
                                <td>{installment.paidDate}</td>
                                <td>{installment.paidAmount}</td>
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
            <br/>
            <div>
                <button onClick={() => { navigate(`/studentdetails/updatestudent/${studentId}`); }} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Edit</button>
            </div>
        </div>
    );
};
