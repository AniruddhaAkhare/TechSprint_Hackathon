import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import './profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from "firebase/firestore";
import { getDocs } from "firebase/firestore";

import { collection } from "firebase/firestore";

export default function EditStudent() {
    const { studentId } = useParams();
    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "",
        goal: "",
        address: {
            street: "",
            area: "",
            city: "",
            state: "",
            zip: "",
            country: "",
        },
        billingAddress: {
            name: "",
            street: "",
            area: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            gstNo: ""
        },
        date_of_birth: "",
        admission_date: "",
        courseDetails: [],
        educationDetails: [],
        installmentDetails: [],
        experienceDetails: [],
        // fees: "",
        discount: "",
        total: "",
    });

    const navigate = useNavigate();
    const [feeTemplates, setFeeTemplates] = useState([]);
    const [formData, setFormData] = useState({});

    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);


    useEffect(() => {
        fetchCourses();
        fetchBatches();
        fetchCenters();
    }, []);

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Course"));
            setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            console.log(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
                        status: data.status,
                        goal: data.goal,
                        address: data.residential_address || {
                            street: "",
                            area: "",
                            city: "",
                            state: "",
                            zip: "",
                            country: "",
                        },
                        billingAddress: data.billing_address || {
                            name: "",
                            street: "",
                            area: "",
                            city: "",
                            state: "",
                            zip: "",
                            country: "",
                            gstNo: ""
                        },
                        date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "",
                        admission_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "",
                        courseDetails: data.course_details || [],
                        educationDetails: data.education_details || [],
                        installmentDetails: data.installment_details || [],
                        experienceDetails: data.experience_details || [],
                        // fees: data.fees || "",
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

        fetchStudent();
    }, [studentId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("billingAddress")) {
            const field = name.split(".")[1];
            setStudent((prevState) => ({
                ...prevState,
                billingAddress: {
                    ...prevState.billingAddress,
                    [field]: value,
                },
            }));
        } else if (name.includes("address")) {
            const field = name.split(".")[1];
            setStudent((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [field]: value,
                },
            }));
        } else if (name.includes("courseDetails")) {
            const [base, index, fieldName] = name.split(".");
            setStudent((prevState) => {
                const updatedCourses = [...prevState.courseDetails];
                updatedCourses[index][fieldName] = value;
                return { ...prevState, courseDetails: updatedCourses };
            });
        } else if (name.includes("educationDetails")) {
            const [base, index, fieldName] = name.split(".");
            setStudent((prevState) => {
                const updatedEducation = [...prevState.educationDetails];
                updatedEducation[index][fieldName] = value;
                return { ...prevState, educationDetails: updatedEducation };
            });
        } else if (name.includes("experienceDetails")) {
            const [base, index, fieldName] = name.split(".");
            setStudent((prevState) => {
                const updatedExperience = [...prevState.experienceDetails];
                updatedExperience[index][fieldName] = value;
                return { ...prevState, experienceDetails: updatedExperience };
            });
        } else if (name.includes("installmentDetails")) {
            const [base, index, fieldName] = name.split(".");
            setStudent((prevState) => {
                const updatedInstallments = [...prevState.installmentDetails];
                updatedInstallments[index][fieldName] = value;
                return { ...prevState, installmentDetails: updatedInstallments };
            });
        } else {
            setStudent((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const addCourse = () => {
        setStudent(prevState => ({
            ...prevState,
            courseDetails: [...prevState.courseDetails, { courseName: '', batch: '', branch: '' }],
        }));
    };

    const addEducation = () => {
        setStudent(prevState => ({
            ...prevState,
            educationDetails: [...prevState.educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '' }],
        }));
    };

    const addInstallment = () => {
        setStudent(prevState => ({
            ...prevState,
            installmentDetails: [...prevState.installmentDetails, { number: '', dueAmount: '', dueDate: '', paidOn: '', amtPaid: '', modeOfPayment: '', pdcStatus: '', remark: '' }],
        }));
    };

    const addExperience = () => {
        setStudent(prevState => ({
            ...prevState,
            experienceDetails: [...prevState.experienceDetails, { companyName: '', designation: '', salary: '', description: '' }],
        }));
    };

    const removeCourse = (index) => {
        setStudent(prevState => ({
            ...prevState,
            courseDetails: prevState.courseDetails.filter((_, i) => i !== index),
        }));
    };

    const deleteEducation = (index) => {
        setStudent(prevState => ({
            ...prevState,
            educationDetails: prevState.educationDetails.filter((_, i) => i !== index),
        }));
    };

    const deleteInstallment = (index) => {
        setStudent(prevState => ({
            ...prevState,
            installmentDetails: prevState.installmentDetails.filter((_, i) => i !== index),
        }));
    };

    const deleteExperience = (index) => {
        setStudent(prevState => ({
            ...prevState,
            experienceDetails: prevState.experienceDetails.filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        const fetchFeeTemplates = async () => {

            try {
                const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
                if (templateSnapshot.empty) {
                    alert("No fee templates found.");
                    return;
                }

                setFeeTemplates(templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error in fetching payment type:", error);
            }
        };

        fetchFeeTemplates();
    }, [studentId, navigate]);


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
                // fees: fees,
                // discount: discount,
                // total: total,
            });


            alert("Student updated successfully!");
            navigate("/studentdetails");
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Error updating student. Please try again.");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this student?");
        if (confirmed) {
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

    const handleTemplateChange = (e) => {
        console.log("Template selected:", e.target.value);

        const templateId = e.target.value;
        const template = feeTemplates.find(t => t.id === templateId);
        setSelectedTemplate(template);
        renderTemplateFields();
        console.log("SelectedTemplate:", selectedTemplate);
        if (template) {
            const initialFormData = {};
            template.fields.forEach(field => {
                initialFormData[field.fieldName] = '';
            });
            setFormData(initialFormData);
            renderTemplateFields();
        } else {
            setFormData({});
        }

    };

    const renderTemplateFields = () => {
        if (!selectedTemplate) return null;
        return selectedTemplate.fields.map((field, index) => (
            <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{field.fieldName}:</label>
                <input
                    type={field.fieldType}
                    value={formData[field.fieldName] || ''}
                    onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        ));
    };

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setStudent((prevState) => ({
            ...prevState,
            fees: {
                ...prevState.fees,
                [fieldName]: value,
            },
        }));
    };


    return (
        <div className="flex-col w-screen ml-80 p-4">
            <button onClick={() => navigate(-1)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Back</button>
            <h1 className="text-lg font-semibold mb-4">Edit Student</h1><br />
            <form className="student-form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <div className="flex">
                        <div className="w-2/4">
                            <label>First Name</label>
                            <input type="text" name="first_name" value={student.first_name} onChange={handleChange} placeholder="First Name" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="w-2/4">
                            <label>Last Name</label>
                            <input type="text" name="last_name" value={student.last_name} onChange={handleChange} placeholder="Last Name" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-2/4">
                            <label>Email</label>
                            <input type="email" name="email" value={student.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="w-2/4">
                            <label>Phone</label>
                            <input type="text" name="phone" value={student.phone} onChange={handleChange} placeholder="Phone" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-2/4">
                            <label>Date of Birth</label>
                            <input type="date" value={student.date_of_birth} onChange={handleChange} placeholder="Date of Birth" />
                        </div>
                        <div className="w-2/4">
                            <label>Enrollment Date</label>
                            <input type="date" name="phone" value={student.admission_date} placeholder="Phone" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly />
                        </div>
                    </div>
                </div><br/><br/>

                <div className="form-group">
                    <div className="flex">
                        <div className="w-2/4">
                            <h3 className="text-lg font-semibold mb-4">Residential Address</h3>
                            <label>Street</label>
                            <input type="text" placeholder="Street" value={student.address.street} onChange={handleChange} />
                            <label>Area</label>
                            <input type="text" placeholder="Area" value={student.address.area} onChange={handleChange} />
                            <label>City</label>
                            <input type="text" placeholder="City" value={student.address.city} onChange={handleChange} />
                            <label>State</label>
                            <input type="text" placeholder="State" value={student.address.state} onChange={handleChange} />
                            <label>Zip Code</label>
                            <input type="text" placeholder="Zip Code" value={student.address.zip} onChange={handleChange} />
                            <label>Country</label>
                            <input type="text" placeholder="Country" value={student.address.country} onChange={handleChange} />
                        </div>
                        <div className="w-2/4">
                            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                            <label>Name / Company Name</label>
                            <input type="text" placeholder="Name" value={student.billingAddress.name} onChange={handleChange} />
                            <label>Street</label>
                            <input type="text" placeholder="Street" value={student.billingAddress.street} onChange={handleChange} />
                            <label>Area</label>
                            <input type="text" placeholder="Area" value={student.billingAddress.area} onChange={handleChange} />
                            <label>City</label>
                            <input type="text" placeholder="City" value={student.billingAddress.city} onChange={handleChange} />
                            <label>State</label>
                            <input type="text" placeholder="State" value={student.billingAddress.state} onChange={handleChange} />
                            <label>Zip Code</label>
                            <input type="text" placeholder="Zip Code" value={student.billingAddress.zip} onChange={handleChange} />
                            <label>Country</label>
                            <input type="text" placeholder="Country" value={student.billingAddress.country} onChange={handleChange} />
                            <label>GST No.</label>
                            <input type="text" placeholder="GST No." value={student.billingAddress.gstNo} onChange={handleChange} />
                        </div>
                    </div>
                </div><br /><br/>



                <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">Educational Details</h3>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-blue">
                            <tr>
                                <th className="py-2 px-4 border border-gray-300">Level</th>
                                <th className="py-2 px-4 border border-gray-300">Institute Name</th>
                                <th className="py-2 px-4 border border-gray-300">Degree</th>
                                <th className="py-2 px-4 border border-gray-300">Specialization</th>
                                <th className="py-2 px-4 border border-gray-300">Grade</th>
                                <th className="py-2 px-4 border border-gray-300">Passing Year</th>
                                <th className="py-2 px-4 border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.educationDetails.map((edu, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            name={`educationDetails.${index}.level`}
                                            value={edu.level}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            <option value="School">School</option>
                                            <option value="UG">UG</option>
                                            <option value="PG">PG</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`educationDetails.${index}.institute`}
                                            type="text"
                                            placeholder="Institute Name"
                                            value={edu.institute}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`educationDetails.${index}.degree`}
                                            type="text"
                                            placeholder="Degree"
                                            value={edu.degree}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`educationDetails.${index}.specialization`}
                                            type="text"
                                            placeholder="Specialization"
                                            value={edu.specialization}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`educationDetails.${index}.grade`}
                                            type="text"
                                            placeholder="Grade"
                                            value={edu.grade}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`educationDetails.${index}.passingyr`}
                                            type="number"
                                            placeholder="Passing Year"
                                            value={edu.passingyr}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <button
                                            type="button"
                                            onClick={() => deleteEducation(index)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="button" onClick={addEducation} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                        Add Education
                    </button>
                </div><br/><br/>


                <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">Experience Details</h3>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-blue">
                            <tr>
                                <th className="py-2 px-4 border border-gray-300">Company Name</th>
                                <th className="py-2 px-4 border border-gray-300">Designation</th>
                                <th className="py-2 px-4 border border-gray-300">Salary</th>
                                <th className="py-2 px-4 border border-gray-300">Description</th>
                                <th className="py-2 px-4 border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.experienceDetails.map((exp, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`experienceDetails.${index}.companyName`}
                                            type="text"
                                            placeholder="Company Name"
                                            value={exp.companyName}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`experienceDetails.${index}.designation`}
                                            type="text"
                                            placeholder="Designation"
                                            value={exp.designation}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`experienceDetails.${index}.salary`}
                                            type="text"
                                            placeholder="Salary"
                                            value={exp.salary}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            name={`experienceDetails.${index}.description`}
                                            type="text"
                                            placeholder="Description"
                                            value={exp.description}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <button
                                            type="button"
                                            onClick={() => deleteExperience(index)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="button" onClick={addExperience} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                        Add Experience
                    </button>
                </div><br/><br/>

                <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">Course Details</h3>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-blue">
                            <tr>
                                <th className="py-2 px-4 border border-gray-300">Course Name</th>
                                <th className="py-2 px-4 border border-gray-300">Batch</th>
                                <th className="py-2 px-4 border border-gray-300">Branch</th>
                                <th className="py-2 px-4 border border-gray-300">Mode</th>
                                <th className="py-2 px-4 border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(student.courseDetails) && student.courseDetails.map((course, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            name={`courseDetails.${index}.courseName`}
                                            value={course.courseName}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            {courses.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            name={`courseDetails.${index}.batch`}
                                            value={course.batch}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            {batches.map(b => (
                                                <option key={b.id} value={b.batchName}>{b.batchName}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            name={`courseDetails.${index}.branch`}
                                            value={course.branch}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            {centers.map(center => (
                                                <option key={center.id} value={center.name}>{center.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            name={`courseDetails.${index}.mode`}
                                            value={course.mode}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <button
                                            type="button"
                                            onClick={() => removeCourse(index)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="button" onClick={addCourse} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                        Add Course
                    </button>
                </div><br/><br/>

                <div className="flex">
                    <div className="w-2/4">
                        <label><b>Status of Student</b></label><br/>
                        <select name="status" value={student.status} onChange={handleChange}>
                            <option value="enquiry">Enquiry</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="deferred">Deferred</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>


                    <div className="w-2/4">
                        <label><b>Enrollment Goals</b></label><br/>
                        <select name="goal" value={student.goal} onChange={handleChange}>
                            <option value="upskilling">Upskilling</option>
                            <option value="placement">Placement</option>
                            <option value="career_switch">Career Switch</option>
                        </select>
                    </div>
                </div><br/><br/>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Payments</h3>

                    <div>
                        <label><b>Payment Type</b></label><br/>
                        <select name="payment-type" value={student.paymentType} onChange={handleTemplateChange} readOnly>
                            {feeTemplates.map((template) => (
                                <option key={template.id} value={template.id}>{template.templateName}</option>
                            ))}
                        </select>
                    </div>

                    {selectedTemplate && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold">Fill Fee Details:</h3>
                            {renderTemplateFields()}
                        </div>
                    )}
                    <br/>
                    <div className="w-2/4">
                        <label><b>Add Discount</b></label>
                        <input className="border-gray-300 rounded" placeholder="Discount" type="number" value={student.discount} readOnly/>%Rup<br />
                    </div>

                    <button type="button" className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                        Apply Discount
                    </button><br/><br/>

                    <div className="w-2/4">
                        <label><b>Fees Summary</b></label><br/>
                        Total: <input type="number" className="border-gray-300 rounded" value={student.total} readOnly/>
                    </div><br/>

                    <div className="overflow-x-auto">
                        <label><b>Installment Details</b></label>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-blue">
                                <tr>
                                    <th className="py-2 px-4 border border-gray-300">Installment No.</th>
                                    <th className="py-2 px-4 border border-gray-300">Due Amount</th>
                                    <th className="py-2 px-4 border border-gray-300">Due Date</th>
                                    <th className="py-2 px-4 border border-gray-300">Paid On</th>
                                    <th className="py-2 px-4 border border-gray-300">Amount Paid</th>
                                    <th className="py-2 px-4 border border-gray-300">Mode of Payment</th>
                                    <th className="py-2 px-4 border border-gray-300">PDC Status</th>
                                    <th className="py-2 px-4 border border-gray-300">Remark</th>
                                    <th className="py-2 px-4 border border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.installmentDetails.map((installment, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.number`}
                                                type="text"
                                                placeholder="Installment No.:"
                                                value={installment.number}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.dueAmount`}
                                                type="text"
                                                placeholder="Due Amount"
                                                value={installment.dueAmount}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                                readOnly
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.dueDate`}
                                                type="date"
                                                value={installment.dueDate}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                                readOnly
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.paidOn`}
                                                type="date"
                                                value={installment.paidDate}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.amtPaid`}
                                                type="text"
                                                placeholder="Amount Paid"
                                                value={installment.paidAmount}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <select
                                                name={`installmentDetails.${index}.modeOfPayment`}
                                                value={installment.modeOfPayment}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                            >
                                                <option>select</option>
                                                <option value="m1">mode1</option>
                                                <option value="m2">mode2</option>
                                                <option value="m3">mode3</option>
                                            </select>
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <select
                                                name={`installmentDetails.${index}.pdcStatus`}
                                                value={installment.pdcStatus}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                            >
                                                <option>select</option>
                                                <option value="s1">status1</option>
                                                <option value="s2">status2</option>
                                                <option value="s3">status3</option>
                                            </select>
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.remark`}
                                                type="text"
                                                placeholder="Remark"
                                                value={installment.remark}
                                                onChange={handleChange}
                                                className="border-gray-300 rounded w-full"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <button
                                                type="button"
                                                onClick={() => deleteInstallment(index)}
                                                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200"
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addInstallment} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                            Add Installment
                        </button>
                    </div>
                </div><br/><br/>


                <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Update Student</button>
                <button type="button" onClick={handleDelete} className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Delete Student</button>
            </form>
        </div>
    );
};
