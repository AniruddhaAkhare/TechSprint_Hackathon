
import React, { useEffect, useState, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { db, auth } from "../../../config/firebase";
import { collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaEdit } from "react-icons/fa";
import { format } from "date-fns";
import * as XLSX from "xlsx";
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
  "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
  "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [stageVisibility, setStageVisibility] = useState(() => {
    const saved = localStorage.getItem("stageVisibility");
    return saved
      ? JSON.parse(saved)
      : Object.keys(initialColumns).reduce((acc, stage) => ({ ...acc, [stage]: true }), {});
  });
  const [view, setView] = useState("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
  const [isEnquiryTypeModalOpen, setIsEnquiryTypeModalOpen] = useState(false);
  const [isBulkEnquiryModalOpen, setIsBulkEnquiryModalOpen] = useState(false);
  const [isMassUpdateModalOpen, setIsMassUpdateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    tags: [],
    stage: "",
    branch: "",
    course: "",
    owner: "",
    createdAtRange: { startDate: "", endDate: "" },
    lastTouchedRange: { startDate: "", endDate: "" },
  });
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [owners, setOwners] = useState([]);
  const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
  const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [noteType, setNoteType] = useState("general-enquiry");
  const [newNote, setNewNote] = useState("");
  const [callDuration, setCallDuration] = useState("");
  const [callType, setCallType] = useState("incoming");
  const [callTime, setCallTime] = useState("");
  const [callDate, setCallDate] = useState("");
  const [callScheduledTime, setCallScheduledTime] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [bulkEnquiries, setBulkEnquiries] = useState([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [massUpdateData, setMassUpdateData] = useState({ assignTo: "", tagsToAdd: [], tagsToRemove: [] });
  const [validationErrors, setValidationErrors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnWidths, setColumnWidths] = useState({
    checkbox: 50,
    name: 150,
    amount: 100,
    phone: 120,
    email: 200,
    stage: 120,
    tags: 200,
    createdAt: 150,
    createdBy: 150,
    lastModifiedTime: 150,
    lastTouched: 150,
    lastUpdatedBy: 150,
  });
  const addButtonRef = useRef(null);
  const resizingColumn = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const gridRef = useRef(null);

  const canDisplay = rolePermissions.enquiries?.display || false;
  const canCreate = rolePermissions.enquiries?.create || false;
  const canUpdate = rolePermissions.enquiries?.update || false;
  const canDelete = rolePermissions.enquiries?.delete || false;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const formatDateSafely = (dateString, formatString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not available";
    return format(date, formatString);
  };

  const renderField = (value, placeholder = "Not provided") => {
    return value || placeholder;
  };

  if (!canDisplay) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
        You don't have permission to view enquiries.
      </div>
    );
  }

  const handleViewEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsNotesMode(false);
    setIsModalOpen(true);
  };

  const handleAddNotes = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setNoteType("general-enquiry");
    setNewNote("");
    setCallDuration("");
    setCallType("incoming");
    setCallTime("");
    setCallDate("");
    setCallScheduledTime("");
    setIsTypePopupOpen(true);
  };

  const handleTypeSubmit = async () => {
    if (!newNote.trim()) {
      alert("Please add a note before submitting.");
      return;
    }
    if (!selectedEnquiry) {
      alert("No enquiry selected to add note.");
      return;
    }
    if (!canUpdate) {
      alert("You don't have permission to update enquiries.");
      return;
    }

    try {
      const noteObject = {
        content: newNote,
        type: noteType,
        callDuration: noteType === "call-log" ? callDuration : null,
        callType: noteType === "call-log" ? callType : null,
        callTime: noteType === "call-log" ? callTime : null,
        callDate: noteType === "call-schedule" ? callDate : null,
        callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
        createdAt: new Date().toISOString(),
        addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
      };

      const enquiryRef = doc(db, "enquiries", selectedEnquiry.id);
      const updatedNotes = [...(selectedEnquiry.notes || []), noteObject];
      const historyEntry = {
        action: `Added ${noteType.replace(/-/g, " ").toLowerCase()} note: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
        performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...(selectedEnquiry.history || []), historyEntry];

      await updateDoc(enquiryRef, {
        notes: updatedNotes,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (noteType === "call-schedule" && callDate && callScheduledTime) {
        setReminderDetails({
          name: selectedEnquiry.name || "this lead",
          date: callDate,
          time: callScheduledTime,
        });
        setShowReminder(true);
      }

      setIsTypePopupOpen(false);
      setNewNote("");
      setNoteType("general-enquiry");
      setCallDuration("");
      setCallType("incoming");
      setCallTime("");
      setCallDate("");
      setCallScheduledTime("");
      alert("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      alert(`Failed to add note: ${error.message}`);
    }
  };

  const handleClearNote = () => {
    setNewNote("");
    setNoteType("general-enquiry");
    setCallDuration("");
    setCallType("incoming");
    setCallTime("");
    setCallDate("");
    setCallScheduledTime("");
  };

  useEffect(() => {
    const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
      const tagsData = snapshot.docs.map((doc) => doc.data().name);
      setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
    });

    const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    });

    const unsubscribeBranches = onSnapshot(
      collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
      (snapshot) => {
        const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
        setBranches(branchesData);
      }
    );

    const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
      const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInstructors(instructorsData);
    });

    const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
      const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
      setOwners(uniqueOwners);

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
          const filteredItems = filteredEnquiries(updatedColumns[key].items);
          updatedColumns[key].count = filteredItems.length;
          updatedColumns[key].totalAmount = filteredItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
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
      const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;

      const matchesCreatedAt = (() => {
        if (!filters.createdAtRange.startDate && !filters.createdAtRange.endDate) return true;
        if (!enquiry.createdAt) return false;
        const createdAt = new Date(enquiry.createdAt);
        const startDate = filters.createdAtRange.startDate ? new Date(filters.createdAtRange.startDate) : null;
        const endDate = filters.createdAtRange.endDate ? new Date(filters.createdAtRange.endDate) : null;
        if (startDate && endDate) {
          endDate.setHours(23, 59, 59, 999); // Include entire end date
          return createdAt >= startDate && createdAt <= endDate;
        }
        if (startDate) return createdAt >= startDate;
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
          return createdAt <= endDate;
        }
        return true;
      })();

      const matchesLastTouched = (() => {
        if (!filters.lastTouchedRange.startDate && !filters.lastTouchedRange.endDate) return true;
        if (!enquiry.lastTouched) return false;
        const lastTouched = new Date(enquiry.lastTouched);
        const startDate = filters.lastTouchedRange.startDate ? new Date(filters.lastTouchedRange.startDate) : null;
        const endDate = filters.lastTouchedRange.endDate ? new Date(filters.lastTouchedRange.endDate) : null;
        if (startDate && endDate) {
          endDate.setHours(23, 59, 59, 999); // Include entire end date
          return lastTouched >= startDate && lastTouched <= endDate;
        }
        if (startDate) return lastTouched >= startDate;
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
          return lastTouched <= endDate;
        }
        return true;
      })();

      return (
        matchesSearch &&
        matchesTags &&
        matchesStage &&
        matchesBranch &&
        matchesCourse &&
        matchesOwner &&
        matchesCreatedAt &&
        matchesLastTouched
      );
    }).sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      const isValidA = !isNaN(aDate.getTime());
      const isValidB = !isNaN(bDate.getTime());

      if (!isValidA && !isValidB) return 0;
      if (!isValidA) return sortConfig.direction === "asc" ? 1 : -1;
      if (!isValidB) return sortConfig.direction === "asc" ? -1 : 1;

      return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleMouseDown = (e, columnKey) => {
    resizingColumn.current = columnKey;
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnKey];
    if (gridRef.current) {
      gridRef.current.style.userSelect = "none";
      document.body.style.userSelect = "none";
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (resizingColumn.current) {
      const delta = e.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + delta);
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn.current]: newWidth,
      }));
    }
  };

  const handleMouseUp = () => {
    resizingColumn.current = null;
    if (gridRef.current) {
      gridRef.current.style.userSelect = "";
      document.body.style.userSelect = "";
    }
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
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
        const historyEntry = {
          action: `Changed stage to ${initialColumns[destination.droppableId].name}`,
          performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
          timestamp: new Date().toISOString(),
        };
        await updateDoc(enquiryRef, {
          stage: destination.droppableId,
          history: [...(movedItem.history || []), historyEntry],
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error updating Firestore:", error);
        setColumns(columns);
      }
    }
  };

  const allEnquiries = Object.values(columns)
    .flatMap((column) => column.items)
    .filter((enquiry) =>
      filteredEnquiries([enquiry]).length > 0
    );

  const getLastUpdater = (enquiry) => {
    if (enquiry.history && enquiry.history.length > 0) {
      const latestEntry = enquiry.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      return latestEntry.performedBy;
    }
    return enquiry.createdBy || "Unknown User";
  };

  const handleAddEnquiryClick = () => {
    setIsEnquiryTypeModalOpen(true);
  };

  const handleEnquiryTypeSelect = (type) => {
    setIsEnquiryTypeModalOpen(false);
    if (type === "single") {
      setSelectedEnquiry(null);
      setIsModalOpen(true);
    } else if (type === "bulk") {
      setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
      setValidationErrors([]);
      setIsBulkEnquiryModalOpen(true);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0].map((header) => header?.toString().trim().toLowerCase());
      const rows = jsonData.slice(1).filter((row) => row.some((cell) => cell));

      const fieldMap = {
        "full name": "fullName",
        "name": "fullName",
        "email": "email",
        "phone number": "phoneNumber",
        "phone": "phoneNumber",
        "college": "college",
      };

      const parsedEnquiries = rows.map((row) => {
        const enquiry = { fullName: "", phoneNumber: "", email: "", college: "" };
        headers.forEach((header, index) => {
          const field = fieldMap[header];
          if (field && row[index]) {
            enquiry[field] = row[index].toString().trim();
          }
        });
        return enquiry;
      });

      const errors = parsedEnquiries.map((enquiry, index) => {
        const error = {};
        if (!enquiry.fullName) {
          error.fullName = "Full Name is required";
        }
        if (!enquiry.email && !enquiry.phoneNumber) {
          error.contact = "Either Email or Phone Number is required";
        }
        return Object.keys(error).length > 0 ? { index, ...error } : null;
      }).filter((error) => error);

      setBulkEnquiries(parsedEnquiries.length > 0 ? parsedEnquiries : [{ fullName: "", phoneNumber: "", email: "", college: "" }]);
      setValidationErrors(errors);
      setIsBulkEnquiryModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkEnquiryChange = (index, field, value) => {
    const updatedEnquiries = [...bulkEnquiries];
    updatedEnquiries[index][field] = value;
    setBulkEnquiries(updatedEnquiries);

    setValidationErrors((prev) =>
      prev.filter((error) => error.index !== index || (!error[field] && !error.contact))
    );
  };

  const handleSubmitBulkEnquiries = async () => {
    if (!canCreate) {
      alert("You don't have permission to create enquiries.");
      return;
    }

    const invalidEnquiries = bulkEnquiries.map((enquiry, index) => {
      const error = {};
      if (!enquiry.fullName.trim()) {
        error.fullName = "Full Name is required";
      }
      if (!enquiry.phoneNumber.trim() && !enquiry.email.trim()) {
        error.contact = "Either Email or Phone Number is required";
      }
      return Object.keys(error).length > 0 ? { index, ...error } : null;
    }).filter((error) => error);

    setValidationErrors(invalidEnquiries);

    if (invalidEnquiries.length > 0) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    try {
      const enquiriesCollection = collection(db, "enquiries");
      const timestamp = new Date().toISOString();
      const userName = currentUser?.displayName || currentUser?.email || "Unknown User";

      for (const enquiry of bulkEnquiries) {
        await addDoc(enquiriesCollection, {
          name: enquiry.fullName,
          phone: enquiry.phoneNumber,
          email: enquiry.email,
          college: enquiry.college || "",
          stage: "pre-qualified",
          createdAt: timestamp,
          updatedAt: timestamp,
          lastModifiedTime: timestamp,
          lastTouched: timestamp,
          createdBy: userName,
          history: [
            {
              action: "Enquiry created",
              performedBy: userName,
              timestamp: timestamp,
            },
          ],
          tags: [],
          notes: [],
          amount: 0,
        });
      }

      setIsBulkEnquiryModalOpen(false);
      setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
      setValidationErrors([]);
      alert("Bulk enquiries added successfully!");
    } catch (error) {
      console.error("Error adding bulk enquiries:", error);
      alert(`Failed to add bulk enquiries: ${error.message}`);
    }
  };

  const handleAddBulkEnquiryRow = () => {
    setBulkEnquiries([...bulkEnquiries, { fullName: "", phoneNumber: "", email: "", college: "" }]);
  };

  const handleRemoveBulkEnquiryRow = (index) => {
    if (bulkEnquiries.length === 1) {
      alert("At least one enquiry is required.");
      return;
    }
    const updatedEnquiries = bulkEnquiries.filter((_, i) => i !== index);
    setBulkEnquiries(updatedEnquiries);
    setValidationErrors((prev) => prev.filter((error) => error.index !== index));
  };

  const handleSelectForAction = (enquiryId) => {
    setSelectedEnquiries((prev) =>
      prev.includes(enquiryId)
        ? prev.filter((id) => id !== enquiryId)
        : [...prev, enquiryId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!canDelete) {
      alert("You don't have permission to delete enquiries.");
      return;
    }

    if (selectedEnquiries.length === 0) {
      alert("No enquiries selected for deletion.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedEnquiries.length} enquiry(ies)?`)) {
      return;
    }

    try {
      for (const enquiryId of selectedEnquiries) {
        const enquiryRef = doc(db, "enquiries", enquiryId);
        await deleteDoc(enquiryRef);
      }
      setSelectedEnquiries([]);
      alert("Selected enquiries deleted successfully!");
    } catch (error) {
      console.error("Error deleting enquiries:", error);
      alert(`Failed to delete enquiries: ${error.message}`);
    }
  };

  const handleMassUpdateClick = () => {
    if (selectedEnquiries.length === 0) {
      alert("No enquiries selected for update.");
      return;
    }
    setMassUpdateData({ assignTo: "", tagsToAdd: [], tagsToRemove: [] });
    setIsMassUpdateModalOpen(true);
  };

  const handleMassUpdateSubmit = async () => {
    if (!canUpdate) {
      alert("You don't have permission to update enquiries.");
      return;
    }

    if (!massUpdateData.assignTo && massUpdateData.tagsToAdd.length === 0 && massUpdateData.tagsToRemove.length === 0) {
      alert("Please specify at least one field to update.");
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const userName = currentUser?.displayName || currentUser?.email || "Unknown User";

      for (const enquiryId of selectedEnquiries) {
        const enquiryRef = doc(db, "enquiries", enquiryId);
        const enquiry = allEnquiries.find((e) => e.id === enquiryId);
        if (!enquiry) continue;

        const updates = {};
        const historyEntries = [];

        if (massUpdateData.assignTo) {
          updates.assignTo = massUpdateData.assignTo;
          historyEntries.push({
            action: `Reassigned to ${massUpdateData.assignTo}`,
            performedBy: userName,
            timestamp: timestamp,
          });
        }

        if (massUpdateData.tagsToAdd.length > 0 || massUpdateData.tagsToRemove.length > 0) {
          const currentTags = enquiry.tags || [];
          const newTags = [
            ...currentTags.filter((tag) => !massUpdateData.tagsToRemove.includes(tag)),
            ...massUpdateData.tagsToAdd.filter((tag) => !currentTags.includes(tag)),
          ];
          updates.tags = newTags;
          if (massUpdateData.tagsToAdd.length > 0) {
            historyEntries.push({
              action: `Added tags: ${massUpdateData.tagsToAdd.join(", ")}`,
              performedBy: userName,
              timestamp: timestamp,
            });
          }
          if (massUpdateData.tagsToRemove.length > 0) {
            historyEntries.push({
              action: `Removed tags: ${massUpdateData.tagsToRemove.join(", ")}`,
              performedBy: userName,
              timestamp: timestamp,
            });
          }
        }

        if (Object.keys(updates).length > 0) {
          updates.updatedAt = timestamp;
          updates.lastModifiedTime = timestamp;
          updates.history = [...(enquiry.history || []), ...historyEntries];
          await updateDoc(enquiryRef, updates);
        }
      }

      setIsMassUpdateModalOpen(false);
      setSelectedEnquiries([]);
      setMassUpdateData({ assignTo: "", tagsToAdd: [], tagsToRemove: [] });
      alert("Selected enquiries updated successfully!");
    } catch (error) {
      console.error("Error updating enquiries:", error);
      alert(`Failed to update enquiries: ${error.message}`);
    }
  };

  const gridTemplateColumns = `
    ${columnWidths.checkbox}px
    ${columnWidths.name}px
    ${columnWidths.amount}px
    ${columnWidths.phone}px
    ${columnWidths.email}px
    ${columnWidths.stage}px
    ${columnWidths.tags}px
    ${columnWidths.createdAt}px
    ${columnWidths.createdBy}px
    ${columnWidths.lastModifiedTime}px
    ${columnWidths.lastTouched}px
    ${columnWidths.lastUpdatedBy}px
  `;

  const getResizeHandlePositions = () => {
    const columnsOrder = [
      "checkbox",
      "name",
      "amount",
      "phone",
      "email",
      "stage",
      "tags",
      "createdAt",
      "createdBy",
      "lastModifiedTime",
      "lastTouched",
    ];
    let cumulativeWidth = 0;
    return columnsOrder.map((key) => {
      cumulativeWidth += columnWidths[key];
      return { key, left: cumulativeWidth - 0.5 };
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-4 fixed inset-0 left-[300px]">
      <div className="p-4 sm:p-6 shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
            <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
            <button
              onClick={() => setIsTagsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
            >
              <FaCircle className="text-gray-400" />
              Manage Tags
            </button>
            {canCreate && (
              <div className="relative" ref={addButtonRef}>
                <button
                  onClick={handleAddEnquiryClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
                >
                  + Add Enquiry
                </button>
              </div>
            )}
            {selectedEnquiries.length > 0 && (
              <>
                {canUpdate && (
                  <button
                    onClick={handleMassUpdateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit />
                    Mass Update ({selectedEnquiries.length})
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md w-full sm:w-auto hover:bg-red-700 transition-colors"
                  >
                    <FaTrash />
                    Delete Selected ({selectedEnquiries.length})
                  </button>
                )}
              </>
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
              instructors={instructors}
              owners={owners}
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
                    canUpdate={canUpdate}
                    handleViewEnquiry={handleViewEnquiry}
                    handleAddNotes={handleAddNotes}
                    handleSelectForAction={handleSelectForAction}
                    selectedEnquiries={selectedEnquiries}
                  />
                ))}
            </div>
          </DragDropContext>
        )}
        {view === "list" && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full relative">
            <div
              ref={gridRef}
              className="grid"
              style={{
                gridTemplateColumns: gridTemplateColumns,
                position: "relative",
              }}
            >
              <div className="p-4 border-b border-gray-200 contents">
                <div className="ml-6 flex items-center">
                  {(canUpdate || canDelete) && (
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEnquiries(filteredEnquiries(allEnquiries).map((item) => item.id));
                        } else {
                          setSelectedEnquiries([]);
                        }
                      }}
                      checked={filteredEnquiries(allEnquiries).length > 0 && selectedEnquiries.length === filteredEnquiries(allEnquiries).length}
                    />
                  )}
                </div>
                <div className="font-semibold ml-8">Name</div>
                <div className="font-semibold ml-8">Amount</div>
                <div className="font-semibold ml-8">Phone</div>
                <div className="font-semibold ml-8">Email</div>
                <div className="font-semibold ml-8">Stage</div>
                <div className="font-semibold ml-8">Tags</div>
                <div className="font-semibold cursor-pointer ml-8" onClick={() => handleSort("createdAt")}>
                  Created At {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
                <div className="font-semibold ml-8">Created By</div>
                <div className="font-semibold cursor-pointer ml-2" onClick={() => handleSort("lastModifiedTime")}>
                  Last Modified Time {sortConfig.key === "lastModifiedTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
                <div className="font-semibold cursor-pointer ml-8" onClick={() => handleSort("lastTouched")}>
                  Last Touched {sortConfig.key === "lastTouched" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </div>
                <div className="font-semibold ml-4">Last Updated By</div>
              </div>
              {filteredEnquiries(allEnquiries).length === 0 ? (
                <div className="col-span-12 p-4 text-center text-gray-500">No enquiries found</div>
              ) : (
                filteredEnquiries(allEnquiries).map((item) => (
                  <div
                    key={item.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 contents ${selectedEnquiries.includes(item.id) ? "bg-blue-100" : ""}`}
                    onClick={() => handleViewEnquiry(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="p-4" onClick={(e) => e.stopPropagation()}>
                      {(canUpdate || canDelete) && (
                        <input
                          type="checkbox"
                          checked={selectedEnquiries.includes(item.id)}
                          onChange={() => handleSelectForAction(item.id)}
                        />
                      )}
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.name }}>
                      {item.name || "Unnamed"}
                    </div>
                    <div className="p-4">₹{item.amount?.toLocaleString() || "0"}</div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.phone }}>
                      {item.phone || "No phone"}
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.email }}>
                      {item.email || "No email"}
                    </div>
                    <div className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
                            <FaCircle className="text-orange-500 text-xs" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.createdAt }}>
                      {formatDateSafely(item.createdAt, "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.createdBy }}>
                      {renderField(item.createdBy)}
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.lastModifiedTime }}>
                      {formatDateSafely(item.lastModifiedTime, "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.lastTouched }}>
                      {formatDateSafely(item.lastTouched, "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="p-4 truncate" style={{ maxWidth: columnWidths.lastUpdatedBy }}>
                      {renderField(getLastUpdater(item))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {getResizeHandlePositions().map(({ key, left }) => (
              <div
                key={key}
                className="absolute top-0 bottom-0 w-[1px] cursor-col-resize bg-gray-300 hover:bg-gray-500"
                style={{ left: `${left}px` }}
                onMouseDown={(e) => handleMouseDown(e, key)}
              />
            ))}
          </div>
        )}
      </div>
      <EnquiryModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setSelectedEnquiry(null);
          setIsNotesMode(false);
          setNewNote("");
          setNoteType("general-enquiry");
        }}
        courses={courses}
        branches={branches}
        instructors={instructors}
        availableTags={availableTags}
        rolePermissions={rolePermissions}
        selectedEnquiry={selectedEnquiry}
        isNotesMode={isNotesMode}
        noteType={noteType}
        setNoteType={setNoteType}
        newNote={newNote}
        setNewNote={setNewNote}
      />
      <TagsModal
        isOpen={isTagsModalOpen}
        onRequestClose={() => setIsTagsModalOpen(false)}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
      />
      {isTypePopupOpen && addButtonRef.current && (
        <div
          className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:mt-12 mt-2 right-auto"
          style={{
            top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
          }}
        >
          <h3 className="text-lg font-semibold mb-4">Add Note</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Note Type</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general-enquiry">General Enquiry</option>
              <option value="call-log">Call Log</option>
              <option value="call-schedule">Call Schedule</option>
              <option value="office-visit">Office Visit</option>
            </select>
          </div>
          {noteType === "call-log" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
                <input
                  type="number"
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                  placeholder="Enter call duration"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Call Type</label>
                <select
                  value={callType}
                  onChange={(e) => setCallType(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="incoming">Incoming</option>
                  <option value="outgoing">Outgoing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Call Time</label>
                <input
                  type="time"
                  value={callTime}
                  onChange={(e) => setCallTime(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
          {noteType === "call-schedule" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Call Date</label>
                <input
                  type="date"
                  value={callDate}
                  onChange={(e) => setCallDate(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Call Time</label>
                <input
                  type="time"
                  value={callScheduledTime}
                  onChange={(e) => setCallScheduledTime(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add your note here..."
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClearNote}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              onClick={handleTypeSubmit}
              disabled={!canUpdate || !newNote?.trim()}
              className={`px-4 py-2 rounded-md ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              Add Note
            </button>
          </div>
        </div>
      )}
      {showReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
            <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong> in 10 minutes:</p>
            <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
            <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
            <button
              onClick={() => setShowReminder(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {isEnquiryTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Enquiry</h3>
            <p className="mb-4">Please select the type of enquiry to add:</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEnquiryTypeSelect("single")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Single Enquiry
              </button>
              <button
                onClick={() => handleEnquiryTypeSelect("bulk")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Bulk Enquiry
              </button>
              <button
                onClick={() => setIsEnquiryTypeModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isBulkEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-semibold mb-4">Add Bulk Enquiries</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Expected columns: Full Name, Email, Phone Number, College (optional)
              </p>
            </div>
            {validationErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 className="text-red-700 font-medium">Validation Errors</h4>
                <ul className="list-disc pl-5 text-red-600">
                  {validationErrors.map((error) => (
                    <li key={error.index}>
                      Enquiry {error.index + 1}:{" "}
                      {error.fullName && error.contact
                        ? `${error.fullName} and ${error.contact}`
                        : error.fullName || error.contact}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {bulkEnquiries.map((enquiry, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md relative">
                <h4 className="text-md font-medium mb-2">Enquiry {index + 1}</h4>
                <button
                  onClick={() => handleRemoveBulkEnquiryRow(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      value={enquiry.fullName}
                      onChange={(e) => handleBulkEnquiryChange(index, "fullName", e.target.value)}
                      placeholder="Enter full name"
                      className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.find((err) => err.index === index && err.fullName)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={enquiry.phoneNumber}
                      onChange={(e) => handleBulkEnquiryChange(index, "phoneNumber", e.target.value)}
                      placeholder="Enter phone number"
                      className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.find((err) => err.index === index && err.contact)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={enquiry.email}
                      onChange={(e) => handleBulkEnquiryChange(index, "email", e.target.value)}
                      placeholder="Enter email"
                      className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.find((err) => err.index === index && err.contact)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">College</label>
                    <input
                      type="text"
                      value={enquiry.college}
                      onChange={(e) => handleBulkEnquiryChange(index, "college", e.target.value)}
                      placeholder="Enter college (optional)"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddBulkEnquiryRow}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              + Add Another Enquiry
            </button>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsBulkEnquiryModalOpen(false);
                  setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
                  setValidationErrors([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBulkEnquiries}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Enquiries
              </button>
            </div>
          </div>
        </div>
      )}
      {isMassUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Mass Update Enquiries</h3>
            <p className="mb-4">Update fields for {selectedEnquiries.length} selected enquiries:</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select
                value={massUpdateData.assignTo}
                onChange={(e) => setMassUpdateData({ ...massUpdateData, assignTo: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.f_name}>
                    {instructor.f_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Add Tags</label>
              <select
                multiple
                value={massUpdateData.tagsToAdd}
                onChange={(e) =>
                  setMassUpdateData({
                    ...massUpdateData,
                    tagsToAdd: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Remove Tags</label>
              <select
                multiple
                value={massUpdateData.tagsToRemove}
                onChange={(e) =>
                  setMassUpdateData({
                    ...massUpdateData,
                    tagsToRemove: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsMassUpdateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleMassUpdateSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Enquiries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;