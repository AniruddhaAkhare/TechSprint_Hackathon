// const AddStudent = () => {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
//     const [billingAddress, setBillingAddress] = useState({ name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
//     const [copyAddress, setCopyAddress] = useState(false);
//     const [dateOfBirth, setDateOfBirth] = useState("");
//     const [courseDetails, setCourseDetails] = useState([]);
//     const [educationDetails, setEducationDetails] = useState([]);
//     const [experienceDetails, setExperienceDetails] = useState([]);


//     const handleAddStudent = async (e) => {
//             e.preventDefault();
//             if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
//                 alert("Please fill all required fields.");
//                 return;
//             }
    
//             let installmentTotal = 0;
//             installmentDetails.map((installment) => {
//                 installmentTotal += Number(installment.dueAmount);
//             });
    
//             if (installmentTotal != total) {
//                 alert("Installment total does not match with total amount");
//                 console.log(installmentTotal);
//                 return;
//             }
    
//             try {
//                 const studentDocRef = await addDoc(collection(db, 'student'), {
//                     first_name: firstName,
//                     last_name: lastName,
//                     email,
//                     phone,
//                     residential_address: address,
//                     billing_address: billingAddress,
//                     goal: goal || "Not specified",
//                     status: status,
//                     date_of_birth: Timestamp.fromDate(new Date(dateOfBirth)),
//                     admission_date: Timestamp.fromDate(new Date(admissionDate)),
//                     course_details: courseDetails,
//                     course_id: courseId,
//                     education_details: educationDetails,
//                     experience_details: experienceDetails,
//                     discount: discount || 0,
//                     total: total || 0,
//                     fees: fees,
//                     installment_details: installmentDetails,
//                 });
    
//                 const studentId = studentDocRef.id;
//                 const enrollmentsRef = collection(db, 'enrollments');
//                 let paidAmt = 0;
//                 const today = new Date().toISOString().split("T")[0];
    
//                 let outstanding = 0;
//                 let overdue = 0;
    
//                 installmentDetails.forEach((installment) => {
//                     const amtPaid = installment.paidAmount || 0;
//                     const amtDue = installment.dueAmount || 0;
    
//                     paidAmt += Number(amtPaid);
    
//                     const dueDate = new Date(installment.dueDate).toISOString().split("T")[0];
    
//                     if (dueDate > today && installmentDetails.paidAmount === 0) {
//                         outstanding += Number(amtDue);
//                     } else if (dueDate <= today && installmentDetails.paidAmount === 0) {
//                         overdue += Number(amtDue);
//                     }
//                 });
    
//                 const enrollmentData = {
//                     student_id: studentId,
//                     course_id: courseId,
//                     enrollment_date: Timestamp.fromDate(new Date(admissionDate)),
//                     fee: {
//                         discount: discount || 0,
//                         total: total || 0,
    
//                         overdue: overdue,
    
//                         paid: paidAmt,
//                         outstanding: outstanding,
//                     },
//                     installments: installmentDetails,
//                 };
//                 await addDoc(enrollmentsRef, enrollmentData);
    
//                 const installmentsRef = collection(db, 'installments');
//                 for (const installmentData of installmentDetails) {
//                     await addDoc(installmentsRef, {
//                         ...installmentData,
//                         student_id: studentId
//                     });
//                 }
    
//                 alert("Student added successfully!");
//                 navigate("/studentdetails");
//             } catch (error) {
//                 console.error("Error adding student:", error);
//                 alert("Error adding student. Please try again.");
//             }
//         };
    
//     return (
// <>
//     <AddCourse />


//         </>
//     )
// }
// export default AddStudent;





