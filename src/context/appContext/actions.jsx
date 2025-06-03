import * as actionTypes from './types';
import { auth, db } from '../../config/firebase'; // Import Firebase services
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const contextActions = (dispatch) => {
  return {
    // Existing UI actions
    navMenu: {
      open: () => dispatch({ type: actionTypes.OPEN_NAV_MENU }),
      close: () => dispatch({ type: actionTypes.CLOSE_NAV_MENU }),
      collapse: () => dispatch({ type: actionTypes.COLLAPSE_NAV_MENU }),
    },
    
    app: {
      open: (appName) => dispatch({ 
        type: actionTypes.CHANGE_APP, 
        payload: appName 
      }),
      default: () => dispatch({ type: actionTypes.DEFAULT_APP }),
    },

    // New Firebase-integrated actions
    auth: {
      login: async (email, password) => {
        try {
          dispatch({ type: actionTypes.AUTH_START });
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'Users', userCredential.user.uid));
          
          dispatch({
            type: actionTypes.AUTH_SUCCESS,
            payload: {
              ...userCredential.user,
              ...userDoc.data()
            }
          });
        } catch (error) {
          dispatch({
            type: actionTypes.AUTH_ERROR,
            payload: error.message
          });
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          dispatch({ type: actionTypes.AUTH_LOGOUT });
        } catch (error) {
        }
      }
    },

    firestore: {
      updateUserProfile: async (userId, updates) => {
        try {
          dispatch({ type: actionTypes.PROFILE_UPDATE_START });
          await updateDoc(doc(db, 'Users', userId), updates);
          dispatch({
            type: actionTypes.PROFILE_UPDATE_SUCCESS,
            payload: updates
          });
        } catch (error) {
          dispatch({
            type: actionTypes.PROFILE_UPDATE_ERROR,
            payload: error.message
          });
        }
      }
    },

    // Real-time data listener
    listenToCollection: (collectionName) => {
      const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch({
          type: actionTypes.COLLECTION_UPDATE,
          payload: data
        });
      });

      return unsubscribe; // Return cleanup function
    }
  };
};

export default contextActions;