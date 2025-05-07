import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
export default function EProfile() {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState(null);
    // const [centers, setCenters] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching student data for ID:", employeeId);

        const fetchEmployeeData = async () => {
            const docRef = doc(db, 'Instructor', employeeId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setEmployee(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        // const fetchCenters = async () => {
        //     // Fetch centers from the instituteSetup subcollection
        //     try {
        //         // Fetch the instituteSetup document first to get its ID
        //         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        //         if (instituteSnapshot.empty) {
        //             console.error("No instituteSetup document found");
        //             return;
        //         }
        //         const instituteId = instituteSnapshot.docs[0].id;

        //         // Fetch only active centers from the Center subcollection
        //         const centerQuery = query(
        //             collection(db, "instituteSetup", instituteId, "Center"),
        //             where("isActive", "==", true)
        //         );
        //         const centerSnapshot = await getDocs(centerQuery);
        //         const centersList = centerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //         setCenters(centersList);
        //     } catch (error) {
        //         console.error("Error fetching centers:", error);
        //     }
        // };

        // Call both fetch functions
        fetchEmployeeData();
        // fetchCenters();
    }, [employeeId]);

    if (!employee) return <div className="text-gray-600 text-center py-10">Loading...</div>;

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
                            value={employee.f_name || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Last Name</label>
                        <input
                            type="text"
                            value={employee.l_name || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="text"
                            value={employee.email || "N/A"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                        <input
                            type="text"
                            value={employee.phone || "N/A"}
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
                            value={employee.residential_address
                                ? `${employee.residential_address.street}, ${employee.residential_address.area}, ${employee.residential_address.city}, ${employee.residential_address.state}, ${employee.residential_address.country} - ${employee.residential_address.zip}`
                                : "Address not available"}
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Preferred Learning Centers */}
            {/*  */}

            {/* Education Details */}
            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Education Details</h2>
                {employee.education_details && employee.education_details.length > 0 ? (
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
                                {employee.education_details.map((edu, index) => (
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
                {employee.experience_details && employee.experience_details.length > 0 ? (
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
                                {employee.experience_details.map((exp, index) => (
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

            {/* Edit Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => navigate(`/studentdetails/updatestudent/${employeeId}`)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}