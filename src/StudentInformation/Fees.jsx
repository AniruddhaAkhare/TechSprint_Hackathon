// import React, { useState, useEffect } from 'react';
// import { getDocs, collection, where, getDoc, doc, query } from 'firebase/firestore';
// import { db } from '../config/firebase';

// const Fees = ({ studentId }) => {
//     const [selectedLearner, setSelectedLearner] = useState(null);
//     const [enrollmentData, setEnrollmentData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [learner, setLearner] = useState();
//     const [totalAmount, setTotalAmount] = useState(null);

//     const checkPaymentStatus = (installments) => {
//         let outstanding = 0;
//         let overdue = 0;
//         const today = new Date();

//         if (!installments) return { outstanding, overdue };

//         installments.forEach(installment => {
//             const dueDate = new Date(installment.dueDate);
//             if (dueDate >= today && installment.paidAmount) {
//                 outstanding += parseFloat(installment.dueAmount) || 0;
//             } else if (dueDate < today && installment.paidAmount) {
//                 overdue += parseFloat(installment.dueAmount) || 0;
//             }
//         });
//         return { outstanding, overdue };
//     };

//     useEffect(() => {
//         const fetchEnrollments = async () => {
//             setIsLoading(true);
//             setError(null);
//             setEnrollmentData([]);

//             try {
//                 const enrollmentsQuery = query(
//                     collection(db, 'enrollments'),
//                     where('student_id', '==', studentId)
//                 );

//                 const enrollmentSnapshot = await getDocs(enrollmentsQuery);
//                 if (!enrollmentSnapshot.empty) {
//                     const courseIds = enrollmentSnapshot.docs.map(doc => doc.data().course_id);
//                     const coursePromises = courseIds.map(courseId => getDoc(doc(db, 'Course', courseId)));
//                     const courseDocs = await Promise.all(coursePromises);

//                     const courses = courseDocs.reduce((acc, courseDoc) => {
//                         if (courseDoc.exists()) {
//                             acc[courseDoc.id] = courseDoc.data()?.name;
//                         }
//                         return acc;
//                     }, {});

//                     const formattedEnrollments = enrollmentSnapshot.docs.map(doc => {
//                         const data = doc.data();
//                         const { outstanding: totalOutstanding, overdue: totalOverdue } = checkPaymentStatus(data.installments);

//                         return {
//                             id: doc.id,
//                             course_id: data.course_id,
//                             name: courses[data.course_id] || 'Course not found',
//                             fees: data.fee || {},
//                             enrolled_date: data.enrollment_date ? new Date(data.enrollment_date).toLocaleString() : 'Not available',
//                             installments: data.installments || {},
//                             totalOutstanding,
//                             totalOverdue,
//                         };
//                     });

//                     setEnrollmentData(formattedEnrollments);
//                 } else {
//                     setError("No enrollments found for this student.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching enrollment data:", error);
//                 setError("Failed to fetch enrollment data.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchEnrollments();
//     }, [studentId]);

//     useEffect(() => {
//         const fetchStudent = async () => {
//             try {
//                 const studentDoc = await getDoc(doc(db, 'student', studentId));
//                 if (studentDoc.exists()) {
//                     setLearner(studentDoc.data());
//                 } else {
//                     setError("No such student found!");
//                 }
//             } catch (err) {
//                 console.error("Error fetching student data:", err);
//                 setError("Problem in fetching student data.");
//             }
//         };

//         fetchStudent();
//     }, [studentId]);

//     if (isLoading) return <p>Loading...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;

//     const handleRowClick = (enrollment) => setSelectedLearner(enrollment);
//     const closeDetails = () => setSelectedLearner(null);

//     const calculateTotalAmount = (discountPercentage, discountedAmount) => {
//         const discount = parseFloat(discountPercentage) || 0;
//         const discounted = parseFloat(discountedAmount) || 0;
//         const calculatedTotal = (100 / (100 - discount)) * discounted;
//         return (calculatedTotal.toFixed(2));
//     };

