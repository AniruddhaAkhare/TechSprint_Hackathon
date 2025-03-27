

import { useState, useEffect } from "react";
import { db } from '../../../config/firebase';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';

const AddInstructor = ({ open, onClose, instructor, centers, roles, setInstructorList }) => {
    const [formData, setFormData] = useState({
        f_name: "",
        l_name: "",
        email: "",
        phone: "",
        specialization: "",
        center: "",
        role: ""
    });
    const [errors, setErrors] = useState({});

    const instructorCollectionRef = collection(db, "Instructor");

    useEffect(() => {
        if (instructor && instructor.id) {
            setFormData(instructor);
        } else {
            resetForm();
        }
    }, [instructor]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.f_name.trim()) newErrors.f_name = "First name is required";
        if (!formData.l_name.trim()) newErrors.l_name = "Last name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }
        if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required";
        if (!formData.center) newErrors.center = "Center is required";
        if (!formData.role) newErrors.role = "Role is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (formData.id) {
                await updateDoc(doc(db, "Instructor", formData.id), formData);
                setInstructorList(prev => prev.map(i => i.id === formData.id ? formData : i));
                alert("Instructor updated successfully!");
            } else {
                const newDoc = await addDoc(instructorCollectionRef, formData);
                setInstructorList(prev => [...prev, { id: newDoc.id, ...formData }]);
                alert("Instructor created successfully!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving instructor:", error);
            alert("Failed to save instructor. Please try again.");
        }
    };

    const resetForm = () => {
        setFormData({
            f_name: "",
            l_name: "",
            email: "",
            phone: "",
            specialization: "",
            center: "",
            role: ""
        });
        setErrors({});
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white w-1/3 shadow-lg transform transition-transform duration-300 ${
                    open ? "translate-x-0" : "translate-x-full"
                } z-50 overflow-y-auto`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {formData.id ? "Edit Instructor" : "Add Instructor"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">First Name</label>
                            <input
                                type="text"
                                value={formData.f_name}
                                onChange={(e) => handleChange("f_name", e.target.value)}
                                placeholder="Enter first name"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.f_name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.f_name && <p className="mt-1 text-sm text-red-500">{errors.f_name}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Last Name</label>
                            <input
                                type="text"
                                value={formData.l_name}
                                onChange={(e) => handleChange("l_name", e.target.value)}
                                placeholder="Enter last name"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.l_name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.l_name && <p className="mt-1 text-sm text-red-500">{errors.l_name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="Enter email"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <div className="relative flex items-center">
                                <span className="inline-block px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600">
                                    +91
                                </span>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    placeholder="Enter 10-digit phone number"
                                    className={`mt-0 w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.phone ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                            </div>
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Specialization */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Specialization</label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) => handleChange("specialization", e.target.value)}
                                placeholder="Enter specialization"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.specialization ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.specialization && <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>}
                        </div>

                        {/* Center */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Center</label>
                            <select
                                value={formData.center}
                                onChange={(e) => handleChange("center", e.target.value)}
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.center ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.name}>{center.name}</option>
                                ))}
                            </select>
                            {errors.center && <p className="mt-1 text-sm text-red-500">{errors.center}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.role ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                type="button"
                                onClick={() => { resetForm(); onClose(); }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                {formData.id ? "Update Instructor" : "Add Instructor"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddInstructor;