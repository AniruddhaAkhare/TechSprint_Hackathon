const SectionNav = ({ currentSection, setCurrentSection }) => {
    return (
      <div className="flex flex-col sm:flex-row justify-between mb-4 flex-wrap gap-2">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentSection(1)}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            Company Details
          </button>
          <button
            onClick={() => setCurrentSection(2)}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            Job Openings
          </button>
          <button
            onClick={() => setCurrentSection(3)}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            Notes
          </button>
          <button
            onClick={() => setCurrentSection(4)}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            Points of Contact
          </button>
          <button
            onClick={() => setCurrentSection(5)}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            History
          </button>
        </div>
      </div>
    );
  };
  
  export default SectionNav;