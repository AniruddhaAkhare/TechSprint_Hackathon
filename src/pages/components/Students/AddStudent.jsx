import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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

        try {
            const studentDocRef = await addDoc(collection(db, 'student'), {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                residential_address: address,
                billing_address: billingAddress,
                goal: goal || "Not specified",
                status: "Enrolled",
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
                // Safely retrieve amounts with a fallback to 0
                const amtPaid = installment.paidAmount || 0;
                const amtDue = installment.dueAmount || 0;

                // Accumulate the total paid amount
                paidAmt += amtPaid;

                // Convert dueDate to a Date object and compare
                const dueDate = new Date(installment.dueDate).toISOString().split("T")[0];

                if (dueDate > today && installmentDetails.paidAmount===0) {
                    outstanding += amtDue; // Amount due in the future
                } else if(dueDate <= today && installmentDetails.paidAmount===0) {
                    overdue += amtDue; // Amount due in the past
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
            <h1>Add Student</h1>
            <form className="student-form" onSubmit={handleAddStudent}>
                <div className="form-group">
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div><br />

                <div className="form-group">
                    <h3>Date of Birth</h3>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div><br />

                <div className="form-group">
                    <h3>Residential Address</h3>
                    <input type="text" placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                    <input type="text" placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
                    <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                    <input type="text" placeholder="Zip Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                    <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                </div><br />

                <div className="form-group">
                    <h3>Billing Address</h3>
                    <label> <input type="checkbox" checked={copyAddress} onChange={(e) => handleCopyAddress(e.target.checked)} />Same as Residential Address </label>
                    <input type="text" placeholder="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} />
                    <input type="text" placeholder="Area" value={billingAddress.area} onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })} />
                    <input type="text" placeholder="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
                    <input type="text" placeholder="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
                    <input type="text" placeholder="Zip Code" value={billingAddress.zip} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
                    <input type="text" placeholder="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} />
                    <input type="text" placeholder="GST No." value={billingAddress.gstNo} onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })} />
                </div><br />

                <div>
                    <h3>Educational Details</h3>
                    {educationDetails.map((edu, index) => (
                        <div key={index} className="education-group">
                            <select value={edu.level} onChange={(e) => handleEducationChange(index, 'level', e.target.value)}>
                                <option value="" disabled>Select Level</option>
                                <option value="School">School</option>
                                <option value="UG">UG</option>
                                <option value="PG">PG</option>
                            </select>
                            <input type="text" placeholder="Institute Name" value={edu.institute} onChange={(e) => handleEducationChange(index, 'institute', e.target.value)} />
                            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} required />
                            <input type="text" placeholder="Specialization" value={edu.specialization} onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)} />
                            <input type="text" placeholder="Grade" value={edu.grade} onChange={(e) => handleEducationChange(index, 'grade', e.target.value)} />
                            <input type="number" placeholder="Passing Year" value={edu.passingyr} onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)} />
                            <button type="button" onClick={() => deleteEducation(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addEducation} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Education</button>
                </div><br />

                <div>
                    <h3>Experience Details</h3>
                    {experienceDetails.map((experience, index) => (
                        <div key={index} className="experience-group">
                            <input type="text" placeholder="Company Name" value={experience.companyName} onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)} />
                            <input type="text" placeholder="Designation" value={experience.designation} onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)} />
                            <input type="text" placeholder="Salary" value={experience.salary} onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)} />
                            <input type="text" placeholder="Description" value={experience.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} />
                            <button type="button" onClick={() => deleteExperience(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addExperience} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Experience</button>
                </div><br />

                <div>
                    <h3>Course Details</h3>
                    {courseDetails.map((course, index) => (
                        <div key={index} className="course-group">
                            <select value={course.courseName} onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}>
                                <option value="">Select Course</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <select value={course.batch} onChange={(e) => handleCourseChange(index, 'batch', e.target.value)}>
                                <option value="">Select Batch</option>
                                {batches.map(b => (
                                    <option key={b.id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                            <select value={course.center} onChange={(e) => handleCourseChange(index, 'center', e.target.value)}>
                                <option value="">Select Center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.name}>{center.name}</option>
                                ))}
                            </select>
                            <select value={course.mode} onChange={(e) => handleCourseChange(index, 'mode', e.target.value)}>
                                <option value="">Select Mode</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                            <button type="button" onClick={() => deleteCourse(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addCourse} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Course</button>
                </div><br />

                <div>
                    <h3>Goal</h3>
                    <select value={goal} onChange={(e) => { setGoal(e.target.value) }}>
                        <option value="" disabled>Select Goal</option>
                        <option value="Upskilling">Upskilling</option>
                        <option value="Career Switch">Career Switch</option>
                        <option value="Placement">Placement</option>
                    </select>
                </div>

                <div>
                    <h3>Payments</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div>
                            <h4>Date Of Enrollments</h4>
                            <input value={admissionDate} readOnly />
                        </div>
                        <div>
                            <h4>Fees Scheme</h4>
                            <select name="payment-type" value={selectedTemplate} onChange={handleTemplateChange}>
                                <option value="">--Select a Type--</option>
                                {feeTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>{template.templateName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <h2>Installment Details</h2>
                        {installmentDetails.map((installment, index) => (
                            <div key={index} className="course-group">
                                <input name={`installmentDetails.${index}.number`} type="text" placeholder="Installment No.:" value={installment.number} readOnly />
                                <input name={`installmentDetails.${index}.dueAmount`} type="text" placeholder="Due Amount" value={installment.dueAmount} onChange={handleChange} />
                                <input name={`installmentDetails.${index}.dueDate`} type="date" placeholder="Due Date" value={installment.dueDate} onChange={handleChange} />
                                <input name={`installmentDetails.${index}.paidDate`} type="date" placeholder="Paid On" value={installment.paidDate} onChange={handleChange} />
                                <input name={`installmentDetails.${index}.paidAmount`} type="text" placeholder="Amount Paid" value={installment.paidAmount} onChange={handleChange} />
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
                        <br /><label>Add Discount</label><br />
                        <input name='Discount' value={discount} placeholder="Discount" onChange={(e) => { setDiscount(e.target.value) }} /> %Rup<br />
                        <button type="button" onClick={handleFeeSummary}> Apply Discount</button>
                        <h4>Fees Summary</h4>
                        Total: <input type="number" value={total} disabled />
                    </div><br />

                </div>

                <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-20">Add Student</button>
            </form>
        </div>
    );
}
