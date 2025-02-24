import { useState, useEffect } from "react";
import React from 'react';
import { useParams } from 'react-router-dom';
import CreateBatch from '../Batch/CreateBatch.jsx';
import { getDocs, collection } from 'firebase/firestore';
import { deleteBatch, updateBatch, getBatch } from '../../../../utils/batchOperations';
import SearchBar from '../../../components/SearchBar.jsx';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";
import {db} from '../../../../config/firebase.js'
export default function IndividualCourseBatch() {
    const { courseId } = useParams();

    const [currentBatch, setCurrentBatch] = useState(null);
    const [batches, setBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const BatchCollectionRef = collection(db, "Batch");
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

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
        try {
            const snapshot = await getDocs(BatchCollectionRef);
            const batchData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(batch => {
                    return batch.courseId && batch.courseId === courseId;
                });
            setBatches(batchData);
            console.log('Fetched batches:', batchData);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    }

    useEffect(() => {
        console.log('Course ID in useEffect:', courseId);
        if (courseId) {
            fetchBatches();
        } else {
            console.error('Course ID is undefined in Batches component');
        }
    }, [courseId]);

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

    const handleDeleteBatch = async () => {
        if (deleteId) {
            try {
                await deleteBatch(deleteId);
                fetchBatches();
                alert('Batch deleted successfully!');
            } catch (err) {
                console.error("Error deleting Batches:", err);
                alert('Failed to delete batch. Please try again.');
            } finally {
                setOpenDelete(false);
                setDeleteId(null);
            }
        }
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

            {console.log('Course ID in Batches:', courseId)}
            <CreateBatch
                isOpen={isOpen}
                toggleSidebar={handleClose}
                batch={currentBatch}
                courseId={courseId}
            />

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
                        {batches.length > 0 ? (
                            (searchResults.length > 0 ? searchResults : batches).map((batch, index) =>
                                <tr key={batch.id}>
                                    <td>{index + 1}</td>
                                    <td>{batch.name}</td>
                                    <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                                        <DialogHeader>Confirm Deletion</DialogHeader>
                                        <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
                                        <DialogFooter>
                                            <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                                            <Button variant="filled" color="red" onClick={handleDeleteBatch}>Yes, Delete</Button>
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
                            )) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    No batches found for this course
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