import React, { useEffect, useState } from 'react';
import { db } from '../../../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    MenuItem,
    Select,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddCourse = () => {
    const studentId = "Bkh4j3MzYEKZfPFrlbXg";
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mode, setMode] = useState('');
    const [installmentDetails, setInstallmentDetails] = useState([{ number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '' }]);
    const [feeTemplate, setFeeTemplate] = useState('');
    const [showInstallmentDetails, setShowInstallmentDetails] = useState(false);

    if (!studentId) {
        return <div className='ml-80 p-4'>Loading...</div>;
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Course'));
                const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Courses", fetchedCourses);
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            }
        };
        fetchCourses();
    }, []);

    const addInstallment = () => {
        setInstallmentDetails([...installmentDetails, { number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '' }]);
    };

    const removeInstallment = (index) => {
        const updatedInstallments = installmentDetails.filter((_, i) => i !== index);
        setInstallmentDetails(updatedInstallments);
    };

    const handleInstallmentChange = (index, field, value) => {
        const updatedInstallments = installmentDetails.map((installment, i) => {
            if (i === index) {
                return { ...installment, [field]: value };
            }
            return installment;
        });
        setInstallmentDetails(updatedInstallments);
    };

    const saveEnrollmentData = async () => {
        const enrollmentData = {
            selectedCourse,
            mode,
            feeTemplate,
            installmentDetails,
        };

        try {
            await db.collection('enrollments').doc(studentId).set({ enrollmentData }, { merge: true });
            alert("Enrollment data saved successfully!");
        } catch (error) {
            console.error("Error saving enrollment data: ", error);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <h2 className="text-lg font-semibold mb-4">Add Courses</h2>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Fee Template</TableCell>
                            <TableCell>Installment Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Select
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Course</MenuItem>
                                    {courses.map(course => (
                                        <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Select
                                    fullWidth
                                    variant="outlined"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Mode</MenuItem>
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Offline">Offline</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Select
                                    fullWidth
                                    variant="outlined"
                                    value={feeTemplate}
                                    onChange={(e) => setFeeTemplate(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Fee Template</MenuItem>
                                    <MenuItem value="Installments">Installments</MenuItem>
                                    <MenuItem value="Finance">Finance</MenuItem>
                                    <MenuItem value="Full Fees">Full Fees</MenuItem>
                                    <MenuItem value="Free">Free</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setShowInstallmentDetails(prev => !prev)}
                                >
                                    {showInstallmentDetails ? 'Hide Installment Details' : 'Show Installment Details'}
                                </Button>
                                {showInstallmentDetails && feeTemplate === 'Installments' && (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Installment Number</TableCell>
                                                <TableCell>Due Date</TableCell>
                                                <TableCell>Due Amount</TableCell>
                                                <TableCell>Paid Date</TableCell>
                                                <TableCell>Paid Amount</TableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {installmentDetails.map((installment, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <TextField
                                                                variant="outlined"
                                                                value={installment.number}
                                                                onChange={(e) => handleInstallmentChange(index, 'number', e.target.value)}
                                                                placeholder="Installment Number"
                                                                />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                variant="outlined"
                                                                type="date"
                                                                value={installment.dueDate}
                                                                onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                                                                />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                variant="outlined"
                                                                value={installment.dueAmount}
                                                                onChange={(e) => handleInstallmentChange(index, 'dueAmount', e.target.value)}
                                                                placeholder="Due Amount"
                                                                />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                variant="outlined"
                                                                type="date"
                                                                value={installment.paidDate}
                                                                onChange={(e) => handleInstallmentChange(index, 'paidDate', e.target.value)}
                                                                />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                variant="outlined"
                                                                value={installment.paidAmount}
                                                                onChange={(e) => handleInstallmentChange(index, 'paidAmount', e.target.value)}
                                                                placeholder="Paid Amount"
                                                                />
                                                        </TableCell>
                                                            <TableCell>
                                                                <Button variant="contained" color="secondary" onClick={() => removeInstallment(index)}>Remove</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    )}
                            </TableCell>
                        </TableRow> 
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={addInstallment} className="mt-4">Add Installment</Button>
            <Button variant="contained" color="primary" onClick={saveEnrollmentData} className="mt-4">Save Enrollment Data</Button>
        </div>
    );
};

export default AddCourse;
