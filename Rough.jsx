// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { collection, addDoc, Timestamp } from "firebase/firestore";
// // // import { db } from "../../../config/firebase";
// // // import './Profile.css'; // Ensure you have relevant styles defined
// // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // import { faXmark } from '@fortawesome/free-solid-svg-icons';

// // // export default function  AddStudent() {
// // //     const [firstName, setFirstName] = useState("");
// // //     const [lastName, setLastName] = useState("");
// // //     const [email, setEmail] = useState("");
// // //     const [phone, setPhone] = useState("");
    
// // //     const [address, setAddress] = useState({
// // //         street: "", area: "", city: "", state: "", zip: "", country: ""
// // //     });
    
// // //     const [billingAddress, setBillingAddress] = useState({
// // //         street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: ""
// // //     });
    
// // //     const [copyAddress, setCopyAddress] = useState(false);
// // //     const [status, setStatus] = useState("");
// // //     const [dateOfBirth, setDateOfBirth] = useState("");
// // //     const [admissionDate, setAdmissionDate] = useState("");
    
// // //     const [courseDetails, setCourseDetails] = useState([]);
// // //     const [educationDetails, setEducationDetails] = useState([]);
// // //     const [installmentDetails, setInstallmentDetails] = useState([]);
// // //     const [experienceDetails, setExperienceDetails] = useState([]);

// // //     const [goal, setGoal] = useState("");

// // //     const navigate = useNavigate();

// // //     useEffect(() => {
// // //         const today = new Date().toISOString().split("T")[0];
// // //         setAdmissionDate(today);
// // //     }, []);

// // //     const handleAddStudent = async (e) => {
// // //         e.preventDefault();
// // //         if (!firstName || !lastName || !email || !phone) {
// // //             alert("Please fill all required fields.");
// // //             return;
// // //         }

// // //         try {
// // //             const studentDocRef = await addDoc(collection(db, 'student'), {
// // //                 first_name: firstName,
// // //                 last_name: lastName,
// // //                 email,
// // //                 phone,
// // //                 residential_address: address,
// // //                 billing_address: billingAddress,
// // //                 goal,
// // //                 status,
// // //                 date_of_birth: Timestamp.fromDate(new Date(dateOfBirth)),
// // //                 admission_date: Timestamp.fromDate(new Date(admissionDate)),
// // //                 course_details: courseDetails,
// // //                 education_details: educationDetails,
// // //                 installment_details: installmentDetails,
// // //                 experience_details: experienceDetails
// // //             });

// // //             alert("Student added successfully!");
// // //             navigate("/studentdetails");
// // //         } catch (error) {
// // //             console.error("Error adding student:", error);
// // //             alert("Error adding student. Please try again.");
// // //         }
// // //     };

// // //     const handleCopyAddress = (isChecked) => {
// // //         setCopyAddress(isChecked);
// // //         if (isChecked) {
// // //             setBillingAddress({
// // //                 ...address, 
// // //                 gstNo: billingAddress.gstNo 
// // //             });
// // //         } else {
// // //             setBillingAddress({ street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
// // //         }
// // //     };

// // //     const addEducation = () => {
// // //         setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '' }]);
// // //     };

// // //     const handleEducationChange = (index, field, value) => {
// // //         const newEducationDetails = [...educationDetails];
// // //         newEducationDetails[index][field] = value;
// // //         setEducationDetails(newEducationDetails);
// // //     };

// // //     const deleteEducation = (index) => {
// // //         const newEducationDetails = educationDetails.filter((_, i) => i !== index);
// // //         setEducationDetails(newEducationDetails);
// // //     };

// // //     const addInstallment = async (studentId, installmentData) => {
// // //         try {
// // //             const installmentRef = await addDoc(collection(db, "installments"), installmentData);
// // //             const installmentId = installmentRef.id;
// // //             const studentDocRef = doc(db, "student", studentId);
// // //             await updateDoc(studentDocRef, { installmentId });
    
// // //             console.log("Installment added successfully with ID:", installmentId);
// // //             return installmentId;
// // //         } catch (error) {
// // //             console.error("Error adding installment:", error);
// // //         }
// // //     };

// // //     const handleAddInstallment = async (studentId) => {
// // //         const installmentData = {
// // //             amount: 5000,
// // //             dueDate: "2025-04-01",
// // //             status: "pending",
// // //             studentId: studentId
// // //         };
    
// // //         await addInstallment(studentId, installmentData);
// // //     };
    
// // //     const handleInstallmentChange = (index, field, value) => {
// // //         const newInstallmentDetails = [...installmentDetails];
// // //         newInstallmentDetails[index][field] = value;
// // //         setInstallmentDetails(newInstallmentDetails);
// // //     };

// // //     const deleteInstallment = (index) => {
// // //         const newInstallmentDetails = installmentDetails.filter((_, i) => i !== index);
// // //         setInstallmentDetails(newInstallmentDetails);
// // //     };

// // //     const addCourse = () => {
// // //         setCourseDetails([...courseDetails, { courseName: '', batch: '', branch: '', mode: '' }]);
// // //     };

// // //     const handleCourseChange = (index, field, value) => {
// // //         const newCourseDetails = [...courseDetails];
// // //         newCourseDetails[index][field] = value;
// // //         setCourseDetails(newCourseDetails);
// // //     };

// // //     const deleteCourse = (index) => {
// // //         const newCourseDetails = courseDetails.filter((_, i) => i !== index);
// // //         setCourseDetails(newCourseDetails);
// // //     };

// // //     const addExperience = () => {
// // //         setExperienceDetails([...experienceDetails, { comapanyName: '', degination: '', salary: '', description: '' }]);
// // //     };

// // //     const handleExperienceChange = (index, field, value) => {
// // //         const newExperienceDetails = [...experienceDetails];
// // //         newExperienceDetails[index][field] = value;
// // //         setExperienceDetails(newExperienceDetails);
// // //     };

// // //     const deleteExperience = (index) => {
// // //         const newExperienceDetails = experienceDetails.filter((_, i) => i !== index);
// // //         setExperienceDetails(newExperienceDetails);
// // //     };

// // //     return (
// // //         <div className="flex-col w-screen ml-80 p-4">
// // //             <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => navigate("/studentdetails")}>Back</button>
// // //             <h1>Add Student</h1>
// // //             <form className="student-form" onSubmit={handleAddStudent}>

// // //                 <div className="form-group">
// // //                     <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
// // //                     <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
// // //                     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
// // //                     <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
// // //                 </div><br/>

// // //                 <div className="form-group">
// // //                     <h3>Date of Birth</h3>
// // //                     <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
// // //                 </div><br/>

// // //                 <div className="form-group">
// // //                     <h3>Residential Address</h3>
// // //                     <input type="text" placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}/>
// // //                     <input type="text" placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
// // //                     <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
// // //                     <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
// // //                     <input type="text" placeholder="Zip Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
// // //                     <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
// // //                 </div><br/>

// // //                 <div className="form-group">
// // //                     <h3>Billing Address</h3>
// // //                     <label> <input type="checkbox" checked={copyAddress} onChange={(e) => handleCopyAddress(e.target.checked)} />Same as Residential Address </label>
// // //                     <input type="text" placeholder="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}/>
// // //                     <input type="text" placeholder="Area" value={billingAddress.area} onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })} />
// // //                     <input type="text" placeholder="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
// // //                     <input type="text" placeholder="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
// // //                     <input type="text" placeholder="Zip Code" value={billingAddress.zip} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
// // //                     <input type="text" placeholder="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} />
// // //                     <input type="text" placeholder="GST No." value={billingAddress.gstNo} onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })} />
// // //                 </div><br/>

// // //                 <div>
// // //                     <h3>Educational Details</h3>
// // //                     {educationDetails.map((edu, index) => (
// // //                         <div key={index} className="education-group">
// // //                             <select value={edu.level} onChange={(e) => handleEducationChange(index, 'level', e.target.value)}>
// // //                                 <option value="" disabled>Select Level</option>
// // //                                 <option value="School">School</option>
// // //                                 <option value="UG">UG</option>
// // //                                 <option value="PG">PG</option>
// // //                             </select>
// // //                             <input type="text" placeholder="Institute Name" value={edu.institute} onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}/>
// // //                             <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} required />
// // //                             <input type="text" placeholder="Specialization" value={edu.specialization} onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)} />
// // //                             <input type="text" placeholder="Grade" value={edu.grade} onChange={(e) => handleEducationChange(index, 'grade', e.target.value)} />
// // //                             <input type="number" placeholder="Passing Year" value={edu.passingyr} onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)} />
// // //                             <button type="button" onClick={() => deleteEducation(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
// // //                                 <FontAwesomeIcon icon={faXmark} />
// // //                             </button>
// // //                         </div>
// // //                     ))}
// // //                     <button type="button" onClick={addEducation} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Education</button>
// // //                 </div><br/>

// // //                 <div>
// // //                     <h3>Experience Details</h3>
// // //                     {experienceDetails.map((experience, index) => (
// // //                         <div key={index} className="experience-group">
// // //                             <input type="text" placeholder="Company Name" value={experience.companyName} onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}/>
// // //                             <input type="text" placeholder="Designation" value={experience.designation} onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)} />
// // //                             <input type="text" placeholder="Salary" value={experience.salary} onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}/>
// // //                             <input type="text" placeholder="Description" value={experience.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}/>
// // //                             <button type="button" onClick={() => deleteExperience(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
// // //                                 <FontAwesomeIcon icon={faXmark} />
// // //                             </button>
// // //                         </div>
// // //                     ))}
// // //                     <button type="button" onClick={addExperience} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Experience</button>
// // //                 </div><br/>

// // //                 <div>
// // //                     <h3>Course Details</h3>
// // //                     {courseDetails.map((course, index) => (
// // //                         <div key={index} className="course-group">
// // //                             <select value={course.courseName} onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}>
// // //                                 <option value="">Select Course</option>
// // //                                 <option value="Full Stack Development (MERN)">Full Stack Development (MERN)</option>
// // //                                 <option value="Full Stack Development (Python)">Full Stack Development (Python)</option>
// // //                                 <option value="Data Science">Data Science</option>
// // //                             </select>
// // //                             <select value={course.batch} onChange={(e) => handleCourseChange(index, 'batch', e.target.value)}>
// // //                                 <option value="">Select Batch</option>
// // //                                 <option value="Full Time">Full Time</option>
// // //                                 <option value="Weekend">Weekend</option>
// // //                             </select>
// // //                             <select value={course.branch} onChange={(e) => handleCourseChange(index, 'branch', e.target.value)}>
// // //                                 <option value="">Select Branch</option>
// // //                                 <option value="Mate Sq.">Mate SQ</option>
// // //                                 <option value="Nandanwan">Nandanwan</option>
// // //                                 <option value="Sadar">Sadar</option>
// // //                             </select>
// // //                             <select value={course.mode} onChange={(e) => handleCourseChange(index, 'mode', e.target.value)}>
// // //                                 <option value="">Select Mode</option>
// // //                                 <option value="Online">Online</option>
// // //                                 <option value="Offline">Offline</option>
// // //                             </select>
// // //                             <button type="button" onClick={() => deleteCourse(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
// // //                                 <FontAwesomeIcon icon={faXmark} />
// // //                             </button>
// // //                         </div>
// // //                     ))}
// // //                     <button type="button" onClick={addCourse} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Course</button>
// // //                 </div><br/>

// // //                 <div className="form-group">
// // //                     <h3>Status of Student</h3>
// // //                     <select value={status} onChange={(e) => setStatus(e.target.value)} required>
// // //                         <option value="">Select Status</option>
// // //                         <option value="enquiry">Enquiry</option>
// // //                         <option value="enrolled">Enrolled</option>
// // //                         <option value="inactive">Inactive</option>
// // //                         <option value="completed">Completed</option>
// // //                     </select>
// // //                 </div><br/>

// // //                 <div>
// // //                     <h3>Admission Date</h3>
// // //                     <input type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
// // //                 </div><br/>

// // //                 <div>
// // //                     <h3>Enrollment Goals</h3>
// // //                     <select value={goal} onChange={(e) => setGoal(e.target.value)}>
// // //                         <option value="">Select Goal</option>
// // //                         <option value="upskilling">Upskilling</option>
// // //                         <option value="placement">Placement</option>
// // //                         <option value="career_switch">Career Switch</option>
// // //                     </select>
// // //                 </div><br/>

// // //                 <div>
// // //                     <h3>Installment Details</h3>
// // //                     {installmentDetails.map((installment, index) => (
// // //                         <div key={index} className="installment-group">
// // //                             <input type="number" placeholder="No. of Installments" value={installment.number} onChange={(e) => handleInstallmentChange(index, 'number', e.target.value)} />
// // //                             <input type="date" placeholder="Due Date" value={installment.dueDate} onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)} />
// // //                             <input type="number" placeholder="Amount" value={installment.dueAmount} onChange={(e) => handleInstallmentChange(index, 'dueAmount', e.target.value)} />
// // //                             <button type="button" onClick={() => deleteInstallment(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
// // //                                 <FontAwesomeIcon icon={faXmark} />
// // //                             </button>
// // //                         </div>
// // //                     ))}
// // //                     <button type="button" onClick={addInstallment} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Installment</button>
// // //                 </div><br/>

                