//     return (
//         <div className="flex relative bg-gray-100 min-h-screen">
//             <div className={`fixed inset-0 bg-black opacity-50 transition-opacity ${selectedLearner ? 'block' : 'hidden'}`} onClick={closeDetails} />
//             <div className="flex-1 p-4">
//                 <table className="min-w-full bg-white shadow-md rounded">
//                     <thead>
//                         <tr className="bg-gray-200 text-gray-600 text-xs uppercase">
//                             <th className="p-3 text-left">Sr.</th>
//                             <th className="p-3 text-left">Course</th>
//                             <th className="p-3 text-left">Total Fees (₹)</th>
//                             <th className="p-3 text-left">Discount (%)</th>
//                             <th className="p-3 text-left">Fee (₹)</th>
//                             <th className="p-3 text-left">Pending (₹)</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {enrollmentData.map((enrollment, index) => (
//                             <tr key={enrollment.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(enrollment)}>
//                                 <td className="p-3 border-b">{index + 1}</td>
//                                 <td className="p-3 border-b">{enrollment.name}</td>
//                                 <td className="p-3 border-b">{calculateTotalAmount(enrollment.fees?.discount, enrollment.fees?.total)}</td>
//                                 <td className="p-3 border-b">{enrollment.fees?.discount || 0}</td>
//                                 <td className="p-3 border-b">{enrollment.fees?.total || 0}</td>
//                                 <td className="p-3 border-b">{(enrollment.fees?.total || 0) - (enrollment.fees?.paid || 0)}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {selectedLearner && learner && (
//                 <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4 z-50">
//                     <h2 className="text-xl font-bold">{`${learner.first_name} ${learner.last_name}`}</h2>
//                     <p className="text-gray-700">Enrolled On: {selectedLearner.enrolled_date || 'Not specified'}</p>
//                     <div className="mt-4">
//                         <div className="flex">
//                             <div className="w-1/2">
//                                 <label className="font-bold mr-2"><b>Total:</b></label>
//                                 <input
//                                     type="text"
//                                     value={`₹ ${selectedLearner.fees?.total || 0}`}
//                                     readOnly
//                                     className="border border-gray-300 rounded px-2 py-1 w-full"
//                                 />
//                             </div>
//                             <div className="w-1/2">
//                                 <label className="font-bold mr-2"><b>Paid:</b></label>
//                                 <input
//                                     type="text"
//                                     value={`₹ ${selectedLearner.fees?.paid || 0}`}
//                                     readOnly
//                                     className="border border-gray-300 rounded px-2 py-1 w-full"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex">
//                             <div className="w-1/2">
//                                 <label className="font-bold mr-2"><b>Outstanding:</b></label>
//                                 <input
//                                     type="text"
//                                     value={`₹ ${selectedLearner.totalOutstanding || 0}`}
//                                     readOnly
//                                     className="border border-gray-300 rounded px-2 py-1 w-full"
//                                 />
//                             </div>
//                             <div className="w-1/2">
//                                 <label className="font-bold mr-2"><b>Overdue:</b></label>
//                                 <input
//                                     type="text"
//                                     value={`₹ ${selectedLearner.totalOverdue || 0}`}
//                                     readOnly
//                                     className="border border-gray-300 rounded px-2 py-1 w-full"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <h4 className="mt-2 font-semibold">Installments</h4>
//                     <div className="mt-2">
//                         {Object.entries(selectedLearner.installments).length > 0 ? (
//                             <table className="min-w-full border-collapse border border-gray-200">
//                                 <thead>
//                                     <tr className="bg-blue">
//                                         <th className="border border-gray-200 px-4 py-2 text-left">Installment</th>
//                                         <th className="border border-gray-200 px-4 py-2 text-left">Due Amount</th>
//                                         <th className="border border-gray-200 px-4 py-2 text-left">Due Date</th>
//                                         <th className="border border-gray-200 px-4 py-2 text-left">Paid Amount</th>
//                                         <th className="border border-gray-200 px-4 py-2 text-left">Paid Date</th>
//                                         <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.entries(selectedLearner.installments).map(([key, installment], index) => (
//                                         <tr key={key} className="hover:bg-gray-50">
//                                             <td className="border border-gray-200 px-4 py-2">Installment {index + 1}</td>
//                                             <td className="border border-gray-200 px-4 py-2">₹{installment.dueAmount || 0}</td>
//                                             <td className="border border-gray-200 px-4 py-2">{installment.dueDate ? new Date(installment.dueDate).toLocaleString() : 'Not specified'}</td>
//                                             <td className="border border-gray-200 px-4 py-2">₹{installment.paidAmount || 0}</td>
//                                             <td className="border border-gray-200 px-4 py-2">{installment.paidDate ? new Date(installment.paidDate).toLocaleString() : 'Not paid'}</td>
//                                             <td className="border border-gray-200 px-4 py-2">
//                                                 <span className={installment.paymentStatus === 'OUTSTANDING' ? 'text-red-500' : 'text-green-500'}>
//                                                     {installment.remark}
//                                                 </span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <p>No installments available.</p>
//                         )}
//                     </div>

