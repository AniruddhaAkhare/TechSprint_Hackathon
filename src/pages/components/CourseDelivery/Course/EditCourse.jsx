import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import './CreateCourse.css';
import EditCourseNavbar from './EditCourseNavbar';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState({
        name: '',
        description: '',
        fee: '',
        duration: '',
        prerequisites: '',
        mode: '',
        centers: [],
        subjects: []
    });
    const [allCenters, setAllCenters] = useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseRef = doc(db, "Course", id);
                const docSnap = await getDoc(courseRef);

                if (docSnap.exists()) {
                    setCourseData(prev => ({ ...prev, ...docSnap.data(), subjects: docSnap.data().subjects || [], centers: docSnap.data().centers || [] }));
                } else {
                    console.log("No such course!");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        const fetchCenters = async () => {
            try {
                const centersCollection = collection(db, "Centers");
                const centersSnapshot = await getDocs(centersCollection);
                const centersList = centersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllCenters(centersList);
            } catch (error) {
                console.error("Error fetching centers:", error);
            }
        };

        if (id) {
            fetchCourse();
            fetchCenters();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index, newValue) => {
        setCourseData(prev => {
            const updatedSubjects = [...prev.subjects];
            updatedSubjects[index] = { subjectName: newValue };
            return { ...prev, subjects: updatedSubjects };
        });
    };

    const addSubject = () => {
        setCourseData(prev => ({ ...prev, subjects: [...prev.subjects, { subjectName: '' }] }));
    };

    const removeSubject = (index) => {
        setCourseData(prev => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== index) }));
    };

    const handleCenterChange = (centerId) => {
        setCourseData(prev => {
            const isSelected = prev.centers.includes(centerId);
            return {
                ...prev,
                centers: isSelected ? prev.centers.filter(id => id !== centerId) : [...prev.centers, centerId]
            };
        });
    };

    const handleSave = async () => {
        if (!courseData.name.trim()) {
            alert("Course name cannot be empty!");
            return;
        }

        try {
            const courseRef = doc(db, "Course", id);
            await updateDoc(courseRef, {
                ...courseData,
                subjects: courseData.subjects.map(s => ({ subjectName: s.subjectName })),
                centers: courseData.centers
            });
            alert("Course updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <h1 className="text-2xl font-semibold mb-4">Create and Edit Course</h1>
            <EditCourseNavbar />
            <p className='para'>{courseData.name}</p>
            <form className="space-y-4">
                <input type="text" name="name" value={courseData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Course Name" />
                <input type="text" name="description" value={courseData.description} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Description" />
                <input type="number" name="fee" value={courseData.fee} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Fee" />
                <input type="text" name="duration" value={courseData.duration} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Duration" />
                <input type="text" name="prerequisites" value={courseData.prerequisites} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Prerequisites" />
                <input type="text" name="mode" value={courseData.mode} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Mode (Online/Offline)" />
                
                <h3 className="font-semibold mt-4">Centers:</h3>
                {allCenters.map(center => (
                    <label key={center.id} className="flex items-center">
                        <input type="checkbox" checked={courseData.centers.includes(center.id)} onChange={() => handleCenterChange(center.id)} />
                        <span className="ml-2">{center.name}</span>
                    </label>
                ))}
                
            
                <div className="flex space-x-4 mt-4">
                    <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSave}>Save Changes</button>
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;