// // //                 <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => navigate(`/studentdetails`)} >Add Student</button>
// // //             </form>
// // //         </div>
// // //     );
// // // };

























// // import React, { useState, useEffect } from "react";
// // import { db } from "../config/firebase";
// // import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

// // export default function InstallmentReport() {
// //     const [installments, setInstallments] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [filter, setFilter] = useState("thisMonth");

// //     useEffect(() => {
// //         const fetchAllInstallments = async () => {
// //             try {
// //                 const studentsQuery = query(collection(db, "student"));
// //                 const studentsSnapshot = await getDocs(studentsQuery);
// //                 const allInstallments = [];

// //                 for (const studentDoc of studentsSnapshot.docs) {
// //                     const installmentsRef = collection(db, "student", studentDoc.id, "installments");
// //                     const installmentsSnapshot = await getDocs(installmentsRef);

// //                     installmentsSnapshot.forEach((installmentDoc) => {
// //                         allInstallments.push({
// //                             id: installmentDoc.id,
// //                             studentId: studentDoc.id,
// //                             studentData: studentDoc.data(),
// //                             ...installmentDoc.data(),
// //                         });
// //                     });
// //                 }

// //                 setInstallments(allInstallments);
// //                 setLoading(false);
// //             } catch (error) {
// //                 console.error("Error fetching installments:", error);
// //                 setLoading(false);
// //             }
// //         };

// //         fetchAllInstallments();
// //     }, []);

// //     const handleUpdate = async (installment, field, value) => {
// //         try {
// //             const updates = { [field]: value };
// //             const installmentRef = doc(db, "student", installment.studentId, "installments", installment.id);
// //             await updateDoc(installmentRef, updates);

// //             setInstallments(prev => prev.map(item =>
// //                 item.id === installment.id ? { ...item, ...updates } : item
// //             ));
// //         } catch (error) {
// //             console.error("Error updating installment:", error);
// //         }
// //     };

// //     const filterInstallments = () => {
// //         // ... keep existing filter logic unchanged ...
// //         const now = new Date();
// //         let startDate, endDate;

// //         switch (filter) {
// //             case "thisMonth":
// //                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
// //                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// //                 break;
// //             case "lastMonth":
// //                 startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// //                 endDate = new Date(now.getFullYear(), now.getMonth(), 0);
// //                 break;
// //             case "nextMonth":
// //                 startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
// //                 endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
// //                 break;
// //             case "thisYear":
// //                 startDate = new Date(now.getFullYear(), 0, 1);
// //                 endDate = new Date(now.getFullYear(), 11, 31);
// //                 break;
// //             case "lastYear":
// //                 startDate = new Date(now.getFullYear() - 1, 0, 1);
// //                 endDate = new Date(now.getFullYear() - 1, 11, 31);
// //             case "all":
// //                 startDate = new Date(0);
// //                 endDate = new Date();
// //             default:
// //                 return installments;
// //         };

// //         if (loading) return <div>Loading installments...</div>;

// //         const filteredInstallments = filterInstallments();
// //         const totalAmount = filteredInstallments.reduce((acc, installment) => acc + Number(installment.dueAmount), 0);

// //         return (
// //             <div className="flex-col w-screen ml-80 p-4">
// //                 <h1 className="text-2xl font-bold mb-4">Installment Report</h1>

// //                 <div className="mb-4">
// //                     <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
// //                         <option value="thisMonth">This Month</option>
// //                         <option value="lastMonth">Last Month</option>
// //                         <option value="nextMonth">Next Month</option>
// //                         <option value="thisYear">This Year</option>
// //                     </select>
// //                 </div>

// //                 <div className="overflow-x-auto">
// //                     <table className="table-auto w-full">
// //                         <thead>
// //                             <tr className="bg-gray-200">
// //                                 <th className="px-4 py-2">Student Name</th>
// //                                 <th className="px-4 py-2">Installment No</th>
// //                                 <th className="px-4 py-2">Due Date</th>
// //                                 <th className="px-4 py-2">Amount</th>
// //                                 <th className="px-4 py-2">Status</th>
// //                                 <th className="px-4 py-2">Paid Date</th>
// //                                 <th className="px-4 py-2">Received By</th>
// //                                 <th className="px-4 py-2">Remarks</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {filteredInstallments.map((installment) => {
// //                                 const dueDate = installment.dueDate instanceof Timestamp
// //                                     ? installment.dueDate.toDate()
// //                                     : new Date(installment.dueDate);

// //                                 const paidDate = installment.paidDate instanceof Timestamp
// //                                     ? installment.paidDate.toDate()
// //                                     : installment.paidDate ? new Date(installment.paidDate) : null;

// //                                 return (
// //                                     <tr key={installment.id} className="border-b">
// //                                         <td className="px-4 py-2 text-center">
// //                                             {installment.studentData.first_name} {installment.studentData.last_name}
// //                                         </td>
// //                                         <td className="px-4 py-2 text-center">{installment.number}</td>
// //                                         <td className="px-4 py-2 text-center">
// //                                             {dueDate.toLocaleDateString()}
// //                                         </td>
// //                                         <td className="px-4 py-2 text-center">₹{installment.dueAmount}</td>
// //                                         <td className="px-4 py-2 text-center">
// //                                             <select
// //                                                 value={installment.paid ? "Paid" : "Pending"}
// //                                                 onChange={(e) => handleUpdate(
// //                                                     installment,
// //                                                     "paid",
// //                                                     e.target.value === "Paid"
// //                                                 )}
// //                                                 className="p-1 border rounded"
// //                                             >
// //                                                 <option value="Pending">Pending</option>
// //                                                 <option value="Paid">Paid</option>
// //                                             </select>
// //                                         </td>
// //                                         <td className="px-4 py-2 text-center">
// //                                             <input
// //                                                 type="date"
// //                                                 value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// //                                                 onChange={(e) => handleUpdate(
// //                                                     installment,
// //                                                     "paidDate",
// //                                                     Timestamp.fromDate(new Date(e.target.value))
// //                                                 )}
// //                                                 className="p-1 border rounded"
// //                                                 disabled={!installment.paid}
// //                                             />
// //                                         </td>

// //                                         <td className="px-4 py-2 text-center">
// //                                             <input
// //                                                 type="text"
// //                                                 value={installment.receivedBy || ""}
// //                                                 onChange={(e) => handleUpdate(
// //                                                     installment, // Corrected: Use 'installment' here
// //                                                     "receivedBy",
// //                                                     e.target.value
// //                                                 )}
// //                                                 className="p-1 border rounded w-32"
// //                                                 disabled={!installment.paid}
// //                                             />
// //                                         </td>

// //                                          {/* <td className="px-4 py-2 text-center">
// //                                              <input
// //                                                  type="text"
// //                                                  value={installment.receivedBy || ""}
// //                                                  onChange={(e) => handleUpdate(
// //                                                      installment,
// //                                                      "receivedBy",
// //                                                      e.target.value
// //                                                  )}
// //                                                  className="p-1 border rounded w-32"
// //                                                  disabled={!installment.paid}
// //                                              />
// //                                          </td> */}
                                        
// //                                         <td className="px-4 py-2 text-center">
// //                                                 <input
// //                                                     type="text"
// //                                                     value={installment.remarks || ""}
// //                                                     onChange={(e) => handleUpdate(
// //                                                         installment,
// //                                                         "remarks",
// //                                                         e.target.value
// //                                                     )}
// //                                                     className="p-1 border rounded w-48"
// //                                                 />
// //                                             </td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                             <tr className="bg-gray-100">
// //                                 <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
// //                                 <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// //                                 <td colSpan="3"></td>
// //                             </tr>
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         );
// //     }









// // import { useState, useEffect } from "react";
// // import { db } from '../../../config/firebase'
// // import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// // import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

// // export default function Instructor() {
// //     const [instructorList, setInstructorList] = useState([]);
// //     const [searchTerm, setSearchTerm] = useState("");

// //     const [openAddInstructor, setOpenAddInstructor] = useState(false);
// //     const [instructorFname, setInstructorFname] = useState("");
// //     const [instructorLname, setInstructorLname] = useState("");
// //     const [instructorEmail, setInstructorEmail] = useState("");
// //     const [instructorPhone, setInstructorPhone] = useState("");
// //     const [instructorSpecialization, setInstructorSpecialization] = useState("");


// //     const [centers, setCenters] = useState([]);

// //     const [openDelete, setOpenDelete] = useState(false);
// //     const [deleteId, setDeleteId] = useState(null);

// //     const [openUpdate, setOpenUpdate] = useState(false);
// //     const [updatingInstructorId, setUpdatingInstructorId] = useState("");
// //     const [updatedFname, setUpdatedFname] = useState("");
// //     const [updatedLname, setUpdatedLname] = useState("");
// //     const [updatedEmail, setUpdatedEmail] = useState("");
// //     const [updatedPhone, setUpdatedPhone] = useState("");
// //     const [updatedSpecialization, setUpdatedSpecialization] = useState("");

// //     const instructorCollectionRef = collection(db, "Instructor");

// //     const getInstructorList = async () => {
// //         try {
// //             const data = await getDocs(instructorCollectionRef);
// //             setInstructorList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     useEffect(() => {
// //         getInstructorList();

// //     }, []);

// //     const handleOpenAddInstructor = () => {
// //         setOpenAddInstructor(true);
// //     };

// //     const handleCloseAddInstructor = () => {
// //         setOpenAddInstructor(false);
// //         setInstructorFname("");
// //         setInstructorLname("");
// //         setInstructorEmail("");
// //         setInstructorPhone("");
// //         setInstructorSpecialization("");

// //     };

// //     const handleSubmitInstructor = async () => {
// //         if (!instructorFname || !instructorLname || !instructorEmail || !instructorPhone || !instructorSpecialization) {
// //             alert("Please fill all fields.");
// //             return;
// //         }

// //         try {
// //             await addDoc(instructorCollectionRef, {
// //                 f_name: instructorFname,
// //                 l_name: instructorLname,
// //                 email: instructorEmail,
// //                 phone: instructorPhone,
// //                 specialization: instructorSpecialization
// //             });

