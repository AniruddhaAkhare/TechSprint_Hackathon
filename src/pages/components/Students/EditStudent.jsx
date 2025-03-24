import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from "firebase/firestore";

export default function EditStudent() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "",
        goal: "",
        address: { street: "", area: "", city: "", state: "", zip: "", country: "" },
        billingAddress: { name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" },
        date_of_birth: "",
        admission_date: "",
        courseDetails: [],
        educationDetails: [],
        installmentDetails: [],
        experienceDetails: [],
        discount: "",
        total: "",
    });
    const [feeTemplates, setFeeTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Control drawer visibility

    useEffect(() => {
        fetchStudent();
        fetchCourses();
        fetchBatches();
        fetchCenters();
        fetchFeeTemplates();
        // Trigger slide-in animation on mount
        setTimeout(() => setIsOpen(true), 10); // Small delay to ensure animation triggers
    }, [studentId]);

    const fetchStudent = async () => {
        try {
            const studentRef = doc(db, "student", studentId);
            const studentSnap = await getDoc(studentRef);
            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setStudent({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    status: data.status || "",
                    goal: data.goal || "",
                    address: data.residential_address || { street: "", area: "", city: "", state: "", zip: "", country: "" },
                    billingAddress: data.billing_address || { name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" },
                    date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "",
                    admission_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "",
                    courseDetails: data.course_details || [],
                    educationDetails: data.education_details || [],
                    installmentDetails: data.installment_details || [],
                    experienceDetails: data.experience_details || [],
                    discount: data.discount || "",
                    total: data.total || "",
                });
            } else {
                alert("Student not found.");
                navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Course"));
            setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchBatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Batch"));
            setBatches(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching batches:", error);
        }
    };

    const fetchCenters = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Centers"));
            setCenters(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching centers:", error);
        }
    };

    const fetchFeeTemplates = async () => {
        try {
            const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
            if (!templateSnapshot.empty) {
                setFeeTemplates(templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } catch (error) {
            console.error("Error in fetching payment type:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("billingAddress")) {
            const field = name.split(".")[1];
            setStudent(prev => ({ ...prev, billingAddress: { ...prev.billingAddress, [field]: value } }));
        } else if (name.includes("address")) {
            const field = name.split(".")[1];
            setStudent(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else if (name.includes("courseDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedCourses = [...prev.courseDetails];
                updatedCourses[index][fieldName] = value;
                return { ...prev, courseDetails: updatedCourses };
            });
        } else if (name.includes("educationDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedEducation = [...prev.educationDetails];
                updatedEducation[index][fieldName] = value;
                return { ...prev, educationDetails: updatedEducation };
            });
        } else if (name.includes("experienceDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedExperience = [...prev.experienceDetails];
                updatedExperience[index][fieldName] = value;
                return { ...prev, experienceDetails: updatedExperience };
            });
        } else if (name.includes("installmentDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStudent(prev => {
                const updatedInstallments = [...prev.installmentDetails];
                updatedInstallments[index][fieldName] = value;
                return { ...prev, installmentDetails: updatedInstallments };
            });
        } else {
            setStudent(prev => ({ ...prev, [name]: value }));
        }
    };

    const addCourse = () => setStudent(prev => ({ ...prev, courseDetails: [...prev.courseDetails, { courseName: '', batch: '', branch: '', mode: '' }] }));
    const addEducation = () => setStudent(prev => ({ ...prev, educationDetails: [...prev.educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }] }));
    const addInstallment = () => setStudent(prev => ({ ...prev, installmentDetails: [...prev.installmentDetails, { number: '', dueAmount: '', dueDate: '', paidOn: '', amtPaid: '', modeOfPayment: '', pdcStatus: '', remark: '' }] }));
    const addExperience = () => setStudent(prev => ({ ...prev, experienceDetails: [...prev.experienceDetails, { companyName: '', designation: '', salary: '', description: '' }] }));

    const removeCourse = (index) => setStudent(prev => ({ ...prev, courseDetails: prev.courseDetails.filter((_, i) => i !== index) }));
    const deleteEducation = (index) => setStudent(prev => ({ ...prev, educationDetails: prev.educationDetails.filter((_, i) => i !== index) }));
    const deleteInstallment = (index) => setStudent(prev => ({ ...prev, installmentDetails: prev.installmentDetails.filter((_, i) => i !== index) }));
    const deleteExperience = (index) => setStudent(prev => ({ ...prev, experienceDetails: prev.experienceDetails.filter((_, i) => i !== index) }));

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!student.first_name || !student.last_name || !student.email || !student.phone) {
            alert("Please fill necessary fields.");
            return;
        }
        try {
            const studentRef = doc(db, "student", studentId);
            await updateDoc(studentRef, {
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                phone: student.phone,
                status: student.status,
                goal: student.goal,
                residential_address: student.address,
                billing_address: student.billingAddress,
                date_of_birth: Timestamp.fromDate(new Date(student.date_of_birth)),
                admission_date: Timestamp.fromDate(new Date(student.admission_date)),
                course_details: student.courseDetails,
                education_details: student.educationDetails,
                installment_details: student.installmentDetails,
                experienceDetails: student.experienceDetails,
                discount: student.discount,
                total: student.total,
            });
            alert("Student updated successfully!");
            navigate("/studentdetails");
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Error updating student. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteDoc(doc(db, "student", studentId));
                alert("Student deleted successfully!");
                navigate("/studentdetails");
            } catch (error) {
                console.error("Error deleting student :", error);
                alert("Error deleting student. Please try again.");
            }
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => navigate("/studentdetails"), 300); // Match transition duration
    };

    return (
        <div className="p-20">
        {/* // <div className="min-h-screen bg-gray-50 p-6 ml-80 w-[calc(100vw-20rem)]"> */}
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Student</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}