import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function StudentProfile() {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [centers, setCenters] = useState([]); // State to store center details
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching student data for ID:", studentId);

        const fetchStudentData = async () => {
            // Fetch student data
            const docRef = doc(db, 'student', studentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setStudent(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        const fetchCenters = async () => {
            // Fetch all centers to map center IDs to names
            try {
                const querySnapshot = await getDocs(collection(db, "Centers"));
                setCenters(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching centers:", error);
            }
        };

        // Call both fetch functions
        fetchStudentData();
        fetchCenters();
    }, [studentId]);

    if (!student) return <div className="text-gray-600 text-center py-10">Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Personal Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">First Name</label>
                        <input
                            type="text"
                            value={student.first_name || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Last Name</label>
                        <input
                            type="text"
                            value={student.last_name || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="text"
                            value={student.email || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                        <input
                            type="text"
                            value={student.phone || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <input
                            type="text"
                            value={student.status || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Goal</label>
                        <input
                            type="text"
                            value={student.goal || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Address Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Residential Address</label>
                        <input
                            type="text"
                            value={student.residential_address
                                ? `${student.residential_address.street}, ${student.residential_address.area}, ${student.residential_address.city}, ${student.residential_address.state}, ${student.residential_address.country} - ${student.residential_address.zip}`
                                : "Address not available"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Billing Address</label>
                        <input
                            type="text"
                            value={student.billing_address
                                ? `${student.billing_address.name}, ${student.billing_address.street}, ${student.billing_address.area}, ${student.billing_address.city}, ${student.billing_address.state}, ${student.billing_address.country} - ${student.billing_address.zip}`
                                : "Address not available"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">GST No.</label>
                        <input
                            type="text"
                            value={student.billing_address?.gstNo || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Preferred Learning Centers */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Preferred Learning Centers</h2>
                {student.preferred_centers && student.preferred_centers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Center Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.preferred_centers.map((centerId, index) => {
                                    const center = centers.find(c => c.id === centerId);
                                    return (
                                        <tr key={centerId} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-gray-700">{index + 1}</td>
                                            <td className="p-3 text-gray-700">{center ? center.name : "Unknown Center"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No preferred learning centers selected.</p>
                )}
            </div>

            {/* Course Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Course Details</h2>
                {student.course_details && student.course_details.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Course Name</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Batch</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Branch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.course_details.map((course, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-700">{index + 1}</td>
                                        <td className="p-3 text-gray-700">{course.courseName || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{course.batch || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{course.branch || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No courses enrolled.</p>
                )}
            </div>

            {/* Education Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Education Details</h2>
                {student.education_details && student.education_details.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Level</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Institute</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Degree</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Specialization</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Grade</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Passing Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.education_details.map((edu, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-700">{index + 1}</td>
                                        <td className="p-3 text-gray-700">{edu.level || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{edu.institute || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{edu.degree || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{edu.specialization || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{edu.grade || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{edu.passingyr || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No education mentioned.</p>
                )}
            </div>

            {/* Experience Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
                {student.experience_details && student.experience_details.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Company Name</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Designation</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Salary</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.experience_details.map((exp, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-700">{index + 1}</td>
                                        <td className="p-3 text-gray-700">{exp.companyName || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{exp.designation || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{exp.salary || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{exp.description || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No experience.</p>
                )}
            </div>

            {/* Installment Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Installment Details</h2>
                {student.installment_details && student.installment_details.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Due Amount</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Due Date</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Paid On</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Paid Amount</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Mode of Payment</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">PDC Status</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.installment_details.map((installment, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-700">{index + 1}</td>
                                        <td className="p-3 text-gray-700">{installment.dueAmount || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{installment.dueDate || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{installment.paidOn || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{installment.amtPaid || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{installment.modeOfPayment || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{installment.pdcStatus || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{installment.remark || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No installment details available.</p>
                )}
            </div>

            {/* Edit Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => navigate(`/studentdetails/updatestudent/${studentId}`)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}