// //             getInstructorList();
// //             handleCloseAddInstructor();
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     const handleOpenDelete = (id) => {
// //         setDeleteId(id);
// //         setOpenDelete(true);
// //     };

// //     const handleDelete = async () => {
// //         if (deleteId) {
// //             try {
// //                 await deleteDoc(doc(db, "Instructor", deleteId));
// //                 getInstructorList();
// //             } catch (err) {
// //                 console.error("Error deleting instructor:", err);
// //             }
// //         }
// //         setOpenDelete(false);
// //     };

// //     const handleOpenUpdate = (instructor) => {
// //         setUpdatingInstructorId(instructor.id);
// //         setUpdatedFname(instructor.f_name);
// //         setUpdatedLname(instructor.l_name);
// //         setUpdatedEmail(instructor.email);
// //         setUpdatedPhone(instructor.phone);
// //         setUpdatedSpecialization(instructor.specialization);
// //         setOpenUpdate(true);
// //     };

// //     const handleUpdate = async () => {
// //         if (updatingInstructorId) {
// //             try {
// //                 await updateDoc(doc(db, "Instructor", updatingInstructorId), {
// //                     f_name: updatedFname,
// //                     l_name: updatedLname,
// //                     email: updatedEmail,
// //                     phone: updatedPhone,
// //                     specialization: updatedSpecialization,
// //                 });

// //                 getInstructorList();
// //                 setOpenUpdate(false);
// //             } catch (error) {
// //                 console.error("Error updating instructor:", error);
// //             }
// //         }
// //     };

// //     const filteredInstructors = instructorList.filter((instructor) => {
// //         const fullName = `${instructor.f_name} ${instructor.l_name}`.toLowerCase();
// //         return (
// //             fullName.includes(searchTerm.toLowerCase()) ||
// //             instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             instructor.phone.toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //     });

// //     return (
// //         <div className="flex-col w-screen ml-80 p-4">
// //             <h1 className="text-2xl font-bold mb-4">Admins & Instructors</h1>
// //             <p className="text-gray-600 mb-6">Create and manage users with different roles on the platform.</p>

// //             <div className="flex items-center justify-between mb-4">
// //                 <input
// //                     type="text"
// //                     placeholder="Search by Name, Email, Mobile..."
// //                     className="p-2 border border-gray-300 rounded-lg w-1/3"
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //                 <button onClick={handleOpenAddInstructor} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
// //                     + Add Instructor
// //                 </button>
// //             </div>

// //             <div className="space-y-4">
// //                 {filteredInstructors.map((instructor) => (
// //                     <div key={instructor.id} className="border p-4 rounded-lg shadow">
// //                         <h2 className="text-lg font-semibold">{instructor.f_name} {instructor.l_name}</h2>
// //                         <p className="text-gray-600">{instructor.email}</p>
// //                         <p className="text-gray-600">{instructor.phone}</p>
// //                         <p className="text-gray-600">{instructor.specialization}</p>
// //                         <div className="flex items-center space-x-2 mt-2">
// //                             <button onClick={() => handleOpenDelete(instructor.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
// //                                 Delete
// //                             </button>
// //                             <button onClick={() => handleOpenUpdate(instructor)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
// //                                 Update
// //                             </button>
// //                         </div>
// //                     </div>
// //                 ))}

// //                 <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
// //                     <DialogHeader>Confirm Deletion</DialogHeader>
// //                     <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
// //                     <DialogFooter>
// //                         <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
// //                         <Button variant="filled" color="red" onClick={handleDelete}>Yes, Delete</Button>
// //                     </DialogFooter>
// //                 </Dialog>

// //                 {/* Update Instructor Modal */}
// //                 <Dialog open={openUpdate} handler={() => setOpenUpdate(false)}>
// //                     <DialogHeader>Update Instructor</DialogHeader>
// //                     <DialogBody>
// //                         <div className="grid grid-cols-1 gap-4">
// //                             <Input label="First Name" value={updatedFname} onChange={(e) => setUpdatedFname(e.target.value)} />
// //                             <Input label="Last Name" value={updatedLname} onChange={(e) => setUpdatedLname(e.target.value)} />
// //                             <Input label="Email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
// //                             <Input label="Phone" value={updatedPhone} onChange={(e) => setUpdatedPhone(e.target.value)} />
// //                             <Input label="Specialization" value={updatedSpecialization} onChange={(e) => setUpdatedSpecialization(e.target.value)} />
// //                         </div>
// //                     </DialogBody>
// //                     <DialogFooter>
// //                         <Button variant="text" color="gray" onClick={() => setOpenUpdate(false)}>Cancel</Button>
// //                         <Button variant="filled" color="green" onClick={handleUpdate}>Update</Button>
// //                     </DialogFooter>
// //                 </Dialog>
// //             </div>

// //             <Dialog open={openAddInstructor} handler={handleCloseAddInstructor}>
// //                 <DialogHeader>Add Instructor</DialogHeader>
// //                 <DialogBody>
// //                     <div className="grid grid-cols-1 gap-4">
// //                         <Input label="First Name" value={instructorFname} onChange={(e) => setInstructorFname(e.target.value)} />
// //                         <Input label="Last Name" value={instructorLname} onChange={(e) => setInstructorLname(e.target.value)} />
// //                         <Input label="Email" value={instructorEmail} onChange={(e) => setInstructorEmail(e.target.value)} />
// //                         <Input label="Phone" value={instructorPhone} onChange={(e) => setInstructorPhone(e.target.value)} />
// //                         <Input label="Specialization" value={instructorSpecialization} onChange={(e) => setInstructorSpecialization(e.target.value)} />
// //                     </div>
// //                 </DialogBody>
// //                 <DialogFooter>
// //                     <Button variant="text" color="gray" onClick={handleCloseAddInstructor}>Cancel</Button>
// //                     <Button variant="filled" color="green" onClick={handleSubmitInstructor}>Add Instructor</Button>
// //                 </DialogFooter>
// //             </Dialog>
// //         </div>
// //     );
// // }












// // // // import React, { useState, useEffect } from 'react';
// // // // import { FaTimes } from 'react-icons/fa';
// // // // import { db } from '../../../../config/firebase';
// // // // import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // import { useNavigate } from "react-router-dom";

// // // // const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
// // // //     const navigate = useNavigate();
// // // //     const [batchName, setBatchName] = useState('');
// // // //     const [curriculums, setCurriculums] = useState([]);
// // // //     const [batchDuration, setBatchDuration] = useState('');
// // // //     const [batchManager, setBatchManager] = useState([]);
// // // //     const [batchFaculty, setBatchFaculty] = useState([]);
// // // //     const [student, setStudents] = useState([]);

// // // //     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
// // // //     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);

// // // //     const handleManagerSelection = (id) => {
// // // //         setSelectedBatchManagers(prev =>
// // // //             prev.includes(id) ? prev.filter(managerId => managerId !== id) : [...prev, id]
// // // //         );
// // // //     };

// // // //     const handleFacultySelection = (id) => {
// // // //         setSelectedBatchFaculty(prev =>
// // // //             prev.includes(id) ? prev.filter(facultyId => facultyId !== id) : [...prev, id]
// // // //         );
// // // //     };


// // // //     useEffect(() => {
// // // //         const fetchFaculty = async () => {
// // // //             const snapshot = await getDocs(collection(db, "Instructor")); // Fetch instructors from Firestore
// // // //             const instructorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //             setBatchFaculty(instructorData); // ✅ Set the faculty state correctly
// // // //         };

// // // //         fetchFaculty(); // Call the function to fetch instructors

// // // //         const fetchManager = async () => {
// // // //             const snapshot = await getDocs(collection(db, "Instructor")); // Fetch managers from Firestore
// // // //             const managerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //             setBatchManager(managerData); // ✅ Fix: Set managers instead of faculty
// // // //         };

// // // //         fetchManager();

// // // //         const fetchCurriculum = async () => {
// // // //             const snapshot = await getDocs(collection(db, "Curriculum"));
// // // //             const curriculumData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //             setCurriculums(curriculumData);
// // // //         };

// // // //         fetchCurriculum();

// // // //         const fetchStudent = async () => {
// // // //             const snapshot = await getDocs(collection(db, "student"));
// // // //             const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //             setStudents(studentData);
// // // //         };

// // // //         fetchStudent();

// // // //         if (batch) {
// // // //             setBatchName(batch.name);
// // // //             setBatchDuration(batch.duration);
// // // //         } else {
// // // //             setBatchName("");
// // // //             setBatchDuration("");
// // // //         }
// // // //     }, [batch]);

// // // //     const batchCollectionRef = collection(db, "Batch");


// // // //     const onSubmitBatch = async (e) => {
// // // //     e.preventDefault();

// // // //     if (!batchName.trim() || !batchDuration.trim()) {
// // // //         alert("Please fill in all required fields");
// // // //         return;
// // // //     }

// // // //     try {
// // // //         let batchId;
// // // //         if (batch) {
// // // //             const batchDoc = doc(db, "Batch", batch.id);
// // // //             await updateDoc(batchDoc, {
// // // //                 name: batchName,
// // // //                 duration: batchDuration,
// // // //             });

// // // //             batchId = batch.id;
// // // //         } else {
// // // //             const docRef = await addDoc(batchCollectionRef, {
// // // //                 name: batchName,
// // // //                 duration: batchDuration,
// // // //             });

// // // //             batchId = docRef.id;
// // // //         }

// // // //         alert("Batch successfully saved!");

// // // //         // ✅ Reset Form State
// // // //         setBatchName("");
// // // //         setBatchDuration("");
// // // //         setSelectedBatchManagers([]);
// // // //         setSelectedBatchFaculty([]);

// // // //         toggleSidebar();
// // // //         navigate(`/batches`);
// // // //     } catch (err) {
// // // //         console.error("Error adding document:", err);
// // // //         alert(`Error adding batch: ${err.message}`);
// // // //     }
// // // // }

// // // //     return (
// // // //         <>
// // // //             <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
// // // //                 <button type="button" className="close-button" onClick={toggleSidebar}>
// // // //                     Back
// // // //                 </button>

// // // //                 <h1>{batch ? "Edit batch" : "Create batch"}</h1>
// // // //                 <form onSubmit={onSubmitBatch}>
// // // //                     <div className="col-md-4">
// // // //                         <div className="mb-3 subfields">
// // // //                             <label htmlFor="batch_name" className="form-label">Batch Name</label>
// // // //                             <input type="text" className="form-control" value={batchName} placeholder="Batch Name" onChange={(e) => setBatchName(e.target.value)} required />
// // // //                         </div>


// // // //                         <div className="mb-3 subfields">
// // // //                             <label htmlFor="duration" className="form-label">Batch Duration</label>
// // // //                             <input type="text" className="form-control" value={batchDuration} placeholder="Enter Batch Duration" onChange={(e) => setBatchDuration(e.target.value)} required />
// // // //                         </div>


// // // //                         <div className="mb-3 subfields">
// // // //                             <label className="form-label">Select Curriculum</label>
// // // //                             {curriculums.map(curriculum => (
// // // //                                 <div key={curriculum.id} className="form-check">
// // // //                                     <input
// // // //                                         className="form-check-input"
// // // //                                         type="checkbox"
// // // //                                         value={curriculum.id}
// // // //                                         id={`curriculum-${curriculum.id}`}
// // // //                                     />
// // // //                                     <label className="form-check-label" htmlFor={`curriculum-${curriculum.id}`}>
// // // //                                         {curriculum.name} {/* Assuming instructor has a name field */}
// // // //                                     </label>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>


// // // //                         <div className="mb-3 subfields">
// // // //                             <label className="form-label">Batch Manager</label>
// // // //                             {batchManager.map(manager => (
// // // //                                 <div key={manager.id} className="form-check">
// // // //                                     <input
// // // //                                         className="form-check-input"
// // // //                                         type="checkbox"
// // // //                                         checked={selectedBatchManagers.includes(manager.id)}
// // // //                                         onChange={() => handleManagerSelection(manager.id)}
// // // //                                         id={`manager-${manager.id}`}
// // // //                                     />
// // // //                                     <label className="form-check-label" htmlFor={`manager-${manager.id}`}>
// // // //                                         {manager.f_name} {manager.l_name}
// // // //                                     </label>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>


// // // //                         <div className="mb-3 subfields">
// // // //                             <label className="form-label">Batch Faculty</label>
// // // //                             {batchFaculty.map(instructor => (
// // // //                                 <div key={instructor.id} className="form-check">
// // // //                                     <input
// // // //                                         className="form-check-input"
// // // //                                         type="checkbox"
// // // //                                         value={instructor.id}
// // // //                                         id={`instructor-${instructor.id}`}
// // // //                                     />
// // // //                                     <label className="form-check-label" htmlFor={`instructor-${instructor.id}`}>
// // // //                                         {instructor.f_name} {/* Assuming instructor has a name field */}
// // // //                                     </label>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>

// // // //                         <div className="mb-3 subfields">
// // // //                             <label className="form-label">Select Student</label>
// // // //                             {student.map(student => (
// // // //                                 <div key={student.id} className="form-check">
// // // //                                     <input
// // // //                                         className="form-check-input"
// // // //                                         type="checkbox"
// // // //                                         value={student.id}
// // // //                                         id={`student-${student.id}`}
// // // //                                     />
// // // //                                     <label className="form-check-label" htmlFor={`student-${student.id}`}>
// // // //                                         {student.first_name} {/* Assuming instructor has a name field */}
// // // //                                     </label>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>



// // // //                         <div className="d-grid gap-2 d-md-flex">
// // // //                             <button type="submit">
// // // //                                 {batch ? "Update" : "Create"}
// // // //                             </button>
// // // //                         </div>
// // // //                     </div>
// // // //                 </form>
// // // //             </div>
// // // //         </>
// // // //     );
// // // // };

// // // // export default CreateBatches;


// // // import React, { useState, useEffect } from 'react';
// // // import { db } from '../../../../config/firebase';
// // // import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// // // import { useNavigate } from "react-router-dom";

// // // const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
// // //     const navigate = useNavigate();
// // //     const [batchName, setBatchName] = useState('');
// // //     const [curriculums, setCurriculums] = useState([]);
// // //     const [batchDuration, setBatchDuration] = useState('');
// // //     const [batchManager, setBatchManager] = useState([]);
// // //     const [batchFaculty, setBatchFaculty] = useState([]);
// // //     const [students, setStudents] = useState([]);
// // //     const [center, setCenter] = useState([]);

// // //     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
// // //     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
// // //     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
// // //     const [selectedStudents, setSelectedStudents] = useState([]);
// // //     const [selectedCenter, setSelectedCenter] = useState([]);

// // //     const handleSelection = (id, setter, selected) => {
// // //         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
// // //     };

// // //     useEffect(() => {
// // //         const fetchData = async () => {
// // //             const fetchCollection = async (collectionName, setter) => {
// // //                 const snapshot = await getDocs(collection(db, collectionName));
// // //                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// // //             };

// // //             await fetchCollection("Instructor", setBatchFaculty);
// // //             await fetchCollection("Instructor", setBatchManager);
// // //             await fetchCollection("Curriculum", setCurriculums);
// // //             await fetchCollection("student", setStudents);
// // //             await fetchCollection("Centers, setCenter");
// // //         };

// // //         fetchData();

// // //         if (batch) {
// // //             setBatchName(batch.name);
// // //             setBatchDuration(batch.duration);
// // //             setSelectedBatchManagers(batch.managers || []);
// // //             setSelectedBatchFaculty(batch.faculty || []);
// // //             setSelectedCurriculums(batch.curriculums || []);
// // //             setSelectedStudents(batch.students || []);
// // //             setSelectedCenter(batch.Centers ||[]);
// // //         } else {
// // //             setBatchName("");
// // //             setBatchDuration("");
// // //         }
// // //     }, [batch]);

// // //     const batchCollectionRef = collection(db, "Batch");

// // //     const onSubmitBatch = async (e) => {
// // //         e.preventDefault();
// // //         if (!batchName.trim() || !batchDuration.trim()) {
// // //             alert("Please fill in all required fields");
// // //             return;
// // //         }

// // //         try {
// // //             let batchId;
// // //             const batchData = {
// // //                 name: batchName,
// // //                 duration: batchDuration,
// // //                 managers: selectedBatchManagers,
// // //                 faculty: selectedBatchFaculty,
// // //                 curriculums: selectedCurriculums,
// // //                 students: selectedStudents,
// // //                 center: selectedCenter
// // //             };

// // //             if (batch) {
// // //                 const batchDoc = doc(db, "Batch", batch.id);
// // //                 await updateDoc(batchDoc, batchData);
// // //                 batchId = batch.id;
// // //             } else {
// // //                 const docRef = await addDoc(batchCollectionRef, batchData);
// // //                 batchId = docRef.id;
// // //             }

// // //             alert("Batch successfully saved!");
// // //             setBatchName("");
// // //             setBatchDuration("");
// // //             setSelectedBatchManagers([]);
// // //             setSelectedBatchFaculty([]);
// // //             setSelectedCurriculums([]);
// // //             setSelectedStudents([]);
// // //             setSelectedCenter([]);
// // //             toggleSidebar();
// // //             navigate(`/batches`);
// // //         } catch (err) {
// // //             console.error("Error adding document:", err);
// // //             alert(`Error adding batch: ${err.message}`);
// // //         }
// // //     };

// // //     return (
// // //         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
// // //             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
// // //             <h1>{batch ? "Edit batch" : "Create batch"}</h1>
// // //             <form onSubmit={onSubmitBatch}>
// // //                 <div className="mb-3">
// // //                     <label>Batch Name</label>
// // //                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     <label>Batch Duration</label>
// // //                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     <label>Select Curriculum</label>
// // //                     {curriculums.map(curriculum => (
// // //                         <div key={curriculum.id}>
// // //                             <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
// // //                             {curriculum.name}
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     <label>Batch Manager</label>
// // //                     {batchManager.map(manager => (
// // //                         <div key={manager.id}>
// // //                             <input type="checkbox" checked={selectedBatchManagers.includes(manager.id)} onChange={() => handleSelection(manager.id, setSelectedBatchManagers, selectedBatchManagers)} />
// // //                             {manager.f_name} {manager.l_name}
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     <label>Batch Faculty</label>
// // //                     {batchFaculty.map(instructor => (
// // //                         <div key={instructor.id}>
// // //                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
// // //                             {instructor.f_name}
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     <label>Select Student</label>
// // //                     {students.map(student => (
// // //                         <div key={student.id}>
// // //                             <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleSelection(student.id, setSelectedStudents, selectedStudents)} />
// // //                             {student.first_name}
// // //                         </div>
// // //                     ))}
// // //                 </div>


// // //                 <div className='mb-3'>
// // //                     <label>Select Center</label>
// // //                     {center.map(center=>{
// // //                         <div key={center.id}>
// // //                             <input type="checkbox" checked={selectedCenter.includes(center.id)} onChannge={()=>handleSelection(center.id, setSelectedCenter, selectedCenter)} />
// // //                             {center.name}
// // //                         </div>
// // //                     })}
// // //                 </div>
// // //                 <button type="submit">{batch ? "Update" : "Create"}</button>
// // //             </form>
// // //         </div>
// // //     );
// // // };

// // // export default CreateBatches;


// // import React, { useState, useEffect } from 'react';
// // import { db } from '../../../../config/firebase';
// // import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// // import { useNavigate } from "react-router-dom";

// // const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
// //     const navigate = useNavigate();
// //     const [batchName, setBatchName] = useState('');
// //     const [curriculums, setCurriculums] = useState([]);
// //     const [batchDuration, setBatchDuration] = useState('');
// //     const [batchManager, setBatchManager] = useState([]);
// //     const [batchFaculty, setBatchFaculty] = useState([]);
// //     const [students, setStudents] = useState([]);
// //     const [centers, setCenters] = useState([]);  // Fixed: Center to Centers
// //     const [loading, setLoading] = useState(true);

// //     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
// //     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
// //     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
// //     const [selectedStudents, setSelectedStudents] = useState([]);
// //     const [selectedCenters, setSelectedCenters] = useState([]); // Fixed: Center to Centers

// //     const handleSelection = (id, setter, selected) => {
// //         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
// //     };

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             const fetchCollection = async (collectionName, setter) => {
// //                 const snapshot = await getDocs(collection(db, collectionName));
// //                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// //             };

// //             await fetchCollection("Instructor", setBatchFaculty);
// //             await fetchCollection("Instructor", setBatchManager);
// //             await fetchCollection("Curriculum", setCurriculums);
// //             await fetchCollection("student", setStudents);
// //             await fetchCollection("Centers", setCenters); // Fixed the collection name
// //         };

// //         fetchData();

// //         if (batch) {
// //             setBatchName(batch.name);
// //             setBatchDuration(batch.duration);
// //             setSelectedBatchManagers(batch.managers || []);
// //             setSelectedBatchFaculty(batch.faculty || []);
// //             setSelectedCurriculums(batch.curriculums || []);
// //             setSelectedStudents(batch.students || []);
// //             setSelectedCenters(batch.centers || []);
// //         } else {
// //             setBatchName("");
// //             setBatchDuration("");
// //         }
// //     }, [batch]);

// //     const batchCollectionRef = collection(db, "Batch");

// //     const onSubmitBatch = async (e) => {
// //         e.preventDefault();
// //         if (!batchName.trim() || !batchDuration.trim()) {
// //             alert("Please fill in all required fields");
// //             return;
// //         }

// //         try {
// //             let batchId;
// //             const batchData = {
// //                 name: batchName,
// //                 duration: batchDuration,
// //                 managers: selectedBatchManagers,
// //                 faculty: selectedBatchFaculty,
// //                 curriculums: selectedCurriculums,
// //                 students: selectedStudents,
// //                 centers: selectedCenters // Fixed: Center to Centers
// //             };

// //             if (batch) {
// //                 const batchDoc = doc(db, "Batch", batch.id);
// //                 await updateDoc(batchDoc, batchData);
// //                 batchId = batch.id;
// //             } else {
// //                 const docRef = await addDoc(batchCollectionRef, batchData);
// //                 batchId = docRef.id;
// //             }

// //             alert("Batch successfully saved!");
// //             setBatchName("");
// //             setBatchDuration("");
// //             setSelectedBatchManagers([]);
// //             setSelectedBatchFaculty([]);
// //             setSelectedCurriculums([]);
// //             setSelectedStudents([]);
// //             setSelectedCenters([]); // Fixed: Center to Centers
// //             toggleSidebar();
// //             navigate(`/batches`);
// //         } catch (err) {
// //             console.error("Error adding document:", err);
// //             alert(`Error adding batch: ${err.message}`);
// //         }
// //     };

// //     return (
// //         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
// //             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
// //             <h1>{batch ? "Edit batch" : "Create batch"}</h1>
// //             <form onSubmit={onSubmitBatch}>
// //                 <div className="mb-3">
// //                     <label>Batch Name</label>
// //                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
// //                 </div>
// //                 <div className="mb-3">
// //                     <label>Batch Duration</label>
// //                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
// //                 </div>
// //                 <div className="mb-3">
// //                     <label>Select Curriculum</label>
// //                     {curriculums.map(curriculum => (
// //                         <div key={curriculum.id}>
// //                             <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
// //                             {curriculum.name}
// //                         </div>
// //                     ))}
// //                 </div>

// //                 <div className="mb-3">
// //                     <label>Select Center</label>
// //                     {centers.map(center => (  // Fixed: Map returning correctly
// //                         <div key={center.id}>
// //                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
// //                             {center.name}
// //                         </div>
// //                     ))}
// //                 </div>


// //                 <div className="mb-3">
// //                     <label>Batch Manager</label>
// //                     {batchManager.map(manager => (
// //                         <div key={manager.id}>
// //                             <input type="checkbox" checked={selectedBatchManagers.includes(manager.id)} onChange={() => handleSelection(manager.id, setSelectedBatchManagers, selectedBatchManagers)} />
// //                             {manager.f_name} {manager.l_name}
// //                         </div>
// //                     ))}
// //                 </div>
// //                 <div className="mb-3">
// //                     <label>Batch Faculty</label>
// //                     {batchFaculty.map(instructor => (
// //                         <div key={instructor.id}>
// //                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
// //                             {instructor.f_name}
// //                         </div>
// //                     ))}
// //                 </div>
// //                 {/* <div className="mb-3">
// //                     <label>Select Student</label>
// //                     {students.map(student => (
// //                         <div key={student.id}>
// //                             <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleSelection(student.id, setSelectedStudents, selectedStudents)} />
// //                             {student.first_name}
// //                         </div>
// //                     ))}
// //                 </div> */}


// //                 <div className='mb-3'>
// //                     <label>Add Students</label>
// //                     <table className="data-table table">
// //                     <thead className="table-secondary">
// //                         <tr>
// //                             <th>Sr No</th>
// //                             <th>Student Name</th>
// //                             <th>Course Short Name</th>
// //                             <th>Select</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {loading ? (
// //                             <tr>
// //                                 <td colSpan="4" className="text-center py-4">Loading...</td>
// //                             </tr>
// //                         ) : student.length > 0 ? (
// //                             (searchResults.length > 0 ? searchResults : student).map((student, index) => (
// //                                 <tr key={batch.id}>
// //                                     <td>{index + 1}</td>
// //                                     <td>{student.first_name}</td>
// //                                     <td>{course.name}</td>
// //                                     <td>
// //                                         <div className="flex items-center space-x-2">
// //                                             <button
// //                                                 onClick={() => { setDeleteId(batch.id); setOpenDelete(true); }}
// //                                                 className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
// //                                             >
// //                                                 Delete
// //                                             </button>
// //                                             <button
// //                                                 onClick={() => handleEditClick(batch)}
// //                                                 className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
// //                                             >
// //                                                 Update
// //                                             </button>
// //                                         </div>
// //                                     </td>
// //                                 </tr>
// //                             ))
// //                         ) : (
// //                             <tr>
// //                                 <td colSpan="3" className="text-center py-4">No batches found</td>
// //                             </tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //                 </div>

// //                 <button type="submit">{batch ? "Update" : "Create"}</button>
// //             </form>
// //         </div>
// //     );
// // };

// // export default CreateBatches;


// import React, { useState, useEffect } from 'react';
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { useNavigate } from "react-router-dom";

// const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
//     const navigate = useNavigate();
//     const [batchName, setBatchName] = useState('');
//     const [batchDuration, setBatchDuration] = useState('');
//     const [curriculums, setCurriculums] = useState([]);
//     const [batchManager, setBatchManager] = useState([]);
//     const [batchFaculty, setBatchFaculty] = useState([]);
//     const [students, setStudents] = useState([]);
//     const [centers, setCenters] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
//     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
//     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
//     const [selectedCenters, setSelectedCenters] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const fetchCollection = async (collectionName, setter) => {
//                 const snapshot = await getDocs(collection(db, collectionName));
//                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//             };

//             await fetchCollection("Instructor", setBatchFaculty);
//             await fetchCollection("Instructor", setBatchManager);
//             await fetchCollection("Curriculum", setCurriculums);
//             await fetchCollection("student", setStudents);
//             await fetchCollection("Centers", setCenters);
//             setLoading(false);
//         };

//         fetchData();

//         if (batch) {
//             setBatchName(batch.name);
//             setBatchDuration(batch.duration);
//             setSelectedBatchManagers(batch.managers || []);
//             setSelectedBatchFaculty(batch.faculty || []);
//             setSelectedCurriculums(batch.curriculums || []);
//             setSelectedCenters(batch.centers || []);
//             setSelectedStudents(batch.students || []);
//         }
//     }, [batch]);

//     // Function to filter faculty, managers, and students based on selected centers
//     const getFilteredData = (data) => {
//         return data.filter(item => selectedCenters.includes(item.center_id));
//     };


//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         const fetchCollection = async (collectionName, setter) => {
//     //             const snapshot = await getDocs(collection(db, collectionName));
//     //             setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     //         };

//     //         await fetchCollection("Instructor", setBatchFaculty);
//     //         await fetchCollection("Instructor", setBatchManager);
//     //         await fetchCollection("Curriculum", setCurriculums);
//     //         await fetchCollection("student", setStudents);
//     //         await fetchCollection("Centers", setCenters);
//     //         setLoading(false);
//     //     };

//     //     fetchData();

//     //     if (batch) {
//     //         setBatchName(batch.name);
//     //         setBatchDuration(batch.duration);
//     //         setSelectedBatchManagers(batch.managers || []);
//     //         setSelectedBatchFaculty(batch.faculty || []);
//     //         setSelectedCurriculums(batch.curriculums || []);
//     //         setSelectedCenters(batch.centers || []);
//     //         setSelectedStudents(batch.students || []);
//     //     }
//     // }, [batch]);

//     const handleSelection = (id, setter, selected) => {
//         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
//     };

//     const handleStudentSelection = (studentId) => {
//         setSelectedStudents(prev =>
//             prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
//         );
//     };

//     const addSelectedStudentsToBatch = () => {
//         alert("Students added to batch!");
//     };

//     const onSubmitBatch = async (e) => {
//         e.preventDefault();
//         if (!batchName.trim() || !batchDuration.trim()) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         try {
//             let batchId;
//             const batchData = {
//                 name: batchName,
//                 duration: batchDuration,
//                 managers: selectedBatchManagers,
//                 faculty: selectedBatchFaculty,
//                 curriculums: selectedCurriculums,
//                 students: selectedStudents,
//                 centers: selectedCenters
//             };

//             if (batch) {
//                 const batchDoc = doc(db, "Batch", batch.id);
//                 await updateDoc(batchDoc, batchData);
//                 batchId = batch.id;
//             } else {
//                 const docRef = await addDoc(collection(db, "Batch"), batchData);
//                 batchId = docRef.id;
//             }

//             alert("Batch successfully saved!");
//             setBatchName("");
//             setBatchDuration("");
//             setSelectedBatchManagers([]);
//             setSelectedBatchFaculty([]);
//             setSelectedCurriculums([]);
//             setSelectedCenters([]);
//             setSelectedStudents([]);
//             toggleSidebar();
//             navigate(`/batches`);
//         } catch (err) {
//             console.error("Error adding document:", err);
//             alert(`Error adding batch: ${err.message}`);
//         }
//     };

//     return (
//         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
//             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
//             <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
//             <form onSubmit={onSubmitBatch}>
//                 <div className="mb-3">
//                     <label>Batch Name</label>
//                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
//                 </div>
//                 <div className="mb-3">
//                     <label>Batch Duration</label>
//                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
//                 </div>
//                 <div className="mb-3">
//                     {curriculums.map((curriculum, index) => (
//                         <div key={curriculum.id || index}>
//                             <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
//                             {curriculum.name}
//                         </div>
//                     ))}

//                     {/* <label>Select Curriculum</label>
//                     {curriculums.map(curriculum => (
//                         <div key={curriculum.id}>
//                             <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
//                             {curriculum.name}
//                         </div>
//                     ))} */}
//                 </div>



//                 <div className="mb-3">
//                     <label>Select Center</label>
//                     {centers.map((center, index) => (
//                         <div key={center.id || index}>
//                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
//                             {center.name}
//                         </div>
//                     ))}

//                     {/* {centers.map(center => (
//                         <div key={center.id}>
//                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
//                             {center.name}
//                         </div>
//                     ))} */}
//                 </div>



// {/* Filtered Batch Managers */}
// <div className="mb-3">
//     <label>Select Batch Manager</label>
//     {getFilteredData(batchManager).map((instructor, index) => (
//         <div key={instructor.id || index}>
//             <input 
//                 type="checkbox" 
//                 checked={selectedBatchManagers.includes(instructor.id)} 
//                 onChange={() => handleSelection(instructor.id, setSelectedBatchManagers, selectedBatchManagers)} 
//             />
//             {instructor.f_name}
//         </div>
//     ))}
// </div>

// {/* Filtered Batch Faculty */}
// <div className="mb-3">
//     <label>Select Batch Faculty</label>
//     {getFilteredData(batchFaculty).map((instructor, index) => (
//         <div key={instructor.id || index}>
//             <input 
//                 type="checkbox" 
//                 checked={selectedBatchFaculty.includes(instructor.id)} 
//                 onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} 
//             />
//             {instructor.f_name}
//         </div>
//     ))}
// </div>

// {/* Filtered Students */}
// <tbody>
//     {loading ? (
//         <tr>
//             <td colSpan="5" className="text-center py-4">Loading...</td>
//         </tr>
//     ) : getFilteredData(students).length > 0 ? (
//         getFilteredData(students).flatMap((student, index) => 
//             (student.course_details || [{}]).map((course, courseIndex) => (
//                 <tr key={`${student.id || index}-${courseIndex}`}>
//                     <td>{index + 1}</td>
//                     <td>{student.first_name} {student.last_name}</td>
//                     <td>{student.enrollment_date || "N/A"}</td>
//                     <td>{course.courseName || "No Course Assigned"}</td>
//                     <td>
//                         <input
//                             type="checkbox"
//                             checked={selectedStudents.includes(student.id)}
//                             onChange={() => handleStudentSelection(student.id)}
//                         />
//                     </td>
//                 </tr>
//             ))
//         )
//     ) : (
//         <tr>
//             <td colSpan="5" className="text-center py-4">No students found</td>
//         </tr>
//     )}
// </tbody>



//                 {/* <div className="mb-3">
//                     <label>Select Batch Manager</label>
//                     {batchManager.map((instructor, index) => (
//                         <div key={instructor.id || index}>
//                             <input type="checkbox" checked={selectedBatchManagers.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchManagers, selectedBatchManagers)} />
//                             {instructor.f_name}
//                         </div>
//                     ))} */}

//                     {/* {batchManager.map(instructor => (
//                         <div key={instructor.id}>
//                             <input type="checkbox" checked={selectedBatchManagers.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setBatchManager, selectedBatchManagers)} />
//                             {instructor.f_name}
//                         </div>
//                     ))} 
//                 </div> */}


//                 {/* <div className="mb-3">
//                     <label>Select Batch Faculty</label>
//                     {batchFaculty.map((instructor, index) => (
//                         <div key={instructor.id || index}>
//                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
//                             {instructor.f_name}
//                         </div>
//                     ))} */}

//                     {/* {batchFaculty.map(instructor => (
//                         <div key={instructor.id}>
//                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setBatchFaculty, selectedBatchFaculty)} />
//                             {instructor.f_name}
//                         </div>
//                     ))} */}
//                 {/* </div> */}


//                 {/* <div className="mb-3">
//                     <label>Add Students</label>
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Sr No</th>
//                                 <th>Student Name</th>
//                                 <th>Enrollment Date</th>
//                                 <th>Course Name</th>
//                                 <th>Select</th>
//                             </tr>
//                         </thead>


//                         <tbody> */}
//     {/* {loading ? (
//         <tr>
//             <td colSpan="5" className="text-center py-4">Loading...</td>
//         </tr>
//     ) : students.length > 0 ? (
//         students.flatMap((student, index) => 
//             (student.course_details || [{}]).map((course, courseIndex) => (
//                 <tr key={`${student.id || index}-${courseIndex}`}>
//                     <td>{index + 1}</td>
//                     <td>{student.first_name} {student.last_name}</td>
//                     <td>{student.enrollment_date || "N/A"}</td>
//                     <td>{course.courseName || "No Course Assigned"}</td>
//                     <td>
//                         <input
//                             type="checkbox"
//                             checked={selectedStudents.includes(student.id)}
//                             onChange={() => handleStudentSelection(student.id)}
//                         />
//                     </td>
//                 </tr>
//             ))
//         ) */}
//     {/* ) : (
//         <tr>
//             <td colSpan="5" className="text-center py-4">No students found</td>
//         </tr>
//     )}
// </tbody> */}


//                         {/* <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">Loading...</td>
//                                 </tr>
//                             ) : students.length > 0 ? (
//                                 students.flatMap((student, index) =>
//                                     (student.course_details || []).map((course, courseIndex) => (
//                                         <tr key={`${student.id || index}-${courseIndex}`}>
//                                             <td>{index + 1}</td>
//                                             <td>{student.first_name} {student.last_name}</td>
//                                             <td>{student.enrollment_date || "N/A"}</td>
//                                             <td>{course.courseName || "N/A"}</td>
//                                             <td>
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedStudents.includes(student.id)}
//                                                     onChange={() => handleStudentSelection(student.id)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">No students found</td>
//                                 </tr>
//                             )}
//                         </tbody> */}

//                         {/* <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">Loading...</td>
//                                 </tr>
//                             ) : students.length > 0 ? (
//                                 students.flatMap((student, index) =>
//                                     student.course_details.map((course, courseIndex) => (
//                                         <tr key={`${student.id}-${courseIndex}`}>
//                                             <td>{index + 1}</td>
//                                             <td>{student.first_name} {student.last_name}</td>
//                                             <td>{student.enrollment_date || "N/A"}</td>
//                                             <td>{course.courseName || "N/A"}</td>
//                                             <td>
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedStudents.includes(student.id)}
//                                                     onChange={() => handleStudentSelection(student.id)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">No students found</td>
//                                 </tr>
//                             )}
//                         </tbody> */}

