import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";


const EditCourseNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const tabs = [
    { name: "Details", path: `/editCourse/${id}` },
    { name: "Curriculum", path: `/courses/${id}/curriculum` }, 
    { name: "Batches", path: `/courses/${id}/batches` },
    { name: "Pricing and Publishing", path: `/pricing` },
    { name: "Learners", path: `/courses/${id}/learners` }, 
  ];
  

  return (
    <div className="border-b flex space-x-6 p-4 bg-white shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => navigate(tab.path)}
          className={`pb-2 text-gray-500 ${
            location.pathname === tab.path
              ? "border-b-2 border-blue-500 text-black font-medium"
              : "hover:text-gray-700"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default EditCourseNavbar;
