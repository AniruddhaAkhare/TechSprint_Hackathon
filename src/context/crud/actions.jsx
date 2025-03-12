// import { createContext, useReducer, useContext } from 'react';

// // Define action types
// const actionTypes = {
//   OPEN_MODAL: 'OPEN_MODAL',
//   CLOSE_MODAL: 'CLOSE_MODAL',
//   OPEN_ADVANCED_BOX: 'OPEN_ADVANCED_BOX',
//   CLOSE_ADVANCED_BOX: 'CLOSE_ADVANCED_BOX',
//   OPEN_EDIT_BOX: 'OPEN_EDIT_BOX',
//   CLOSE_EDIT_BOX: 'CLOSE_EDIT_BOX',
//   OPEN_PANEL: 'OPEN_PANEL',
//   CLOSE_PANEL: 'CLOSE_PANEL',
//   COLLAPSE_PANEL: 'COLLAPSE_PANEL',
//   OPEN_BOX: 'OPEN_BOX',
//   CLOSE_BOX: 'CLOSE_BOX',
//   COLLAPSE_BOX: 'COLLAPSE_BOX',
//   OPEN_READ_BOX: 'OPEN_READ_BOX',
//   CLOSE_READ_BOX: 'CLOSE_READ_BOX',
//   COLLAPSE_READ_BOX: 'COLLAPSE_READ_BOX',
// };

// // Initial state
// const initialState = {
//   modal: false,
//   advancedBox: false,
//   editBox: false,
//   panel: false,
//   collapsedBox: false,
//   readBox: false,
// };

// // Reducer function
// const reducer = (state, action) => {
//   switch (action.type) {
//     case actionTypes.OPEN_MODAL:
//       return { ...state, modal: true };
//     case actionTypes.CLOSE_MODAL:
//       return { ...state, modal: false };
//     case actionTypes.OPEN_ADVANCED_BOX:
//       return { ...state, advancedBox: true };
//     case actionTypes.CLOSE_ADVANCED_BOX:
//       return { ...state, advancedBox: false };
//     case actionTypes.OPEN_EDIT_BOX:
//       return { ...state, editBox: true };
//     case actionTypes.CLOSE_EDIT_BOX:
//       return { ...state, editBox: false };
//     case actionTypes.OPEN_PANEL:
//       return { ...state, panel: true };
//     case actionTypes.CLOSE_PANEL:
//       return { ...state, panel: false };
//     case actionTypes.COLLAPSE_PANEL:
//       return { ...state, panel: 'collapsed' };
//     case actionTypes.OPEN_BOX:
//       return { ...state, collapsedBox: true };
//     case actionTypes.CLOSE_BOX:
//       return { ...state, collapsedBox: false };
//     case actionTypes.COLLAPSE_BOX:
//       return { ...state, collapsedBox: 'collapsed' };
//     case actionTypes.OPEN_READ_BOX:
//       console.log('readBox open');
//       return { ...state, readBox: true };
//     case actionTypes.CLOSE_READ_BOX:
//       console.log('readBox close');
//       return { ...state, readBox: false };
//     case actionTypes.COLLAPSE_READ_BOX:
//       return { ...state, readBox: 'collapsed' };
//     default:
//       return state;
//   }
// };

// // Create context
// const UIContext = createContext();

// // Context provider component
// export const UIProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const contextActions = {
//     modal: {
//       open: () => dispatch({ type: actionTypes.OPEN_MODAL }),
//       close: () => dispatch({ type: actionTypes.CLOSE_MODAL }),
//     },
//     advancedBox: {
//       open: () => dispatch({ type: actionTypes.OPEN_ADVANCED_BOX }),
//       close: () => dispatch({ type: actionTypes.CLOSE_ADVANCED_BOX }),
//     },
//     editBox: {
//       open: () => dispatch({ type: actionTypes.OPEN_EDIT_BOX }),
//       close: () => dispatch({ type: actionTypes.CLOSE_EDIT_BOX }),
//     },
//     panel: {
//       open: () => dispatch({ type: actionTypes.OPEN_PANEL }),
//       close: () => dispatch({ type: actionTypes.CLOSE_PANEL }),
//       collapse: () => dispatch({ type: actionTypes.COLLAPSE_PANEL }),
//     },
//     collapsedBox: {
//       open: () => dispatch({ type: actionTypes.OPEN_BOX }),
//       close: () => dispatch({ type: actionTypes.CLOSE_BOX }),
//       collapse: () => dispatch({ type: actionTypes.COLLAPSE_BOX }),
//     },
//     readBox: {
//       open: () => {
//         dispatch({ type: actionTypes.OPEN_READ_BOX });
//         console.log('readBox open');
//       },
//       close: () => {
//         dispatch({ type: actionTypes.CLOSE_READ_BOX });
//         console.log('readBox close');
//       },
//       collapse: () => dispatch({ type: actionTypes.COLLAPSE_READ_BOX }),
//     },
//   };

//   return (
//     <UIContext.Provider value={{ state, actions: contextActions }}>
//       {children}
//     </UIContext.Provider>
//   );
// };

// // Custom hook to use context
// export const useUI = () => {
//   return useContext(UIContext);
// };


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
