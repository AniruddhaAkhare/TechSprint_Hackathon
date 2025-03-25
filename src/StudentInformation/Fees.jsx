import React, { useState, useEffect } from 'react';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Fees = ({ studentId }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [learner, setLearner] = useState(null);

    const calculatePaymentStatus = (course) => {
        let outstanding = 0;
        let overdue = 0;
        const today = new Date();

        if (course.feeTemplate === 'Installments' && course.installmentDetails) {
            course.installmentDetails.forEach(installment => {
                const dueDate = new Date(installment.dueDate);
                const dueAmount = parseFloat(installment.dueAmount) || 0;
                const paidAmount = parseFloat(installment.paidAmount) || 0;

                if (!installment.paidDate) {
                    if (dueDate < today) {
                        overdue += dueAmount;
                    } else {
                        outstanding += dueAmount;
                    }
                }
            });
        } else if (course.feeTemplate === 'FullFees' && course.fullFeesDetails) {
            const regAmount = parseFloat(course.fullFeesDetails.registration.amount) || 0;
            const finalAmount = parseFloat(course.fullFeesDetails.finalPayment.amount) || 0;
            const totalPaid = regAmount + finalAmount;
            const remaining = course.fullFeesDetails.feeAfterDiscount - totalPaid;

            if (remaining > 0) {
                const regDate = course.fullFeesDetails.registration.date ? new Date(course.fullFeesDetails.registration.date) : today;
                if (regDate < today) {
                    overdue = remaining;
                } else {
                    outstanding = remaining;
                }
            }
        } else if (course.feeTemplate === 'Finance' && course.financeDetails) {
            const financedAmount = parseFloat(course.financeDetails.totalAmountFinanced) || 0;
            if (course.financeDetails.status === 'Pending' || course.financeDetails.status === 'Approved') {
                outstanding = financedAmount;
            }
        }

        return { outstanding, overdue };
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const studentDoc = await getDoc(doc(db, 'student', studentId));
                if (studentDoc.exists()) {
                    setLearner(studentDoc.data());
                } else {
                    throw new Error("No such student found!");
                }

                const enrollmentDoc = await getDoc(doc(db, 'enrollments', studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const coursesData = enrollmentDoc.data().courses;

                    const coursePromises = coursesData.map(course =>
                        getDoc(doc(db, 'Course', course.selectedCourse?.id || ''))
                    );
                    const courseDocs = await Promise.all(coursePromises);

                    const formattedEnrollments = coursesData.map((course, index) => {
                        const courseDoc = courseDocs[index];
                        const courseName = courseDoc.exists() ? courseDoc.data().name : 'Course not found';
                        const { outstanding, overdue } = calculatePaymentStatus(course);

                        return {
                            ...course,
                            id: course.selectedCourse?.id || `course-${index}`,
                            name: courseName,
                            totalOutstanding: outstanding,
                            totalOverdue: overdue,
                        };
                    });

                    setEnrollmentData(formattedEnrollments);
                } else {
                    setError("No enrollments found for this student.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || "Failed to fetch data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    if (isLoading) return <p className="text-gray-600 text-center py-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

    const handleRowClick = (course) => setSelectedCourse(course);
    const closeDetails = () => setSelectedCourse(null);

    return (
        <div className="space-y-6">
            {/* Main Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* <h2 className="text-lg font-medium text-gray-700 mb-4">Fee Summary</h2> */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr.</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Course</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Mode</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Fee Template</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Total Fees (₹)</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Discount</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Fee After Discount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollmentData.map((course, index) => (
                                <tr
                                    key={course.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(course)}
                                >
                                    <td className="p-3 text-gray-700">{index + 1}</td>
                                    <td className="p-3 text-gray-700">{course.name}</td>
                                    <td className="p-3 text-gray-700">{course.mode || 'N/A'}</td>
                                    <td className="p-3 text-gray-700">{course.feeTemplate || 'N/A'}</td>
                                    <td className="p-3 text-gray-700">₹{course.fullFeesDetails?.totalFees || 0}</td>
                                    <td className="p-3 text-gray-700">
                                        {course.fullFeesDetails?.discountType
                                            ? `${course.fullFeesDetails.discountValue}${course.fullFeesDetails.discountType === 'percentage' ? '%' : '₹'}`
                                            : '0'}
                                    </td>
                                    <td className="p-3 text-gray-700">₹{course.fullFeesDetails?.feeAfterDiscount || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sidebar Modal */}
            {selectedCourse && learner && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeDetails} />
                    <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
                        <h2 className="text-xl font-semibold text-gray-800">{`${learner.first_name} ${learner.last_name}`}</h2>
                        <p className="text-sm text-gray-600 mt-1">Course: {selectedCourse.name}</p>
                        <p className="text-sm text-gray-600">Mode: {selectedCourse.mode || 'Not specified'}</p>

                        {/* Fee Summary */}
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Total Fees</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.fullFeesDetails?.totalFees || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Fee After Discount</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.fullFeesDetails?.feeAfterDiscount || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Outstanding</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.totalOutstanding || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Overdue</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.totalOverdue || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Full Fees Details */}
                        {selectedCourse.feeTemplate === 'FullFees' && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Payment Details</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Type</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Amount</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Date</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Received By</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="p-3 text-gray-700">Registration</td>
                                                <td className="p-3 text-gray-700">₹{selectedCourse.fullFeesDetails?.registration?.amount || 0}</td>
                                                <td className="p-3 text-gray-700">
                                                    {selectedCourse.fullFeesDetails?.registration?.date
                                                        ? new Date(selectedCourse.fullFeesDetails.registration.date).toLocaleDateString()
                                                        : 'Not paid'}
                                                </td>
                                                <td className="p-3 text-gray-700">{selectedCourse.fullFeesDetails?.registration?.receivedBy || 'N/A'}</td>
                                                <td className="p-3 text-gray-700">{selectedCourse.fullFeesDetails?.registration?.remark || 'N/A'}</td>
                                            </tr>
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="p-3 text-gray-700">Final Payment</td>
                                                <td className="p-3 text-gray-700">₹{selectedCourse.fullFeesDetails?.finalPayment?.amount || 0}</td>
                                                <td className="p-3 text-gray-700">
                                                    {selectedCourse.fullFeesDetails?.finalPayment?.date
                                                        ? new Date(selectedCourse.fullFeesDetails.finalPayment.date).toLocaleDateString()
                                                        : 'Not paid'}
                                                </td>
                                                <td className="p-3 text-gray-700">{selectedCourse.fullFeesDetails?.finalPayment?.receivedBy || 'N/A'}</td>
                                                <td className="p-3 text-gray-700">{selectedCourse.fullFeesDetails?.finalPayment?.remark || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Installments Details */}
                        {selectedCourse.feeTemplate === 'Installments' && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Installments</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">No.</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Due Amount</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Due Date</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Paid Amount</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Paid Date</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedCourse.installmentDetails?.map((installment, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="p-3 text-gray-700">{installment.number || index + 1}</td>
                                                    <td className="p-3 text-gray-700">₹{installment.dueAmount || 0}</td>
                                                    <td className="p-3 text-gray-700">
                                                        {installment.dueDate ? new Date(installment.dueDate).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-3 text-gray-700">₹{installment.paidAmount || 0}</td>
                                                    <td className="p-3 text-gray-700">
                                                        {installment.paidDate ? new Date(installment.paidDate).toLocaleDateString() : 'Not paid'}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={
                                                            !installment.paidDate && new Date(installment.dueDate) < new Date()
                                                                ? 'text-red-500'
                                                                : installment.paidDate
                                                                    ? 'text-green-500'
                                                                    : 'text-yellow-500'
                                                        }>
                                                            {installment.paidDate ? 'Paid' : new Date(installment.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Free Course */}
                        {selectedCourse.feeTemplate === 'Free' && (
                            <p className="mt-4 text-gray-600">This is a free course. No payment required.</p>
                        )}

                        {/* Finance Details */}
                        {selectedCourse.feeTemplate === 'Finance' && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Finance Details</h4>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Financing Type:</span> {selectedCourse.financeDetails?.financingType || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Provider:</span> {selectedCourse.financeDetails?.providerName || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Agreement ID:</span> {selectedCourse.financeDetails?.agreementId || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Amount Financed:</span> ₹{selectedCourse.financeDetails?.totalAmountFinanced || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Repayment Terms:</span> {selectedCourse.financeDetails?.repaymentTerms || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Status:</span>
                                        <span className={
                                            selectedCourse.financeDetails?.status === 'Pending' ? 'text-yellow-500' :
                                                selectedCourse.financeDetails?.status === 'Approved' ? 'text-blue-500' :
                                                    selectedCourse.financeDetails?.status === 'Active' ? 'text-green-500' :
                                                        'text-gray-500'
                                        }>
                                            {selectedCourse.financeDetails?.status || 'N/A'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Approval Date:</span> {selectedCourse.financeDetails?.approvalDate
                                            ? new Date(selectedCourse.financeDetails.approvalDate).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Remarks:</span> {selectedCourse.financeDetails?.remarks || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={closeDetails}
                            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Fees;