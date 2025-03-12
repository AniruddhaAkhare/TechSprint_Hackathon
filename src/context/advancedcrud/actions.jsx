import React, { useState } from 'react';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadPanelOpen, setIsReadPanelOpen] = useState(false);
  const [isUpdatePanelOpen, setIsUpdatePanelOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isRecordPaymentPanelOpen, setIsRecordPaymentPanelOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openReadPanel = () => setIsReadPanelOpen(true);
  const closePanel = () => {
    setIsReadPanelOpen(false);
    setIsUpdatePanelOpen(false);
    setIsCreatePanelOpen(false);
    setIsRecordPaymentPanelOpen(false);
  };
  const openUpdatePanel = () => setIsUpdatePanelOpen(true);
  const openCreatePanel = () => setIsCreatePanelOpen(true);
  const openRecordPaymentPanel = () => setIsRecordPaymentPanelOpen(true);

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <button onClick={openReadPanel}>Open Read Panel</button>
      <button onClick={openUpdatePanel}>Open Update Panel</button>
      <button onClick={openCreatePanel}>Open Create Panel</button>
      <button onClick={openRecordPaymentPanel}>Open Record Payment Panel</button>
      <button onClick={closePanel}>Close All Panels</button>

      {/* Conditionally render your modals and panels based on the state variables */}
      {isModalOpen && <div>Modal Content</div>}
      {isReadPanelOpen && <div>Read Panel Content</div>}
      {isUpdatePanelOpen && <div>Update Panel Content</div>}
      {isCreatePanelOpen && <div>Create Panel Content</div>}
      {isRecordPaymentPanelOpen && <div>Record Payment Panel Content</div>}
    </div>
  );
}

export default MyComponent;