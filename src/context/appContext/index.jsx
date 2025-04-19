import { useMemo, useReducer, createContext, useContext, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';

const AppContext = createContext();

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  
  // Add Firebase real-time listeners
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userRef = doc(db, 'Users', user.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            dispatch({
              type: 'FIREBASE_USER_UPDATE',
              payload: { ...docSnap.data(), uid: user.uid }
            });
          }
        });

        // Fetch app settings from Firestore
        const settingsRef = doc(db, 'settings', 'global');
        const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
          if (docSnap.exists()) {
            dispatch({
              type: 'FIREBASE_SETTINGS_UPDATE',
              payload: docSnap.data()
            });
          }
        });

        return () => {
          unsubscribeUser();
          unsubscribeSettings();
        };
      } else {
        dispatch({ type: 'FIREBASE_LOGOUT' });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = useMemo(() => [state, dispatch], [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  const [state, dispatch] = context;
  const appContextAction = contextActions(dispatch);
  
  return { 
    state,
    appContextAction,
    // Add Firebase shortcuts
    fb: {
      auth,
      db,
      currentUser: state.firebase?.user,
      settings: state.firebase?.settings
    }
  };
}

export { AppContextProvider };