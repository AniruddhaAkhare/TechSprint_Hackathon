const contextSelectors = (state) => {
    return {
      isModalOpen: () => {
        return state.passwordModal.isOpen;
      },
      isPanelOpen: (panel) => {
        return state[panel]?.isOpen ?? false; // Dynamic selector for different panels
      },
    };
  };
  
  export default contextSelectors;
  