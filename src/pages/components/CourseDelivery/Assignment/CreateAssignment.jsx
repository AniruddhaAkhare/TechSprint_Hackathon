import { useState, useEffect } from 'react';
import { db, storage } from '../../../../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import { useNavigate } from 'react-router-dom';

export default function CreateAssignment() {
    const [curriculums, setCurriculums] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const {navigate} = useNavigate();


    useEffect(() => {
        const fetchCurriculums = async () => {
            try {
                const curriculumsCollection = collection(db, "curriculum");
                const snapshot = await getDocs(curriculumsCollection);
                const curriculumList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(), // Get all data fields
                }));
                console.log("Fetched Curriculums:", curriculumList); // Debugging
                setCurriculums(curriculumList);
            } catch (error) {
                console.error("Error fetching curriculums:", error);
            }
        };

        fetchCurriculums();
    }, []);


    // useEffect(() => {
    //     const fetchCurriculums = async () => {
    //         try {
    //             const curriculumsCollection = collection(db, "curriculum");
    //             const snapshot = await getDocs(curriculumsCollection);
    //             const curriculumList = snapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 name: doc.data().name,
    //             }));
    //             console.log("Fetched Curriculums:", curriculumList); // Debugging
    //             setCurriculums(curriculumList);
    //         } catch (error) {
    //             console.error("Error fetching curriculums:", error);
    //         }
    //     };

    //     fetchCurriculums();
    // }, []);



    // useEffect(() => {
    //     const fetchCurriculums = async () => {
    //         try {
    //             const curriculumsCollection = collection(db, "curriculum");
    //             const snapshot = await getDocs(curriculumsCollection);
    //             const curriculumList = snapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 name: doc.data().name,
    //             }));
    //             setCurriculums(curriculumList);
    //         } catch (error) {
    //             console.error("Error fetching curriculums:", error);
    //         }
    //     };

    //     fetchCurriculums();
    // }, []);

    const handleFileUpload = async () => {
        if (!file) return null;
        const fileRef = ref(storage, `assignments/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const fileUrl = await handleFileUpload();
            await addDoc(collection(db, "assignments"), {
                curriculum: selectedCurriculum,
                dueDate,
                fileUrl,
                timestamp: new Date(),
            });
            alert("Assignment created successfully!");
            navigate('/assignments');
        } catch (error) {
            console.error("Error creating assignment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container ml-80 p-4">
        {/* // <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300`}> */}
            {/* <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto"> */}
            <h2 className="text-xl font-bold">Create Assignment</h2>

            <div className="mt-4">
                <label className="block font-medium">Curriculum</label>

                <select value={selectedCurriculum} onChange={(e) => setSelectedCurriculum(e.target.value)}>
                    <option value="" disabled>Select Curriculum</option>
                    {curriculums.map(curriculum => (
                        <option key={curriculum.id} value={curriculum.name}>{curriculum.name}</option>
                    ))}
                </select>


                {/* <Select value={selectedCurriculum} onChange={(e) => setSelectedCurriculum(e.target.value)}>
                    <option value="" disabled>Select Curriculum</option>
                    {curriculums.length > 0 ? (
                        curriculums.map(curriculum => (
                            <option key={curriculum.id} value={curriculum.name}>{curriculum.name}</option>
                        ))
                    ) : (
                        <option disabled>Loading curriculums...</option>
                    )}
                </Select> */}

                {/* <Select value={selectedCurriculum} onChange={(e) => setSelectedCurriculum(e.target.value)}>
                    <option value="" disabled>Select Curriculum</option>
                    {curriculums.map(curriculum => (
                        <option key={curriculum.id} value={curriculum.name}>{curriculum.name}</option>
                    ))}
                </Select> */}
            </div>

            <div className="mt-4">
                <label className="block font-medium">Due Date</label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div className="mt-4">
                <label className="block font-medium">Upload File</label>
                <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <Button onClick={handleSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded" disabled={loading}>
                {loading ? "Saving..." : "Create Assignment"}
            </Button>
        </div>
    );
}