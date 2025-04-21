
import React, { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../../../config/firebase";
import { collection, onSnapshot, updateDoc, doc, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { FaSearch, FaFilter, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaChevronDown, FaTimes, FaPen, FaTrash } from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root");

const initialColumns = {
  "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0 },
  "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0 },
  "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0 },
  "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0 },
  "closed-lost": { name: "Closed Lost", items: [], icon: <FaTimesCircle className="text-red-500" />, count: 0 },
  "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0 },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isStageVisibilityOpen, setIsStageVisibilityOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [stageVisibility, setStageVisibility] = useState(initialVisibility);
  const [view, setView] = useState("kanban");
  const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } }); // Mock permissions
  const [newEnquiry, setNewEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    branch: "",
    course: "",
    source: "",
    assignTo: "",
    notes: "",
    tags: [],
  });
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    "High Priority",
    "Follow Up",
    "Hot Lead",
    "Career Change",
    "Corporate Enquiry",
    "International",
  ]);
  const [newTag, setNewTag] = useState("");
  const [filters, setFilters] = useState({
    tags: [],
    stage: "",
    branch: "",
    course: "",
  });
  const sourceOptions = ["Instagram", "Friend", "Family", "LinkedIn", "College"];
  const stageVisibilityRef = useRef(null);
  const filtersRef = useRef(null);
  const [instituteId] = useState("A1JnPx6fEQ0wxP1drl3A");
  const [editingEnquiryId, setEditingEnquiryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const canCreate = rolePermissions.enquiries?.create || false;
  const canUpdate = rolePermissions.enquiries?.update || false;
  const canDelete = rolePermissions.enquiries?.delete || false;
  const canDisplay = rolePermissions.enquiries?.display || false;

  if (!canDisplay) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
        You don't have permission to view enquiries.
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tags"), (snapshot) => {
      const tagsData = snapshot.docs.map((doc) => doc.data().name);
      setAvailableTags(tagsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersOpen(false);
      }
      if (stageVisibilityRef.current && !stageVisibilityRef.current.contains(event.target)) {
        setIsStageVisibilityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Course"), (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    }, (error) => console.error("Error fetching courses:", error));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "instituteSetup", instituteId, "Center"), (snapshot) => {
      const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBranches(branchesData);
    }, (error) => console.error("Error fetching branches:", error));
    return () => unsubscribe();
  }, [instituteId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Instructor"), (snapshot) => {
      const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInstructors(instructorsData);
    }, (error) => console.error("Error fetching instructors:", error));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "enquiries"), (snapshot) => {
      const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setColumns((prevColumns) => {
        const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
          acc[key] = { ...initialColumns[key], items: [] };
          return acc;
        }, {});
        enquiries.forEach((enquiry) => {
          const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
          if (updatedColumns[columnId]) updatedColumns[columnId].items.push(enquiry);
        });
        return { ...updatedColumns };
      });
    }, (error) => console.error("Error fetching enquiries:", error));
    return () => unsubscribe();
  }, []);

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

  const handleEditEnquiry = (enquiry) => {
    setNewEnquiry({
      name: enquiry.name || "",
      email: enquiry.email || "",
      phone: enquiry.phone || "",
      address: enquiry.address || "",
      branch: enquiry.branch || "",
      course: enquiry.course || "",
      source: enquiry.source || "",
      assignTo: enquiry.assignTo || "",
      notes: enquiry.notes || "",
      tags: enquiry.tags || [],
    });
    setEditingEnquiryId(enquiry.id);
    setIsModalOpen(true);
  };

  const handleAddEnquiry = async () => {
    const requiredFields = ["name", "email", "phone", "branch", "course", "source"];
    const missingFields = requiredFields.filter((field) => !newEnquiry[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    const selectedCourse = courses.find((course) => course.name === newEnquiry.course);
    let currentStage = "pre-qualified";
    if (editingEnquiryId) {
      const foundStage = Object.entries(columns).find(([stageId, column]) =>
        column.items.some((item) => item.id === editingEnquiryId)
      );
      currentStage = foundStage ? foundStage[0] : "pre-qualified";
    }

    const enquiryData = {
      name: newEnquiry.name,
      email: newEnquiry.email,
      phone: newEnquiry.phone,
      address: newEnquiry.address || "",
      branch: newEnquiry.branch,
      course: newEnquiry.course,
      source: newEnquiry.source,
      assignTo: newEnquiry.assignTo || "",
      notes: newEnquiry.notes || "",
      tags: newEnquiry.tags || [],
      stage: currentStage,
      amount: selectedCourse?.fee || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (editingEnquiryId) {
        if (!canUpdate) {
          alert("You don't have permission to update enquiries");
          return;
        }
        const enquiryRef = doc(db, "enquiries", editingEnquiryId);
        await updateDoc(enquiryRef, enquiryData);
      } else {
        if (!canCreate) {
          alert("You don't have permission to create enquiries");
          return;
        }
        await addDoc(collection(db, "enquiries"), enquiryData);
      }

      setNewEnquiry({
        name: "",
        email: "",
        phone: "",
        address: "",
        branch: "",
        course: "",
        source: "",
        assignTo: "",
        notes: "",
        tags: [],
      });
      setEditingEnquiryId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving enquiry:", error);
      alert(`Failed to save enquiry: ${error.message}`);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      try {
        await addDoc(collection(db, "tags"), { name: newTag.trim() });
        setNewTag("");
      } catch (error) {
        console.error("Error adding tag:", error);
        alert("Failed to add tag");
      }
    }
  };

  const handleDeleteTag = async (tag) => {
    try {
      const tagQuery = query(collection(db, "tags"), where("name", "==", tag));
      const tagSnapshot = await getDocs(tagQuery);
      tagSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Failed to delete tag");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleTagToggle = (tag) => {
    setNewEnquiry({
      ...newEnquiry,
      tags: newEnquiry.tags.includes(tag) ? newEnquiry.tags.filter((t) => t !== tag) : [...newEnquiry.tags, tag],
    });
  };

  const toggleStageVisibility = (stage) => {
    setStageVisibility((prev) => ({ ...prev, [stage]: !prev[stage] }));
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
              onClick={(e) => {
                e.stopPropagation();
                console.log("Manage Tags clicked");
                setIsTagsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
            >
              <FaCircle className="text-gray-400" />
              Manage Tags
            </button>
            {canCreate && (
              <button
                onClick={() => setIsModalOpen(true)}
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
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
              >
                <FaFilter />
                Filters
              </button>
              {isFiltersOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Apply Filters</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <select
                      multiple
                      value={filters.tags}
                      onChange={(e) => handleFilterChange("tags", Array.from(e.target.selectedOptions, (option) => option.value))}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    >
                      {availableTags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Stage</label>
                    <select
                      value={filters.stage}
                      onChange={(e) => handleFilterChange("stage", e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    >
                      <option value="">All Stages</option>
                      {Object.entries(initialColumns).map(([stageId, { name }]) => (
                        <option key={stageId} value={stageId}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <select
                      value={filters.branch}
                      onChange={(e) => handleFilterChange("branch", e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    >
                      <option value="">All Branches</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.branchName}>{branch.branchName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Course</label>
                    <select
                      value={filters.course}
                      onChange={(e) => handleFilterChange("course", e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    >
                      <option value="">All Courses</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.name}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setFilters({ tags: [], stage: "", branch: "", course: "" })}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsFiltersOpen(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            {view === "kanban" && (
              <div className="relative w-full sm:w-auto" ref={stageVisibilityRef}>
                <button
                  onClick={() => setIsStageVisibilityOpen(!isStageVisibilityOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full hover:bg-gray-100"
                >
                  <FaChevronDown />
                  Stage Visibility
                </button>
                {isStageVisibilityOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Show/Hide Stages</h3>
                      {Object.keys(initialColumns).map((stage) => (
                        <div key={stage} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            {initialColumns[stage].icon}
                            <span>{initialColumns[stage].name}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={stageVisibility[stage]}
                              onChange={() => toggleStageVisibility(stage)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${stageVisibility[stage] ? "translate-x-5" : "translate-x-1"}`}></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided) => (
                      <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0" {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
                          {column.icon}
                          <h2 className="text-base font-medium truncate">{column.name}</h2>
                          <span className="ml-auto text-gray-500">{column.items.length}</span>
                        </div>
                        <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
                          {column.items.length === 0 ? (
                            <p className="text-gray-500 text-center">No enquiries in this stage</p>
                          ) : (
                            filteredEnquiries(column.items).map((item, index) => (
                              <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                {(provided) => (
                                  <div
                                    className="bg-white border border-gray-200 rounded-md p-4 mb-2 shadow-sm"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => canUpdate && handleEditEnquiry(item)}
                                    style={{ cursor: "pointer", ...provided.draggableProps.style }}
                                  >
                                    <p className="font-medium truncate">{item.name || "Unnamed"}</p>
                                    <p className="text-gray-700">₹{item.amount?.toLocaleString() || "0"}</p>
                                    <p className="text-gray-500 truncate">{item.phone || "No phone"}</p>
                                    <p className="text-gray-500 truncate">{item.email || "No email"}</p>
                                    <div className="flex flex-wrap gap-2 mt-2 min-h-[40px]">
                                      {item.tags?.map((tag) => (
                                        <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
                                          <FaCircle className="text-orange-500 text-xs" />
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
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
                      onClick={() => canUpdate && handleEditEnquiry(item)}
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-[95%] sm:w-full max-w-2xl mx-auto mt-4 sm:mt-20 max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {editingEnquiryId ? "Edit Enquiry" : "Add New Enquiry"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Contact Information</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newEnquiry.name}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                placeholder="Enter name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={newEnquiry.email}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                placeholder="Enter email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newEnquiry.phone}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                placeholder="Enter phone number"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={newEnquiry.address}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, address: e.target.value })}
                placeholder="Enter address"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Enquiry Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Branch <span className="text-red-500">*</span></label>
              <select
                value={newEnquiry.branch}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, branch: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.name}>{branch.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Course <span className="text-red-500">*</span></label>
              <select
                value={newEnquiry.course}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, course: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.name}>{course.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Source <span className="text-red-500">*</span></label>
              <select
                value={newEnquiry.source}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, source: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select source</option>
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select
                value={newEnquiry.assignTo}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, assignTo: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.f_name}>{instructor.f_name} {instructor.l_name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={newEnquiry.notes}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, notes: e.target.value })}
                placeholder="Enter notes"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-base sm:text-lg font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-full text-sm ${newEnquiry.tags.includes(tag) ? "bg-blue-100 border-blue-500 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddEnquiry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={editingEnquiryId ? !canUpdate : !canCreate}
          >
            {editingEnquiryId ? "Update Enquiry" : "Create Enquiry"}
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isTagsModalOpen}
        onRequestClose={() => setIsTagsModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-md mx-auto mt-20 max-h-[80vh] overflow-y-auto border border-gray-200"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Tags</h2>
          <button onClick={() => setIsTagsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Create New Tag</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Tag name"
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              + Add
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Existing Tags</h3>
          {availableTags.length === 0 ? (
            <p className="text-gray-500">No tags available</p>
          ) : (
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <FaCircle className="text-gray-500" />
                    <span className="text-sm">{tag}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeleteTag(tag)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default KanbanBoard;