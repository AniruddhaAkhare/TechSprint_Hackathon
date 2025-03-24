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
    InputLabel,
    FormControl,
} from '@mui/material';

const AddCourse = () => {
    const { studentId } = useParams();
    const [courses, setCourses] = useState([]);
    const [courseEntries, setCourseEntries] = useState([]);
    const [financePartners, setFinancePartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const defaultFinanceDetails = {
        financePartner: '',
        contactPerson: '',
        scheme: '',
        loanAmount: 0,
        downPayment: 0,
        downPaymentDate: '',
        applicantName: '',
        relationship: '',
        loanStatus: 'Pending',
        bankStatement: null,
        aadharCard: null,
        panCard: null,
        registration: { amount: '', date: '', receivedBy: '', paymentMethod: '', remark: '' }
    };

    const defaultEntry = {
        selectedCourse: '',
        mode: '',
        feeTemplate: '',
        installmentDetails: [
            { number: '', dueDate: '', dueAmount: '', paidDate: '', paidAmount: '', paymentMode: '', pdcStatus: '', receivedBy: '', remark: '' }
        ],
        fullFeesDetails: {
            discountType: '',
            discountValue: '',
            feeAfterDiscount: 0,
            totalFees: 0,
            registration: { amount: '', date: '', receivedBy: '', paymentMethod: '', remark: '' },
            finalPayment: { amount: '', date: '', receivedBy: '', paymentMethod: '', remark: '' }
        },
        financeDetails: { ...defaultFinanceDetails },
        registration: { amount: '', date: '', receivedBy: '', paymentMethod: '', remark: '' }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const coursesSnapshot = await getDocs(collection(db, 'Course'));
                const fetchedCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(fetchedCourses);

                const financePartnersSnapshot = await getDocs(collection(db, 'FinancePartner'));
                const activeFinancePartners = financePartnersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(partner => partner.status === 'Active');
                setFinancePartners(activeFinancePartners);

                const enrollmentDoc = await getDoc(doc(db, 'enrollments', studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const existingCourses = enrollmentDoc.data().courses.map(course => ({
                        ...defaultEntry,
                        ...course,
                        selectedCourse: fetchedCourses.find(c => c.id === course.selectedCourse?.id) || course.selectedCourse || '',
                        financeDetails: { ...defaultFinanceDetails, ...course.financeDetails, scheme: course.financeDetails?.scheme || '' },
                        registration: course.registration || defaultEntry.registration
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
                setTimeout(() => setIsOpen(true), 10);
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

    const handleRegistrationChange = (index, field, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                return {
                    ...entry,
                    registration: { ...entry.registration, [field]: value }
                };
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

    const handleFinanceChange = (index, field, subField, value) => {
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                const financeDetails = { ...entry.financeDetails };
                if (subField) {
                    financeDetails[field] = { ...financeDetails[field], [subField]: value };
                } else {
                    financeDetails[field] = value;
                }
                // Reset dependent fields when financePartner changes
                if (field === 'financePartner') {
                    financeDetails.contactPerson = '';
                    financeDetails.scheme = '';
                }
                return { ...entry, financeDetails };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const handleFileChange = (index, field, event) => {
        const file = event.target.files[0];
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                return {
                    ...entry,
                    financeDetails: { ...entry.financeDetails, [field]: file }
                };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const saveEnrollmentData = async () => {
        try {
            const updatedEntries = courseEntries.map(entry => {
                if (entry.feeTemplate === 'Finance') {
                    const { bankStatement, aadharCard, panCard, ...restFinanceDetails } = entry.financeDetails;
                    return { ...entry, financeDetails: restFinanceDetails };
                }
                return entry;
            });
            await setDoc(doc(db, 'enrollments', studentId), { courses: updatedEntries }, { merge: true });
            alert("Enrollment data saved successfully!");
            handleClose();
        } catch (error) {
            console.error("Error saving enrollment data: ", error);
            alert("Failed to save enrollment data.");
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => navigate(-1), 300);
    };

    if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
            <div
                className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h5" className="text-gray-800 font-semibold">
                            Add Courses
                        </Typography>
                        <Button onClick={handleClose} className="text-gray-500 hover:text-gray-700" sx={{ minWidth: 0, padding: 1 }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium">Title</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Payment Method</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Remark</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Registration</TableCell>
                                                    <TableCell><TextField value={entry.fullFeesDetails.registration.amount || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'amount', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField type="date" value={entry.fullFeesDetails.registration.date || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'date', e.target.value)} size="small" /></TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.fullFeesDetails.registration.paymentMethod || ""}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, "registration", "paymentMethod", e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                        >
                                                            <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell><TextField value={entry.fullFeesDetails.registration.receivedBy || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'receivedBy', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={entry.fullFeesDetails.registration.remark || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'remark', e.target.value)} size="small" /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Final Payment</TableCell>
                                                    <TableCell><TextField value={entry.fullFeesDetails.finalPayment.amount || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'amount', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField type="date" value={entry.fullFeesDetails.finalPayment.date || ''} onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'date', e.target.value)} size="small" /></TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.fullFeesDetails.finalPayment.paymentMethod || ""}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, "finalPayment", "paymentMethod", e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                        >
                                                            <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
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
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">Registration</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium">Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Payment Method</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Remark</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><TextField value={entry.registration.amount || ''} onChange={(e) => handleRegistrationChange(courseIndex, 'amount', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField type="date" value={entry.registration.date || ''} onChange={(e) => handleRegistrationChange(courseIndex, 'date', e.target.value)} size="small" /></TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.registration.paymentMethod || ""}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, "paymentMethod", e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                        >
                                                            <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell><TextField value={entry.registration.receivedBy || ''} onChange={(e) => handleRegistrationChange(courseIndex, 'receivedBy', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={entry.registration.remark || ''} onChange={(e) => handleRegistrationChange(courseIndex, 'remark', e.target.value)} size="small" /></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">Installments</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
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
                                    <Typography variant="subtitle1" className="text-gray-700">Total Fees: {entry.fullFeesDetails?.totalFees || 0}</Typography>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">Registration</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium">Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Payment Method</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium">Remark</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><TextField value={entry.financeDetails.registration.amount || ''} onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'amount', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField type="date" value={entry.financeDetails.registration.date || ''} onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'date', e.target.value)} size="small" /></TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.financeDetails.registration.paymentMethod || ""}
                                                            onChange={(e) => handleFinanceChange(courseIndex, "registration", "paymentMethod", e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                        >
                                                            <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell><TextField value={entry.financeDetails.registration.receivedBy || ''} onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'receivedBy', e.target.value)} size="small" /></TableCell>
                                                    <TableCell><TextField value={entry.financeDetails.registration.remark || ''} onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'remark', e.target.value)} size="small" /></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">Finance Details</Typography>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormControl fullWidth>
                                            <InputLabel>Finance Partner</InputLabel>
                                            <Select
                                                value={entry.financeDetails.financePartner || ''}
                                                onChange={(e) => handleFinanceChange(courseIndex, 'financePartner', '', e.target.value)}
                                                label="Finance Partner"
                                                className="bg-gray-100 rounded-lg"
                                            >
                                                <MenuItem value="" disabled>Select Finance Partner</MenuItem>
                                                {financePartners.map(partner => (
                                                    <MenuItem key={partner.id} value={partner.name}>{partner.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel>Contact Person</InputLabel>
                                            <Select
                                                value={entry.financeDetails.contactPerson || ''}
                                                onChange={(e) => handleFinanceChange(courseIndex, 'contactPerson', '', e.target.value)}
                                                label="Contact Person"
                                                className="bg-gray-100 rounded-lg"
                                                disabled={!entry.financeDetails.financePartner}
                                            >
                                                <MenuItem value="" disabled>Select Contact Person</MenuItem>
                                                {entry.financeDetails.financePartner && financePartners
                                                    .find(p => p.name === entry.financeDetails.financePartner)?.contactPersons
                                                    ?.map((person, idx) => (
                                                        <MenuItem key={idx} value={person.name}>{person.name}</MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel>Finance Scheme</InputLabel>
                                            <Select
                                                value={entry.financeDetails.scheme || ''}
                                                onChange={(e) => handleFinanceChange(courseIndex, 'scheme', '', e.target.value)}
                                                label="Finance Scheme"
                                                className="bg-gray-100 rounded-lg"
                                                disabled={!entry.financeDetails.financePartner}
                                            >
                                                <MenuItem value="">Select Finance Scheme</MenuItem>
                                                {entry.financeDetails.financePartner && financePartners
                                                    .find(p => p.name === entry.financeDetails.financePartner)?.scheme
                                                    ?.map((schemeItem, idx) => (
                                                        <MenuItem
                                                            key={idx}
                                                            value={schemeItem.plan}
                                                        >
                                                            {schemeItem.plan}
                                                            {schemeItem.description && ` - ${schemeItem.description}`}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Loan Amount"
                                            type="number"
                                            value={entry.financeDetails.loanAmount || 0}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'loanAmount', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                        <TextField
                                            label="Down Payment"
                                            type="number"
                                            value={entry.financeDetails.downPayment || 0}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'downPayment', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                        <TextField
                                            label="Down Payment Date"
                                            type="date"
                                            value={entry.financeDetails.downPaymentDate || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'downPaymentDate', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Applicant Name"
                                            value={entry.financeDetails.applicantName || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'applicantName', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                        <TextField
                                            label="Relationship"
                                            value={entry.financeDetails.relationship || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'relationship', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                        <FormControl fullWidth>
                                            <InputLabel>Loan Status</InputLabel>
                                            <Select
                                                value={entry.financeDetails.loanStatus || 'Pending'}
                                                onChange={(e) => handleFinanceChange(courseIndex, 'loanStatus', '', e.target.value)}
                                                label="Loan Status"
                                                className="bg-gray-100 rounded-lg"
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Approved">Approved</MenuItem>
                                                <MenuItem value="Rejected">Rejected</MenuItem>
                                                <MenuItem value="Disbursed">Disbursed</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <Typography variant="subtitle2" className="text-gray-700">6 Months Bank Statement</Typography>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(courseIndex, 'bankStatement', e)}
                                                className="mt-1"
                                            />
                                            {entry.financeDetails.bankStatement && (
                                                <Typography variant="body2" className="text-gray-600 mt-1">
                                                    {entry.financeDetails.bankStatement.name}
                                                </Typography>
                                            )}
                                        </div>
                                        <div>
                                            <Typography variant="subtitle2" className="text-gray-700">Aadhar Card</Typography>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(courseIndex, 'aadharCard', e)}
                                                className="mt-1"
                                            />
                                            {entry.financeDetails.aadharCard && (
                                                <Typography variant="body2" className="text-gray-600 mt-1">
                                                    {entry.financeDetails.aadharCard.name}
                                                </Typography>
                                            )}
                                        </div>
                                        <div>
                                            <Typography variant="subtitle2" className="text-gray-700">PAN Card</Typography>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(courseIndex, 'panCard', e)}
                                                className="mt-1"
                                            />
                                            {entry.financeDetails.panCard && (
                                                <Typography variant="body2" className="text-gray-600 mt-1">
                                                    {entry.financeDetails.panCard.name}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
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
        </>
    );
};

export default AddCourse;  