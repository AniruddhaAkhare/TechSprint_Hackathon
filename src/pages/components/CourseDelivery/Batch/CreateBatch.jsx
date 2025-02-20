import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from '../../../../config/firebase'
import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CreateBatch = ({ isOpen, toggleSidebar, batch }) => {
    const [batchName, setBatchName] = useState('');
    const [batchDescription, setBatchDescription] = useState('');
    const [batchSchedule, setBatchSchedule] = useState('');
    const [batchCapacity, setBatchCapacity] = useState('');

    useEffect(() => {
        if (batch) {
            setBatchName(batch.name);
            setBatchDescription(batch.description);
            setBatchSchedule(batch.Schedule);
            setBatchCapacity(batch.Capacity);
        }else{
            setBatchName("");
            setBatchDescription("");
            setBatchSchedule("");
            setBatchCapacity("");
        }
    }, [batch]);

    const batchCollectionRef = collection(db, "Batch");

    const onSubmitBatch = async (e) => {
        e.preventDefault();

        if (!batchName.trim() || !batchDescription.trim() || !batchSchedule || !batchCapacity) {
            alert("Please fill in all required fields");
            return;
        }

        console.log("Form submitted with batch data:", {
            batchName,
            batchDescription,
            batchSchedule,
            batchCapacity
        });

        try {
            if (batch) {
                const batchDoc = doc(db, "Batch", batch.id);
                await updateDoc(batchDoc, {
                    description: batchDescription,
                    Capacity: batchCapacity,
                    Schedule: batchSchedule,
                    name: batchName
                });
            } else {
                await addDoc(batchCollectionRef, {
                    description: batchDescription,
                    Capacity: batchCapacity,
                    Schedule: batchSchedule,
                    name: batchName,
                });
            }

            alert("batch successfully added!");
            toggleSidebar(); 
        } catch (err) {
            console.error("Error adding document: ", err);
            alert("Error adding batch!");
        }
    };

    return (
        <>
            <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform Capacity-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
                <button type="button" className="close-button" onClick={toggleSidebar}>
                    Back
                </button>

                <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
                <form onSubmit={onSubmitBatch}>
                    <div className="col-md-4">
                        <div className="mb-3 subfields">
                            <label htmlFor="batch_name" className="form-label">Batch Name</label>
                            <input type="text" className="form-control" value={batchName} placeholder="batch Name" onChange={(e) => setBatchName(e.target.value)} required />
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="description" className="form-label">Batch Description</label>
                            <input type="text" className="form-control" value={batchDescription} placeholder="batch Description" onChange={(e) => setBatchDescription(e.target.value)} required />
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="Schedule" className="form-label">Batch Schedule</label>
                            <input type="number" className="form-control" value={batchSchedule} placeholder="Enter batch Schedule" onChange={(e) => setBatchSchedule(e.target.value)} required />
                        </div>

                        <div className="mb-3 subfields">
                            <label htmlFor="Capacity" className="form-label">Batch Capacity</label>
                            <input type="text" className="form-control" value={batchCapacity} placeholder="Enter batch Capacity" onChange={(e) => setBatchCapacity(e.target.value)} required />
                        </div>

                        <div className="d-grid gap-2 d-md-flex">
                            <button type="submit" >
                                {batch ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateBatch;
