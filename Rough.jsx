// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { db } from "../../../config/firebase";
// import './Profile.css'; // Ensure you have relevant styles defined
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';

// export default function  AddStudent() {
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
//                 installment_details: installmentDetails,
//                 experience_details: experienceDetails
//             });

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

//     const addInstallment = async (studentId, installmentData) => {
//         try {
//             const installmentRef = await addDoc(collection(db, "installments"), installmentData);
//             const installmentId = installmentRef.id;
//             const studentDocRef = doc(db, "student", studentId);
//             await updateDoc(studentDocRef, { installmentId });
    
//             console.log("Installment added successfully with ID:", installmentId);
//             return installmentId;
//         } catch (error) {
//             console.error("Error adding installment:", error);
//         }
//     };

//     const handleAddInstallment = async (studentId) => {
//         const installmentData = {
//             amount: 5000,
//             dueDate: "2025-04-01",
//             status: "pending",
//             studentId: studentId
//         };
    
//         await addInstallment(studentId, installmentData);
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
//         setCourseDetails([...courseDetails, { courseName: '', batch: '', branch: '', mode: '' }]);
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

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => navigate("/studentdetails")}>Back</button>
//             <h1>Add Student</h1>
//             <form className="student-form" onSubmit={handleAddStudent}>

//                 <div className="form-group">
//                     <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//                     <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//                     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                     <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//                 </div><br/>

//                 <div className="form-group">
//                     <h3>Date of Birth</h3>
//                     <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
//                 </div><br/>

//                 <div className="form-group">
//                     <h3>Residential Address</h3>
//                     <input type="text" placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}/>
//                     <input type="text" placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
//                     <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
//                     <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
//                     <input type="text" placeholder="Zip Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
//                     <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
//                 </div><br/>

//                 <div className="form-group">
//                     <h3>Billing Address</h3>
//                     <label> <input type="checkbox" checked={copyAddress} onChange={(e) => handleCopyAddress(e.target.checked)} />Same as Residential Address </label>
//                     <input type="text" placeholder="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}/>
//                     <input type="text" placeholder="Area" value={billingAddress.area} onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })} />
//                     <input type="text" placeholder="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
//                     <input type="text" placeholder="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
//                     <input type="text" placeholder="Zip Code" value={billingAddress.zip} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
//                     <input type="text" placeholder="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} />
//                     <input type="text" placeholder="GST No." value={billingAddress.gstNo} onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })} />
//                 </div><br/>

//                 <div>
//                     <h3>Educational Details</h3>
//                     {educationDetails.map((edu, index) => (
//                         <div key={index} className="education-group">
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
//                             <select value={course.branch} onChange={(e) => handleCourseChange(index, 'branch', e.target.value)}>
//                                 <option value="">Select Branch</option>
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

                

//                 <button type="submit" className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => navigate(`/studentdetails`)} >Add Student</button>
//             </form>
//         </div>
//     );
// };
