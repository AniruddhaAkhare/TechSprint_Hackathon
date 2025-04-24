import React, { useEffect, useState, useRef, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../../../config/firebase";
import { collection, onSnapshot, updateDoc, doc, addDoc, writeBatch, query, where } from "firebase/firestore";
import { FaSearch, FaFilter, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaChevronDown, FaChartBar } from "react-icons/fa";
import Modal from "react-modal";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

Modal.setAppElement("#root");

const initialColumns = {
  "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" /> },
  "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" /> },
  "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" /> },
  "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" /> },
  "closed-lost": { name: "Closed Lost", items: [], icon: <FaTimesCircle className="text-red-500" /> },
  "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" /> },
};

const initialVisibility = {
  "pre-qualified": true,
  "qualified": true,
  "negotiation": true,
  "closed-won": true,
  "closed-lost": true,
  "contact-in-future": true,
};

const EnquiryDashboard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStageVisibilityOpen, setIsStageVisibilityOpen] = useState(false);
  const [stageVisibility, setStageVisibility] = useState(initialVisibility);
  const [view, setView] = useState("kanban");
  const { rolePermissions, user } = useAuth();
  const [newEnquiry, setNewEnquiry] = useState({
    name: "", email: "", phone: "", address: "", branch: "", course: "", source: "", assignTo: "", notes: "", tags: [],
  });
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const sourceOptions = ["Instagram", "Friend", "Family", "LinkedIn", "College"];
  const stageVisibilityRef = useRef(null);
  const [instituteId] = useState("9z6G6BLzfDScI0mzMOlB");
  const [editingEnquiryId, setEditingEnquiryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters] = useState({ centers: [], batches: [] });

  const canCreate = rolePermissions.enquiries?.create || false;
  const canUpdate = rolePermissions.enquiries?.update || false;
  const canDisplay = rolePermissions.enquiries?.display || false;

  // Debounced search handler
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
      logActivity('SEARCH_ENQUIRIES', { term: value });
    }, 300),
    []
  );

  // Log activity to Firestore (optimized to reduce writes)
  const logActivity = async (action, details) => {
    if (!canDisplay) return;
    try {
      await addDoc(collection(db, 'activityLogs'), {
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user?.email || 'currentUser@example.com',
        userId: user?.uid || 'currentUserId',
        centerId: filters.centers.join(', ') || 'All',
        batchId: filters.batches.join(', ') || 'All',
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  if (!canDisplay) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
        You don't have permission to view enquiries.
      </div>
    );
  }

  // Fetch Courses (only if canDisplay is true)
  useEffect(() => {
    if (!canDisplay) return;
    const q = query(collection(db, "Course"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    }, (error) => {
      console.error("Error fetching courses:", error);
    });
    return () => unsubscribe();
  }, [canDisplay]);

  // Fetch Branches (only if instituteId and canDisplay are valid)
  useEffect(() => {
    if (!instituteId || !canDisplay) return;
    const branchCollection = collection(db, "instituteSetup", instituteId, "Center");
    const unsubscribe = onSnapshot(branchCollection, (snapshot) => {
      const branchesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || doc.data().centerName || "Unnamed Branch",
        ...doc.data(),
      }));
      setBranches(branchesData);
    }, (error) => {
      console.error("Error fetching branches:", error);
      alert(error.code === "permission-denied" 
        ? "You don't have permission to view branches."
        : `Failed to fetch branches: ${error.message}`);
    });
    return () => unsubscribe();
  }, [instituteId, canDisplay]);

  // Fetch Instructors (only if canDisplay is true)
  useEffect(() => {
    if (!canDisplay) return;
    const q = query(collection(db, "Instructor"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInstructors(instructorsData);
    }, (error) => {
      console.error("Error fetching instructors:", error);
    });
    return () => unsubscribe();
  }, [canDisplay]);

  // Fetch Enquiries (optimized with query constraints)
  useEffect(() => {
    if (!canDisplay) return;
    const q = query(collection(db, "enquiries"), where("instituteId", "==", instituteId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setColumns((prevColumns) => {
        const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
          acc[key] = { ...initialColumns[key], items: [] };
          return acc;
        }, {});
        enquiries.forEach((enquiry) => {
          const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
          if (updatedColumns[columnId]) {
            updatedColumns[columnId].items.push(enquiry);
          }
        });
        return updatedColumns;
      });
    }, (error) => {
      console.error("Error fetching enquiries:", error);
    });
    return () => unsubscribe();
  }, [canDisplay, instituteId]);

  // Handle click outside for stage visibility dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stageVisibilityRef.current && !stageVisibilityRef.current.contains(event.target)) {
        setIsStageVisibilityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle drag and drop with batched Firestore updates
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    let updatedColumns;
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      updatedColumns = {
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
      };
    } else {
      destItems.splice(destination.index, 0, movedItem);
      updatedColumns = {
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      };
    }
    setColumns(updatedColumns);

    const batch = writeBatch(db);
    const enquiryRef = doc(db, "enquiries", movedItem.id);
    batch.update(enquiryRef, { stage: destination.droppableId });
    batch.set(collection(db, 'activityLogs'), {
      action: 'MOVED_ENQUIRY',
      details: { enquiryId: movedItem.id, from: source.droppableId, to: destination.droppableId },
      timestamp: new Date().toISOString(),
      userEmail: user?.email || 'currentUser@example.com',
      userId: user?.uid || 'currentUserId',
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error updating Firestore:", error);
      setColumns(columns);
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
    const currentStage = editingEnquiryId
      ? (Object.entries(columns).find(([_, column]) => column.items.some((item) => item.id === editingEnquiryId))?.[0] || "pre-qualified")
      : "pre-qualified";

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
      instituteId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const batch = writeBatch(db);
    let enquiryId;
    if (editingEnquiryId) {
      if (!canUpdate) {
        alert("You don't have permission to update enquiries");
        return;
      }
      enquiryId = editingEnquiryId;
      batch.update(doc(db, "enquiries", editingEnquiryId), enquiryData);
      batch.set(collection(db, 'activityLogs'), {
        action: 'UPDATE_ENQUIRY',
        details: { enquiryId: editingEnquiryId },
        timestamp: new Date().toISOString(),
        userEmail: user?.email || 'currentUser@example.com',
        userId: user?.uid || 'currentUserId',
      });
    } else {
      if (!canCreate) {
        alert("You don't have permission to create enquiries");
        return;
      }
      const docRef = doc(collection(db, "enquiries"));
      enquiryId = docRef.id;
      batch.set(docRef, enquiryData);
      batch.set(collection(db, 'activityLogs'), {
        action: 'CREATE_ENQUIRY',
        details: { enquiryId },
        timestamp: new Date().toISOString(),
        userEmail: user?.email || 'currentUser@example.com',
        userId: user?.uid || 'currentUserId',
      });
    }

    try {
      await batch.commit();
      setNewEnquiry({ name: "", email: "", phone: "", address: "", branch: "", course: "", source: "", assignTo: "", notes: "", tags: [] });
      setEditingEnquiryId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving enquiry:", error);
      alert(`Failed to save enquiry: ${error.message}`);
    }
  };

  // Memoized filtered enquiries
  const filteredEnquiries = useMemo(() => (items) => {
    if (!searchTerm) return items;
    return items.filter(
      (enquiry) =>
        enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phone?.includes(searchTerm) ||
        enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const handleTagToggle = (tag) => {
    setNewEnquiry({
      ...newEnquiry,
      tags: newEnquiry.tags.includes(tag)
        ? newEnquiry.tags.filter((t) => t !== tag)
        : [...newEnquiry.tags, tag],
    });
  };

  const toggleStageVisibility = (stage) => {
    setStageVisibility((prev) => ({ ...prev, [stage]: !prev[stage] }));
  };

  const allEnquiries = useMemo(() =>
    Object.values(columns)
      .flatMap((column) => column.items)
      .filter(
        (enquiry) =>
          !searchTerm ||
          enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.phone?.includes(searchTerm) ||
          enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [columns, searchTerm]
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
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100">
              <FaCircle className="text-gray-400" />
              Manage Tags
            </button>
            <Link
              to="/enquiry-analytics"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
            >
              <FaChartBar />
              Analytics
            </Link>
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
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100">
              <FaFilter />
              Filters
            </button>
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
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${stageVisibility[stage] ? "translate-x-5" : "translate-x-1"}`}
                              ></div>
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
                      <div
                        className="bg-white rounded-lg shadow-md w-72 flex-shrink-0"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
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
                                        <span
                                          key={tag}
                                          className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap"
                                        >
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
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No enquiries found
                    </td>
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
                            <span
                              key={tag}
                              className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap"
                            >
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
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
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
            {["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"].map((tag) => (
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
    </div>
  );
};

export default EnquiryDashboard;