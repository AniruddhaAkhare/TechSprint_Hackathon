import React, { useState } from "react";
import AddMCQModal from "./AddMCQModal"; // Adjust the path

const ParentComponent = ({ selectedSection, selectedCurriculumId }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (!selectedSection || !selectedCurriculumId) {
            alert("Please select a section and curriculum before adding MCQs.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Add MCQs</button>
            {isModalOpen ? (
                selectedSection && selectedCurriculumId ? (
                    <>
                        <AddMCQModal
                            sectionId={selectedSection.id}
                            curriculumId={selectedCurriculumId}
                            // onClose={handleCloseModal} 
                            onClose={() => {
                                setIsModalOpen(false);
                            }}
                        />
                    </>
                ) : (
                    console.log()
                )
            ) : null}
        </div>
    );
};
export default ParentComponent;