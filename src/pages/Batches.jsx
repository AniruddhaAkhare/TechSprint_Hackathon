import { useState, useEffect } from "react";
import React from 'react';
import CreateBatch from "./components/CreateBatch";
import { db } from '../config/firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import SearchBar from "./components/Searchbar";

export default function Batches() {
    const [currentBatch, setCurrentBatch] = useState(null);
    const [batches, setBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const BatchCollectionRef = collection(db, "Batch");
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    }

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = batches.filter(batch =>
            batch.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        const snapshot = await getDocs(BatchCollectionRef);
        const batchData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setBatches(batchData);
    }

    useEffect(() => {
        fetchBatches();
    }, []);


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

    const deleteBatch = async (id) => {
        const batchDoc = doc(db, "Batch", id);
        await deleteDoc(batchDoc);
        alert("Batch deleted successfully");
        fetchBatches();
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Batches</h1>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateBatchClick}
                    >
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
                                <td>{batch.name}</td>
                                <td>
                                    <button onClick={() => handleEditClick(batch)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Edit</button>
                                    <button onClick={() => deleteBatch(batch.id)} className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
