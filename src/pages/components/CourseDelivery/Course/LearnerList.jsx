import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase'; // Adjust path as needed
import { collection, getDocs } from 'firebase/firestore';
import { 
    Dialog, 
    DialogHeader, 
    DialogBody, 
    DialogFooter, 
    Button 
} from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

export default function LearnerList({ courseId, open, onClose }) {
    const [learners, setLearners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLearners = async () => {
            if (!courseId || !open) return;

            setIsLoading(true);
            setError(null);
            setLearners([]);

            try {
                // Step 1: Fetch enrollments
                const enrollmentsRef = collection(db, "enrollments");
                const enrollmentSnapshot = await getDocs(enrollmentsRef);
                const allEnrollments = enrollmentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filter enrollments for the given courseId
                const matchedLearners = allEnrollments
                    .filter(enrollment => 
                        enrollment.courses?.some(course => 
                            course.selectedCourse?.id === courseId
                        )
                    )
                    .map(enrollment => ({
                        studentId: enrollment.id, // Assuming enrollment.id is the studentId
                        courseDetails: enrollment.courses.find(course => 
                            course.selectedCourse?.id === courseId
                        )
                    }));

                // Step 2: Fetch student details from the student collection
                const studentsRef = collection(db, "student");
                const studentSnapshot = await getDocs(studentsRef);
                const allStudents = studentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Step 3: Map studentId to firstName and lastName
                const learnersWithNames = matchedLearners.map(learner => {
                    const student = allStudents.find(s => s.id === learner.studentId);
                    return {
                        ...learner,
                        firstName: student?.first_name || student?.f_name || 'N/A',
                        lastName: student?.last_name || student?.l_name || 'N/A'
                    };
                });
                console.log(learnersWithNames);
                setLearners(learnersWithNames);
            } catch (err) {
                console.error("Error fetching learners:", err);
                setError("Failed to load learners");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLearners();
    }, [courseId, open]);

    return (
        
        <Dialog
            open={open}
            handler={onClose}
            
        >
            <DialogHeader className="text-gray-800 font-semibold">
                Learners for Course
            </DialogHeader>
            <DialogBody className="text-gray-600 max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                    <p>Loading learners...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : learners.length === 0 ? (
                    <p>No learners enrolled in this course</p>
                ) : (
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sr No</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learners.map((learner, index) => (
                                <tr key={learner.studentId} className="border-b hover:bg-gray-50 cursor-pointer hover:text-blue-600" onClick={()=>{navigate(`/studentdetails/${learner.studentId}`)}}>
                                    <td className="px-4 py-2 ">{index + 1}</td>
                                    <td className="px-4 py-2" >{learner.firstName}<span>   </span>{learner.lastName}</td>
                                    <td className="px-4 py-2">{learner.courseDetails?.mode || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </DialogBody>
            <DialogFooter className="space-x-4">
                <Button
                    variant="text"
                    color="gray"
                    onClick={onClose}
                    className="hover:bg-gray-100 transition duration-200"
                    disabled={isLoading}
                >
                    Close
                </Button>
            </DialogFooter>
        </Dialog>
    );
}