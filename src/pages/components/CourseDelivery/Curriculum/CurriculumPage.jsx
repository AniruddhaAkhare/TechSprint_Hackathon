// import React, { useState } from "react";
// import CreateCurriculum from "./CreateCurriculum";

// const CurriculumPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div>
//       <button 
//         onClick={() => setIsModalOpen(true)} 
//         className="px-4 py-2 bg-green-500 text-white rounded"
//       >
//         Open Curriculum Modal
//       </button>

//       <CreateCurriculum
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={(data) => console.log("New Curriculum:", data)}
//       />
//     </div>
//   );
// };

// export default CurriculumPage;


import React, { useState } from "react";
import CreateCurriculum from "./CreateCurriculum";

const CurriculumPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="px-4 py-2 bg-green-500 text-white rounded"
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
