// // import React, { useState, useEffect } from "react";
// // import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
// // import { db } from "../../../config/firebase";

// // import { serverTimestamp } from "firebase/firestore";
// // export default function CreateCenters({ isOpen, toggleSidebar, centerData, refreshCenters }) {
// //     const [center, setCenter] = useState({
// //         name: "",
// //         addressLine1: "",
// //         addressLine2: "",
// //         area: "",
// //         city: "",
// //         state: "",
// //         pinCode: "",
// //         owner: ""
// //     });

// //     useEffect(() => {
// //         if (centerData) {
// //             setCenter(centerData);
// //         } else {
// //             setCenter({
// //                 name: "",
// //                 addressLine1: "",
// //                 addressLine2: "",
// //                 area: "",
// //                 city: "",
// //                 state: "",
// //                 pinCode: "",
// //                 owner: ""
// //             });
// //         }
// //     }, [centerData]);

// //     const handleChange = (e) => {
// //         setCenter({ ...center, [e.target.name]: e.target.value });
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             if (centerData?.id) {
// //                 const centerRef = doc(db, "Centers", centerData.id);
// //                 await updateDoc(centerRef, center);
// //                 // await updateDoc(centerRef, center);
// //                 alert("Center updated successfully!");
// //             } else {
// //                 await addDoc(collection(db, "Centers"), {
// //                     name: "Center Name",
// //                     createdAt: serverTimestamp(), // Adds the timestamp
// //                 });
                
// //                 alert("Center created successfully!");
// //                 // await addDoc(collection(db, "Centers"), center);
// //             }
// //             toggleSidebar();
// //             refreshCenters(); // Refresh the center list in Centers.jsx
// //         } catch (error) {
// //             console.error("Error saving center:", error);
// //         }
// //     };

// //     return (
// //         isOpen && (
// //             <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
// //                 <div className="bg-white p-6 rounded-lg w-96">
// //                     <h2 className="text-xl font-semibold mb-4">{centerData ? "Edit Center" : "Create Center"}</h2>
// //                     <form onSubmit={handleSubmit}>
// //                         {["name", "addressLine1", "addressLine2", "area", "city", "state", "pinCode", "owner"].map((field) => (
// //                             <div key={field} className="mb-3">
// //                                 <label className="block text-sm font-medium">{field.replace(/([A-Z])/g, " $1")}</label>
// //                                 <input
// //                                     type="text"
// //                                     name={field}
// //                                     value={center[field]}
// //                                     onChange={handleChange}
// //                                     className="border p-2 w-full rounded"
// //                                     required
// //                                 />
// //                             </div>
// //                         ))}
// //                         <div className="flex justify-between">
// //                             <button type="button" onClick={toggleSidebar} className="bg-gray-400 text-white py-2 px-4 rounded">
// //                                 Cancel
// //                             </button>
// //                             <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
// //                                 {centerData ? "Update" : "Create"}
// //                             </button>
// //                         </div>
// //                     </form>
// //                 </div>
// //             </div>
// //         )
// //     );
// // }


// import React, { useState, useEffect } from "react";
// import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
// import { db } from "../../../config/firebase";
// import { serverTimestamp } from "firebase/firestore";

// export default function CreateCenters({ isOpen, toggleSidebar, centerData, refreshCenters }) {
//     const [center, setCenter] = useState({
//         name: "",
//         addressLine1: "",
//         addressLine2: "",
//         area: "",
//         city: "",
//         state: "",
//         pinCode: "",
//         owner: ""
//     });

//     useEffect(() => {
//         if (centerData) {
//             setCenter(centerData);
//         } else {
//             setCenter({
//                 name: "",
//                 addressLine1: "",
//                 addressLine2: "",
//                 area: "",
//                 city: "",
//                 state: "",
//                 pinCode: "",
//                 owner: ""
//             });
//         }
//     }, [centerData]);

//     const handleChange = (e) => {
//         setCenter({ ...center, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (centerData?.id) {
//                 const centerRef = doc(db, "Centers", centerData.id);
//                 await updateDoc(centerRef, center);
//                 alert("Center updated successfully!");
//             } else {
//                 await addDoc(collection(db, "Centers"), {
//                     ...center,
//                     createdAt: serverTimestamp() // Add timestamp only for new centers
//                 });
//                 alert("Center created successfully!");
//             }
//             toggleSidebar();
//             refreshCenters(); // Refresh the center list in Centers.jsx
//         } catch (error) {
//             console.error("Error saving center:", error);
//             alert("Failed to save center. Please try again.");
//         }
//     };

//     return (
//         isOpen && (
//             <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//                 <div className="bg-white p-6 rounded-lg w-96">
//                     <h2 className="text-xl font-semibold mb-4">{centerData ? "Edit Center" : "Create Center"}</h2>
//                     <form onSubmit={handleSubmit}>
//                         {["name", "addressLine1", "addressLine2", "area", "city", "state", "pinCode", "owner"].map((field) => (
//                             <div key={field} className="mb-3">
//                                 <label className="block text-sm font-medium">{field.replace(/([A-Z])/g, " $1")}</label>
//                                 <input
//                                     type="text"
//                                     name={field}
//                                     value={center[field]}
//                                     onChange={handleChange}
//                                     className="border p-2 w-full rounded"
//                                     required
//                                 />
//                             </div>
//                         ))}
//                         <div className="flex justify-between">
//                             <button type="button" onClick={toggleSidebar} className="bg-gray-400 text-white py-2 px-4 rounded">
//                                 Cancel
//                             </button>
//                             <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
//                                 {centerData ? "Update" : "Create"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         )
//     );
// }

import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { serverTimestamp } from "firebase/firestore";

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
                await addDoc(collection(db, "Centers"), {
                    ...center,
                    createdAt: serverTimestamp()
                });
                alert("Center created successfully!");
            }
            toggleSidebar();
            refreshCenters();
        } catch (error) {
            console.error("Error saving center:", error);
            alert("Failed to save center. Please try again.");
        }
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full bg-white w-full md:w-2/5 shadow-lg transform transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } p-6 overflow-y-auto`}
        >
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
    );
}
