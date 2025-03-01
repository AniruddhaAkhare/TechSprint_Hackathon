import React, { useState } from "react";
import AddMCQModal from "./AddMCQModal"; // Adjust the path

const ParentComponent = ({ selectedSection, selectedCurriculumId }) => {
    console.log("🟢 ParentComponent Rendered");
    console.log("✅ selectedSection:", selectedSection);
    console.log("✅ selectedCurriculumId:", selectedCurriculumId);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (!selectedSection || !selectedCurriculumId) {
            alert("Please select a section and curriculum before adding MCQs.");
            return;
        }
        console.log("🎉 Opening Modal");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        console.log("❌ Closing Modal");
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Add MCQs</button>
            {isModalOpen ? (
                selectedSection && selectedCurriculumId ? (
                    <>
                        {console.log("✅ Rendering AddMCQModal with onClose")}
                        <AddMCQModal
                            sectionId={selectedSection.id}
                            curriculumId={selectedCurriculumId}
                            // onClose={handleCloseModal} 
                            onClose={() => {
                                setIsModalOpen(false);
                                console.log("Modal closed");
                            }}
                        />
                    </>
                ) : (
                    console.log("🚨 Modal prevented: Missing selectedSection or selectedCurriculumId")
                )
            ) : null}
        </div>
    );
};
export default ParentComponent;