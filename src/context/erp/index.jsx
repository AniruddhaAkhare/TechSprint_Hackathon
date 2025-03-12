import { useMemo, useReducer, createContext, useContext } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

const ErpContext = createContext();

function ErpContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  
  // Memoize actions and selectors to prevent unnecessary re-renders
  const erpContextAction = useMemo(() => contextActions(dispatch), [dispatch]);
  const erpContextSelector = useMemo(() => contextSelectors(state), [state]);

  const value = useMemo(() => ({ state, erpContextAction, erpContextSelector }), [state, erpContextAction, erpContextSelector]);

  return <ErpContext.Provider value={value}>{children}</ErpContext.Provider>;
}

function useErpContext() {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErpContext must be used within an ErpContextProvider');
  }
  return context;
}

export { ErpContextProvider, useErpContext };
