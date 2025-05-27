// import { useState, useEffect } from "react";
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
// import { db } from "../../../config/firebase";
// import CreateCenters from "./CreateCenters.jsx";
// import SearchBar from "../SearchBar";

// export default function Centers() {
//     const [centers, setCenters] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [currentCenter, setCurrentCenter] = useState(null);
//     const [deleteId, setDeleteId] = useState(null);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);

//     const fetchCenters = async () => {
//         try {
//             const snapshot = await getDocs(collection(db, "Centers"));
//             const centersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
//             // Sort centers based on createdAt timestamp (ascending order)
//             centersList.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    
//             setCenters(centersList);
//         } catch (error) {
//             //console.error("Error fetching centers:", error);
//         }
//     };
    

//     // const fetchCenters = async () => {
//     //     try {
//     //         const snapshot = await getDocs(collection(db, "Centers"));
//     //         setCenters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     //     } catch (error) {
//     //         //console.error("Error fetching centers:", error);
//     //     }
//     // };

//     useEffect(() => {
//         fetchCenters();
//     }, []);

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = centers.filter(center =>
//             center.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         if (searchTerm) {
//             handleSearch();
//         } else {
//             setSearchResults([]);
//         }
//     }, [searchTerm]);

   

//     const handleCreateCenterClick = () => {
//         setCurrentCenter(null);
//         setIsOpen(true);
//     };

//     const handleEditClick = (center) => {
//         setCurrentCenter(center);
//         setIsOpen(true);
//     };

//     const handleDeleteCenter = async () => {
//         if (deleteId) {
//             try {
//                 await deleteDoc(doc(db, "Centers", deleteId));
//                 fetchCenters();
//                 alert("Center deleted successfully!");
//             } catch (error) {
//                 //console.error("Error deleting center:", error);
//                 alert("Failed to delete center. Please try again.");
//             } finally {
//                 setDeleteId(null);
//             }
//         }
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4">
//                 <div className="flex-1">
//                     <h1 className="text-2xl font-semibold">Centers</h1>
//                 </div>
//                 <div>
//                     <button onClick={handleCreateCenterClick} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
//                         + Create Center
//                     </button>
//                 </div>
//             </div>

//             <CreateCenters isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} centerData={currentCenter} refreshCenters={fetchCenters} />


//             <div className="justify-between items-center p-4 mt-4">
//                 <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleSearch={handleSearch}
//                 />
//             </div>

//             <div className="sec-3">
//                 <table className="data-table table">
//                     <thead className="table-secondary">
//                         <tr className="bg-gray-200">
//                             <th className="border p-2">Sr No</th>
//                             <th className="border p-2">Center Name</th>
//                             <th className="border p-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {centers.length > 0 ? (
//                             centers.map((center, index) => (
//                                 <tr key={center.id} className="border">
//                                     <td className="border p-2">{index + 1}</td>
//                                     <td className="border p-2">{center.name}</td>
//                                     <td className="border p-2 flex space-x-2">
//                                         <button onClick={() => setDeleteId(center.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
//                                             Delete
//                                         </button>
//                                         <button onClick={() => handleEditClick(center)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
//                                             Update
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="3" className="text-center py-4">No centers found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {deleteId && (
//                 <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg">
//                         <h2 className="text-xl font-semibold">Confirm Deletion</h2>
//                         <p>Are you sure you want to delete this center?</p>
//                         <div className="flex justify-between mt-4">
//                             <button onClick={() => setDeleteId(null)} className="bg-gray-400 text-white py-2 px-4 rounded">
//                                 Cancel
//                             </button>
//                             <button onClick={handleDeleteCenter} className="bg-red-500 text-white py-2 px-4 rounded">
//                                 Yes, Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }




import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import CreateCenters from "./CreateCenters.jsx";
import SearchBar from "../SearchBar";

export default function Centers() {
    const [centers, setCenters] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentCenter, setCurrentCenter] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    
    const fetchCenters = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Centers"));
            const centersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort centers based on createdAt timestamp (ascending order)
            centersList.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

            
            setCenters(centersList);
        } catch (error) {
            //console.error("Error fetching centers:", error);
        }
    };

    useEffect(() => {
        fetchCenters();
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = centers.filter(center =>
            center.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleCreateCenterClick = () => {
        setCurrentCenter(null);
        setIsOpen(true);
    };

    const handleEditClick = (center) => {
        setCurrentCenter(center);
        setIsOpen(true);
    };

    const handleDeleteCenter = async () => {
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "Centers", deleteId));
                fetchCenters();
                alert("Center deleted successfully!");
            } catch (error) {
                //console.error("Error deleting center:", error);
                alert("Failed to delete center. Please try again.");
            } finally {
                setDeleteId(null);
            }
        }
    };

    return (
        <div className="p-20">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Centers</h1>
                </div>
                <div>
                    <button onClick={handleCreateCenterClick} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        + Create Center
                    </button>
                </div>
            </div>

            <CreateCenters isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} centerData={currentCenter} refreshCenters={fetchCenters} />

            <div className="justify-between items-center p-4 mt-4">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                />
            </div>

            <div className="sec-3">
                <table className="data-table table">
                    <thead className="table-secondary">
                        <tr className="bg-gray-200">
                            <th className="border p-2">Sr No</th>
                            <th className="border p-2">Center Name</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {centers.length > 0 ? (
                            centers.map((center, index) => (
                                <tr key={center.id} className="border">
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{center.name}</td>
                                    
                                    <td className="border p-2">{center.status}</td>
                                    <td className="border p-2 flex space-x-2">
                                        <button onClick={() => setDeleteId(center.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                        <button onClick={() => handleEditClick(center)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No centers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {deleteId && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this center?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setDeleteId(null)} className="bg-gray-400 text-white py-2 px-4 rounded">
                                Cancel
                            </button>
                            <button onClick={handleDeleteCenter} className="bg-red-500 text-white py-2 px-4 rounded">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}