//                         {/* <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">Loading...</td>
//                                 </tr>
//                             ) : students.length > 0 ? (
//                                 students.map((student, index) => (
//                                     <tr key={student.id || index}>
//                                         <td>{index + 1}</td>
//                                         <td>{student.first_name} {student.last_name}</td>
//                                         <td>{student.enrollment_date || "N/A"}</td>
//                                         <td>{student.course_name || "N/A"}</td>
//                                         <td>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedStudents.includes(student.id)}
//                                                 onChange={() => handleStudentSelection(student.id)}
//                                             />
//                                         </td>
//                                     </tr>
//                                 ))

//                                 // students.map((student, index) => (
//                                 //     <tr key={student.id}>
//                                 //         <td>{index + 1}</td>
//                                 //         <td>{student.first_name} {student.last_name}</td>
//                                 //         <td>{student.enrollment_date || "N/A"}</td>
//                                 //         <td>{student.course_name || "N/A"}</td>
//                                 //         <td>
//                                 //             <input
//                                 //                 type="checkbox"
//                                 //                 checked={selectedStudents.includes(student.id)}
//                                 //                 onChange={() => handleStudentSelection(student.id)}
//                                 //             />
//                                 //         </td>
//                                 //     </tr>
//                                 // ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">No students found</td>
//                                 </tr>
//                             )}
//                         </tbody> */}
//                     </table>
//                     <button
//                         type="button"
//                         className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3"
//                         onClick={addSelectedStudentsToBatch}
//                     >
//                         Add Students
//                     </button>
//                 </div>

