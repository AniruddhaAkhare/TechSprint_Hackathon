import * as actionTypes from './types';
import { db } from '../firebase'; // Import Firebase Firestore instance
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const contextActions = (dispatch) => {
  return {
    modal: {
      open: () => dispatch({ type: actionTypes.OPEN_MODAL }),
      close: () => dispatch({ type: actionTypes.CLOSE_MODAL }),
    },
    crud: {
      // Fetch items from Firestore
      fetchItems: async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'items'));
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: actionTypes.SET_ITEMS, payload: items });
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      },
      // Add item to Firestore
      addItem: async (itemData) => {
        try {
          const docRef = await addDoc(collection(db, 'items'), itemData);
          dispatch({ type: actionTypes.ADD_ITEM, payload: { id: docRef.id, ...itemData } });
        } catch (error) {
          console.error('Error adding item:', error);
        }
      },
      // Update item in Firestore
      updateItem: async (id, updatedData) => {
        try {
          const itemRef = doc(db, 'items', id);
          await updateDoc(itemRef, updatedData);
          dispatch({ type: actionTypes.UPDATE_ITEM, payload: { id, ...updatedData } });
        } catch (error) {
          console.error('Error updating item:', error);
        }
      },
      // Delete item from Firestore
      deleteItem: async (id) => {
        try {
          await deleteDoc(doc(db, 'items', id));
          dispatch({ type: actionTypes.DELETE_ITEM, payload: id });
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      },
    },
  };
};

export default contextActions;
