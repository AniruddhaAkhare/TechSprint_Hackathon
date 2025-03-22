import React, { useEffect, useState } from 'react';
import { db } from '../../../../config/firebase';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import {useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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

const AddCourse = () => {
    const { studentId } = useParams();
    const [courses, setCourses] = useState([]);
    const [courseEntries, setCourseEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const defaultEntry = {
        selectedCourse: '',
        mode: '',
        feeTemplate: '',
        installmentDetails: [{ number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '', paymentMode: '', pdcStatus: '', receivedBy: '', remark: '' }],
        fullFeesDetails: {
            discountType: '',
            discountValue: '',
            feeAfterDiscount: 0,
            totalFees: 0,
            registration: { amount: '', date: '', receivedBy: '', remark: '' },
            finalPayment: { amount: '', date: '', receivedBy: '', remark: '' }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const coursesSnapshot = await getDocs(collection(db, 'Course'));
                const fetchedCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(fetchedCourses);

                // Fetch existing enrollment data
                const enrollmentDoc = await getDoc(doc(db, 'enrollments', studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const existingCourses = enrollmentDoc.data().courses.map(course => ({
                        ...course,
                        selectedCourse: fetchedCourses.find(c => c.id === course.selectedCourse?.id) || course.selectedCourse
                    }));
                    setCourseEntries(existingCourses);
                } else {
                    setCourseEntries([defaultEntry]);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                setCourseEntries([defaultEntry]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    const addCourseEntry = () => {
        setCourseEntries([...courseEntries, defaultEntry]);
    };

    const removeCourseEntry = (index) => {
        setCourseEntries(courseEntries.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                if (field === 'selectedCourse') {
                    return {
                        ...entry,
                        [field]: value,
                        fullFeesDetails: { ...entry.fullFeesDetails, totalFees: value.fee || 0 }
                    };
                }
                return { ...entry, [field]: value };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const handleFullFeesChange = (index, field, subField, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                const fullFeesDetails = { ...entry.fullFeesDetails };
                
                if (field === 'discountType') {
                    fullFeesDetails.discountType = value;
                } else if (field === 'discountValue') {
                    fullFeesDetails.discountValue = value;
                    const totalFees = fullFeesDetails.totalFees;
                    fullFeesDetails.feeAfterDiscount = fullFeesDetails.discountType === 'percentage' 
                        ? totalFees - (totalFees * (Number(value) / 100))
                        : totalFees - Number(value);
                } else {
                    fullFeesDetails[field] = { ...fullFeesDetails[field], [subField]: value };
                }
                
                return { ...entry, fullFeesDetails };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === courseIndex) {
                const updatedDetails = entry.installmentDetails.map((installment, j) => {
                    if (j === installmentIndex) {
                        return { ...installment, [field]: value };
                    }
                    return installment;
                });
                return { ...entry, installmentDetails: updatedDetails };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const addInstallment = (index) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                return {
                    ...entry,
                    installmentDetails: [...entry.installmentDetails, {
                        number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '',
                        paymentMode: '', pdcStatus: '', receivedBy: '', remark: ''
                    }]
                };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const removeInstallment = (courseIndex, installmentIndex) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === courseIndex) {
                return { ...entry, installmentDetails: entry.installmentDetails.filter((_, j) => j !== installmentIndex) };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const saveEnrollmentData = async () => {
        try {
            await setDoc(doc(db, 'enrollments', studentId), { courses: courseEntries }, { merge: true });
            alert("Enrollment data saved successfully!");
        } catch (error) {
            console.error("Error saving enrollment data: ", error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <Button variant="contained" onClick={()=>{navigate(-1)}}>Back</Button>
            <h2 className="text-lg font-semibold mb-4">Add Courses</h2>
            {courseEntries.map((entry, courseIndex) => (
                <TableContainer key={courseIndex} className="mb-4 w-screen">
                    <Table className="w-screen">
                        <TableHead>
                            <TableRow>
                                <TableCell>Course</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Fee Template</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Select
                                        fullWidth
                                        value={entry.selectedCourse}
                                        onChange={(e) => handleChange(courseIndex, 'selectedCourse', e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Course</MenuItem>
                                        {courses.map(course => (
                                            <MenuItem key={course.id} value={course}>{course.name}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        fullWidth
                                        value={entry.mode}
                                        onChange={(e) => handleChange(courseIndex, 'mode', e.target.value)}
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
                                        value={entry.feeTemplate}
                                        onChange={(e) => handleChange(courseIndex, 'feeTemplate', e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Fee Template</MenuItem>
                                        <MenuItem value="Installments">Installments</MenuItem>
                                        <MenuItem value="Finance">Finance</MenuItem>
                                        <MenuItem value="FullFees">Full Fees</MenuItem>
                                        <MenuItem value="Free">Free</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => removeCourseEntry(courseIndex)}>Remove</Button>
                                </TableCell>
                            </TableRow>

                            {entry.feeTemplate === 'FullFees' && (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Typography>Total Fees: {entry.fullFeesDetails.totalFees}</Typography>
                                            <Select
                                                value={entry.fullFeesDetails.discountType || ''}
                                                onChange={(e) => handleFullFeesChange(courseIndex, 'discountType', '', e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Discount Type</MenuItem>
                                                <MenuItem value="percentage">Percentage</MenuItem>
                                                <MenuItem value="value">Value</MenuItem>
                                            </Select>
                                            <TextField
                                                label="Discount"
                                                value={entry.fullFeesDetails.discountValue || ''}
                                                onChange={(e) => handleFullFeesChange(courseIndex, 'discountValue', '', e.target.value)}
                                                className='gap-10'
                                            />
                                            <Typography>Fee After Discount: {entry.fullFeesDetails.feeAfterDiscount}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Received By</TableCell>
                                            <TableCell>Remark</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Registration Amount</TableCell>
                                            <TableCell><TextField value={entry.fullFeesDetails.registration.amount} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'amount', e.target.value)} /></TableCell>
                                            <TableCell><TextField type="date" value={entry.fullFeesDetails.registration.date} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'date', e.target.value)} /></TableCell>
                                            <TableCell><TextField value={entry.fullFeesDetails.registration.receivedBy} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'receivedBy', e.target.value)} /></TableCell>
                                            <TableCell><TextField value={entry.fullFeesDetails.registration.remark} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'remark', e.target.value)} /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Final Payment</TableCell>
                                            <TableCell><TextField value={entry.fullFeesDetails.finalPayment.amount} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'amount', e.target.value)} /></TableCell>
                                            <TableCell><TextField type="date" value={entry.fullFeesDetails.finalPayment.date} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'date', e.target.value)} /></TableCell>
                                            <TableCell><TextField value={entry.fullFeesDetails.finalPayment.receivedBy} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'receivedBy', e.target.value)} /></TableCell>
                                            <TableCell><TextField value={entry.fullFeesDetails.finalPayment.remark} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'remark', e.target.value)} /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </>
                            )}

                            {entry.feeTemplate === 'Installments' && (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Typography>Total Fees: {entry.fullFeesDetails.totalFees}</Typography>
                                            <Select
                                                value={entry.fullFeesDetails.discountType || ''}
                                                onChange={(e) => handleFullFeesChange(courseIndex, 'discountType', '', e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Discount Type</MenuItem>
                                                <MenuItem value="percentage">Percentage</MenuItem>
                                                <MenuItem value="value">Value</MenuItem>
                                            </Select>
                                            <TextField
                                                label="Discount"
                                                value={entry.fullFeesDetails.discountValue || ''}
                                                onChange={(e) => handleFullFeesChange(courseIndex, 'discountValue', '', e.target.value)}
                                            />
                                            <Typography>Fee After Discount: {entry.fullFeesDetails.feeAfterDiscount}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Installment Number</TableCell>
                                            <TableCell>Due Date</TableCell>
                                            <TableCell>Due Amount</TableCell>
                                            <TableCell>Paid date</TableCell>
                                            <TableCell>Paid Amount</TableCell>
                                            <TableCell>Payment Mode</TableCell>
                                            <TableCell>PDC Status</TableCell>
                                            <TableCell>Received By</TableCell>
                                            <TableCell>Remark</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {entry.installmentDetails.map((installment, installmentIndex) => (
                                        <TableBody key={installmentIndex}>
                                            <TableRow>
                                                <TableCell><TextField value={installment.number} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'number', e.target.value)} placeholder="Number" /></TableCell>
                                                <TableCell><TextField type="date" value={installment.dueDate} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'dueDate', e.target.value)} /></TableCell>
                                                <TableCell><TextField value={installment.dueAmount} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'dueAmount', e.target.value)} placeholder="Due Amount" /></TableCell>
                                                <TableCell><TextField type="date" value={installment.paidDate} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paidDate', e.target.value)} /></TableCell>
                                                <TableCell><TextField value={installment.paidAmount} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paidAmount', e.target.value)} placeholder="Paid Amount" /></TableCell>
                                                <TableCell><TextField value={installment.paymentMode} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paymentMode', e.target.value)} placeholder="Payment Mode" /></TableCell>
                                                <TableCell><TextField value={installment.pdcStatus} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'pdcStatus', e.target.value)} placeholder="PDC Status" /></TableCell>
                                                <TableCell><TextField value={installment.receivedBy} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'receivedBy', e.target.value)} placeholder="Received By" /></TableCell>
                                                <TableCell><TextField value={installment.remark} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'remark', e.target.value)} placeholder="Remark" /></TableCell>
                                                <TableCell><Button onClick={() => removeInstallment(courseIndex, installmentIndex)}>Remove</Button></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Button onClick={() => addInstallment(courseIndex)}>Add Installment</Button>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}

                            {entry.feeTemplate === 'Free' && entry.fullFeesDetails.totalFees === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography>This is a free course</Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {entry.feeTemplate === 'Finance' && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography>To be implemented later</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ))}
            <Button variant="contained" onClick={addCourseEntry}>Add Course</Button>
            <Button variant="contained" onClick={saveEnrollmentData} className="ml-4">Save Enrollment</Button>
        </div>
    );
};

export default AddCourse;