//                 <button type="submit">{batch ? "Update" : "Create"}</button>
//             </form >
//         </div >
//     );
// };

// export default CreateBatches;





























// // // import React, { useState, useEffect } from 'react';
// // // import { db } from '../../../../config/firebase';
// // // import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// // // import { useNavigate } from "react-router-dom";

// // // const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
// // //     const navigate = useNavigate();
// // //     const [batchName, setBatchName] = useState('');
// // //     const [batchDuration, setBatchDuration] = useState('');
// // //     const [curriculums, setCurriculums] = useState([]);
// // //     const [batchManager, setBatchManager] = useState([]);
// // //     const [batchFaculty, setBatchFaculty] = useState([]);
// // //     const [students, setStudents] = useState([]);
// // //     const [centers, setCenters] = useState([]);
// // //     const [loading, setLoading] = useState(true);

// // //     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
// // //     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
// // //     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
// // //     const [selectedCenters, setSelectedCenters] = useState([]);
// // //     const [selectedStudents, setSelectedStudents] = useState([]);

// // //     useEffect(() => {
// // //         const fetchData = async () => {
// // //             const fetchCollection = async (collectionName, setter) => {
// // //                 const snapshot = await getDocs(collection(db, collectionName));
// // //                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// // //             };

// // //             await fetchCollection("Instructor", setBatchFaculty);
// // //             await fetchCollection("Instructor", setBatchManager);
// // //             await fetchCollection("Curriculum", setCurriculums);
// // //             await fetchCollection("student", setStudents);
// // //             await fetchCollection("Centers", setCenters);
// // //             setLoading(false);
// // //         };

// // //         fetchData();

// // //         if (batch) {
// // //             setBatchName(batch.name);
// // //             setBatchDuration(batch.duration);
// // //             setSelectedBatchManagers(batch.managers || []);
// // //             setSelectedBatchFaculty(batch.faculty || []);
// // //             setSelectedCurriculums(batch.curriculums || []);
// // //             setSelectedCenters(batch.centers || []);
// // //             setSelectedStudents(batch.students || []);
// // //         }
// // //     }, [batch]);

// // //     // Function to filter faculty, managers, and students based on selected centers
// // //     const getFilteredData = (data) => {
// // //         return data.filter(item => selectedCenters.includes(item.center_id));
// // //     };


// // //     // useEffect(() => {
// // //     //     const fetchData = async () => {
// // //     //         const fetchCollection = async (collectionName, setter) => {
// // //     //             const snapshot = await getDocs(collection(db, collectionName));
// // //     //             setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// // //     //         };

// // //     //         await fetchCollection("Instructor", setBatchFaculty);
// // //     //         await fetchCollection("Instructor", setBatchManager);
// // //     //         await fetchCollection("Curriculum", setCurriculums);
// // //     //         await fetchCollection("student", setStudents);
// // //     //         await fetchCollection("Centers", setCenters);
// // //     //         setLoading(false);
// // //     //     };

