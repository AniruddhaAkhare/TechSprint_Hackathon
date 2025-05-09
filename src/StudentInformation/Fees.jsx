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

                if (installment.status !== 'Paid') {
                    if (dueDate < today) {
                        overdue += dueAmount - paidAmount;
                    } else {
                        outstanding += dueAmount - paidAmount;
                    }
                }
            });
        } else if (course.feeTemplate === 'FullFees' && course.fullFeesDetails) {
            const regAmount = parseFloat(course.fullFeesDetails.registration?.amount) || 0;
            const finalAmount = parseFloat(course.fullFeesDetails.finalPayment?.amount) || 0;
            const totalPaid = regAmount + finalAmount;
            const feeAfterDiscount = parseFloat(course.fullFeesDetails.feeAfterDiscount) || 0;
            const remaining = feeAfterDiscount - totalPaid;

            if (remaining > 0) {
                const regDate = course.fullFeesDetails.registration?.date
                    ? new Date(course.fullFeesDetails.registration.date)
                    : today;
                if (regDate < today && course.fullFeesDetails.registration?.status !== 'Paid') {
                    overdue = remaining;
                } else {
                    outstanding = remaining;
                }
            }
        } else if (course.feeTemplate === 'Finance' && course.financeDetails) {
            const loanAmount = parseFloat(course.financeDetails.loanAmount) || 0;
            const downPayment = parseFloat(course.financeDetails.downPayment) || 0;
            const regAmount = parseFloat(course.financeDetails.registration?.amount) || 0;
            const remaining = loanAmount - (downPayment + regAmount);
            if (course.financeDetails.loanStatus === 'Pending' || course.financeDetails.loanStatus === 'Approved') {
                outstanding = remaining;
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
                        course.selectedCourse?.id
                            ? getDoc(doc(db, 'Course', course.selectedCourse.id))
                            : Promise.resolve(null)
                    );
                    const courseDocs = await Promise.all(coursePromises);

                    const formattedEnrollments = coursesData.map((course, index) => {
                        const courseDoc = courseDocs[index];
                        const courseName = courseDoc && courseDoc.exists()
                            ? courseDoc.data().name
                            : course.selectedCourse?.name || 'Course not found';
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
        <div className="">
            {/* Main Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                                    <td className="p-3 text-gray-700">
                                        ₹{course.fullFeesDetails?.totalFees || course.financeDetails?.loanAmount || 0}
                                    </td>
                                    <td className="p-3 text-gray-700">
                                        {course.fullFeesDetails?.discountType || course.financeDetails?.discountType
                                            ? `${course.fullFeesDetails?.discountValue || course.financeDetails?.discountValue}${course.fullFeesDetails?.discountType === 'percentage' || course.financeDetails?.discountType === 'percentage' ? '%' : '₹'}`
                                            : '0'}
                                    </td>
                                    <td className="p-3 text-gray-700">
                                        ₹{course.fullFeesDetails?.feeAfterDiscount || course.financeDetails?.feeAfterDiscount || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sidebar Modal */}
            {selectedCourse && learner && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeDetails} />
                    <div className="fixed right-0 top-0 w-2/4 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
                        <h2 className="text-xl font-semibold text-gray-800">{`${learner.Name}`}</h2>
                        <p className="text-sm text-gray-600 mt-1">Course: {selectedCourse.name}</p>
                        <p className="text-sm text-gray-600">Mode: {selectedCourse.mode || 'Not specified'}</p>

                        {/* Fee Summary */}
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Total Fees</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.fullFeesDetails?.totalFees || selectedCourse.financeDetails?.loanAmount || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Fee After Discount</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.fullFeesDetails?.feeAfterDiscount || selectedCourse.financeDetails?.feeAfterDiscount || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-600">Outstanding</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.totalOutstanding || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div> */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-600">Overdue</label>
                                    <input
                                        type="text"
                                        value={`₹${selectedCourse.totalOverdue || 0}`}
                                        readOnly
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                                    />
                                </div> */}
                            </div>
                        </div>

                        {/* Registration Details  */}
                        {selectedCourse.registration && selectedCourse.feeTemplate === 'Installments' &&(
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Registration Payment</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Amount</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Date</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Received By</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Payment Method</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Remark</th>
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="p-3 text-gray-700">₹{selectedCourse.registration?.amount || 0}</td>
                                                <td className="p-3 text-gray-700">
                                                    {selectedCourse.registration?.date
                                                        ? new Date(selectedCourse.registration.date).toLocaleDateString()
                                                        : 'Not paid'}
                                                </td>
                                                <td className="p-3 text-gray-700">{selectedCourse.registration?.receivedBy || 'N/A'}</td>
                                                <td className="p-3 text-gray-700">{selectedCourse.registration?.paymentMethod || 'N/A'}</td>
                                                <td className="p-3 text-gray-700">{selectedCourse.registration?.remark || 'N/A'}</td>
                                                <td className="p-3 text-gray-700">{selectedCourse.registration?.status || 'Pending'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

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
                                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Status</th>
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
                                                <td className="p-3 text-gray-700">{selectedCourse.fullFeesDetails?.registration?.status || 'Pending'}</td>
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
                                                <td className="p-3 text-gray-700">{selectedCourse.fullFeesDetails?.finalPayment?.status || 'Pending'}</td>
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
                                                            installment.status === 'Paid' ? 'text-green-500' :
                                                            installment.status === 'Overdue' || (!installment.paidDate && new Date(installment.dueDate) < new Date()) ? 'text-red-500' :
                                                            'text-yellow-500'
                                                        }>
                                                            {installment.status || (installment.paidDate ? 'Paid' : new Date(installment.dueDate) < new Date() ? 'Overdue' : 'Pending')}
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
                            <div className="mt-4">
                                <p className="text-gray-600">This is a free course. No payment required.</p>
                                {selectedCourse.freeReason && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        <span className="font-medium">Reason:</span> {selectedCourse.freeReason}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Finance Details */}
                        {selectedCourse.feeTemplate === 'Finance' && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Finance Details</h4>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Finance Partner:</span> {selectedCourse.financeDetails?.financePartner || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Contact Person:</span> {selectedCourse.financeDetails?.contactPerson || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Scheme:</span> {selectedCourse.financeDetails?.scheme || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Loan Amount:</span> ₹{selectedCourse.financeDetails?.loanAmount || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Down Payment:</span> ₹{selectedCourse.financeDetails?.downPayment || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Down Payment Date:</span> {selectedCourse.financeDetails?.downPaymentDate
                                            ? new Date(selectedCourse.financeDetails.downPaymentDate).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Applicant Name:</span> {selectedCourse.financeDetails?.applicantName || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Relationship:</span> {selectedCourse.financeDetails?.relationship || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Loan Status:</span>
                                        <span className={
                                            selectedCourse.financeDetails?.loanStatus === 'Pending' ? 'text-yellow-500' :
                                            selectedCourse.financeDetails?.loanStatus === 'Approved' ? 'text-blue-500' :
                                            selectedCourse.financeDetails?.loanStatus === 'Active' ? 'text-green-500' :
                                            'text-gray-500'
                                        }>
                                            {selectedCourse.financeDetails?.loanStatus || 'N/A'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Discount:</span> {selectedCourse.financeDetails?.discountType
                                            ? `${selectedCourse.financeDetails.discountValue}${selectedCourse.financeDetails.discountType === 'percentage' ? '%' : '₹'}`
                                            : 'None'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Discount Reason:</span> {selectedCourse.financeDetails?.discountReason || 'N/A'}
                                    </p>
                                </div>
                                {selectedCourse.financeDetails?.registration && (
                                    <div className="mt-4">
                                        <h4 className="text-md font-medium text-gray-700 mb-3">Finance Registration Payment</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="p-3 text-sm font-medium text-gray-600 text-left">Amount</th>
                                                        <th className="p-3 text-sm font-medium text-gray-600 text-left">Date</th>
                                                        <th className="p-3 text-sm font-medium text-gray-600 text-left">Received By</th>
                                                        <th className="p-3 text-sm font-medium text-gray-600 text-left">Payment Method</th>
                                                        <th className="p-3 text-sm font-medium text-gray-600 text-left">Remark</th>
                                                        <th className="p-3 text-sm font-medium text-gray-600 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b hover:bg-gray-50">
                                                        <td className="p-3 text-gray-700">₹{selectedCourse.financeDetails.registration?.amount || 0}</td>
                                                        <td className="p-3 text-gray-700">
                                                            {selectedCourse.financeDetails.registration?.date
                                                                ? new Date(selectedCourse.financeDetails.registration.date).toLocaleDateString()
                                                                : 'Not paid'}
                                                        </td>
                                                        <td className="p-3 text-gray-700">{selectedCourse.financeDetails.registration?.receivedBy || 'N/A'}</td>
                                                        <td className="p-3 text-gray-700">{selectedCourse.financeDetails.registration?.paymentMethod || 'N/A'}</td>
                                                        <td className="p-3 text-gray-700">{selectedCourse.financeDetails.registration?.remark || 'N/A'}</td>
                                                        <td className="p-3 text-gray-700">{selectedCourse.financeDetails.registration?.status || 'Pending'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
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