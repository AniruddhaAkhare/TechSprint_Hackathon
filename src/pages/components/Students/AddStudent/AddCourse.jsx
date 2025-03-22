import React, { useEffect, useState } from 'react';
import { db } from '../../../../config/firebase';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
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

    const defaultFinanceDetails = {
        financingType: '',
        providerName: '',
        agreementId: '',
        totalAmountFinanced: 0,
        repaymentTerms: '',
        status: 'Pending',
        approvalDate: '',
        remarks: ''
    };

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
        },
        financeDetails: { ...defaultFinanceDetails }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const coursesSnapshot = await getDocs(collection(db, 'Course'));
                const fetchedCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(fetchedCourses);

                const enrollmentDoc = await getDoc(doc(db, 'enrollments', studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const existingCourses = enrollmentDoc.data().courses.map(course => ({
                        ...defaultEntry,
                        ...course,
                        selectedCourse: fetchedCourses.find(c => c.id === course.selectedCourse?.id) || course.selectedCourse || '',
                        financeDetails: { ...defaultFinanceDetails, ...course.financeDetails }
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

    const addCourseEntry = () => setCourseEntries([...courseEntries, defaultEntry]);
    const removeCourseEntry = (index) => setCourseEntries(courseEntries.filter((_, i) => i !== index));

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
                    const totalFees = fullFeesDetails.totalFees || 0;
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
                    if (j === installmentIndex) return { ...installment, [field]: value };
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

    const handleFinanceChange = (index, field, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                return {
                    ...entry,
                    financeDetails: { ...entry.financeDetails, [field]: value }
                };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const saveEnrollmentData = async () => {
        try {
            await setDoc(doc(db, 'enrollments', studentId), { courses: courseEntries }, { merge: true });
            alert("Enrollment data saved successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error saving enrollment data: ", error);
            alert("Failed to save enrollment data.");
        }
    };

    if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

    return (
        <div className='ml-80 w-full'>
            <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h5" className="text-gray-800 font-semibold">
                        Add Courses
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        Back
                    </Button>
                </div>

                {courseEntries.map((entry, courseIndex) => (
                    <div key={courseIndex} className="mb-8 bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <Select
                                
                                value={entry.selectedCourse || ''}
                                onChange={(e) => handleChange(courseIndex, 'selectedCourse', e.target.value)}
                                displayEmpty
                                className="w-full bg-gray-100 rounded-lg"
                                renderValue={(selected) => selected ? selected.name : <span className="text-gray-400">Select Course</span>}
                            >
                                {courses.map(course => (
                                    <MenuItem key={course.id} value={course}>{course.name}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                
                                value={entry.mode || ''}
                                onChange={(e) => handleChange(courseIndex, 'mode', e.target.value)}
                                displayEmpty
                                className="w-full bg-gray-100 rounded-lg"
                                renderValue={(selected) => selected || <span className="text-gray-400">Select Mode</span>}
                            >
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Offline">Offline</MenuItem>
                            </Select>
                            <Select
                                value={entry.feeTemplate || ''}
                                onChange={(e) => handleChange(courseIndex, 'feeTemplate', e.target.value)}
                                displayEmpty
                                className="w-full bg-gray-100 rounded-lg"
                                renderValue={(selected) => selected || <span className="text-gray-400">Select Fee Template</span>}
                            >
                                <MenuItem value="Installments">Installments</MenuItem>
                                <MenuItem value="Finance">Finance</MenuItem>
                                <MenuItem value="FullFees">Full Fees</MenuItem>
                                <MenuItem value="Free">Free</MenuItem>
                            </Select>
                        </div>

                        {entry.feeTemplate === 'FullFees' && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Typography className="text-gray-700">Total Fees: {entry.fullFeesDetails.totalFees}</Typography>
                                    <Select
                                        value={entry.fullFeesDetails.discountType || ''}
                                        onChange={(e) => handleFullFeesChange(courseIndex, 'discountType', '', e.target.value)}
                                        displayEmpty
                                        className="w-32 bg-gray-100 rounded-lg"
                                    >
                                        <MenuItem value="" disabled>Type</MenuItem>
                                        <MenuItem value="percentage">%</MenuItem>
                                        <MenuItem value="value">₹</MenuItem>
                                    </Select>
                                    <TextField
                                        label="Discount"
                                        value={entry.fullFeesDetails.discountValue || ''}
                                        onChange={(e) => handleFullFeesChange(courseIndex, 'discountValue', '', e.target.value)}
                                        className="w-32"
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Typography className="text-gray-700">Fee After Discount: {entry.fullFeesDetails.feeAfterDiscount}</Typography>
                                </div>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-blue">
                                                <TableCell className="text-gray-800 font-medium">Title</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Amount</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Date</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Received By</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Remark</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Registration</TableCell>
                                                <TableCell><TextField value={entry.fullFeesDetails.registration.amount || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'amount', e.target.value)} size="small" /></TableCell>
                                                <TableCell><TextField type="date" value={entry.fullFeesDetails.registration.date || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'date', e.target.value)} size="small" /></TableCell>
                                                <TableCell><TextField value={entry.fullFeesDetails.registration.receivedBy || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'receivedBy', e.target.value)} size="small" /></TableCell>
                                                <TableCell><TextField value={entry.fullFeesDetails.registration.remark || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'remark', e.target.value)} size="small" /></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Final Payment</TableCell>
                                                <TableCell><TextField value={entry.fullFeesDetails.finalPayment.amount || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'amount', e.target.value)} size="small" /></TableCell>
                                                <TableCell><TextField type="date" value={entry.fullFeesDetails.finalPayment.date || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'date', e.target.value)} size="small" /></TableCell>
                                                <TableCell><TextField value={entry.fullFeesDetails.finalPayment.receivedBy || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'receivedBy', e.target.value)} size="small" /></TableCell>
                                                <TableCell><TextField value={entry.fullFeesDetails.finalPayment.remark || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'remark', e.target.value)} size="small" /></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}

                        {entry.feeTemplate === 'Installments' && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Typography className="text-gray-700">Total Fees: {entry.fullFeesDetails.totalFees}</Typography>
                                    <Select
                                        value={entry.fullFeesDetails.discountType || ''}
                                        onChange={(e) => handleFullFeesChange(courseIndex, 'discountType', '', e.target.value)}
                                        displayEmpty
                                        className="w-32 bg-gray-100 rounded-lg"
                                    >
                                        <MenuItem value="" disabled>Type</MenuItem>
                                        <MenuItem value="percentage">%</MenuItem>
                                        <MenuItem value="value">₹</MenuItem>
                                    </Select>
                                    <TextField
                                        label="Discount"
                                        value={entry.fullFeesDetails.discountValue || ''}
                                        onChange={(e) => handleFullFeesChange(courseIndex, 'discountValue', '', e.target.value)}
                                        className="w-32"
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Typography className="text-gray-700">Fee After Discount: {entry.fullFeesDetails.feeAfterDiscount}</Typography>
                                </div>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-blue">
                                                <TableCell className="text-gray-800 font-medium">No.</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Due Date</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Due Amount</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Paid Date</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Paid Amount</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Mode</TableCell>
                                                <TableCell className="text-gray-800 font-medium">PDC Status</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Received By</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Remark</TableCell>
                                                <TableCell className="text-gray-800 font-medium">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {entry.installmentDetails.map((installment, installmentIndex) => (
                                                <TableRow key={installmentIndex}>
                                                    <TableCell><TextField value={installment.number || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'number', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField type="date" value={installment.dueDate || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'dueDate', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={installment.dueAmount || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'dueAmount', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField type="date" value={installment.paidDate || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paidDate', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={installment.paidAmount || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paidAmount', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={installment.paymentMode || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'paymentMode', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={installment.pdcStatus || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'pdcStatus', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={installment.receivedBy || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'receivedBy', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={installment.remark || ''} onChange={(e) => handleInstallmentChange(courseIndex, installmentIndex, 'remark', e.target.value)} size="small" /></TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="text"
                                                            color="error"
                                                            onClick={() => removeInstallment(courseIndex, installmentIndex)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Button
                                    variant="outlined"
                                    onClick={() => addInstallment(courseIndex)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Add Installment
                                </Button>
                            </div>
                        )}

                        {entry.feeTemplate === 'Free' && entry.fullFeesDetails.totalFees === 0 && (
                            <Typography className="text-gray-600 mt-4">This is a free course</Typography>
                        )}

                        {entry.feeTemplate === 'Finance' && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Typography className="text-gray-700">Total Fees: {entry.fullFeesDetails?.totalFees || 0}</Typography>
                                    <Select
                                        value={entry.financeDetails?.financingType || ''}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'financingType', e.target.value)}
                                        displayEmpty
                                        className="w-48 bg-gray-100 rounded-lg"
                                    >
                                        <MenuItem value="" disabled>Select Financing Type</MenuItem>
                                        <MenuItem value="Loan">Loan</MenuItem>
                                        <MenuItem value="Employer">Employer Sponsorship</MenuItem>
                                        <MenuItem value="Deferred">Deferred Payment</MenuItem>
                                        <MenuItem value="Scholarship">Scholarship</MenuItem>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextField
                                        label="Provider Name"
                                        value={entry.financeDetails?.providerName || ''}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'providerName', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Agreement ID"
                                        value={entry.financeDetails?.agreementId || ''}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'agreementId', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Total Amount Financed"
                                        type="number"
                                        value={entry.financeDetails?.totalAmountFinanced || 0}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'totalAmountFinanced', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Repayment Terms"
                                        value={entry.financeDetails?.repaymentTerms || ''}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'repaymentTerms', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                    <Select
                                        value={entry.financeDetails?.status || 'Pending'}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'status', e.target.value)}
                                        fullWidth
                                        className="bg-gray-100 rounded-lg"
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Approved">Approved</MenuItem>
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                    <TextField
                                        label="Approval Date"
                                        type="date"
                                        value={entry.financeDetails?.approvalDate || ''}
                                        onChange={(e) => handleFinanceChange(courseIndex, 'approvalDate', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>
                                <TextField
                                    label="Remarks"
                                    value={entry.financeDetails?.remarks || ''}
                                    onChange={(e) => handleFinanceChange(courseIndex, 'remarks', e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </div>
                        )}

                        <Button
                            variant="text"
                            color="error"
                            onClick={() => removeCourseEntry(courseIndex)}
                            className="mt-4 text-red-500 hover:text-red-700"
                        >
                            Remove Course
                        </Button>
                    </div>
                ))}

                <div className="flex space-x-4">
                    <Button
                        variant="contained"
                        onClick={addCourseEntry}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                    >
                        Add Course
                    </Button>
                    <Button
                        variant="contained"
                        onClick={saveEnrollmentData}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
                    >
                        Save Enrollment
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;