//                     <button onClick={closeDetails} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
//                         Close
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Fees;



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
        }

        return { outstanding, overdue };
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch student data
                const studentDoc = await getDoc(doc(db, 'student', studentId));
                if (studentDoc.exists()) {
                    setLearner(studentDoc.data());
                } else {
                    throw new Error("No such student found!");
                }

                // Fetch enrollment data
                const enrollmentDoc = await getDoc(doc(db, 'enrollments', studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const coursesData = enrollmentDoc.data().courses;
                    
                    // Fetch course details
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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const handleRowClick = (course) => setSelectedCourse(course);
    const closeDetails = () => setSelectedCourse(null);

    return (
        <div className="flex relative bg-gray-100 min-h-screen">
            <div className={`fixed inset-0 bg-black opacity-50 transition-opacity ${selectedCourse ? 'block' : 'hidden'}`} onClick={closeDetails} />
            <div className="flex-1 p-4">
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 text-xs uppercase">
                            <th className="p-3 text-left">Sr.</th>
                            <th className="p-3 text-left">Course</th>
                            <th className="p-3 text-left">Mode</th>
                            <th className="p-3 text-left">Fee Template</th>
                            <th className="p-3 text-left">Total Fees (₹)</th>
                            <th className="p-3 text-left">Discount</th>
                            <th className="p-3 text-left">Fee After Discount (₹)</th>
                            {/* <th className="p-3 text-left">Pending (₹)</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {enrollmentData.map((course, index) => (
                            <tr key={course.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(course)}>
                                <td className="p-3 border-b">{index + 1}</td>
                                <td className="p-3 border-b">{course.name}</td>
                                <td className="p-3 border-b">{course.mode || 'N/A'}</td>
                                <td className="p-3 border-b">{course.feeTemplate || 'N/A'}</td>
                                <td className="p-3 border-b">{course.fullFeesDetails?.totalFees || 0}</td>
                                <td className="p-3 border-b">
                                    {course.fullFeesDetails?.discountType 
                                        ? `${course.fullFeesDetails.discountValue}${course.fullFeesDetails.discountType === 'percentage' ? '%' : '₹'}`
                                        : '0'}
                                </td>
                                <td className="p-3 border-b">{course.fullFeesDetails?.feeAfterDiscount || 0}</td>
                                {/* <td className="p-3 border-b">{course.totalOutstanding + course.totalOverdue}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCourse && learner && (
                <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
                    <h2 className="text-xl font-bold">{`${learner.first_name} ${learner.last_name}`}</h2>
                    <p className="text-gray-700">Course: {selectedCourse.name}</p>
                    <p className="text-gray-700">Mode: {selectedCourse.mode || 'Not specified'}</p>
                    <div className="mt-4">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="font-bold"><b>Total Fees:</b></label>
                                <input
                                    type="text"
                                    value={`₹ ${selectedCourse.fullFeesDetails?.totalFees || 0}`}
                                    readOnly
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="font-bold"><b>Fee After Discount:</b></label>
                                <input
                                    type="text"
                                    value={`₹ ${selectedCourse.fullFeesDetails?.feeAfterDiscount || 0}`}
                                    readOnly
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-2">
                            <div className="w-1/2">
                                <label className="font-bold"><b>Outstanding:</b></label>
                                <input
                                    type="text"
                                    value={`₹ ${selectedCourse.totalOutstanding || 0}`}
                                    readOnly
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="font-bold"><b>Overdue:</b></label>
                                <input
                                    type="text"
                                    value={`₹ ${selectedCourse.totalOverdue || 0}`}
                                    readOnly
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {selectedCourse.feeTemplate === 'FullFees' && (
                        <>
                            <h4 className="mt-4 font-semibold">Payment Details</h4>
                            <table className="min-w-full border-collapse border border-gray-200 mt-2">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Received By</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2">Registration</td>
                                        <td className="border border-gray-200 px-4 py-2">₹{selectedCourse.fullFeesDetails?.registration?.amount || 0}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {selectedCourse.fullFeesDetails?.registration?.date 
                                                ? new Date(selectedCourse.fullFeesDetails.registration.date).toLocaleDateString() 
                                                : 'Not paid'}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">{selectedCourse.fullFeesDetails?.registration?.receivedBy || 'N/A'}</td>
                                        <td className="border border-gray-200 px-4 py-2">{selectedCourse.fullFeesDetails?.registration?.remark || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2">Final Payment</td>
                                        <td className="border border-gray-200 px-4 py-2">₹{selectedCourse.fullFeesDetails?.finalPayment?.amount || 0}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {selectedCourse.fullFeesDetails?.finalPayment?.date 
                                                ? new Date(selectedCourse.fullFeesDetails.finalPayment.date).toLocaleDateString() 
                                                : 'Not paid'}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">{selectedCourse.fullFeesDetails?.finalPayment?.receivedBy || 'N/A'}</td>
                                        <td className="border border-gray-200 px-4 py-2">{selectedCourse.fullFeesDetails?.finalPayment?.remark || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}

                    {selectedCourse.feeTemplate === 'Installments' && (
                        <>
                            <h4 className="mt-4 font-semibold">Installments</h4>
                            <table className="min-w-full border-collapse border border-gray-200 mt-2">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-200 px-4 py-2 text-left">No.</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Due Amount</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Due Date</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Paid Amount</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Paid Date</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCourse.installmentDetails?.map((installment, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-2">{installment.number || index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2">₹{installment.dueAmount || 0}</td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {installment.dueDate ? new Date(installment.dueDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">₹{installment.paidAmount || 0}</td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {installment.paidDate ? new Date(installment.paidDate).toLocaleDateString() : 'Not paid'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
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
                        </>
                    )}

                    {selectedCourse.feeTemplate === 'Free' && (
                        <p className="mt-4">This is a free course. No payment required.</p>
                    )}

                    {selectedCourse.feeTemplate === 'Finance' && (
                        <p className="mt-4">Finance details to be implemented later.</p>
                    )}

                    <button onClick={closeDetails} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default Fees;