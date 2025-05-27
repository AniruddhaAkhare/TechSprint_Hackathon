import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function  Enrollments ({ studentId })  {
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            setIsLoading(true);
            setError(null);
            setEnrollmentData([]); 

            try {
                const studentRef = doc(db, "student", studentId);
                const studentSnap = await getDoc(studentRef);

                if (studentSnap.exists()) {
                    const data = studentSnap.data();
                    if (data.course_details && Array.isArray(data.course_details)) {
                        const formattedCourses = data.course_details.map((course, index) => ({
                            srNo: index + 1,
                            courseName: course.courseName, 
                            batch: course.batch, 
                            branch: course.branch, 
                            mode: course.mode 
                        }));
                        setEnrollmentData(formattedCourses);
                    } else {
                        setError("No courses found for this student.");
                    }
                } else {
                    setError("Student not found.");
                }
            } catch (error) {
                //console.error("Error fetching student enrollments:", error);
                setError("Failed to fetch enrollment data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrollments();
    }, [studentId]); 

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Enrollments</h2>
            <table className='table-data table'>
                <thead className='table-secondary'>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Course Name</th>
                        <th>Batch</th>
                        <th>Branch</th>
                        <th>Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {enrollmentData.length > 0 ? (
                        enrollmentData.map((enrollment) => (
                            <tr key={enrollment.srNo}>
                                <td>{enrollment.srNo}</td>
                                <td>{enrollment.courseName}</td>
                                <td>{enrollment.batch}</td>
                                <td>{enrollment.branch}</td>
                                <td>{enrollment.mode}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No enrollments available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};