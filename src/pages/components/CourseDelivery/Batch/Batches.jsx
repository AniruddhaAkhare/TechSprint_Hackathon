


import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc,  query, orderBy} from 'firebase/firestore';
import CreateBatch from "./CreateBatch";
import SearchBar from "../../SearchBar";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

export default function Batches() {
    const [currentBatch, setCurrentBatch] = useState(null);
    const [batches, setBatches] = useState([]);

    const [subjects, setSubjects] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const BatchCollectionRef = collection(db, "Batch");
    const SubjectCollectionRef = collection(db, "Subject");
    const [isOpen, setIsOpen] = useState(false);


    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = batches.filter(batch =>
            batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
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

    const fetchBatches = async () => {
        const q = query(BatchCollectionRef, orderBy('createdAt', 'desc')); // Add order by createdAt
        const snapshot = await getDocs(q);
        const batchData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setBatches(batchData);
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    // const fetchBatches = async () => {
    //     const snapshot = await getDocs(BatchCollectionRef);
    //     const batchData = snapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));
    //     setBatches(batchData);
    // };

    // useEffect(() => {
    //     fetchBatches();
    // }, []);

    const handleCreateBatchClick = () => {
        setCurrentBatch(null);
        toggleSidebar();
    };

    const handleEditClick = (batch) => {
        setCurrentBatch(batch);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentBatch(null);
        fetchBatches();
    };

    const deleteBatch = async () => {
        // console.log("delete ");
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "Batch", deleteId));
                fetchBatches();
            } catch (err) {
                console.error("Error deleting batches:", err);
            }
        }
        setOpenDelete(false);
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Batches</h1>
                </div>
                <div>
                    <button type="button"
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateBatchClick}>
                        + Create Batch
                    </button>
                </div>
            </div>

            <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />

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
                        <tr>
                            <th>Sr No</th>
                            <th>Batch Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
                            <tr key={batch.id}>
                                <td>{index + 1}</td>
                                <td>{batch.batchName}</td>

                                <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                                    <DialogHeader>Confirm Deletion</DialogHeader>
                                    <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
                                    <DialogFooter>
                                        <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                                        <Button variant="filled" color="red" onClick={deleteBatch}>Yes, Delete</Button>
                                    </DialogFooter>
                                </Dialog>
                                <td>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => { setDeleteId(batch.id); setOpenDelete(true); }} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                                                Delete
                                            </button>
                                            <button onClick={() => handleEditClick(batch)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
                                                Update
                                            </button>
                                        </div>
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

