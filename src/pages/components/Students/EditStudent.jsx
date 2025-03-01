import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import './profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from "firebase/firestore";

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
    });

    const navigate = useNavigate();

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
                        address: data.residential_address,
                        billingAddress: data.billing_address,
                        date_of_birth: data.date_of_birth.toDate().toISOString().split("T")[0],
                        admission_date: data.admission_date.toDate().toISOString().split("T")[0],
                        courseDetails: data.course_details || [],
                        educationDetails: data.education_details || [],
                        installmentDetails: data.installment_details || [],
                        experienceDetails: data.experience_details || [],
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

    // Remove Course
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

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <button onClick={() => navigate(-1)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Back</button>
            <h1>Edit Student</h1><br />
            <form onSubmit={handleUpdate}>

                <input type="text" name="first_name" value={student.first_name} onChange={handleChange} placeholder="First Name" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="last_name" value={student.last_name} onChange={handleChange} placeholder="Last Name" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" name="email" value={student.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="phone" value={student.phone} onChange={handleChange} placeholder="Phone" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />


                <h2>Residential Address</h2>
                <input type="text" name="address.street" value={student.address.street} onChange={handleChange} placeholder="Street" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="address.area" value={student.address.area} onChange={handleChange} placeholder="Area" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="address.city" value={student.address.city} onChange={handleChange} placeholder="City" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="address.state" value={student.address.state} onChange={handleChange} placeholder="State" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="address.zip" value={student.address.zip} onChange={handleChange} placeholder="Zip Code" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="address.country" value={student.address.country} onChange={handleChange} placeholder="Country" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" /><br />


                <h2>Billing Address</h2>
                <input type="text" name="billingAddress.street" value={student.billingAddress.street} onChange={handleChange} placeholder="Street" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="billingAddress.area" value={student.billingAddress.area} onChange={handleChange} placeholder="Area" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="billingAddress.city" value={student.billingAddress.city} onChange={handleChange} placeholder="City" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="billingAddress.state" value={student.billingAddress.state} onChange={handleChange} placeholder="State" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="billingAddress.zip" value={student.billingAddress.zip} onChange={handleChange} placeholder="Zip Code" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="billingAddress.country" value={student.billingAddress.country} onChange={handleChange} placeholder="Country" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="billingAddress.gstNo" value={student.billingAddress.gstNo} onChange={handleChange} placeholder="GST Number" className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" /><br />


                <h2>Date Of Birth</h2>
                <input type="date" name="date_of_birth" value={student.date_of_birth} onChange={handleChange} placeholder="Date of Birth" /><br />
                <h2>Admission Date</h2>
                <input type="date" name="admission_date" value={student.admission_date} onChange={handleChange} placeholder="Admission Date" /><br />

                {/* <div>
                    <h2>Course Details</h2> */}

                {/* {student.experienceDetails.map((exp, index) => (
                    {student.courseDetails.map((course => (
                        <div key={course.id}>{course.name}</div>
                    ))} */}
                <div>
                    <h2>Course Details</h2>


                    
                    {Array.isArray(student.courseDetails) && student.courseDetails.map((course, index) => (
                        <div key={index} className="course-group">
                            {/* {student.courseDetails.map((course, index) => (
                        <div key={index} className="course-group"> */}
                            <select name={`courseDetails.${index}.courseName`} value={course.courseName} onChange={handleChange}>
                                <option value="">Select Course</option>
                                <option value="Full Stack Development (MERN)">Full Stack Development (MERN)</option>
                                <option value="Full Stack Development (Python)">Full Stack Development (Python)</option>
                                <option value="Data Science">Data Science</option>
                            </select>
                            <select name={`courseDetails.${index}.batch`} value={course.batch} onChange={handleChange} >
                                <option value="">Select Batch</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Weekend">Weekend</option>
                            </select>
                            <select name={`courseDetails.${index}.branch`} value={course.branch} onChange={handleChange}>
                                <option value="">Select Branch</option>
                                <option value="Mate Sq">Mate Sq</option>
                                <option value="Nandanwan">Nandanwan</option>
                                <option value="Sadar">Sadar</option>
                            </select>
                            <select name={`courseDetails.${index}.mode`} value={course.mode} onChange={handleChange}>
                                <option value="">Select Mode</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                            <button type="button" onClick={() => removeCourse(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                     <button type="button" onClick={addCourse} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Course</button>
                    {/* <button type="button" onClick={addCourse} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Course</button> */}
                </div><br />

                <div>
                    <h2>Status of Student</h2>
                    <select name="status" value={student.status} onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="enquiry">Enquiry</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                    </select>
                </div><br />

                <div>
                    <h2>Educational Details</h2>
                    {student.educationDetails.map((edu, index) => (
                        <div key={index} className="education-group">
                            <select name={`educationDetails.${index}.level`} value={edu.level} onChange={handleChange}>
                                <option value="" disabled>Select Level</option>
                                <option value="School">School</option>
                                <option value="UG">UG</option>
                                <option value="PG">PG</option>
                            </select>
                            <input name={`educationDetails.${index}.institute`} type="text" placeholder="Institute Name" value={edu.institute} onChange={handleChange} />
                            <input name={`educationDetails.${index}.degree`} type="text" placeholder="Degree" value={edu.degree} onChange={handleChange} />
                            <input name={`educationDetails.${index}.specialization`} type="text" placeholder="Specialization" value={edu.specialization} onChange={handleChange} />
                            <input name={`educationDetails.${index}.grade`} type="text" placeholder="Grade" value={edu.grade} onChange={handleChange} />
                            <input name={`educationDetails.${index}.passingyr`} type="number" placeholder="Passing Year" value={edu.passingyr} onChange={handleChange} />

                            <button type="button" onClick={() => deleteEducation(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addEducation} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Education</button>
                </div><br />

                <div>
                    <h2>Experience Details</h2>
                    {student.experienceDetails.map((exp, index) => (
                        <div key={index} className="experience-group">
                            <input name={`experienceDetails.${index}.companyName`} type="text" placeholder="Company Name" value={exp.companyName} onChange={handleChange} />
                            <input name={`experienceDetails.${index}.designation`} type="text" placeholder="Designation" value={exp.designation} onChange={handleChange} />
                            <input name={`experienceDetails.${index}.salary`} type="text" placeholder="Salary" value={exp.salary} onChange={handleChange} />
                            <input name={`experienceDetails.${index}.description`} type="text" placeholder="Description" value={exp.description} onChange={handleChange} />
                            <button type="button" onClick={() => deleteExperience(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addExperience} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Experience</button>
                </div><br />

                <div>
                    <h2>Installment Details</h2>
                    {student.installmentDetails.map((installment, index) => (
                        <div key={index} className="course-group">
                            <input name={`installmentDetails.${index}.number`} type="text" placeholder="Installment No.:" value={installment.number} onChange={handleChange} />
                            <input name={`installmentDetails.${index}.dueAmount`} type="text" placeholder="Due Amount" value={installment.dueAmount} onChange={handleChange} />
                            <input name={`installmentDetails.${index}.dueDate`} type="date" placeholder="Due Date" value={installment.dueDate} onChange={handleChange} />
                            <input name={`installmentDetails.${index}.paidOn`} type="date" placeholder="Paid On" value={installment.paidOn} onChange={handleChange} />
                            <input name={`installmentDetails.${index}.amtPaid`} type="text" placeholder="Amount Paid" value={installment.amtPaid} onChange={handleChange} />
                            <select name={`installmentDetails.${index}.modeOfPayment`} value={installment.modeOfPayment} onChange={handleChange}>
                                <option value="" disabled>Select Mode Of Payment</option>
                                <option value="m1">mode1</option>
                                <option value="m2">mode2</option>
                                <option value="m3">mode3</option>
                            </select>
                            <select name={`installmentDetails.${index}.pdcStatus`} value={installment.pdcStatus} onChange={handleChange}>
                                <option value="" disabled>Select PDC Status</option>
                                <option value="s1">status1</option>
                                <option value="s2">status2</option>
                                <option value="s3">status3</option>
                            </select>
                            <input name={`installmentDetails.${index}.remark`} type="text" placeholder="Remark" value={installment.remark} onChange={handleChange} />
                            <button type="button" onClick={() => deleteInstallment(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addInstallment} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Installment</button>
                </div><br />

                <div>
                    <h2>Enrollment Goals</h2>
                    <select name="goal" value={student.goal} onChange={handleChange}>
                        <option value="">Select Goal</option>
                        <option value="upskilling">Upskilling</option>
                        <option value="placement">Placement</option>
                        <option value="career_switch">Career Switch</option>
                    </select>
                </div><br />

                <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Update Student</button>
                <button type="button" onClick={handleDelete} className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Delete Student</button>
            </form>
        </div>
    );
};

