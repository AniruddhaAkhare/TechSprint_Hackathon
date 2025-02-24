import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default function CreateCenters({ isOpen, toggleSidebar, centerData, refreshCenters }) {
    const [center, setCenter] = useState({
        name: "",
        addressLine1: "",
        addressLine2: "",
        area: "",
        city: "",
        state: "",
        pinCode: "",
        owner: ""
    });

    useEffect(() => {
        if (centerData) {
            setCenter(centerData);
        } else {
            setCenter({
                name: "",
                addressLine1: "",
                addressLine2: "",
                area: "",
                city: "",
                state: "",
                pinCode: "",
                owner: ""
            });
        }
    }, [centerData]);

    const handleChange = (e) => {
        setCenter({ ...center, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (centerData?.id) {
                const centerRef = doc(db, "Centers", centerData.id);
                await updateDoc(centerRef, center);
                alert("Center updated successfully!");
            } else {
                await addDoc(collection(db, "Centers"), center);
                alert("Center created successfully!");
            }
            toggleSidebar();
            refreshCenters(); // Refresh the center list in Centers.jsx
        } catch (error) {
            console.error("Error saving center:", error);
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">{centerData ? "Edit Center" : "Create Center"}</h2>
                    <form onSubmit={handleSubmit}>
                        {["name", "addressLine1", "addressLine2", "area", "city", "state", "pinCode", "owner"].map((field) => (
                            <div key={field} className="mb-3">
                                <label className="block text-sm font-medium">{field.replace(/([A-Z])/g, " $1")}</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={center[field]}
                                    onChange={handleChange}
                                    className="border p-2 w-full rounded"
                                    required
                                />
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <button type="button" onClick={toggleSidebar} className="bg-gray-400 text-white py-2 px-4 rounded">
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                                {centerData ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}