// // //     //     fetchData();

// // //     //     if (batch) {
// // //     //         setBatchName(batch.name);
// // //     //         setBatchDuration(batch.duration);
// // //     //         setSelectedBatchManagers(batch.managers || []);
// // //     //         setSelectedBatchFaculty(batch.faculty || []);
// // //     //         setSelectedCurriculums(batch.curriculums || []);
// // //     //         setSelectedCenters(batch.centers || []);
// // //     //         setSelectedStudents(batch.students || []);
// // //     //     }
// // //     // }, [batch]);

// // //     const handleSelection = (id, setter, selected) => {
// // //         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
// // //     };

// // //     const handleStudentSelection = (studentId) => {
// // //         setSelectedStudents(prev =>
// // //             prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
// // //         );
// // //     };

// // //     const addSelectedStudentsToBatch = () => {
// // //         alert("Students added to batch!");
// // //     };

// // //     const onSubmitBatch = async (e) => {
// // //         e.preventDefault();
// // //         if (!batchName.trim() || !batchDuration.trim()) {
// // //             alert("Please fill in all required fields");
// // //             return;
// // //         }

// // //         try {
// // //             let batchId;
// // //             const batchData = {
// // //                 name: batchName,
// // //                 duration: batchDuration,
// // //                 managers: selectedBatchManagers,
// // //                 faculty: selectedBatchFaculty,
// // //                 curriculums: selectedCurriculums,
// // //                 students: selectedStudents,
// // //                 centers: selectedCenters
// // //             };

// // //             if (batch) {
// // //                 const batchDoc = doc(db, "Batch", batch.id);
// // //                 await updateDoc(batchDoc, batchData);
// // //                 batchId = batch.id;
// // //             } else {
// // //                 const docRef = await addDoc(collection(db, "Batch"), batchData);
// // //                 batchId = docRef.id;
// // //             }

// // //             alert("Batch successfully saved!");
// // //             setBatchName("");
// // //             setBatchDuration("");
// // //             setSelectedBatchManagers([]);
// // //             setSelectedBatchFaculty([]);
// // //             setSelectedCurriculums([]);
// // //             setSelectedCenters([]);
// // //             setSelectedStudents([]);
// // //             toggleSidebar();
// // //             navigate(`/batches`);
// // //         } catch (err) {
// // //             console.error("Error adding document:", err);
// // //             alert(`Error adding batch: ${err.message}`);
// // //         }
// // //     };

// // //     return (
// // //         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
// // //             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
// // //             <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
// // //             <form onSubmit={onSubmitBatch}>
// // //                 <div className="mb-3">
// // //                     <label>Batch Name</label>
// // //                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     <label>Batch Duration</label>
// // //                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
// // //                 </div>
// // //                 <div className="mb-3">
// // //                     {curriculums.map((curriculum, index) => (
// // //                         <div key={curriculum.id || index}>
// // //                             <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
// // //                             {curriculum.name}
// // //                         </div>
// // //                     ))}

// // //                     {/* <label>Select Curriculum</label>
// // //                     {curriculums.map(curriculum => (
// // //                         <div key={curriculum.id}>
// // //                             <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
// // //                             {curriculum.name}
// // //                         </div>
// // //                     ))} */}
// // //                 </div>



// // //                 <div className="mb-3">
// // //                     <label>Select Center</label>
// // //                     {centers.map((center, index) => (
// // //                         <div key={center.id || index}>
// // //                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
// // //                             {center.name}
// // //                         </div>
// // //                     ))}

// // //                     {/* {centers.map(center => (
// // //                         <div key={center.id}>
// // //                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
// // //                             {center.name}
// // //                         </div>
// // //                     ))} */}
// // //                 </div>



// // //                 {/* Filtered Batch Managers */}
// // //                 <div className="mb-3">
// // //                     <label>Select Batch Manager</label>
// // //                     {getFilteredData(batchManager).map((instructor, index) => (
// // //                         <div key={instructor.id || index}>
// // //                             <input
// // //                                 type="checkbox"
// // //                                 checked={selectedBatchManagers.includes(instructor.id)}
// // //                                 onChange={() => handleSelection(instructor.id, setSelectedBatchManagers, selectedBatchManagers)}
// // //                             />
// // //                             {instructor.f_name}
// // //                         </div>
// // //                     ))}
// // //                 </div>

// // //                 {/* Filtered Batch Faculty */}
// // //                 <div className="mb-3">
// // //                     <label>Select Batch Faculty</label>
// // //                     {getFilteredData(batchFaculty).map((instructor, index) => (
// // //                         <div key={instructor.id || index}>
// // //                             <input
// // //                                 type="checkbox"
// // //                                 checked={selectedBatchFaculty.includes(instructor.id)}
// // //                                 onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)}
// // //                             />
// // //                             {instructor.f_name}
// // //                         </div>
// // //                     ))}
// // //                 </div>

// // //                 {/* Filtered Students */}
// // //                 <table className="table">
// // //                 <label>Add Students</label>
// // //                 {/* <table> */}
// // //                     <thead>
// // //                         <tr>
// // //                             <th>Sr No</th>
// // //                             <th>Student Name</th>
// // //                             <th>Enrollment Date</th>
// // //                             <th>Course Name</th>
// // //                             <th>Select</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {loading ? (
// // //                             <tr>
// // //                                 <td colSpan="5" className="text-center py-4">Loading...</td>
// // //                             </tr>
// // //                         ) : getFilteredData(students).length > 0 ? (
// // //                             getFilteredData(students).flatMap((student, index) =>
// // //                                 (student.course_details || [{}]).map((course, courseIndex) => (
// // //                                     <tr key={`${student.id || index}-${courseIndex}`}>
// // //                                         <td>{index + 1}</td>
// // //                                         <td>{student.first_name} {student.last_name}</td>
// // //                                         <td>{student.enrollment_date || "N/A"}</td>
// // //                                         <td>{course.courseName || "No Course Assigned"}</td>
// // //                                         <td>
// // //                                             <input
// // //                                                 type="checkbox"
// // //                                                 checked={selectedStudents.includes(student.id)}
// // //                                                 onChange={() => handleStudentSelection(student.id)}
// // //                                             />
// // //                                         </td>
// // //                                     </tr>
// // //                                 ))
// // //                             )
// // //                         ) : (
// // //                             <tr>
// // //                                 <td colSpan="5" className="text-center py-4">No students found</td>
// // //                             </tr>
// // //                         )}
// // //                     </tbody>
// // //                 </table>
// // //                     <button
// // //                         type="button"
// // //                         className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3"
// // //                         onClick={addSelectedStudentsToBatch}
// // //                     >
// // //                         Add Students
// // //                     </button>
// // //                 {/* </div> */}

// // //                 <button type="submit">{batch ? "Update" : "Create"}</button>
// // //             </form >
// // //         </div >
// // //     );
// // // };

// // // export default CreateBatches;


// // import React, { useState, useEffect } from 'react';
// // import { db } from '../../../../config/firebase';
// // import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// // import { useNavigate } from "react-router-dom";

