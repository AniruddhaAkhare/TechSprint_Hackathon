const contextSelectors = (state) => { 
    return {
      isModalOpen: () => state.isModalOpen,
      isPanelOpen: () => !state.isPanelClose, // Fix: Negation to match open state
      isBoxOpen: () => state.isBoxCollapsed, // Fix: Using correct state property
      isReadBoxOpen: () => state.isReadBoxOpen,
      isAdvancedBoxOpen: () => state.isAdvancedBoxOpen,
      isEditBoxOpen: () => state.isEditBoxOpen,
    };
  };
  
  export default contextSelectors;
  