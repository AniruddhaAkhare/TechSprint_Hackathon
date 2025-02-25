import React, { useState } from "react";
import AddMCQModal from "./AddMCQModal"; // Adjust the path

const ParentComponent = ({selectedSection, selectedCurriculumId}) => {
    const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);

    const openMCQModal = () => {
        setIsMCQModalOpen(true);
    };

    return (
        <div>
            <button onClick={openMCQModal}>Open MCQ Modal</button>

            {isMCQModalOpen && (
                <AddMCQModal
                    sectionId={selectedSection.id}
                    curriculumId={selectedCurriculumId}
                    onClose={() => {
                        setIsMCQModalOpen(false);
                        console.log("Modal closed");
                    }}
                />
            )}
        </div>
    );
};

export default ParentComponent;