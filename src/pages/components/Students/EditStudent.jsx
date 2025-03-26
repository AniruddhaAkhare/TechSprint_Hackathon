import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, setDoc, query, where } from "firebase/firestore";
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
        preferred_centers: [], // Added to store preferred centers
        guardian_details: { name: "", phone: "", email: "", relation: "", occupation: "" }, // Added guardian details
    });
    const [feeTemplates, setFeeTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Control drawer visibility
    const [selectedCenter, setSelectedCenter] = useState(""); // Temporary state for dropdown selection

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
                    preferred_centers: data.preferred_centers || [], // Load preferred centers
                    guardian_details: data.guardian_details || { name: "", phone: "", email: "", relation: "", occupation: "" }, // Load guardian details
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
          // Fetch the instituteSetup document first to get its ID
          const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
          if (instituteSnapshot.empty) {
            console.error("No instituteSetup document found");
            return;
          }
          const instituteId = instituteSnapshot.docs[0].id;
    
          // Fetch only active centers from the Center subcollection
          const centerQuery = query(
            collection(db, "instituteSetup", instituteId, "Center"),
            where("isActive", "==", true)
          );
          const centerSnapshot = await getDocs(centerQuery);
          const centersList = centerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCenters(centersList);
        } catch (error) {
          console.error("Error fetching centers:", error);
        }
      };

    // const fetchCenters = async () => {
    //     try {
    //         const querySnapshot = await getDocs(collection(db, "Centers"));
    //         setCenters(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    //     } catch (error) {
    //         console.error("Error fetching centers:", error);
    //     }
    // };

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
        } else if (name.includes("guardian_details")) {
            const field = name.split(".")[1];
            setStudent(prev => ({ ...prev, guardian_details: { ...prev.guardian_details, [field]: value } }));
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

    const addCourse = () => setStudent(prev => ({ ...prev, courseDetails: [...prev.courseDetails, { courseName: '', batch: '', branch: '', mode: '', fee: 0 }] }));
    const addEducation = () => setStudent(prev => ({ ...prev, educationDetails: [...prev.educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }] }));
    const addInstallment = () => setStudent(prev => ({ ...prev, installmentDetails: [...prev.installmentDetails, { number: '', dueAmount: '', dueDate: '', paidOn: '', amtPaid: '', modeOfPayment: '', pdcStatus: '', remark: '' }] }));
    const addExperience = () => setStudent(prev => ({ ...prev, experienceDetails: [...prev.experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }] }));

    const removeCourse = (index) => setStudent(prev => ({ ...prev, courseDetails: prev.courseDetails.filter((_, i) => i !== index) }));
    const deleteEducation = (index) => setStudent(prev => ({ ...prev, educationDetails: prev.educationDetails.filter((_, i) => i !== index) }));
    const deleteInstallment = (index) => setStudent(prev => ({ ...prev, installmentDetails: prev.installmentDetails.filter((_, i) => i !== index) }));
    const deleteExperience = (index) => setStudent(prev => ({ ...prev, experienceDetails: prev.experienceDetails.filter((_, i) => i !== index) }));

    const handleAddCenter = () => {
        if (selectedCenter && !student.preferred_centers.includes(selectedCenter)) {
            setStudent(prev => ({ ...prev, preferred_centers: [...prev.preferred_centers, selectedCenter] }));
            setSelectedCenter(""); // Reset dropdown after adding
        }
    };

    const handleRemoveCenter = (centerId) => {
        setStudent(prev => ({ ...prev, preferred_centers: prev.preferred_centers.filter(id => id !== centerId) }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!student.first_name || !student.last_name || !student.email || !student.phone) {
            alert("Please fill necessary fields.");
            return;
        }
    
        let installmentTotal = 0;
        student.installmentDetails.forEach((installment) => {
            installmentTotal += Number(installment.dueAmount);
        });
    
        if (installmentTotal !== Number(student.total)) {
            alert("Installment total does not match with total amount");
            return;
        }
    
        try {
            // Update the student document
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
                experience_details: student.experienceDetails,
                discount: student.discount,
                total: student.total,
                preferred_centers: student.preferred_centers,
                guardian_details: student.guardian_details,
            });
    
            // Update or create the enrollments document
            let paidAmt = 0;
            const today = new Date().toISOString().split("T")[0];
            let outstanding = 0;
            let overdue = 0;
    
            student.installmentDetails.forEach((installment) => {
                const amtPaid = Number(installment.amtPaid) || 0;
                const amtDue = Number(installment.dueAmount) || 0;
    
                paidAmt += amtPaid;
    
                const dueDate = new Date(installment.dueDate).toISOString().split("T")[0];
                if (dueDate > today && !installment.amtPaid) {
                    outstanding += amtDue;
                } else if (dueDate <= today && !installment.amtPaid) {
                    overdue += amtDue;
                }
            });
    
            const enrollmentData = {
                student_id: studentId,
                course_id: student.courseDetails[0]?.courseId || "",
                enrollment_date: Timestamp.fromDate(new Date(student.admission_date)),
                fee: {
                    discount: student.discount || 0,
                    total: student.total || 0,
                    overdue: overdue,
                    paid: paidAmt,
                    outstanding: outstanding,
                },
                installments: student.installmentDetails,
            };
    
            // Use setDoc with merge to create or update the enrollments document
            await setDoc(doc(db, 'enrollments', studentId), enrollmentData, { merge: true });
    
            // Update or create the installments documents
            for (const installmentData of student.installmentDetails) {
                if (installmentData.id) {
                    // If the installment has an ID, update or create it
                    await setDoc(doc(db, 'installments', installmentData.id), {
                        ...installmentData,
                        student_id: studentId
                    }, { merge: true });
                } else {
                    // If the installment doesn't have an ID, create a new document
                    const newInstallmentRef = doc(collection(db, 'installments'));
                    await setDoc(newInstallmentRef, {
                        ...installmentData,
                        student_id: studentId,
                        id: newInstallmentRef.id // Assign the generated ID to the installment
                    });
                    // Update the installmentDetails with the new ID
                    setStudent(prev => {
                        const updatedInstallments = [...prev.installmentDetails];
                        const index = updatedInstallments.findIndex(inst => inst === installmentData);
                        updatedInstallments[index] = { ...installmentData, id: newInstallmentRef.id };
                        return { ...prev, installmentDetails: updatedInstallments };
                    });
                }
            }
    
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
                console.error("Error deleting student:", error);
                alert("Error deleting student. Please try again.");
            }
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => navigate("/studentdetails"), 300); // Match transition duration
    };

    const handleFeeSummary = () => {
        let totalFees = 0;
        student.courseDetails.forEach((course) => {
            if (course.fee && !isNaN(course.fee)) {
                totalFees += Number(course.fee);
            }
        });
        const discountAmount = (totalFees * (student.discount / 100)) || 0;
        const finalTotal = totalFees - discountAmount;
        setStudent(prev => ({ ...prev, total: finalTotal }));
    };

    const handleTemplateChange = async (e) => {
        const templateId = e.target.value;
        setSelectedTemplate(templateId);

        const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
        const templateData = templateSnapshot.docs.find(doc => doc.id === templateId)?.data();
        if (templateData && templateData.installments) {
            setStudent(prev => ({ ...prev, installmentDetails: templateData.installments }));
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } z-50 overflow-y-auto`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Edit Student</h1>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
                        {/* Personal Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={student.first_name}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={student.last_name}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        required
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={student.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={student.phone}
                                        onChange={handleChange}
                                        placeholder="Phone"
                                        required
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={student.date_of_birth}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Enrollment Date</label>
                                    <input
                                        type="date"
                                        name="admission_date"
                                        value={student.admission_date}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Guardian Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Name</label>
                                    <input
                                        type="text"
                                        name="guardian_details.name"
                                        value={student.guardian_details.name}
                                        onChange={handleChange}
                                        placeholder="Guardian Name"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                                    <input
                                        type="text"
                                        name="guardian_details.phone"
                                        value={student.guardian_details.phone}
                                        onChange={handleChange}
                                        placeholder="Guardian Phone"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="guardian_details.email"
                                        value={student.guardian_details.email}
                                        onChange={handleChange}
                                        placeholder="Guardian Email"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Relation</label>
                                    <input
                                        type="text"
                                        name="guardian_details.relation"
                                        value={student.guardian_details.relation}
                                        onChange={handleChange}
                                        placeholder="Relation"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Occupation</label>
                                    <input
                                        type="text"
                                        name="guardian_details.occupation"
                                        value={student.guardian_details.occupation}
                                        onChange={handleChange}
                                        placeholder="Occupation"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={student.address.street}
                                            onChange={handleChange}
                                            placeholder="Street"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.area"
                                            value={student.address.area}
                                            onChange={handleChange}
                                            placeholder="Area"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={student.address.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={student.address.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.zip"
                                            value={student.address.zip}
                                            onChange={handleChange}
                                            placeholder="Zip Code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={student.address.country}
                                            onChange={handleChange}
                                            placeholder="Country"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-600 mb-2">Billing Address</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="billingAddress.name"
                                            value={student.billingAddress.name}
                                            onChange={handleChange}
                                            placeholder="Name / Company Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.street"
                                            value={student.billingAddress.street}
                                            onChange={handleChange}
                                            placeholder="Street"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.area"
                                            value={student.billingAddress.area}
                                            onChange={handleChange}
                                            placeholder="Area"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.city"
                                            value={student.billingAddress.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.state"
                                            value={student.billingAddress.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.zip"
                                            value={student.billingAddress.zip}
                                            onChange={handleChange}
                                            placeholder="Zip Code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.country"
                                            value={student.billingAddress.country}
                                            onChange={handleChange}
                                            placeholder="Country"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.gstNo"
                                            value={student.billingAddress.gstNo}
                                            onChange={handleChange}
                                            placeholder="GST No."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Educational Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3 text-sm font-medium text-gray-600">Level</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.educationDetails.map((edu, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <select
                                                        name={`educationDetails.${index}.level`}
                                                        value={edu.level}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="" disabled>Select Level</option>
                                                        <option value="School">School</option>
                                                        <option value="UG">UG</option>
                                                        <option value="PG">PG</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.institute`}
                                                        value={edu.institute}
                                                        onChange={handleChange}
                                                        placeholder="Institute Name"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.degree`}
                                                        value={edu.degree}
                                                        onChange={handleChange}
                                                        placeholder="Degree"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.specialization`}
                                                        value={edu.specialization}
                                                        onChange={handleChange}
                                                        placeholder="Specialization"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.grade`}
                                                        value={edu.grade}
                                                        onChange={handleChange}
                                                        placeholder="Grade"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        name={`educationDetails.${index}.passingyr`}
                                                        value={edu.passingyr}
                                                        onChange={handleChange}
                                                        placeholder="Year"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteEducation(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Add Education
                                </button>
                            </div>
                        </div>

                        {/* Experience Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Years</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Description</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.experienceDetails.map((exp, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.companyName`}
                                                        value={exp.companyName}
                                                        onChange={handleChange}
                                                        placeholder="Company Name"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.designation`}
                                                        value={exp.designation}
                                                        onChange={handleChange}
                                                        placeholder="Designation"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.salary`}
                                                        value={exp.salary}
                                                        onChange={handleChange}
                                                        placeholder="Salary"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        name={`experienceDetails.${index}.years`}
                                                        value={exp.years}
                                                        onChange={handleChange}
                                                        placeholder="Years"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.description`}
                                                        value={exp.description}
                                                        onChange={handleChange}
                                                        placeholder="Description"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteExperience(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addExperience}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Add Experience
                                </button>
                            </div>
                        </div>

                        {/* Goal, Status, and Preferred Learning Centers */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Goal</label>
                                    <select
                                        name="goal"
                                        value={student.goal}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select Goal</option>
                                        <option value="Upskilling">Upskilling</option>
                                        <option value="Career Switch">Career Switch</option>
                                        <option value="Placement">Placement</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Status</label>
                                    <select
                                        name="status"
                                        value={student.status}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select Status</option>
                                        <option value="enquiry">Enquiry</option>
                                        <option value="enrolled">Enrolled</option>
                                        <option value="completed">Completed</option>
                                        <option value="deferred">Deferred</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Preferred Learning Centers</label>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={selectedCenter}
                                            onChange={(e) => setSelectedCenter(e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" disabled>Select a Center</option>
                                            {centers
                                                .filter(center => !student.preferred_centers.includes(center.id))
                                                .map((center) => (
                                                    <option key={center.id} value={center.id}>
                                                        {center.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAddCenter}
                                            disabled={!selectedCenter}
                                            className={`mt-1 px-3 py-2 rounded-md text-white ${
                                                selectedCenter ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                            } transition duration-200`}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {student.preferred_centers.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-600">Selected Centers:</p>
                                            <ul className="mt-1 space-y-1">
                                                {student.preferred_centers.map((centerId) => {
                                                    const center = centers.find(c => c.id === centerId);
                                                    return (
                                                        <li key={centerId} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                                            <span>{center?.name || "Unknown Center"}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCenter(centerId)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <FontAwesomeIcon icon={faXmark} />
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Date of Enrollment</label>
                                    <input
                                        type="date"
                                        name="admission_date"
                                        value={student.admission_date}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Update Student
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
                            >
                                Delete Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}