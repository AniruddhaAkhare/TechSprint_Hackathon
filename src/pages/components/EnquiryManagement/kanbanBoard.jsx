
import React, { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { db } from "../../../config/firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import FiltersDropdown from "./FiltersDropdown";
import StageVisibilityDropdown from "./StageVisibilityDropdown";
import EnquiryModal from "./EnquiryModal";
import TagsModal from "./TagsModal";
import Column from "./Column";

const initialColumns = {
  "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
  "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
  "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
  "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
  "closed-lost": { name: "Closed Lost", items: [], icon: <FaTimesCircle className="text-red-500" />, count: 0, totalAmount: 0 },
  "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
};

const initialVisibility = {
  "pre-qualified": true,
  "qualified": true,
  "negotiation": true,
  "closed-won": true,
  "closed-lost": true,
  "contact-in-future": true,
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [stageVisibility, setStageVisibility] = useState(initialVisibility);
  const [view, setView] = useState("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "" });
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]); // Default tags
  const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const canDisplay = rolePermissions.enquiries?.display || false;
  const canCreate = rolePermissions.enquiries?.create || false;

  if (!canDisplay) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
        You don't have permission to view enquiries.
      </div>
    );
  }

  const handleViewEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Fetch tags from Firestore, fallback to default tags if empty
    const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
      const tagsData = snapshot.docs.map((doc) => doc.data().name);
      setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
    });

    // Fetch courses
    const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    });

    // Fetch branches
    const unsubscribeBranches = onSnapshot(
      collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
      (snapshot) => {
        const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
        setBranches(branchesData);
      }
    );

    // Fetch instructors
    const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
      const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInstructors(instructorsData);
    });

    // Fetch enquiries
    const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
      const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setColumns((prevColumns) => {
        const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
          acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
          return acc;
        }, {});
        enquiries.forEach((enquiry) => {
          const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
          if (updatedColumns[columnId]) {
            updatedColumns[columnId].items.push(enquiry);
            const amount = Number(enquiry.amount) || 0;
            updatedColumns[columnId].totalAmount += amount;
          }
        });
        Object.keys(updatedColumns).forEach((key) => {
          updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
        });
        return { ...updatedColumns };
      });
    });

    return () => {
      unsubscribeTags();
      unsubscribeCourses();
      unsubscribeBranches();
      unsubscribeInstructors();
      unsubscribeEnquiries();
    };
  }, [filters, searchTerm]);

  const filteredEnquiries = (items) => {
    return items.filter((enquiry) => {
      const matchesSearch =
        !searchTerm ||
        enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phone?.includes(searchTerm) ||
        enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
      const matchesStage = !filters.stage || enquiry.stage === filters.stage;
      const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
      const matchesCourse = !filters.course || enquiry.course === filters.course;
      return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse;
    });
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      const updatedColumns = {
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      };
      setColumns(updatedColumns);
      try {
        const enquiryRef = doc(db, "enquiries", movedItem.id);
        await updateDoc(enquiryRef, { stage: destination.droppableId });
      } catch (error) {
        console.error("Error updating Firestore:", error);
        setColumns(columns);
      }
    }
  };

  const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
    (enquiry) =>
      !searchTerm ||
      enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.includes(searchTerm) ||
      enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
      <div className="p-4 sm:p-6 shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
            <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsTagsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
            >
              <FaCircle className="text-gray-400" />
              Manage Tags
            </button>
            {canCreate && (
              <button
                onClick={() => {
                  setSelectedEnquiry(null); // Clear selectedEnquiry for new enquiry
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
              >
                + Add Enquiry
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setView("kanban")}
              className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
            >
              List View
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiries..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <FiltersDropdown
              filters={filters}
              setFilters={setFilters}
              availableTags={availableTags}
              branches={branches}
              courses={courses}
              initialColumns={initialColumns}
            />
            {view === "kanban" && (
              <StageVisibilityDropdown
                stageVisibility={stageVisibility}
                setStageVisibility={setStageVisibility}
                initialColumns={initialColumns}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
        {view === "kanban" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto gap-4 h-full">
              {Object.entries(columns)
                .filter(([columnId]) => stageVisibility[columnId])
                .map(([columnId, column]) => (
                  <Column
                    key={columnId}
                    columnId={columnId}
                    column={column}
                    filteredEnquiries={filteredEnquiries(column.items)}
                    canUpdate={rolePermissions.enquiries?.update || false}
                    handleViewEnquiry={handleViewEnquiry} // Updated to pass handleViewEnquiry
                  />
                ))}
            </div>
          </DragDropContext>
        )}
        {view === "list" && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4">Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries(allEnquiries).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
                  </tr>
                ) : (
                  filteredEnquiries(allEnquiries).map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                      onClick={() => handleViewEnquiry(item)} // Updated to call handleViewEnquiry
                      style={{ cursor: "pointer" }}
                    >
                      <td className="p-4 truncate">{item.name || "Unnamed"}</td>
                      <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
                      <td className="p-4 truncate">{item.phone || "No phone"}</td>
                      <td className="p-4 truncate">{item.email || "No email"}</td>
                      <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {item.tags?.map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
                              <FaCircle className="text-orange-500 text-xs" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EnquiryModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setSelectedEnquiry(null);
        }}
        courses={courses}
        branches={branches}
        instructors={instructors}
        availableTags={availableTags}
        rolePermissions={rolePermissions}
        selectedEnquiry={selectedEnquiry}
      />
      <TagsModal
        isOpen={isTagsModalOpen}
        onRequestClose={() => setIsTagsModalOpen(false)}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
      />
    </div>
  );
};

export default KanbanBoard;