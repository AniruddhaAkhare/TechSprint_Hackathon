import React, { useState, createContext, useContext, useMemo } from 'react';

const FirebaseCrudContext = createContext();

function FirebaseCrudContextProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadPanelOpen, setIsReadPanelOpen] = useState(false);
  // Add other state variables as needed

  const value = useMemo(
    () => ({
      isModalOpen,
      setIsModalOpen,
      isReadPanelOpen,
      setIsReadPanelOpen,
      // Add other state variables and setter functions
    }),
    [isModalOpen, isReadPanelOpen]
  );

  return (
    <FirebaseCrudContext.Provider value={value}>
      {children}
    </FirebaseCrudContext.Provider>
  );
}

function useFirebaseCrudContext() {
  const context = useContext(FirebaseCrudContext);
  if (context === undefined) {
    throw new Error(
      'useFirebaseCrudContext must be used within a FirebaseCrudContextProvider'
    );
  }
  return context;
}

export { FirebaseCrudContextProvider, useFirebaseCrudContext };