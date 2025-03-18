import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from "@material-tailwind/react";

export default function AddStudent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
    const [billingAddress, setBillingAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
    const [copyAddress, setCopyAddress] = useState(false);
    const [status, setStatus] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [admissionDate, setAdmissionDate] = useState("");
    const [courseDetails, setCourseDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [installmentDetails, setInstallmentDetails] = useState([]);
    const [experienceDetails, setExperienceDetails] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);
    const [goal, setGoal] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [discount, setDiscount] = useState();
    const [total, setTotal] = useState("");
    const [fees, setFees] = useState([]);
    const navigate = useNavigate();
    const [courseId, setCourseId] = useState("");
    const [feeTemplates, setFeeTemplates] = useState([]);
    const [formData, setFormData] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateFields, setTemplateFields] = useState([]);

    let discountedTotal = 0;

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setAdmissionDate(today);
        fetchCourses();
        fetchBatches();
        fetchCenters();
        fetchFeeTemplates();
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

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
            alert("Please fill all required fields.");
            return;
        }

        let installmentTotal = 0;
        installmentDetails.map((installment) => {
            installmentTotal += Number(installment.dueAmount);
        });

        if (installmentTotal != total) {
            alert("Installment total does not match with total amount");
            console.log(installmentTotal);
            return;
        }

        try {
            const studentDocRef = await addDoc(collection(db, 'student'), {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                residential_address: address,
                billing_address: billingAddress,
                goal: goal || "Not specified",
                status: status,
                date_of_birth: Timestamp.fromDate(new Date(dateOfBirth)),
                admission_date: Timestamp.fromDate(new Date(admissionDate)),
                course_details: courseDetails,
                course_id: courseId,
                education_details: educationDetails,
                experience_details: experienceDetails,
                discount: discount || 0,
                total: total || 0,
                fees: fees,
                installment_details: installmentDetails,
            });

            const studentId = studentDocRef.id;
            const enrollmentsRef = collection(db, 'enrollments');
            let paidAmt = 0;
            const today = new Date().toISOString().split("T")[0];

            let outstanding = 0;
            let overdue = 0;

            installmentDetails.forEach((installment) => {
                const amtPaid = installment.paidAmount || 0;
                const amtDue = installment.dueAmount || 0;

                paidAmt += amtPaid;

                const dueDate = new Date(installment.dueDate).toISOString().split("T")[0];

                if (dueDate > today && installmentDetails.paidAmount === 0) {
                    outstanding += amtDue;
                } else if (dueDate <= today && installmentDetails.paidAmount === 0) {
                    overdue += amtDue;
                }
            });

            const enrollmentData = {
                student_id: studentId,
                course_id: courseId,
                enrollment_date: Timestamp.fromDate(new Date(admissionDate)),
                fee: {
                    discount: discount || 0,
                    total: total || 0,

                    overdue: overdue,

                    paid: paidAmt,
                    outstanding: outstanding,
                },
                installments: installmentDetails,
            };
            await addDoc(enrollmentsRef, enrollmentData);

            const installmentsRef = collection(db, 'installments');
            for (const installmentData of installmentDetails) {
                await addDoc(installmentsRef, {
                    ...installmentData,
                    student_id: studentId
                });
            }

            alert("Student added successfully!");
            navigate("/studentdetails");
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Error adding student. Please try again.");
        }
    };

    const handleCopyAddress = (isChecked) => {
        setCopyAddress(isChecked);
        if (isChecked) {
            setBillingAddress({
                ...address,
                gstNo: billingAddress.gstNo
            });
        } else {
            setBillingAddress({ street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
        }
    };

    const addEducation = () => {
        setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '' }]);
    };

    const handleEducationChange = (index, field, value) => {
        const newEducationDetails = [...educationDetails];
        newEducationDetails[index][field] = value;
        setEducationDetails(newEducationDetails);
    };

    const deleteEducation = (index) => {
        const newEducationDetails = educationDetails.filter((_, i) => i !== index);
        setEducationDetails(newEducationDetails);
    };

    const handleInstallmentChange = (index, field, value) => {
        const newInstallmentDetails = [...installmentDetails];
        newInstallmentDetails[index][field] = value;
        setInstallmentDetails(newInstallmentDetails);
    };


    const addCourse = () => {
        setCourseDetails([...courseDetails, { courseName: '', batch: '', center: '', mode: '', fee: 0 }]);
    };

    const handleCourseChange = (index, field, value) => {
        const newCourseDetails = [...courseDetails];
        newCourseDetails[index][field] = value;

        if (field === 'courseName') {
            const selectedCourse = courses.find(course => course.name === value);
            newCourseDetails[index].fee = selectedCourse ? selectedCourse.fee : 0;
            setCourseId(selectedCourse.id);
        }
        discountedTotal = 0;

        setCourseDetails(newCourseDetails);
    };

    const deleteCourse = (index) => {
        const newCourseDetails = courseDetails.filter((_, i) => i !== index);
        discountedTotal = 0;
        setCourseDetails(newCourseDetails);
    };

    const addExperience = () => {
        setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', description: '' }]);
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperienceDetails = [...experienceDetails];
        newExperienceDetails[index][field] = value;
        setExperienceDetails(newExperienceDetails);
    };

    const deleteExperience = (index) => {
        const newExperienceDetails = experienceDetails.filter((_, i) => i !== index);
        setExperienceDetails(newExperienceDetails);
    };

    const handleTemplateChange = async (e) => {
        const templateId = e.target.value;
        setSelectedTemplate(templateId);

        const templateSnapshot = await firestore.collection('feeTemplates').doc(templateId).get();
        const templateData = templateSnapshot.data();

        if (templateData && templateData.installments) {
            setInstallmentDetails(templateData.installments);
        }
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        const [fieldName, index, subField] = name.split('.');

        if (fieldName === 'installmentDetails') {
            const updatedDetails = [...installmentDetails];
            updatedDetails[index][subField] = value;
            setInstallmentDetails(updatedDetails);
        }
        else if (fieldName === 'discount') {
            setDiscount(value);
        }
        else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };


    const addInstallment = () => {
        const newInstallment = {
            number: installmentDetails.length + 1,
            dueAmount: "",
            dueDate: "",
            paidDate: "",
            paidAmount: "",
            modeOfPayment: "",
            pdcStatus: "",
            remark: ""
        };
        setInstallmentDetails([...installmentDetails, newInstallment]);
    };


    const deleteInstallment = (index) => {
        const updatedInstallments = installmentDetails.filter((_, i) => i !== index);
        setInstallmentDetails(updatedInstallments);
    };

    // const renderTemplateFields = () => {
    //     return templateFields.map((field, idx) => (
    //         <div key={idx}>
    //             <label>{field.label}</label>
    //             <input
    //                 type={field.type}
    //                 name={`installmentDetails.${idx}.${field.name}`}
    //                 value={installmentDetails[idx][field.name]}
    //                 onChange={handleChange}
    //             />
    //         </div>
    //     ));
    // };

    const handleFeeSummary = () => {
        let totalFees = 0;

        courseDetails.forEach((course) => {
            if (course.fee && !isNaN(course.fee)) {
                totalFees += Number(course.fee);
            }
        });
        console.log(totalFees);
        console.log(discount);

        const discountAmount = (Number(totalFees * discount / 100)) || 0;
        console.log(discountAmount);
        const finalTotal = totalFees - discountAmount;

        setTotal(finalTotal);
    };


    return (
        <div className="flex-col w-screen ml-80 p-4">
            <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => navigate("/studentdetails")}>Back</button>
            <h1 className="text-lg font-semibold mb-4">Add Student</h1>
            <form className="student-form" onSubmit={handleAddStudent}>
                <div className="form-group">
                    <div className="flex">
                        <div className="w-2/4">
                            <label>First Name</label>
                            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="w-2/4">
                            <label>Last Name</label>
                            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-2/4">
                            <label>Email</label>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="w-2/4">
                            <label>Phone</label>
                            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-2/4">
                            <label>Date of Birth</label>
                            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                        </div>
                    </div>
                </div><br /><br/>

                <div className="form-group">
                    <div className="flex">
                        <div className="w-2/4">
                            <h3 className="text-lg font-semibold mb-4">Residential Address</h3>
                            <label>Street</label>
                            <input type="text" placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                            <label>Area</label>
                            <input type="text" placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
                            <label>City</label>
                            <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                            <label>State</label>
                            <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                            <label>Zip Code</label>
                            <input type="text" placeholder="Zip Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                            <label>Country</label>
                            <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                            <label> <input type="checkbox" checked={copyAddress} onChange={(e) => handleCopyAddress(e.target.checked)} /> Same as Residential Address </label>
                        </div>
                        <div className="w-2/4">
                            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                            <label>Street</label>
                            <input type="text" placeholder="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} />
                            <label>Area</label>
                            <input type="text" placeholder="Area" value={billingAddress.area} onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })} />
                            <label>City</label>
                            <input type="text" placeholder="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
                            <label>State</label>
                            <input type="text" placeholder="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
                            <label>Zip Code</label>
                            <input type="text" placeholder="Zip Code" value={billingAddress.zip} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
                            <label>Country</label>
                            <input type="text" placeholder="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} />
                            <label>GST No.</label>
                            <input type="text" placeholder="GST No." value={billingAddress.gstNo} onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })} />
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
                            {educationDetails.map((edu, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select value={edu.level} onChange={(e) => handleEducationChange(index, 'level', e.target.value)} className="border-gray-300 rounded">
                                            <option value="" disabled>Select Level</option>
                                            <option value="School">School</option>
                                            <option value="UG">UG</option>
                                            <option value="PG">PG</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input type="text" placeholder="Institute Name" value={edu.institute} onChange={(e) => handleEducationChange(index, 'institute', e.target.value)} className="border-gray-300 rounded w-full" />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className="border-gray-300 rounded w-full" required />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input type="text" placeholder="Specialization" value={edu.specialization} onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)} className="border-gray-300 rounded w-full" />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input type="number" placeholder="Grade" value={edu.grade} onChange={(e) => handleEducationChange(index, 'grade', e.target.value)} className="border-gray-300 rounded w-full" />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input type="number" placeholder="Passing Year" value={edu.passingyr} onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)} className="border-gray-300 rounded w-full" />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <button type="button" onClick={() => deleteEducation(index)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="button" onClick={addEducation} className="mt-4 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Education</button>
                </div>
                <br /><br/>

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
                            {experienceDetails.map((experience, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="Company Name"
                                            value={experience.companyName}
                                            onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="Designation"
                                            value={experience.designation}
                                            onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="Salary"
                                            value={experience.salary}
                                            onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={experience.description}
                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
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
                </div>
                <br /><br/>

                <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">Course Details</h3>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-blue">
                            <tr>
                                <th className="py-2 px-4 border border-gray-300">Course</th>
                                <th className="py-2 px-4 border border-gray-300">Batch</th>
                                <th className="py-2 px-4 border border-gray-300">Center</th>
                                <th className="py-2 px-4 border border-gray-300">Mode</th>
                                <th className="py-2 px-4 border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseDetails.map((course, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            value={course.courseName}
                                            onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            value={course.batch}
                                            onChange={(e) => handleCourseChange(index, 'batch', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            <option value="">Select Batch</option>
                                            {batches.map(b => (
                                                <option key={b.id} value={b.name}>{b.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            value={course.center}
                                            onChange={(e) => handleCourseChange(index, 'center', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            <option value="">Select Center</option>
                                            {centers.map(center => (
                                                <option key={center.id} value={center.name}>{center.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <select
                                            value={course.mode}
                                            onChange={(e) => handleCourseChange(index, 'mode', e.target.value)}
                                            className="border-gray-300 rounded w-full"
                                        >
                                            <option value="">Select Mode</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <button
                                            type="button"
                                            onClick={() => deleteCourse(index)}
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
                </div>
                <br /><br/>

                <div className="flex">
                    <div className="w-2/4">
                        <label><b>Goal</b></label><br />
                        <select value={goal} onChange={(e) => { setGoal(e.target.value) }}>
                            <option value="" disabled>Select Goal</option>
                            <option value="Upskilling">Upskilling</option>
                            <option value="Career Switch">Career Switch</option>
                            <option value="Placement">Placement</option>
                        </select>
                    </div>
                    <div className="w-2/4">
                        <label><b>Status</b></label><br />
                        <select value={status} onChange={(e) => { setStatus(e.target.value) }}>
                            <option value="" disabled>Select Status</option>
                            <option value="enquiry">Enquiry</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="completed">Completed</option>
                            <option value="deferred">Deferred</option>
                        </select>
                    </div>
                </div><br/><br/>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Payments</h3>
                    <div className="flex">
                        <div className="w-2/4">
                            <label><b>Date Of Enrollments</b></label><br />
                            <input value={admissionDate} readOnly />
                        </div>
                        <div className="w-2/4">
                            <label><b>Fees Scheme</b></label><br />
                            <select name="payment-type" value={selectedTemplate} onChange={handleTemplateChange}>
                                <option value="">--Select a Type--</option>
                                {feeTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>{template.templateName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <label><b>Add Discount</b></label><br />
                        <input
                            name='Discount'
                            value={discount}
                            placeholder="Discount"
                            onChange={(e) => { setDiscount(e.target.value); }}
                            className="border-gray-300 rounded w-1/4"
                        /> %Rup<br />

                        <button type="button" onClick={handleFeeSummary} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                            Apply Discount
                        </button><br />

                        <div className="w-2/4">
                            <label><b>Fees Summary</b></label><br />
                            Total: <input type="number" value={total} disabled className="w-1/4 border-gray-300 rounded " /><br />
                        </div>
                        <label><b>Installment Details</b></label>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-blue">
                                <tr>
                                    <th className="py-2 px-4 border border-gray-300">No.</th>
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
                                {installmentDetails.map((installment, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.number`}
                                                type="text"
                                                placeholder="Installment No.:"
                                                value={installment.number}
                                                readOnly
                                                className="w-full border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.dueAmount`}
                                                type="text"
                                                placeholder="Due Amount"
                                                value={installment.dueAmount}
                                                onChange={handleChange}
                                                className="w-full border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.dueDate`}
                                                type="date"
                                                placeholder="Due Date"
                                                value={installment.dueDate}
                                                onChange={handleChange}
                                                className="w-full border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.paidDate`}
                                                type="date"
                                                placeholder="Paid On"
                                                value={installment.paidDate}
                                                onChange={handleChange}
                                                className="w-full border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <input
                                                name={`installmentDetails.${index}.paidAmount`}
                                                type="text"
                                                placeholder="Amount Paid"
                                                value={installment.paidAmount}
                                                onChange={handleChange}
                                                className="w-full border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <select
                                                name={`installmentDetails.${index}.modeOfPayment`}
                                                value={installment.modeOfPayment}
                                                onChange={handleChange}
                                                className="w-full border-gray-300 rounded"
                                            >
                                                <option value="" disabled>Select</option>
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
                                                className="w-full border-gray-300 rounded"
                                            >
                                                <option value="" disabled>Select</option>
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
                                                className="w-full border-gray-300 rounded"
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

                        <br />

                    </div>


                </div>

                <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-20">Add Student</button>
            </form>
        </div>
    );
}
