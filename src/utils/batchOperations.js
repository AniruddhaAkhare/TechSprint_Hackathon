import { db } from '../config/firebase.js';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

export const deleteBatch = async (batchId) => {
    try {
        await deleteDoc(doc(db, "Batch", batchId));
        return true;
    } catch (err) {
        //console.error("Error deleting Batch:", err);
        throw err;
    }
};

export const updateBatch = async (batchId, updatedData) => {
    try {
        const batchRef = doc(db, "Batch", batchId);
        await updateDoc(batchRef, updatedData);
        return true;
    } catch (err) {
        //console.error("Error updating Batch:", err);
        throw err;
    }
};

export const getBatch = async (batchId) => {
    try {
        const batchRef = doc(db, "Batch", batchId);
        const docSnap = await getDoc(batchRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (err) {
        //console.error("Error getting Batch:", err);
        throw err;
    }
};