// // const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
// //     const navigate = useNavigate();
// //     const [batchName, setBatchName] = useState('');
// //     const [batchDuration, setBatchDuration] = useState('');
// //     const [curriculums, setCurriculums] = useState([]);
// //     const [batchManager, setBatchManager] = useState([]);
// //     const [batchFaculty, setBatchFaculty] = useState([]);
// //     const [students, setStudents] = useState([]);
// //     const [centers, setCenters] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
// //     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
// //     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
// //     const [selectedCenters, setSelectedCenters] = useState([]);
// //     const [selectedStudents, setSelectedStudents] = useState([]);

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             const fetchCollection = async (collectionName, setter) => {
// //                 const snapshot = await getDocs(collection(db, collectionName));
// //                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// //             };

// //             await fetchCollection("Instructor", setBatchFaculty);
// //             await fetchCollection("Instructor", setBatchManager);
// //             await fetchCollection("Curriculum", setCurriculums);
// //             await fetchCollection("student", setStudents);
// //             await fetchCollection("Centers", setCenters);
// //             setLoading(false);
// //         };

// //         fetchData();

// //         if (batch) {
// //             setBatchName(batch.name);
// //             setBatchDuration(batch.duration);
// //             setSelectedBatchManagers(batch.managers || []);
// //             setSelectedBatchFaculty(batch.faculty || []);
// //             setSelectedCurriculums(batch.curriculums || []);
// //             setSelectedCenters(batch.centers || []);
// //             setSelectedStudents(batch.students || []);
// //         }
// //     }, [batch]);

// //     const getFilteredData = (data) => {
// //         // if (selectedCenters.length === 0) return data; // Show all if no center selected
// //         return data.filter(item => selectedCenters.includes(item.center_id));
// //     };

// //     const handleSelection = (id, setter, selected) => {
// //         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
// //     };

// //     const handleStudentSelection = (studentId) => {
// //         setSelectedStudents(prev =>
// //             prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
// //         );
// //     };

// //     const onSubmitBatch = async (e) => {
// //         e.preventDefault();
// //         if (!batchName.trim() || !batchDuration.trim()) {
// //             alert("Please fill in all required fields");
// //             return;
// //         }

// //         try {
// //             let batchId;
// //             const batchData = {
// //                 name: batchName,
// //                 duration: batchDuration,
// //                 managers: selectedBatchManagers,
// //                 faculty: selectedBatchFaculty,
// //                 curriculums: selectedCurriculums,
// //                 students: selectedStudents,
// //                 centers: selectedCenters
// //             };

// //             if (batch) {
// //                 const batchDoc = doc(db, "Batch", batch.id);
// //                 await updateDoc(batchDoc, batchData);
// //                 batchId = batch.id;
// //             } else {
// //                 const docRef = await addDoc(collection(db, "Batch"), batchData);
// //                 batchId = docRef.id;
// //             }

// //             alert("Batch successfully saved!");
// //             toggleSidebar();
// //             navigate(`/batches`);
// //         } catch (err) {
// //             console.error("Error adding document:", err);
// //             alert(`Error adding batch: ${err.message}`);
// //         }
// //     };

// //     return (
// //         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
// //             <button onClick={toggleSidebar}>Back</button>
// //             <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
// //             <form onSubmit={onSubmitBatch}>
// //                 <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required placeholder="Batch Name" />
// //                 <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required placeholder="Batch Duration" />
                
// //                 <label>Select Center</label>
// //                 {centers.map(center => (
// //                     <div key={center.id}>
// //                         <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
// //                         {center.name}
// //                     </div>
// //                 ))}
                
// //                 <label>Select Batch Manager</label>
// //                 {getFilteredData(batchManager).map(manager => (
// //                     <div key={manager.id}>
// //                         <input type="checkbox" checked={selectedBatchManagers.includes(manager.id)} onChange={() => handleSelection(manager.id, setSelectedBatchManagers, selectedBatchManagers)} />
// //                         {manager.f_name}
// //                     </div>
// //                 ))}

// //                 <label>Select Batch Faculty</label>
// //                 {getFilteredData(batchFaculty).map(faculty => (
// //                     <div key={faculty.id}>
// //                         <input type="checkbox" checked={selectedBatchFaculty.includes(faculty.id)} onChange={() => handleSelection(faculty.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
// //                         {faculty.f_name}
// //                     </div>
// //                 ))}

// //                 <label>Select Students</label>
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th>Name</th>
// //                             <th>Select</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {getFilteredData(students).map(student => (
// //                             <tr key={student.id}>
// //                                 <td>{student.first_name} {student.last_name}</td>
// //                                 <td>
// //                                     <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleStudentSelection(student.id)} />
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
                
// //                 <button type="submit">{batch ? "Update" : "Create"}</button>
// //             </form>
// //         </div>
// //     );
// // };

// // export default CreateBatches;



// import React, { useState, useEffect } from 'react';
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { useNavigate } from "react-router-dom";

// const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
//     const navigate = useNavigate();
//     const [batchName, setBatchName] = useState('');
//     const [batchDuration, setBatchDuration] = useState('');
//     const [curriculums, setCurriculums] = useState([]);
//     const [batchManagers, setBatchManagers] = useState([]);
//     const [batchFaculty, setBatchFaculty] = useState([]);
//     const [student, setStudents] = useState([]);
//     const [centers, setCenters] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState();

//     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
//     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
//     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
//     const [selectedCenters, setSelectedCenters] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const fetchCollection = async (collectionName, setter) => {
//                 const snapshot = await getDocs(collection(db, collectionName));
//                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//             };

//             await fetchCollection("Instructor", setBatchFaculty);
//             await fetchCollection("Instructor", setBatchManagers);
//             await fetchCollection("Curriculum", setCurriculums);
//             await fetchCollection("student", setStudents);
//             await fetchCollection("Centers", setCenters);
//             setLoading(false);
//         };

//         fetchData();

//         if (batch) {
//             setBatchName(batch.name);
//             setBatchDuration(batch.duration);
//             setSelectedBatchManagers(batch.managers || []);
//             setSelectedBatchFaculty(batch.faculty || []);
//             setSelectedCurriculums(batch.curriculums || []);
//             setSelectedCenters(batch.centers || []);
//             setSelectedStudents(batch.students || []);
//         }
//     }, [batch]);

//     const getFilteredData = (data) => {
//         if (selectedCenters.length === 0) return data;
//         return data.filter(item => selectedCenters.includes(item.center_id));
//     };

//     const handleSelection = (id, setter, selected) => {
//         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
//     };

//     const handleStudentSelection = (studentId) => {
//         setSelectedStudents(prev =>
//             prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
//         );
//     };

//     const addSelectedStudentsToBatch = () => {
//         alert("Students added to batch!");
//     };

//     const onSubmitBatch = async (e) => {
//         e.preventDefault();
//         if (!batchName.trim() || !batchDuration.trim()) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         try {
//             let batchId;
//             const batchData = {
//                 name: batchName,
//                 duration: batchDuration,
//                 managers: selectedBatchManagers,
//                 faculty: selectedBatchFaculty,
//                 curriculums: selectedCurriculums,
//                 students: selectedStudents,
//                 centers: selectedCenters
//             };

//             if (batch) {
//                 const batchDoc = doc(db, "Batch", batch.id);
//                 await updateDoc(batchDoc, batchData);
//                 batchId = batch.id;
//             } else {
//                 const docRef = await addDoc(collection(db, "Batch"), batchData);
//                 batchId = docRef.id;
//             }

//             alert("Batch successfully saved!");
//             setBatchName("");
//             setBatchDuration("");
//             setSelectedBatchManagers([]);
//             setSelectedBatchFaculty([]);
//             setSelectedCurriculums([]);
//             setSelectedCenters([]);
//             setSelectedStudents([]);
//             toggleSidebar();
//             navigate(`/batches`);
//         } catch (err) {
//             console.error("Error adding document:", err);
//             alert(`Error adding batch: ${err.message}`);
//         }
//     };

//     return (
//         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
//             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
//             <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
//             <form onSubmit={onSubmitBatch}>
//                 <div className="mb-3">
//                     <label>Batch Name</label>
//                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
//                 </div>
//                 <div className="mb-3">
//                     <label>Batch Duration</label>
//                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
//                 </div>

//                 <div className="mb-3">
//                     <label>Select Center</label>
//                     {centers.map(center => (
//                         <div key={center.id}>
//                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
//                             {center.name}
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mb-3">
//                     <label>Select Batch Manager</label>
//                     {getFilteredData(batchManagers).map(manager => (
//                         <div key={manager.id}>
//                             <input type="checkbox" checked={selectedBatchManagers.includes(manager.id)} onChange={() => handleSelection(manager.id, setSelectedBatchManagers, selectedBatchManagers)} />
//                             {manager.f_name}
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mb-3">
//                     <label>Select Batch Faculty</label>
//                     {getFilteredData(batchFaculty).map(faculty => (
//                         <div key={faculty.id}>
//                             <input type="checkbox" checked={selectedBatchFaculty.includes(faculty.id)} onChange={() => handleSelection(faculty.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
//                             {faculty.f_name}
//                         </div>
//                     ))}
//                 </div>



                
//                  <div className='mb-3'>
//                      <label>Add Students</label>
//                      <table className="data-table table">
//                      <thead className="table-secondary">
//                          <tr>
//                              <th>Sr No</th>
//                              <th>Student Name</th>
//                              <th>Course Short Name</th>
//                              <th>Select</th>
//                          </tr>
//                      </thead>
//                      <tbody>
//                          {loading ? (
//                              <tr>
//                                  <td colSpan="4" className="text-center py-4">Loading...</td>
//                              </tr>
//                          ) : student.length > 0 ? (
//                             (searchResults.length > 0 ? searchResults : student).map((student, index) => (
//                             //  (searchResults.length > 0 ? searchResults : student).map((student, index) => (
//                                  <tr key={batch.id}>
//                                      <td>{index + 1}</td>
//                                      <td>{student.first_name}</td>
//                                      <td>{course.name}</td>
//                                      <td>
//                                          <div className="flex items-center space-x-2">
//                                              <button
//                                                  onClick={() => { setDeleteId(batch.id); setOpenDelete(true); }}
//                                                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
//                                              >
//                                                  Delete
//                                              </button>
//                                              <button
//                                                  onClick={() => handleEditClick(batch)}
//                                                  className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
//                                              >
//                                                  Update
//                                              </button>
//                                          </div>
//                                      </td>
//                                  </tr>
//                              ))
//                          ) : (
//                              <tr>
//                                  <td colSpan="3" className="text-center py-4">No batches found</td>
//                              </tr>
//                          )}
//                      </tbody>
//                  </table>
//                  </div>

//                 <button type="submit">{batch ? "Update" : "Create"}</button>
//             </form>
//         </div>
//     );
// };

// export default CreateBatches;












// import React, { useState, useEffect } from 'react';
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { useNavigate } from "react-router-dom";

// const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
//     const navigate = useNavigate();
//     const [batchName, setBatchName] = useState('');
//     const [batchDuration, setBatchDuration] = useState('');
//     const [curriculums, setCurriculums] = useState([]);
//     const [batchManager, setBatchManager] = useState([]);
//     const [allBatchFaculty, setAllBatchFaculty] = useState([]); // Store all faculty
//     const [batchFaculty, setBatchFaculty] = useState([]); // Store filtered faculty
//     const [students, setStudents] = useState([]);
//     const [centers, setCenters] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
//     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
//     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
//     const [selectedCenters, setSelectedCenters] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const fetchCollection = async (collectionName, setter) => {
//                 const snapshot = await getDocs(collection(db, collectionName));
//                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//             };

//             await fetchCollection("Instructor", setAllBatchFaculty); // Fetch all faculty
//             await fetchCollection("Instructor", setBatchManager);
//             await fetchCollection("Curriculum", setCurriculums);
//             await fetchCollection("student", setStudents);
//             await fetchCollection("Centers", setCenters);
//             setLoading(false);
//         };

//         fetchData();

//         if (batch) {
//             setBatchName(batch.name);
//             setBatchDuration(batch.duration);
//             setSelectedBatchManagers(batch.managers || []);
//             setSelectedBatchFaculty(batch.faculty || []);
//             setSelectedCurriculums(batch.curriculums || []);
//             setSelectedCenters(batch.centers || []);
//             setSelectedStudents(batch.students || []);
//         }
//     }, [batch]);

//     useEffect(() => {
//         filterFacultyByCenter();
//     }, [selectedCenters, allBatchFaculty]);

//     const filterFacultyByCenter = () => {
//         if (selectedCenters.length === 0) {
//             setBatchFaculty(allBatchFaculty); // Show all if no centers selected
//             return;
//         }

//         const filteredFaculty = allBatchFaculty.filter(faculty => {
//             if (!faculty.center_id) return false;
//             return selectedCenters.includes(faculty.center_id);
//         });
//         setBatchFaculty(filteredFaculty);
//     };

//     const handleSelection = (id, setter, selected) => {
//         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
//     };

//     const handleStudentSelection = (studentId) => {
//         setSelectedStudents(prev =>
//             prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
//         );
//     };

//     const addSelectedStudentsToBatch = () => {
//         alert("Students added to batch!");
//     };

//     const onSubmitBatch = async (e) => {
//         e.preventDefault();
//         if (!batchName.trim() || !batchDuration.trim()) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         try {
//             let batchId;
//             const batchData = {
//                 name: batchName,
//                 duration: batchDuration,
//                 managers: selectedBatchManagers,
//                 faculty: selectedBatchFaculty,
//                 curriculums: selectedCurriculums,
//                 students: selectedStudents,
//                 centers: selectedCenters
//             };

//             if (batch) {
//                 const batchDoc = doc(db, "Batch", batch.id);
//                 await updateDoc(batchDoc, batchData);
//                 batchId = batch.id;
//             } else {
//                 const docRef = await addDoc(collection(db, "Batch"), batchData);
//                 batchId = docRef.id;
//             }

//             alert("Batch successfully saved!");
//             setBatchName("");
//             setBatchDuration("");
//             setSelectedBatchManagers([]);
//             setSelectedBatchFaculty([]);
//             setSelectedCurriculums([]);
//             setSelectedCenters([]);
//             setSelectedStudents([]);
//             toggleSidebar();
//             navigate(`/batches`);
//         } catch (err) {
//             console.error("Error adding document:", err);
//             alert(`Error adding batch: ${err.message}`);
//         }
//     };

//     return (
//         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
//             {/* ... rest of your component */}


//             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
//             <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
//             <form onSubmit={onSubmitBatch}>
//                 <div className="mb-3">
//                     <label>Batch Name</label>
//                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
//                 </div>
//                 <div className="mb-3">
//                     <label>Batch Duration</label>
//                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
//                 </div>
//                 <div className="mb-3">
//                     <label>Select Curriculum</label>
//                     {curriculums.map(curriculum => (<div key={curriculum.id}>
//                         <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
//                         {curriculum.name}
//                     </div>))}
//                 </div>


//                 <div className="mb-3">
//                     <label>Select Center</label>
//                     {centers.map(center => (
//                         <div key={center.id}>
//                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
//                             {center.name}
//                         </div>
//                     ))}
//                 </div>
                
//                 <div className="mb-3">
//                     <label>Batch Manager</label>
//                     {batchManager.map(manager => (<div key={manager.id}>
//                         <input type="checkbox" checked={selectedBatchManagers.includes(manager.id)} onChange={() => handleSelection(manager.id, setSelectedBatchManagers, selectedBatchManagers)} />
//                         {manager.f_name} {manager.l_name}
//                     </div>))}
//                 </div>
//                 {/* <div className="mb-3">
//                     <label>Batch Faculty</label>
//                     {batchFaculty.map(instructor => (
//                         <div key={instructor.id}>
//                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
//                             {instructor.f_name}
//                         </div>
//                     ))}
//                 </div> */}

//                 {/* <div className="mb-3">
//                      <label>Select Curriculum</label>
//                      {curriculums.map(curriculum => (
//                          <div key={curriculum.id}>
//                              <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
//                              {curriculum.name}
//                          </div>
//                      ))}
//                  </div> */}




              


//                 <div className="mb-3">
//                     <label>Batch Faculty</label>
//                     {batchFaculty.map(instructor => (
//                         <div key={instructor.id}>
//                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
//                             {instructor.f_name}
//                         </div>
//                     ))}
//                 </div>
//                 {/* ... rest of your component */}

//                 <div className="mb-3">
//                      <label>Add Students</label>
//                      <table className="table">
//                          <thead>
//                              <tr>
//                                  <th>Sr No</th>
//                                  <th>Student Name</th>
//                                  <th>Enrollment Date</th>
//                                  <th>Course Name</th>
//                                  <th>Select</th>
//                              </tr>
//                          </thead>


//                          <tbody>
//                              {loading ? (
//                                  <tr>
//                                      <td colSpan="5" className="text-center py-4">Loading...</td>
//                                  </tr>
//                              ) : students.length > 0 ? (
//                                  students.flatMap((student, index) =>
//                                      (student.course_details || [{}]).map((course, courseIndex) => (
//                                          <tr key={`${student.id || index}-${courseIndex}`}>
//                                              <td>{index + 1}</td>
//                                              <td>{student.first_name} {student.last_name}</td>
//                                              <td>{student.enrollment_date || "N/A"}</td>
//                                              <td>{course.courseName || "No Course Assigned"}</td>
//                                              <td>
//                                                  <input
//                                                      type="checkbox"
//                                                      checked={selectedStudents.includes(student.id)}
//                                                      onChange={() => handleStudentSelection(student.id)}
//                                                  />
//                                              </td>
//                                          </tr>
//                                      ))
//                                  )
//                              ) : (
//                                  <tr>
//                                      <td colSpan="5" className="text-center py-4">No students found</td>
//                                  </tr>
//                              )}
//                          </tbody>

//                      </table>
//                      <button
//                          type="button"
//                          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3"
//                          onClick={addSelectedStudentsToBatch}
//                      >
//                          Add Students
//                      </button>
//                  </div>

//                  <button type="submit">{batch ? "Update" : "Create"}</button>
//             </form>
//         </div>
//     );
// };

// export default CreateBatches;






















// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
// import { db } from "../../../config/firebase";
// import './Profile.css'; // Ensure you have relevant styles defined
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';

// export default function AddStudent() {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");

//     const [address, setAddress] = useState({
//         street: "", area: "", city: "", state: "", zip: "", country: ""
//     });

//     const [billingAddress, setBillingAddress] = useState({
//         street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: ""
//     });

//     const [copyAddress, setCopyAddress] = useState(false);
//     const [status, setStatus] = useState("");
//     const [dateOfBirth, setDateOfBirth] = useState("");
//     const [admissionDate, setAdmissionDate] = useState("");

//     const [courseDetails, setCourseDetails] = useState([]);
//     const [educationDetails, setEducationDetails] = useState([]);
//     const [installmentDetails, setInstallmentDetails] = useState([]);
//     const [experienceDetails, setExperienceDetails] = useState([]);

//     const [course, setCourse] = useState("");
//     const [batch, setBatch] = useState("");

//     const [centers, setCenters] = useState([]);
//     const [selectedCenters, setSelectedCenters] = useState([]);

//     const [goal, setGoal] = useState("");

//     const navigate = useNavigate();

//     useEffect(() => {
//         const today = new Date().toISOString().split("T")[0];
//         setAdmissionDate(today);
//     }, []);

//     const handleAddStudent = async (e) => {
//         e.preventDefault();
//         if (!firstName || !lastName || !email || !phone) {
//             alert("Please fill all required fields.");
//             return;
//         }
    
//         try {
//             const studentDocRef = await addDoc(collection(db, 'student'), {
//                 first_name: firstName,
//                 last_name: lastName,
//                 email,
//                 phone,
//                 residential_address: address,
//                 billing_address: billingAddress,
//                 goal,
//                 status,
//                 date_of_birth: Timestamp.fromDate(new Date(dateOfBirth)),
//                 admission_date: Timestamp.fromDate(new Date(admissionDate)),
//                 course_details: courseDetails,
//                 education_details: educationDetails,
//                 experience_details: experienceDetails
//             });
    
//             const studentId = studentDocRef.id;
    
//             // Add installments to the student's 'installments' subcollection
//             const installmentsRef = collection(db, 'student', studentId, 'installments');
//             for (const installmentData of installmentDetails) {
//                 await addDoc(installmentsRef, installmentData);
//             }
    
//             alert("Student added successfully!");
//             navigate("/studentdetails");
//         } catch (error) {
//             console.error("Error adding student:", error);
//             alert("Error adding student. Please try again.");
//         }
//     };

//     const handleCopyAddress = (isChecked) => {
//         setCopyAddress(isChecked);
//         if (isChecked) {
//             setBillingAddress({
//                 ...address,
//                 gstNo: billingAddress.gstNo
//             });
//         } else {
//             setBillingAddress({ street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
//         }
//     };

//     const addEducation = () => {
//         setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '' }]);
//     };

//     const handleEducationChange = (index, field, value) => {
//         const newEducationDetails = [...educationDetails];
//         newEducationDetails[index][field] = value;
//         setEducationDetails(newEducationDetails);
//     };

//     const deleteEducation = (index) => {
//         const newEducationDetails = educationDetails.filter((_, i) => i !== index);
//         setEducationDetails(newEducationDetails);
//     };
    
//     const handleInstallmentChange = (index, field, value) => {
//         const newInstallmentDetails = [...installmentDetails];
//         newInstallmentDetails[index][field] = value;
//         setInstallmentDetails(newInstallmentDetails);
//     };

//     const deleteInstallment = (index) => {
//         const newInstallmentDetails = installmentDetails.filter((_, i) => i !== index);
//         setInstallmentDetails(newInstallmentDetails);
//     };

//     const addCourse = () => {
//         setCourseDetails([...courseDetails, { courseName: '', batch: '', center: '', mode: '' }]);
//     };

//     const handleCourseChange = (index, field, value) => {
//         const newCourseDetails = [...courseDetails];
//         newCourseDetails[index][field] = value;
//         setCourseDetails(newCourseDetails);
//     };

//     const deleteCourse = (index) => {
//         const newCourseDetails = courseDetails.filter((_, i) => i !== index);
//         setCourseDetails(newCourseDetails);
//     };

//     const addExperience = () => {
//         setExperienceDetails([...experienceDetails, { comapanyName: '', degination: '', salary: '', description: '' }]);
//     };

//     const handleExperienceChange = (index, field, value) => {
//         const newExperienceDetails = [...experienceDetails];
//         newExperienceDetails[index][field] = value;
//         setExperienceDetails(newExperienceDetails);
//     };

//     const deleteExperience = (index) => {
//         const newExperienceDetails = experienceDetails.filter((_, i) => i !== index);
//         setExperienceDetails(newExperienceDetails);
//     };

//     const addInstallment = () => {
//         setInstallmentDetails([...installmentDetails, { number: '', dueDate: '', dueAmount: '' }]);
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => navigate("/studentdetails")}>Back</button>
//             <h1>Add Student</h1>
//             <form className="student-form" onSubmit={handleAddStudent}>
//                 {/* ... (rest of your form) ... */}
//                 <div className="form-group">
//                      <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//                      <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//                      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//                  </div><br/>

