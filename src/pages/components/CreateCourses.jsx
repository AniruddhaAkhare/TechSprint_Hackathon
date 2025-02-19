import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from "./firebase";
import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [coursePrerequisite, setCoursePrerequisites] = useState('');
    const [courseMode, setCourseMode] = useState('');
    const [courseBranch, setCourseBranch] = useState('');
    const [courseSubject, setCourseSubject] = useState([{ subjectName: '' }]);

    useEffect(() => {
        if (course) {
            setCourseName(course.name);
            setCourseDescription(course.description);
            setCourseFee(course.fee);
            setCourseDuration(course.duration);
            setCoursePrerequisites(course.prerequisites);
            setCourseMode(course.mode);
            setCourseBranch(course.branch);
            setCourseSubject(course.subjects);
        }else{
            setCourseName("");
            setCourseDescription("");
            setCourseFee("");
            setCourseDuration("");
            setCoursePrerequisites("");
            setCourseMode("");
            setCourseBranch("");
            setCourseSubject([{ subjectName: '' }]);
        }
    }, [course]);

    const courseCollectionRef = collection(db, "Course");

    const onSubmitCourse = async (e) => {
        e.preventDefault();

        if (!courseName.trim() || !courseDescription.trim() || !courseFee || !courseDuration) {
            alert("Please fill in all required fields");
            return;
        }

        if (courseSubject.length === 0 || courseSubject.some(sub => !sub.subjectName.trim())) {
            alert("Please add at least one subject and ensure all subjects have names");
            return;
        }

        console.log("Form submitted with course data:", {
            courseName,
            courseDescription,
            courseFee,
            courseDuration,
            coursePrerequisite,
            courseMode,
            courseBranch,
            courseSubject
        });

        try {
            if (course) {
                const courseDoc = doc(db, "Course", course.id);
                await updateDoc(courseDoc, {
                    description: courseDescription,
                    duration: courseDuration,
                    fee: courseFee,
                    name: courseName,
                    prerequisites: coursePrerequisite,
                    mode: courseMode,
                    branch: courseBranch,
                    subjects: courseSubject
                });
            } else {
                await addDoc(courseCollectionRef, {
                    description: courseDescription,
                    duration: courseDuration,
                    fee: courseFee,
                    name: courseName,
                    prerequisites: coursePrerequisite,
                    mode: courseMode,
                    branch: courseBranch,
                    subjects: courseSubject
                });
            }

            alert("Course successfully added!");
            toggleSidebar(); 
        } catch (err) {
            console.error("Error adding document: ", err);
            alert("Error adding course!");
        }
    };

    const addSubject = () => {
        setCourseSubject([...courseSubject, { subjectName: '' }]);
    };

    const handleSubjectChange = (index, key, value) => {
        const updatedSubjects = [...courseSubject];
        updatedSubjects[index][key] = value;
        setCourseSubject(updatedSubjects);
    };

    const deleteSubject = (index) => {
        setCourseSubject(courseSubject.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
                <button type="button" className="close-button" onClick={toggleSidebar}>
                    Back
                </button>

                <h1>{course ? "Edit Course" : "Create Course"}</h1>
                <form onSubmit={onSubmitCourse}>
                    <div className="col-md-4">
                        <div className="mb-3 subfields">
                            <label htmlFor="course_name" className="form-label">Course Name</label>
                            <input type="text" className="form-control" value={courseName} placeholder="Course Name" onChange={(e) => setCourseName(e.target.value)} required />
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="branch" className="form-label">Branch Name</label>
                            <select value={courseBranch} className="form-select" onChange={(e) => setCourseBranch(e.target.value)}>
                                <option value="">Select Branch</option>
                                <option value="matesq">Mate sq.</option>
                                <option value="nandanwan">Nandanwan</option>
                                <option value="sadar">Sadar</option>
                            </select>
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="description" className="form-label">Course Description</label>
                            <input type="text" className="form-control" value={courseDescription} placeholder="Course Description" onChange={(e) => setCourseDescription(e.target.value)} required />
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="fee" className="form-label">Course Fee</label>
                            <input type="number" className="form-control" value={courseFee} placeholder="Enter Course Fee" onChange={(e) => setCourseFee(e.target.value)} required />
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="duration" className="form-label">Course Duration</label>
                            <input type="text" className="form-control" value={courseDuration} placeholder="Enter Course Duration" onChange={(e) => setCourseDuration(e.target.value)} required />
                        </div>

                        <div>
                            <label htmlFor="subjects" className="form-label">Subjects</label>
                            {courseSubject.map((subject, index) => (
                                <div key={index} className="flex items-center">
                                    <input type="text" placeholder="Subject Name" value={subject.subjectName} onChange={(e) => handleSubjectChange(index, 'subjectName', e.target.value)} />
                                    <button type="button" onClick={() => deleteSubject(index)} className="delete-button">
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                            ))}
                            <br />
                            <button type="button" onClick={addSubject}>Add Subject</button>
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="mode" className="form-label">Course Mode</label>
                            <select value={courseMode} className="form-select" onChange={(e) => setCourseMode(e.target.value)} required>
                                <option value="">Select Mode</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div className="d-grid gap-2 d-md-flex">
                            <button type="submit" >
                                {course ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateCourses;
