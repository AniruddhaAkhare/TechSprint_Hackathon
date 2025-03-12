const contextSelectors = (state) => ({
    isModalOpen: state.deleteModal.isOpen,
    isCreatePanelOpen: state.create.isOpen,
    isUpdatePanelOpen: state.update.isOpen,
    isReadPanelOpen: state.read.isOpen,
    isRecordPaymentPanelOpen: state.recordPayment.isOpen,
    isDataTableVisible: state.dataTableList.isOpen,
  });
  
  export default contextSelectors;
  