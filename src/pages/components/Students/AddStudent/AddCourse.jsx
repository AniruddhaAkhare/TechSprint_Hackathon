import React, { useEffect, useState } from 'react';
import { db } from '../../../../config/firebase';
import { collection, getDocs, setDoc, doc, getDoc, query, where, addDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourse = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user, rolePermissions } = useAuth();
    const [courses, setCourses] = useState([]);
    const [courseEntries, setCourseEntries] = useState([]);
    const [financePartners, setFinancePartners] = useState([]);
    const [preferredCenters, setPreferredCenters] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // Permission checks
    const canDisplay = rolePermissions?.enrollments?.display || false;
    const canCreate = rolePermissions?.enrollments?.create || false;
    const canUpdate = rolePermissions?.enrollments?.update || false;
    const canDelete = rolePermissions?.enrollments?.delete || false;
    const isAdmin = rolePermissions?.role === 'Admin';

    // Activity logging function
    const logActivity = async (action, details) => {
        try {
            const activityLog = {
                action,
                details: { studentId, ...details },
                timestamp: new Date().toISOString(),
                userEmail: user?.email || 'anonymous',
                userId: user?.uid
            };
            await addDoc(collection(db, 'activityLogs'), activityLog);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    };

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
        paymentSlip: null,
        aadharCard: null,
        panCard: null,
        registration: {
            amount: '',
            date: '',
            receivedBy: '',
            paymentMethod: '',
            remark: '',
            status: 'Pending',
        },
        discountType: '',
        discountValue: '',
        discountReason: '',
        feeAfterDiscount: 0,
    };

    const defaultEntry = {
        selectedCourse: '',
        mode: '',
        feeTemplate: '',
        installmentDetails: [
            {
                number: '',
                dueDate: '',
                dueAmount: '',
                paidDate: '',
                paidAmount: '',
                paymentMode: '',
                pdcStatus: '',
                receivedBy: '',
                remark: '',
                status: 'Pending',
            },
        ],
        fullFeesDetails: {
            discountType: '',
            discountValue: '',
            discountReason: '',
            feeAfterDiscount: 0,
            totalFees: 0,
            registration: {
                amount: '',
                date: '',
                receivedBy: '',
                paymentMethod: '',
                remark: '',
                status: 'Pending',
            },
            finalPayment: {
                amount: '',
                date: '',
                receivedBy: '',
                paymentMethod: '',
                remark: '',
                status: 'Pending',
            },
        },
        financeDetails: { ...defaultFinanceDetails },
        registration: {
            amount: '',
            date: '',
            receivedBy: '',
            paymentMethod: '',
            remark: '',
            status: 'Pending',
        },
        freeReason: '',
    };

    useEffect(() => {
        if (!canDisplay) {
            toast.error("You don't have permission to view this page");
            // logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', { page: 'AddCourse' });
            navigate('/unauthorized');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                const studentDoc = await getDoc(doc(db, 'student', studentId));
                let studentPreferredCenters = [];
                if (studentDoc.exists()) {
                    const studentData = studentDoc.data();
                    studentPreferredCenters = studentData.preferred_centers || [];
                    if (!Array.isArray(studentPreferredCenters)) {
                        console.warn('preferred_centers is not an array, defaulting to empty array:', studentPreferredCenters);
                        studentPreferredCenters = [];
                    }
                    setPreferredCenters(studentPreferredCenters);
                    // logActivity('FETCH_STUDENT_SUCCESS', { preferredCenters: studentPreferredCenters.length });
                } else {
                    toast.error('Student not found');
                    // logActivity('FETCH_STUDENT_NOT_FOUND', {});
                    setPreferredCenters([]);
                }

                const instituteSnapshot = await getDocs(collection(db, 'instituteSetup'));
                if (instituteSnapshot.empty) {
                    console.error('No instituteSetup document found');
                    setCenters([]);
                    // logActivity('FETCH_CENTERS_WARNING', { message: 'No instituteSetup found' });
                } else {
                    const instituteId = instituteSnapshot.docs[0].id;
                    const centerQuery = query(
                        collection(db, 'instituteSetup', instituteId, 'Center'),
                        where('isActive', '==', true)
                    );
                    const centerSnapshot = await getDocs(centerQuery);
                    const fetchedCenters = centerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setCenters(fetchedCenters);
                    // logActivity('FETCH_CENTERS_SUCCESS', { count: fetchedCenters.length });
                }

                const coursesSnapshot = await getDocs(collection(db, 'Course'));
                const fetchedCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(fetchedCourses);
                // logActivity('FETCH_COURSES_SUCCESS', { count: fetchedCourses.length });

                const financePartnersSnapshot = await getDocs(collection(db, 'FinancePartner'));
                const activeFinancePartners = financePartnersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(partner => partner.status === 'Active');
                setFinancePartners(activeFinancePartners);
                // logActivity('FETCH_FINANCE_PARTNERS_SUCCESS', { count: activeFinancePartners.length });

                const enrollmentDoc = await getDoc(doc(db, 'enrollments', studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const existingCourses = enrollmentDoc.data().courses.map(course => ({
                        ...defaultEntry,
                        ...course,
                        selectedCourse: fetchedCourses.find(c => c.id === course.selectedCourse?.id) || course.selectedCourse || '',
                        financeDetails: {
                            ...defaultFinanceDetails,
                            ...course.financeDetails,
                            scheme: course.financeDetails?.scheme || '',
                            registration: {
                                ...defaultFinanceDetails.registration,
                                ...course.financeDetails?.registration,
                                status: course.financeDetails?.registration?.status || 'Pending',
                            },
                        },
                        registration: {
                            ...defaultEntry.registration,
                            ...course.registration,
                            status: course.registration?.status || 'Pending',
                        },
                        installmentDetails: course.installmentDetails?.map(installment => ({
                            ...defaultEntry.installmentDetails[0],
                            ...installment,
                            status: installment.status || 'Pending',
                        })) || defaultEntry.installmentDetails,
                        fullFeesDetails: {
                            ...defaultEntry.fullFeesDetails,
                            ...course.fullFeesDetails,
                            registration: {
                                ...defaultEntry.fullFeesDetails.registration,
                                ...course.fullFeesDetails?.registration,
                                status: course.fullFeesDetails?.registration?.status || 'Pending',
                            },
                            finalPayment: {
                                ...defaultEntry.fullFeesDetails.finalPayment,
                                ...course.fullFeesDetails?.finalPayment,
                                status: course.fullFeesDetails?.finalPayment?.status || 'Pending',
                            },
                        },
                        freeReason: course.freeReason || '',
                    }));
                    setCourseEntries(existingCourses);
                    // logActivity('FETCH_ENROLLMENT_SUCCESS', { courseCount: existingCourses.length });
                } else {
                    setCourseEntries([defaultEntry]);
                    // logActivity('FETCH_ENROLLMENT_NOT_FOUND', {});
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
                toast.error('Failed to fetch data');
                // logActivity('FETCH_DATA_ERROR', { error: error.message });
                setCourseEntries([defaultEntry]);
                setPreferredCenters([]);
                setCenters([]);
            } finally {
                setLoading(false);
                setTimeout(() => setIsOpen(true), 10);
            }
        };

        fetchData();
    }, [studentId, canDisplay, navigate]);

    const addCourseEntry = () => {
        if (!canCreate) {
            toast.error("You don't have permission to add courses");
            // logActivity('UNAUTHORIZED_CREATE_ATTEMPT', { action: 'addCourseEntry' });
            return;
        }
        setCourseEntries([...courseEntries, defaultEntry]);
        logActivity('ADD COURSE ENTRY', {});
    };

    const removeCourseEntry = (index) => {
        if (!canDelete) {
            toast.error("You don't have permission to remove courses");
            // logActivity('UNAUTHORIZED_DELETE_ATTEMPT', { action: 'removeCourseEntry', index });
            return;
        }
        setCourseEntries(courseEntries.filter((_, i) => i !== index));
        logActivity('REMOVE COURSE ENTRY', { index });
    };

    const handleChange = (index, field, value) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'updateCourseEntry', field });
            return;
        }
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                if (field === 'selectedCourse') {
                    // logActivity('CHANGE COURSE', { courseId: value?.id, field });
                    return {
                        ...entry,
                        [field]: value,
                        fullFeesDetails: { ...entry.fullFeesDetails, totalFees: value.fee || 0 },
                        financeDetails: { ...entry.financeDetails, feeAfterDiscount: value.fee || 0 },
                    };
                } else if (field === 'freeReason') {
                    // logActivity('CHANGE FIELD', { field, value });
                    return { ...entry, freeReason: value };
                }
                
                return { ...entry, [field]: value };
            }
            return entry;
        });
        logActivity('CHANGE FREE COUrse', { field, value });
        setCourseEntries(updatedEntries);
    };

    const handleFullFeesChange = (index, field, subField, value) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'updateFullFees', field, subField });
            return;
        }
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
                } else if (field === 'discountReason') {
                    fullFeesDetails.discountReason = value;
                } else {
                    fullFeesDetails[field] = { ...fullFeesDetails[field], [subField]: value };
                }
                
                return { ...entry, fullFeesDetails };
            }
            return entry;
        });
        logActivity('CHANGE FULL FEES', { field, subField, value });
        setCourseEntries(updatedEntries);
    };

    const handleRegistrationChange = (index, field, value) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'updateRegistration', field });
            return;
        }
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                logActivity('CHANGE REGISTRATION', { field, value });
                return {
                    ...entry,
                    registration: { ...entry.registration, [field]: value },
                };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'updateInstallment', field });
            return;
        }
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
        logActivity('CHANGE INSTALLMENT', { installmentIndex, field, value });
        setCourseEntries(updatedEntries);
    };

    const addInstallment = (index) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'addInstallment' });
            return;
        }
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                logActivity('ADD INSTALLMENT', { courseIndex: index });
                return {
                    ...entry,
                    installmentDetails: [
                        ...entry.installmentDetails,
                        {
                            number: '',
                            dueDate: '',
                            dueAmount: '',
                            paidDate: '',
                            paidAmount: '',
                            paymentMode: '',
                            pdcStatus: '',
                            receivedBy: '',
                            remark: '',
                            status: 'Pending',
                        },
                    ],
                };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const removeInstallment = (courseIndex, installmentIndex) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'removeInstallment', installmentIndex });
            return;
        }
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === courseIndex) {
                logActivity('REMOVE INSTALLMENT', { courseIndex, installmentIndex });
                return {
                    ...entry,
                    installmentDetails: entry.installmentDetails.filter((_, j) => j !== installmentIndex),
                };
            }
            return entry;
        });
        setCourseEntries(updatedEntries);
    };

    const handleFinanceChange = (index, field, subField, value) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'updateFinance', field, subField });
            return;
        }
        const updatedEntries = courseEntries.map((entry, i) => {
            if (i === index) {
                const financeDetails = { ...entry.financeDetails };
                if (field === 'discountType') {
                    financeDetails.discountType = value;
                } else if (field === 'discountValue') {
                    financeDetails.discountValue = value;
                    const totalFees = entry.fullFeesDetails.totalFees || 0;
                    financeDetails.feeAfterDiscount = financeDetails.discountType === 'percentage'
                        ? totalFees - (totalFees * (Number(value) / 100))
                        : totalFees - Number(value);
                } else if (field === 'discountReason') {
                    financeDetails.discountReason = value;
                } else if (subField) {
                    financeDetails[field] = { ...financeDetails[field], [subField]: value };
                } else {
                    financeDetails[field] = value;
                }
                if (field === 'financePartner') {
                    financeDetails.contactPerson = '';
                    financeDetails.scheme = '';
                }
                
                return { ...entry, financeDetails };
            }
            return entry;
        });
        logActivity('CHANGE FINANCE', { field, subField, value });
        setCourseEntries(updatedEntries);
    };

    const handleFileChange = (index, field, event) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update course details");
            // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'uploadFile', field });
            return;
        }
        const file = event.target.files[0];
        if (file) {
            const updatedEntries = courseEntries.map((entry, i) => {
                if (i === index) {
                    logActivity('UPLOAD FILE', { field, fileName: file.name });
                    return {
                        ...entry,
                        financeDetails: { ...entry.financeDetails, [field]: file },
                    };
                }
                return entry;
            });
            setCourseEntries(updatedEntries);
        }
    };

    const saveEnrollmentData = async () => {
        if (!canCreate) {
            toast.error("You don't have permission to save enrollment data");
            // logActivity('UNAUTHORIZED_CREATE_ATTEMPT', { action: 'saveEnrollment' });
            return;
        }
        try {
            const updatedEntries = courseEntries.map(entry => {
                if (entry.feeTemplate === 'Finance') {
                    const { bankStatement, paymentSlip, aadharCard, panCard, ...restFinanceDetails } = entry.financeDetails;
                    return { ...entry, financeDetails: restFinanceDetails };
                }
                return { ...entry, freeReason: entry.freeReason || '' };
            });
            await setDoc(doc(db, 'enrollments', studentId), { courses: updatedEntries }, { merge: true });
            toast.success('Enrollment data saved successfully!');
            logActivity('SAVE ENROLLMENT SUCCESS', { courseCount: updatedEntries.length });
            handleClose();
        } catch (error) {
            console.error('Error saving enrollment data: ', error);
            toast.error('Failed to save enrollment data');
            // logActivity('SAVE_ENROLLMENT_ERROR', { error: error.message });
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            navigate(-1);
            // logActivity('NAVIGATE_BACK', { from: 'AddCourse' });
        }, 300);
    };

    const getFilteredCourses = (mode) => {
        if (!mode || preferredCenters.length === 0) return [];
        return courses.filter(course => {
            const isAvailableAtCenter = course.centers?.some(
                center => center.status === 'Active' && preferredCenters.includes(center.centerId)
            );
            const isAvailableInMode = course.mode === mode;
            return isAvailableAtCenter && isAvailableInMode;
        });
    };

    if (!canDisplay) return null;

    if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
            <div
                className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } z-50 overflow-y-auto`}
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

                    <div className="mb-6">
                        <Typography variant="subtitle1" className="text-gray-800 font-medium mb-2">
                            Preferred Learning Centers
                        </Typography>
                        {preferredCenters.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {preferredCenters.map((centerId) => {
                                    const center = centers.find(c => c.id === centerId);
                                    return (
                                        <li key={centerId} className="text-gray-700">
                                            {center ? center.name : `Unknown Center (ID: ${centerId})`}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <Typography className="text-gray-600">
                                No preferred learning centers selected.
                            </Typography>
                        )}
                    </div>

                    {courseEntries.map((entry, courseIndex) => (
                        <div key={courseIndex} className="mb-8 bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <Select
                                    value={entry.mode || ''}
                                    onChange={(e) => handleChange(courseIndex, 'mode', e.target.value)}
                                    displayEmpty
                                    className="w-full bg-gray-100 rounded-lg"
                                    renderValue={(selected) => selected || <span className="text-gray-400">Select Mode</span>}
                                    disabled={!canUpdate}
                                >
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Offline">Offline</MenuItem>
                                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                                </Select>
                                <Select
                                    value={entry.selectedCourse || ''}
                                    onChange={(e) => handleChange(courseIndex, 'selectedCourse', e.target.value)}
                                    displayEmpty
                                    className="w-full bg-gray-100 rounded-lg"
                                    renderValue={(selected) => (selected ? selected.name : <span className="text-gray-400">Select Course</span>)}
                                    disabled={!entry.mode || !canUpdate}
                                >
                                    {getFilteredCourses(entry.mode).map(course => (
                                        <MenuItem key={course.id} value={course}>
                                            {course.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    value={entry.feeTemplate || ''}
                                    onChange={(e) => handleChange(courseIndex, 'feeTemplate', e.target.value)}
                                    displayEmpty
                                    className="w-full bg-gray-100 rounded-lg"
                                    renderValue={(selected) => selected || <span className="text-gray-400">Select Fee Template</span>}
                                    disabled={!canUpdate}
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
                                            disabled={!canUpdate}
                                        >
                                            <MenuItem value="" disabled>
                                                Type
                                            </MenuItem>
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
                                            disabled={!canUpdate}
                                        />
                                        <TextField
                                            label="Discount Reason/Coupon"
                                            value={entry.fullFeesDetails.discountReason || ''}
                                            onChange={(e) => handleFullFeesChange(courseIndex, 'discountReason', '', e.target.value)}
                                            className="w-48"
                                            variant="outlined"
                                            size="small"
                                            disabled={!canUpdate}
                                        />
                                        <Typography className="text-gray-700">Fee After Discount: {entry.fullFeesDetails.feeAfterDiscount}</Typography>
                                    </div>
                                    <TableContainer>
                                        <Table className="overflow-x-auto">
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Title</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Payment Method</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Remark</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Registration</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.fullFeesDetails.registration.amount || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'amount', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            value={entry.fullFeesDetails.registration.date || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'date', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.fullFeesDetails.registration.paymentMethod || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'paymentMethod', e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Payment Method
                                                            </MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.fullFeesDetails.registration.receivedBy || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'receivedBy', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.fullFeesDetails.registration.remark || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'remark', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.fullFeesDetails.registration.status || 'Pending'}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'registration', 'status', e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="Pending">Pending</MenuItem>
                                                            <MenuItem value="Paid">Paid</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Final Payment</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.fullFeesDetails.finalPayment.amount || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'amount', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            value={entry.fullFeesDetails.finalPayment.date || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'date', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.fullFeesDetails.finalPayment.paymentMethod || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'paymentMethod', e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Payment Method
                                                            </MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.fullFeesDetails.finalPayment.receivedBy || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'receivedBy', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.fullFeesDetails.finalPayment.remark || ''}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'remark', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.fullFeesDetails.finalPayment.status || 'Pending'}
                                                            onChange={(e) => handleFullFeesChange(courseIndex, 'finalPayment', 'status', e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="Pending">Pending</MenuItem>
                                                            <MenuItem value="Paid">Paid</MenuItem>
                                                        </Select>
                                                    </TableCell>
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
                                            disabled={!canUpdate}
                                        >
                                            <MenuItem value="" disabled>
                                                Type
                                            </MenuItem>
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
                                            disabled={!canUpdate}
                                        />
                                        <TextField
                                            label="Discount Reason/Coupon"
                                            value={entry.fullFeesDetails.discountReason || ''}
                                            onChange={(e) => handleFullFeesChange(courseIndex, 'discountReason', '', e.target.value)}
                                            className="w-48"
                                            variant="outlined"
                                            size="small"
                                            disabled={!canUpdate}
                                        />
                                        <Typography className="text-gray-700">Fee After Discount: {entry.fullFeesDetails.feeAfterDiscount}</Typography>
                                    </div>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">
                                        Registration
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Payment Method</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Remark</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.registration.amount || ''}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, 'amount', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            value={entry.registration.date || ''}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, 'date', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.registration.paymentMethod || ''}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, 'paymentMethod', e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Payment Method
                                                            </MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.registration.receivedBy || ''}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, 'receivedBy', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.registration.remark || ''}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, 'remark', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.registration.status || 'Pending'}
                                                            onChange={(e) => handleRegistrationChange(courseIndex, 'status', e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="Pending">Pending</MenuItem>
                                                            <MenuItem value="Paid">Paid</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">
                                        Installments
                                    </Typography>
                                    <TableContainer>
                                        <Table className="overflow-x-auto">
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium min-w-40">No.</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Due Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Due Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Paid Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Paid Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Mode</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">PDC Status</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Remark</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Status</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {entry.installmentDetails.map((installment, installmentIndex) => (
                                                    <TableRow key={installmentIndex}>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.number || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'number', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="date"
                                                                value={installment.dueDate || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'dueDate', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.dueAmount || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'dueAmount', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="date"
                                                                value={installment.paidDate || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'paidDate', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.paidAmount || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'paidAmount', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.paymentMode || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'paymentMode', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.pdcStatus || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'pdcStatus', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.receivedBy || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'receivedBy', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={installment.remark || ''}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'remark', e.target.value)
                                                                }
                                                                size="small"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={installment.status || 'Pending'}
                                                                onChange={(e) =>
                                                                    handleInstallmentChange(courseIndex, installmentIndex, 'status', e.target.value)
                                                                }
                                                                size="small"
                                                                fullWidth
                                                                disabled={!canUpdate}
                                                            >
                                                                <MenuItem value="Pending">Pending</MenuItem>
                                                                <MenuItem value="Paid">Paid</MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="text"
                                                                color="error"
                                                                onClick={() => removeInstallment(courseIndex, installmentIndex)}
                                                                className="text-red-500 hover:text-red-700"
                                                                disabled={!canUpdate}
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
                                        disabled={!canUpdate}
                                    >
                                        Add Installment
                                    </Button>
                                </div>
                            )}

                            {entry.feeTemplate === 'Free' && (
                                <div className="space-y-4">
                                    <Typography className="text-gray-600 mt-4">This is a free course</Typography>
                                    <TextField
                                        label="Reason for Free Course"
                                        value={entry.freeReason || ''}
                                        onChange={(e) => handleChange(courseIndex, 'freeReason', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        disabled={!canUpdate}
                                    />
                                </div>
                            )}

                            {entry.feeTemplate === 'Finance' && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Typography variant="subtitle1" className="text-gray-700">
                                            Total Fees: {entry.fullFeesDetails?.totalFees || 0}
                                        </Typography>
                                        <Select
                                            value={entry.financeDetails.discountType || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'discountType', '', e.target.value)}
                                            displayEmpty
                                            className="w-32 bg-gray-100 rounded-lg"
                                            disabled={!canUpdate}
                                        >
                                            <MenuItem value="" disabled>
                                                Type
                                            </MenuItem>
                                            <MenuItem value="percentage">%</MenuItem>
                                            <MenuItem value="value">₹</MenuItem>
                                        </Select>
                                        <TextField
                                            label="Discount"
                                            value={entry.financeDetails.discountValue || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'discountValue', '', e.target.value)}
                                            className="w-32"
                                            variant="outlined"
                                            size="small"
                                            disabled={!canUpdate}
                                        />
                                        <TextField
                                            label="Discount Reason/Coupon"
                                            value={entry.financeDetails.discountReason || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'discountReason', '', e.target.value)}
                                            className="w-48"
                                            variant="outlined"
                                            size="small"
                                            disabled={!canUpdate}
                                        />
                                        <Typography className="text-gray-700">Fee After Discount: {entry.financeDetails.feeAfterDiscount}</Typography>
                                    </div>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">
                                        Registration
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Amount</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Date</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Payment Method</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Received By</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Remark</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.financeDetails.registration.amount || ''}
                                                            onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'amount', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            value={entry.financeDetails.registration.date || ''}
                                                            onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'date', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.financeDetails.registration.paymentMethod || ''}
                                                            onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'paymentMethod', e.target.value)}
                                                            size="small"
                                                            displayEmpty
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Payment Method
                                                            </MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                            <MenuItem value="Card">Card</MenuItem>
                                                            <MenuItem value="UPI">UPI</MenuItem>
                                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.financeDetails.registration.receivedBy || ''}
                                                            onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'receivedBy', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={entry.financeDetails.registration.remark || ''}
                                                            onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'remark', e.target.value)}
                                                            size="small"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={entry.financeDetails.registration.status || 'Pending'}
                                                            onChange={(e) => handleFinanceChange(courseIndex, 'registration', 'status', e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            disabled={!canUpdate}
                                                        >
                                                            <MenuItem value="Pending">Pending</MenuItem>
                                                            <MenuItem value="Paid">Paid</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium">
                                        Finance Details
                                    </Typography>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormControl fullWidth>
                                            <InputLabel>Finance Partner</InputLabel>
                                            <Select
                                                value={entry.financeDetails.financePartner || ''}
                                                onChange={(e) => handleFinanceChange(courseIndex, 'financePartner', '', e.target.value)}
                                                label="Finance Partner"
                                                className="bg-gray-100 rounded-lg"
                                                disabled={!canUpdate}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Finance Partner
                                                </MenuItem>
                                                {financePartners.map(partner => (
                                                    <MenuItem key={partner.id} value={partner.name}>
                                                        {partner.name}
                                                    </MenuItem>
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
                                                disabled={!entry.financeDetails.financePartner || !canUpdate}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Contact Person
                                                </MenuItem>
                                                {entry.financeDetails.financePartner &&
                                                    financePartners
                                                        .find(p => p.name === entry.financeDetails.financePartner)
                                                        ?.contactPersons?.map((person, idx) => (
                                                            <MenuItem key={idx} value={person.name}>
                                                                {person.name}
                                                            </MenuItem>
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
                                                disabled={!entry.financeDetails.financePartner || !canUpdate}
                                            >
                                                <MenuItem value="">Select Finance Scheme</MenuItem>
                                                {entry.financeDetails.financePartner &&
                                                    financePartners
                                                        .find(p => p.name === entry.financeDetails.financePartner)
                                                        ?.scheme?.map((schemeItem, idx) => (
                                                            <MenuItem key={idx} value={schemeItem.plan}>
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
                                            disabled={!canUpdate}
                                        />
                                        <TextField
                                            label="Down Payment"
                                            type="number"
                                            value={entry.financeDetails.downPayment || 0}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'downPayment', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            disabled={!canUpdate}
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
                                            disabled={!canUpdate}
                                        />
                                        <TextField
                                            label="Applicant Name"
                                            value={entry.financeDetails.applicantName || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'applicantName', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            disabled={!canUpdate}
                                        />
                                        <TextField
                                            label="Relationship"
                                            value={entry.financeDetails.relationship || ''}
                                            onChange={(e) => handleFinanceChange(courseIndex, 'relationship', '', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            disabled={!canUpdate}
                                        />
                                        <FormControl fullWidth>
                                            <InputLabel>Loan Status</InputLabel>
                                            <Select
                                                value={entry.financeDetails.loanStatus || 'Pending'}
                                                onChange={(e) => handleFinanceChange(courseIndex, 'loanStatus', '', e.target.value)}
                                                label="Loan Status"
                                                className="bg-gray-100 rounded-lg"
                                                disabled={!canUpdate}
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Approved">Approved</MenuItem>
                                                <MenuItem value="Rejected">Rejected</MenuItem>
                                                <MenuItem value="Disbursed">Disbursed</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
                                        Documents
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow className="bg-blue-50">
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Document Type</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">File</TableCell>
                                                    <TableCell className="text-gray-800 font-medium min-w-40">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>6 Months Bank Statement</TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleFileChange(courseIndex, 'bankStatement', e)}
                                                            className="mt-1"
                                                            disabled={!canUpdate}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.financeDetails.bankStatement ? (
                                                            <Typography variant="body2" className="text-green-600">
                                                                Uploaded: {entry.financeDetails.bankStatement.name}
                                                            </Typography>
                                                        ) : (
                                                            <Typography variant="body2" className="text-gray-600">
                                                                Not Uploaded
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                {entry.financeDetails.bankStatement && (
                                                    <TableRow>
                                                        <TableCell>Payment Slip</TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleFileChange(courseIndex, 'paymentSlip', e)}
                                                                className="mt-1"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {entry.financeDetails.paymentSlip ? (
                                                                <Typography variant="body2" className="text-green-600">
                                                                    Uploaded: {entry.financeDetails.paymentSlip.name}
                                                                </Typography>
                                                            ) : (
                                                                <Typography variant="body2" className="text-gray-600">
                                                                    Not Uploaded
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {entry.financeDetails.paymentSlip && (
                                                    <TableRow>
                                                        <TableCell>Aadhar Card</TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleFileChange(courseIndex, 'aadharCard', e)}
                                                                className="mt-1"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {entry.financeDetails.aadharCard ? (
                                                                <Typography variant="body2" className="text-green-600">
                                                                    Uploaded: {entry.financeDetails.aadharCard.name}
                                                                </Typography>
                                                            ) : (
                                                                <Typography variant="body2" className="text-gray-600">
                                                                    Not Uploaded
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {entry.financeDetails.aadharCard && (
                                                    <TableRow>
                                                        <TableCell>PAN Card</TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleFileChange(courseIndex, 'panCard', e)}
                                                                className="mt-1"
                                                                disabled={!canUpdate}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {entry.financeDetails.panCard ? (
                                                                <Typography variant="body2" className="text-green-600">
                                                                    Uploaded: {entry.financeDetails.panCard.name}
                                                                </Typography>
                                                            ) : (
                                                                <Typography variant="body2" className="text-gray-600">
                                                                    Not Uploaded
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            )}

                            {canDelete && (
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => removeCourseEntry(courseIndex)}
                                    className="mt-4 text-red-500 hover:text-red-700"
                                    disabled={!canDelete}
                                >
                                    Remove Course
                                </Button>
                            )}
                        </div>
                    ))}

                    <div className="flex space-x-4">
                        {canCreate && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={addCourseEntry}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                                    disabled={!canCreate}
                                >
                                    Add Course
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={saveEnrollmentData}
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
                                    disabled={!canCreate}
                                >
                                    Save Enrollment
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddCourse;