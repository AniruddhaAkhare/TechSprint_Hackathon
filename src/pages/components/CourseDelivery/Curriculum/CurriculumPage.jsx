

import React, { useState } from "react";
import CreateCurriculum from "./CreateCurriculum";

const CurriculumPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center w-full p-4 sm:p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm sm:text-base"
      >
        Open Curriculum Modal
      </button>

      {isModalOpen && (
        <CreateCurriculum
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => console.log("New Curriculum:", data)}
        />
      )}
    </div>
  );
};

export default CurriculumPage;