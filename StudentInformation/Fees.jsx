import React, { useState, useEffect } from 'react';
import { getDocs, collection, where, getDoc, doc, query } from 'firebase/firestore';
import { db } from '../src/config/firebase';

const Fees = ({ studentId }) => {
    const [selectedLearner, setSelectedLearner] = useState(null);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [learner, setLearner] = useState();

    const [totalAmount, setTotalAmount] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            setIsLoading(true);
            setError(null);
            setEnrollmentData([]);

            try {
                const enrollmentsQuery = query(
                    collection(db, 'enrollments'),
                    where('student_id', '==', studentId)
                );

                const enrollmentSnapshot = await getDocs(enrollmentsQuery);

                if (!enrollmentSnapshot.empty) {
                    const courseIds = enrollmentSnapshot.docs.map(doc => doc.data().course_id);
                    const coursePromises = courseIds.map(courseId => getDoc(doc(db, 'Course', courseId)));
                    const courseDocs = await Promise.all(coursePromises);

                    const courses = courseDocs.reduce((acc, courseDoc) => {
                        if (courseDoc.exists()) {
                            acc[courseDoc.id] = courseDoc.data().name; 
                        }
                        return acc;
                    }, {});

                    const formattedEnrollments = enrollmentSnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            course_id: data.course_id,
                            course_name: courses[data.course_id] || 'Course not found', 
                            fees: data.fee || {},
                            enrolled_date: data.enrollment_date ? new Date(data.enrollment_date).toLocaleString() : 'Not available',
                            installments: data.installments || {},
                        };
                    });

                    setEnrollmentData(formattedEnrollments);
                } else {
                    setError("No enrollments found for this student.");
                }
            } catch (error) {
                console.error("Error fetching enrollment data:", error);
                setError("Failed to fetch enrollment data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrollments();
    }, [studentId]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const studentDoc = await getDoc(doc(db, 'student', studentId));
                if (studentDoc.exists()) {
                    setLearner(studentDoc.data());
                } else {
                    setError("No such student found!");
                }
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError("Problem in fetching student data.");
            }
        };

        fetchStudent();
    }, [studentId]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const handleRowClick = (enrollment) => {
        setSelectedLearner(enrollment);
    };

    const closeDetails = () => {
        setSelectedLearner(null);
    };



    const calculateTotalAmount = (discountPercentage, discountedAmount) => {
        const discount = parseFloat(discountPercentage) || 0;
        const discounted = parseFloat(discountedAmount) || 0;

        const calculatedTotal = (100/(100-discount))*discounted;
        return (calculatedTotal.toFixed(2)); 
    };

    return (
        <div className="flex relative bg-gray-100 min-h-screen">
            <div className={`fixed inset-0 bg-black opacity-50 transition-opacity ${selectedLearner ? 'block' : 'hidden'}`} onClick={closeDetails} />
            <div className="flex-1 p-4">
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 text-xs uppercase">
                            <th className="p-3 text-left">Sr.</th>
                            <th className="p-3 text-left">Course</th>
                            <th className="p-3 text-left">Total Fees (₹)</th>
                            <th className="p-3 text-left">Discount (%)</th>
                            <th className="p-3 text-left">Fee (₹)</th>
                            <th className="p-3 text-left">Pending (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollmentData.map((enrollment, index) => (
                            <tr key={enrollment.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(enrollment)}>
                                <td className="p-3 border-b">{index + 1}</td>
                                <td className="p-3 border-b">{enrollment.course_name}</td>
                                <td className="p-3 border-b">{calculateTotalAmount(enrollment.fees?.discount, enrollment.fees?.total)}</td>
                                <td className="p-3 border-b">{enrollment.fees?.discount || 0}</td>
                                <td className="p-3 border-b">{enrollment.fees?.total || 0}</td>
                                <td className="p-3 border-b">{(enrollment.fees?.total || 0) - (enrollment.fees?.paid || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedLearner && learner && (
                <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4 z-50">
                    <h2 className="text-xl font-bold">Name: {`${learner.first_name} ${learner.last_name}`}</h2>
                    <p className="text-gray-700">Enrolled On: {selectedLearner.enrolled_date || 'Not specified'}</p>
                    <h3 className="text-lg mt-4">Total: ₹ {selectedLearner.fees?.total || 0}</h3>
                    <h3 className="text-lg mt-4">Paid: ₹ {selectedLearner.fees?.paid || 0}</h3>
                    <h3 className="text-lg mt-4">Outstanding: ₹ {selectedLearner.fees?.outstanding || 0}</h3>
                    <h3 className="text-lg mt-4">Overdue: ₹ {selectedLearner.fees?.overdue || 0}</h3>
                    <h4 className="mt-2 font-semibold">Installments</h4>
                    <div className="mt-2">
                        {Object.entries(selectedLearner.installments).length > 0 ? (
                            Object.entries(selectedLearner.installments).map(([key, installment], index) => (
                                <div key={index}>
                                    <h5>Installment {index + 1}</h5>
                                    <div className="border-b py-2">
                                        <p>Due Amount: ₹{installment.dueAmount || 0}</p>
                                        <p>Due Date: {installment.dueDate ? new Date(installment.dueDate).toLocaleString() : 'Not specified'}</p>
                                        <p>Paid Amount: ₹{installment.paidAmount || 0}</p>
                                        <p>Paid Date: {installment.paidDate ? new Date(installment.paidDate).toLocaleString() : 'Not paid'}</p>
                                        <p>Status: <span className={installment.paymentStatus === 'OUTSTANDING' ? 'text-red-500' : 'text-green-500'}>{installment.remark}</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No installments available.</p>
                        )}
                    </div>
                    <button onClick={closeDetails} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default Fees;
