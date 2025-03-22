import React, { useEffect, useState } from 'react';
import { db } from '../../../../config/firebase'; // adjust this import based on your project structure
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
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
    const [courseEntries, setCourseEntries] = useState([
        {
            selectedCourse: '',
            mode: '',
            feeTemplate: '',
            installmentDetails: [{ number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '' }],
            fullFeesDetails: { discountType: 'percentage', discountvalue: '', feeAfterDiscount: 0, paymentMethod: '', collectorName: '', remarks: '', totalFees: 0 }
        }
    ]);
    const [discountType, setDiscountType] = useState();
    const [showInstallmentDetails, setShowInstallmentDetails] = useState(false);
    const [feeTemplate, setFeeTemplate] = useState('');

    const [discountedAmount, setDiscountedAmount] = useState();
    const [discountedPercentage, setDiscountedPercentage] = useState();
    const [totalFees, setTotalFees] = useState();


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Course'));
                const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            }
        };

        fetchCourses();
    }, []);

    const addCourseEntry = () => {
        setCourseEntries([...courseEntries, {
            selectedCourse: '',
            mode: '',
            feeTemplate: '',
            installmentDetails: [{ number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '' }],
            fullFeesDetails: { discountType: 'Percentage', discountvalue: '', feeAfterDiscount: 0, paymentMethod: '', collectorName: '', remarks: '', totalFees: 0 }
        }]);
    };

    const removeCourseEntry = (index) => {
        const updatedEntries = courseEntries.filter((_, i) => i !== index);
        setCourseEntries(updatedEntries);
    };

    const handleChange = (index, field, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                return { ...entry, [field]: value };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
        const updatedInstallments = courseEntries.map((entry, i) => {
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
        setCourseEntries(updatedInstallments);
    };

    const addInstallment = (index) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                return { ...entry, installmentDetails: [...entry.installmentDetails, { number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '' }] };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const removeInstallment = (courseIndex, installmentIndex) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === courseIndex) {
                const updatedDetails = entry.installmentDetails.filter((_, j) => j !== installmentIndex);
                return { ...entry, installmentDetails: updatedDetails };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const saveEnrollmentData = async () => {
        try {
            const enrollmentData = { courses: courseEntries };
            await db.collection('enrollments').doc(studentId).set({ enrollmentData }, { merge: true });
            alert("Enrollment data saved successfully!");
        } catch (error) {
            console.error("Error saving enrollment data: ", error);
        }
    };

    const handleDiscount = async () => {
        console.log("Clicked");
        if (totalFees && discount) {
            const discountAmt = totalFees * (Number(discountedPercentage) / 100);
            const finalAmount = Number(totalFees) - Number(discountAmt);
            console.log("Final Amount after Discount:", finalAmount);
            setDiscountedAmount(finalAmount);
        } else {
            console.error("Total Fees or Discount Percentage is undefined");
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <h2 className="text-lg font-semibold mb-4">Add Courses</h2>
            {courseEntries.map((entry, courseIndex) => (
                <TableContainer key={courseIndex} className="mb-4">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Course</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Fee Template</TableCell>
                                <TableCell>Installments</TableCell>
                                <TableCell>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Select
                                        fullWidth
                                        variant="outlined"
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
                                        variant="outlined"
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
                                        variant="outlined"
                                        value={entry.feeTemplate}
                                        onChange={(e) => { handleChange(courseIndex, 'feeTemplate', e.target.value), setFeeTemplate(e.target.value) }}
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
                                    <Button variant="contained" color="primary" onClick={() => { addInstallment(courseIndex), setShowInstallmentDetails(prev => !prev) }}>Add Payment

                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => removeCourseEntry(courseIndex)}>Remove Course</Button>
                                </TableCell>
                            </TableRow>
                            {feeTemplate === 'Installments' && (
                                <Table fullWidth>

                                    {entry.installmentDetails.map((installment, installmentIndex) => (
                                        <div className='pl-24'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Installment Number</TableCell>
                                                    <TableCell>Due Date</TableCell>
                                                    <TableCell>Due Amount</TableCell>
                                                    <TableCell>Paid Date</TableCell>
                                                    <TableCell>Paid Amount</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow key={installmentIndex}>
                                                    <TableCell>
                                                        <TextField
                                                            variant="outlined"
                                                            value={installment.number}
                                                            onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'number', e.target.value)}
                                                            placeholder="Installment Number"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            variant="outlined"
                                                            type="date"
                                                            value={installment.dueDate}
                                                            onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'dueDate', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            variant="outlined"
                                                            value={installment.dueAmount}
                                                            onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'dueAmount', e.target.value)}
                                                            placeholder="Due Amount"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            variant="outlined"
                                                            type="date"
                                                            value={installment.paidDate}
                                                            onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paidDate', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            variant="outlined"
                                                            value={installment.paidAmount}
                                                            onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paidAmount', e.target.value)}
                                                            placeholder="Paid Amount"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="secondary" onClick={() => removeInstallment(courseIndex, installmentIndex)}>Remove</Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </div>
                                    ))}

                                </Table>
                            )}

                            {feeTemplate === 'FullFees' && (
                                <>
                                    <Typography>Discount Type</Typography>
                                    <Select
                                        fullWidth
                                        variant="outlined"
                                        value={entry.discountType}
                                        onChange={(e) => { setDiscountType(e.target.value) }}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select</MenuItem>
                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                        <MenuItem value="Value">Value</MenuItem>

                                    </Select>
                                    {discountType === 'Percentage' && (
                                        <div>
                                            {entry.selectedCourse && (
                                                <>
                                                    <div>
                                                        <Typography>Total Fees:</Typography>
                                                        <TextField value={entry?.selectedCourse?.fee} aria-readonly onChange={() => { setTotalFees(entry?.selectedCourse?.fee) }}></TextField>
                                                    </div>
                                                    <div>
                                                        <Typography>Discount Percentage:</Typography>
                                                        <TextField variant='outlined' value={discountedPercentage} onChange={(e) => { setDiscountedPercentage(e.target.value) }}></TextField>
                                                    </div>
                                                    <div>
                                                        <Button variant='contained' onClick={handleDiscount}>Apply Discount</Button>
                                                    </div>
                                                    <div>
                                                        {discountedAmount &&
                                                            <>
                                                                <Typography>Discounted Fees:</Typography>
                                                                <TextField value={discountedAmount} aria-readonly ></TextField>
                                                            </>
                                                        }
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    )}
                                    {discountType === 'Value' && (
                                        <div>

                                        </div>
                                    )}

                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ))}
            <div>
                <Button variant="contained" color="primary" onClick={addCourseEntry} className="mt-4">Add Course</Button><span>   </span>
                <Button variant="contained" color="primary" onClick={saveEnrollmentData} className="mt-4">Save Enrollment Data</Button>
            </div>
        </div>
    );
};

export default AddCourse;