//                  <div className="form-group">
//                      <h3>Date of Birth</h3>
//                      <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
//                  </div><br/>

//                  <div className="form-group">
//                      <h3>Residential Address</h3>
//                      <input type="text" placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}/>
//                      <input type="text" placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
//                      <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
//                      <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
//                      <input type="text" placeholder="Zip Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
//                      <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
//                  </div><br/>

//                  <div className="form-group">
//                      <h3>Billing Address</h3>
//                      <label> <input type="checkbox" checked={copyAddress} onChange={(e) => handleCopyAddress(e.target.checked)} />Same as Residential Address </label>
//                      <input type="text" placeholder="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}/>
//                      <input type="text" placeholder="Area" value={billingAddress.area} onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })} />
//                      <input type="text" placeholder="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
//                      <input type="text" placeholder="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
//                      <input type="text" placeholder="Zip Code" value={billingAddress.zip} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
//                      <input type="text" placeholder="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} />
//                      <input type="text" placeholder="GST No." value={billingAddress.gstNo} onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })} />
//                  </div><br/>

//                  <div>
//                      <h3>Educational Details</h3>
//                      {educationDetails.map((edu, index) => (
//                          <div key={index} className="education-group">
//                             <select value={edu.level} onChange={(e) => handleEducationChange(index, 'level', e.target.value)}>
//                                 <option value="" disabled>Select Level</option>
//                                 <option value="School">School</option>
//                                 <option value="UG">UG</option>
//                                 <option value="PG">PG</option>
//                             </select>
//                             <input type="text" placeholder="Institute Name" value={edu.institute} onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}/>
//                             <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} required />
//                             <input type="text" placeholder="Specialization" value={edu.specialization} onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)} />
//                             <input type="text" placeholder="Grade" value={edu.grade} onChange={(e) => handleEducationChange(index, 'grade', e.target.value)} />
//                             <input type="number" placeholder="Passing Year" value={edu.passingyr} onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)} />
//                             <button type="button" onClick={() => deleteEducation(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
//                                 <FontAwesomeIcon icon={faXmark} />
//                             </button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={addEducation} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Education</button>
//                 </div><br/>

//                 <div>
//                     <h3>Experience Details</h3>
//                     {experienceDetails.map((experience, index) => (
//                         <div key={index} className="experience-group">
//                             <input type="text" placeholder="Company Name" value={experience.companyName} onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}/>
//                             <input type="text" placeholder="Designation" value={experience.designation} onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)} />
//                             <input type="text" placeholder="Salary" value={experience.salary} onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}/>
//                             <input type="text" placeholder="Description" value={experience.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}/>
//                             <button type="button" onClick={() => deleteExperience(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
//                                 <FontAwesomeIcon icon={faXmark} />
//                             </button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={addExperience} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Experience</button>
//                 </div><br/>

//                 <div>
//                     <h3>Course Details</h3>
//                     {courseDetails.map((course, index) => (
//                         <div key={index} className="course-group">
//                             <select value={course.courseName} onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}>
//                                 <option value="">Select Course</option>
//                                 <option value="Full Stack Development (MERN)">Full Stack Development (MERN)</option>
//                                 <option value="Full Stack Development (Python)">Full Stack Development (Python)</option>
//                                 <option value="Data Science">Data Science</option>
//                             </select>
//                             <select value={course.batch} onChange={(e) => handleCourseChange(index, 'batch', e.target.value)}>
//                                 <option value="">Select Batch</option>
//                                 <option value="Full Time">Full Time</option>
//                                 <option value="Weekend">Weekend</option>
//                             </select>
//                             <select value={course.center} onChange={(e) => handleCourseChange(index, 'center', e.target.value)}>
//                                 <option value="">Select Center</option>
//                                 <option value="Mate Sq.">Mate SQ</option>
//                                 <option value="Nandanwan">Nandanwan</option>
//                                 <option value="Sadar">Sadar</option>
//                             </select>
//                             <select value={course.mode} onChange={(e) => handleCourseChange(index, 'mode', e.target.value)}>
//                                 <option value="">Select Mode</option>
//                                 <option value="Online">Online</option>
//                                 <option value="Offline">Offline</option>
//                             </select>
//                             <button type="button" onClick={() => deleteCourse(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
//                                 <FontAwesomeIcon icon={faXmark} />
//                             </button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={addCourse} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Course</button>
//                 </div><br/>

//                 <div className="form-group">
//                     <h3>Status of Student</h3>
//                     <select value={status} onChange={(e) => setStatus(e.target.value)} required>
//                         <option value="">Select Status</option>
//                         <option value="enquiry">Enquiry</option>
//                         <option value="enrolled">Enrolled</option>
//                         <option value="inactive">Inactive</option>
//                         <option value="completed">Completed</option>
//                     </select>
//                 </div><br/>

//                 <div>
//                     <h3>Admission Date</h3>
//                     <input type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
//                 </div><br/>

//                 <div>
//                     <h3>Enrollment Goals</h3>
//                     <select value={goal} onChange={(e) => setGoal(e.target.value)}>
//                         <option value="">Select Goal</option>
//                         <option value="upskilling">Upskilling</option>
//                         <option value="placement">Placement</option>
//                         <option value="career_switch">Career Switch</option>
//                     </select>
//                 </div><br/>

//                 <div>
//                     <h3>Installment Details</h3>
//                     {installmentDetails.map((installment, index) => (
//                         <div key={index} className="installment-group">
//                             <input type="number" placeholder="No. of Installments" value={installment.number} onChange={(e) => handleInstallmentChange(index, 'number', e.target.value)} />
//                             <input type="date" placeholder="Due Date" value={installment.dueDate} onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)} />
//                             <input type="number" placeholder="Amount" value={installment.dueAmount} onChange={(e) => handleInstallmentChange(index, 'dueAmount', e.target.value)} />
//                             <button type="button" onClick={() => deleteInstallment(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
//                                 <FontAwesomeIcon icon={faXmark} />
//                             </button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={addInstallment} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Installment</button>
//                 </div><br/>
//                 <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Student</button>
//             </form>
//         </div>
//     );
// }



import { useState, useEffect } from "react";
import Button from '../../../components/ui/Button';
import { db } from "../../../config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import CreateRoleModal from "./CreateRoleModal";
import { MoreVertical } from "lucide-react";
import useUserRole from "./useUserRole";  // Import hook

const PERMISSIONS = {
  Admin: ["create", "edit", "delete", "view"],
  Manager: ["edit", "view"],
  Instructor: ["view"]
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { userRole, loading } = useUserRole();  // Get the logged-in user's role

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "roles"));
      setRoles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleNewRole = () => {
    if (PERMISSIONS[userRole]?.includes("create")) {
      setSelectedRole(null);
      setIsModalOpen(true);
    } else {
      alert("You do not have permission to create roles.");
    }
  };

  const handleEdit = (role) => {
    if (PERMISSIONS[userRole]?.includes("edit")) {
      setSelectedRole(role);
      setIsModalOpen(true);
      setDropdownOpen(null);
    } else {
      alert("You do not have permission to edit roles.");
    }
  };

  const handleDelete = async (roleId) => {
    if (PERMISSIONS[userRole]?.includes("delete")) {
      if (window.confirm("Are you sure you want to delete this role?")) {
        await deleteDoc(doc(db, "roles", roleId));
        fetchRoles();
        setDropdownOpen(null);
      }
    } else {
      alert("You do not have permission to delete roles.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Roles & Permissions</h2>
        
        {/* Only show "New Role" button if the user has "create" permission */}
        {PERMISSIONS[userRole]?.includes("create") && (
          <Button className="bg-blue-600 text-white" onClick={handleNewRole}>
            + New Role
          </Button>
        )}
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Role Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Users Assigned</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id} className="text-center border">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{role.name}</td>
              <td className="p-2 border">{role.description}</td>
              <td className="p-2 border">
                <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
              </td>
              <td className="p-2 border">{role.usersAssigned || 0}</td>
              <td className="p-2 border relative">
                
                {/* Only show actions if user has "edit" or "delete" permission */}
                {(PERMISSIONS[userRole]?.includes("edit") || PERMISSIONS[userRole]?.includes("delete")) && (
                  <>
                    <button onClick={() => setDropdownOpen(dropdownOpen === role.id ? null : role.id)}>
                      <MoreVertical className="cursor-pointer" />
                    </button>
                    {dropdownOpen === role.id && (
                      <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
                        {PERMISSIONS[userRole]?.includes("edit") && (
                          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleEdit(role)}>
                            Edit
                          </button>
                        )}
                        {PERMISSIONS[userRole]?.includes("delete") && (
                          <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => handleDelete(role.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRoles} selectedRole={selectedRole} />
    </div>
  );
};

export default Roles;
