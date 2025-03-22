import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from "firebase/firestore";

export default function EditStudent() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "",
        goal: "",
        address: { street: "", area: "", city: "", state: "", zip: "", country: "" },
        billingAddress: { name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" },
        date_of_birth: "",
        admission_date: "",
        courseDetails: [],
        educationDetails: [],
        installmentDetails: [],
        experienceDetails: [],
        discount: "",
        total: "",
    });
    const [feeTemplates, setFeeTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);

    useEffect(() => {
        fetchStudent();
        fetchCourses();
        fetchBatches();
        fetchCenters();
        fetchFeeTemplates();
    }, [studentId]);

    const fetchStudent = async () => {
        try {
            const studentRef = doc(db, "student", studentId);
            const studentSnap = await getDoc(studentRef);
            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setStudent({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    status: data.status || "",
                    goal: data.goal || "",
                    address: data.residential_address || { street: "", area: "", city: "", state: "", zip: "", country: "" },
                    billingAddress: data.billing_address || { name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" },
                    date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "",
                    admission_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "",
                    courseDetails: data.course_details || [],
                    educationDetails: data.education_details || [],
                    installmentDetails: data.installment_details || [],
                    experienceDetails: data.experience_details || [],
                    discount: data.discount || "",
                    total: data.total || "",
                });
            } else {
                alert("Student not found.");
                navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Course"));
            setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchBatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Batch"));
            setBatches(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching batches:", error);
        }
    };

    const fetchCenters = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Centers"));
            setCenters(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching centers:", error);
        }
    };

    const fetchFeeTemplates = async () => {
        try {
            const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
            if (!templateSnapshot.empty) {
                setFeeTemplates(templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } catch (error) {
            console.error("Error in fetching payment type:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("billingAddress")) {
            const field = name.split(".")[1];
            setStudent(prev => ({ ...prev, billingAddress: { ...prev.billingAddress, [field]: value } }));
        } else if (name.includes("address")) {
            const field = name.split(".")[1];
            setStudent(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else if (name.includes("courseDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedCourses = [...prev.courseDetails];
                updatedCourses[index][fieldName] = value;
                return { ...prev, courseDetails: updatedCourses };
            });
        } else if (name.includes("educationDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedEducation = [...prev.educationDetails];
                updatedEducation[index][fieldName] = value;
                return { ...prev, educationDetails: updatedEducation };
            });
        } else if (name.includes("experienceDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedExperience = [...prev.experienceDetails];
                updatedExperience[index][fieldName] = value;
                return { ...prev, experienceDetails: updatedExperience };
            });
        } else if (name.includes("installmentDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedInstallments = [...prev.installmentDetails];
                updatedInstallments[index][fieldName] = value;
                return { ...prev, installmentDetails: updatedInstallments };
            });
        } else {
            setStudent(prev => ({ ...prev, [name]: value }));
        }
    };

    const addCourse = () => setStudent(prev => ({ ...prev, courseDetails: [...prev.courseDetails, { courseName: '', batch: '', branch: '', mode: '' }] }));
    const addEducation = () => setStudent(prev => ({ ...prev, educationDetails: [...prev.educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }] }));
    const addInstallment = () => setStudent(prev => ({ ...prev, installmentDetails: [...prev.installmentDetails, { number: '', dueAmount: '', dueDate: '', paidOn: '', amtPaid: '', modeOfPayment: '', pdcStatus: '', remark: '' }] }));
    const addExperience = () => setStudent(prev => ({ ...prev, experienceDetails: [...prev.experienceDetails, { companyName: '', designation: '', salary: '', description: '' }] }));

    const removeCourse = (index) => setStudent(prev => ({ ...prev, courseDetails: prev.courseDetails.filter((_, i) => i !== index) }));
    const deleteEducation = (index) => setStudent(prev => ({ ...prev, educationDetails: prev.educationDetails.filter((_, i) => i !== index) }));
    const deleteInstallment = (index) => setStudent(prev => ({ ...prev, installmentDetails: prev.installmentDetails.filter((_, i) => i !== index) }));
    const deleteExperience = (index) => setStudent(prev => ({ ...prev, experienceDetails: prev.experienceDetails.filter((_, i) => i !== index) }));

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!student.first_name || !student.last_name || !student.email || !student.phone) {
            alert("Please fill necessary fields.");
            return;
        }
        try {
            const studentRef = doc(db, "student", studentId);
            await updateDoc(studentRef, {
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                phone: student.phone,
                status: student.status,
                goal: student.goal,
                residential_address: student.address,
                billing_address: student.billingAddress,
                date_of_birth: Timestamp.fromDate(new Date(student.date_of_birth)),
                admission_date: Timestamp.fromDate(new Date(student.admission_date)),
                course_details: student.courseDetails,
                education_details: student.educationDetails,
                installment_details: student.installmentDetails,
                experienceDetails: student.experienceDetails,
                discount: student.discount,
                total: student.total,
            });
            alert("Student updated successfully!");
            navigate("/studentdetails");
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Error updating student. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteDoc(doc(db, "student", studentId));
                alert("Student deleted successfully!");
                navigate("/studentdetails");
            } catch (error) {
                console.error("Error deleting student:", error);
                alert("Error deleting student. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 ml-80 w-[calc(100vw-20rem)]">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Student</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
                    {/* Personal Details */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={student.first_name}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={student.last_name}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={student.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={student.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={student.date_of_birth}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Enrollment Date</label>
                                <input
                                    type="date"
                                    name="admission_date"
                                    value={student.admission_date}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Details */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={student.address.street}
                                        onChange={handleChange}
                                        placeholder="Street"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="address.area"
                                        value={student.address.area}
                                        onChange={handleChange}
                                        placeholder="Area"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={student.address.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={student.address.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="address.zip"
                                        value={student.address.zip}
                                        onChange={handleChange}
                                        placeholder="Zip Code"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="address.country"
                                        value={student.address.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-600 mb-2">Billing Address</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="billingAddress.name"
                                        value={student.billingAddress.name}
                                        onChange={handleChange}
                                        placeholder="Name / Company Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.street"
                                        value={student.billingAddress.street}
                                        onChange={handleChange}
                                        placeholder="Street"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.area"
                                        value={student.billingAddress.area}
                                        onChange={handleChange}
                                        placeholder="Area"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.city"
                                        value={student.billingAddress.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.state"
                                        value={student.billingAddress.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.zip"
                                        value={student.billingAddress.zip}
                                        onChange={handleChange}
                                        placeholder="Zip Code"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.country"
                                        value={student.billingAddress.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress.gstNo"
                                        value={student.billingAddress.gstNo}
                                        onChange={handleChange}
                                        placeholder="GST No."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Educational Details */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-sm font-medium text-gray-600">Level</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.educationDetails.map((edu, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <select
                                                    name={`educationDetails.${index}.level`}
                                                    value={edu.level}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="" disabled>Select Level</option>
                                                    <option value="School">School</option>
                                                    <option value="UG">UG</option>
                                                    <option value="PG">PG</option>
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`educationDetails.${index}.institute`}
                                                    value={edu.institute}
                                                    onChange={handleChange}
                                                    placeholder="Institute Name"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`educationDetails.${index}.degree`}
                                                    value={edu.degree}
                                                    onChange={handleChange}
                                                    placeholder="Degree"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`educationDetails.${index}.specialization`}
                                                    value={edu.specialization}
                                                    onChange={handleChange}
                                                    placeholder="Specialization"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`educationDetails.${index}.grade`}
                                                    value={edu.grade}
                                                    onChange={handleChange}
                                                    placeholder="Grade"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    name={`educationDetails.${index}.passingyr`}
                                                    value={edu.passingyr}
                                                    onChange={handleChange}
                                                    placeholder="Year"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteEducation(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Add Education
                            </button>
                        </div>
                    </div>

                    {/* Experience Details */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Description</th>
                                        <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.experienceDetails.map((exp, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`experienceDetails.${index}.companyName`}
                                                    value={exp.companyName}
                                                    onChange={handleChange}
                                                    placeholder="Company Name"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`experienceDetails.${index}.designation`}
                                                    value={exp.designation}
                                                    onChange={handleChange}
                                                    placeholder="Designation"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`experienceDetails.${index}.salary`}
                                                    value={exp.salary}
                                                    onChange={handleChange}
                                                    placeholder="Salary"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    name={`experienceDetails.${index}.description`}
                                                    value={exp.description}
                                                    onChange={handleChange}
                                                    placeholder="Description"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExperience(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Add Experience
                            </button>
                        </div>
                    </div>

                    {/* Goal and Status */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Status</label>
                                <select
                                    name="status"
                                    value={student.status}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="enquiry">Enquiry</option>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="deferred">Deferred</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Goal</label>
                                <select
                                    name="goal"
                                    value={student.goal}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select Goal</option>
                                    <option value="upskilling">Upskilling</option>
                                    <option value="placement">Placement</option>
                                    <option value="career_switch">Career Switch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Update Student
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
                        >
                            Delete Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}