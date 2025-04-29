
// // // // // // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
// // // // // // // // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // // // // // // // import Column from "./Column";

// // // // // // // // // // // // // // const initialColumns = {
// // // // // // // // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaTimesCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // const initialVisibility = {
// // // // // // // // // // // // // //   "pre-qualified": true,
// // // // // // // // // // // // // //   "qualified": true,
// // // // // // // // // // // // // //   "negotiation": true,
// // // // // // // // // // // // // //   "closed-won": true,
// // // // // // // // // // // // // //   "closed-lost": true,
// // // // // // // // // // // // // //   "contact-in-future": true,
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // const KanbanBoard = () => {
// // // // // // // // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "" });
// // // // // // // // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]); // Default tags
// // // // // // // // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);

// // // // // // // // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // // // // // // // //   if (!canDisplay) {
// // // // // // // // // // // // // //     return (
// // // // // // // // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // // // // // // // //         You don't have permission to view enquiries.
// // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // //     );
// // // // // // // // // // // // // //   }

// // // // // // // // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     // Fetch tags from Firestore, fallback to default tags if empty
// // // // // // // // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // // // // //     });

// // // // // // // // // // // // // //     // Fetch courses
// // // // // // // // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // // // //       setCourses(coursesData);
// // // // // // // // // // // // // //     });

// // // // // // // // // // // // // //     // Fetch branches
// // // // // // // // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // // // // // // // //       (snapshot) => {
// // // // // // // // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // // // // // // // //         setBranches(branchesData);
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     );

// // // // // // // // // // // // // //     // Fetch instructors
// // // // // // // // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // // // //       setInstructors(instructorsData);
// // // // // // // // // // // // // //     });

// // // // // // // // // // // // // //     // Fetch enquiries
// // // // // // // // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // // // //       setColumns((prevColumns) => {
// // // // // // // // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // // // // // // // //           return acc;
// // // // // // // // // // // // // //         }, {});
// // // // // // // // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // // // // // // // //           }
// // // // // // // // // // // // // //         });
// // // // // // // // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // // // // // // // //         });
// // // // // // // // // // // // // //         return { ...updatedColumns };
// // // // // // // // // // // // // //       });
// // // // // // // // // // // // // //     });

// // // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // // //       unsubscribeTags();
// // // // // // // // // // // // // //       unsubscribeCourses();
// // // // // // // // // // // // // //       unsubscribeBranches();
// // // // // // // // // // // // // //       unsubscribeInstructors();
// // // // // // // // // // // // // //       unsubscribeEnquiries();
// // // // // // // // // // // // // //     };
// // // // // // // // // // // // // //   }, [filters, searchTerm]);

// // // // // // // // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // // // // // // // //     return items.filter((enquiry) => {
// // // // // // // // // // // // // //       const matchesSearch =
// // // // // // // // // // // // // //         !searchTerm ||
// // // // // // // // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse;
// // // // // // // // // // // // // //     });
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // // // // // // // //     const { source, destination } = result;
// // // // // // // // // // // // // //     if (!destination) return;

// // // // // // // // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // // // // //       const updatedColumns = {
// // // // // // // // // // // // // //         ...columns,
// // // // // // // // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // // // // // // // //       };
// // // // // // // // // // // // // //       setColumns(updatedColumns);
// // // // // // // // // // // // // //       try {
// // // // // // // // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // // // // // // // //         setColumns(columns);
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // // // // // // // //     (enquiry) =>
// // // // // // // // // // // // // //       !searchTerm ||
// // // // // // // // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // // // // // // // //   );

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // // // // // // // //           <div>
// // // // // // // // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // // // // // // // //           </div>
// // // // // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // // // // //             <button
// // // // // // // // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // // // // // // // //             >
// // // // // // // // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // // // // // // // //               Manage Tags
// // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // //             {canCreate && (
// // // // // // // // // // // // // //               <button
// // // // // // // // // // // // // //                 onClick={() => {
// // // // // // // // // // // // // //                   setSelectedEnquiry(null); // Clear selectedEnquiry for new enquiry
// // // // // // // // // // // // // //                   setIsModalOpen(true);
// // // // // // // // // // // // // //                 }}
// // // // // // // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // // // // // // // //               >
// // // // // // // // // // // // // //                 + Add Enquiry
// // // // // // // // // // // // // //               </button>
// // // // // // // // // // // // // //             )}
// // // // // // // // // // // // // //           </div>
// // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // // // // // // // //             <button
// // // // // // // // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // // // // //             >
// // // // // // // // // // // // // //               Kanban View
// // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // //             <button
// // // // // // // // // // // // // //               onClick={() => setView("list")}
// // // // // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // // // // //             >
// // // // // // // // // // // // // //               List View
// // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // //           </div>
// // // // // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // // // // // // // //               <input
// // // // // // // // // // // // // //                 type="text"
// // // // // // // // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // // // // // // // //                 value={searchTerm}
// // // // // // // // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // // // // // // // //               />
// // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // //             <FiltersDropdown
// // // // // // // // // // // // // //               filters={filters}
// // // // // // // // // // // // // //               setFilters={setFilters}
// // // // // // // // // // // // // //               availableTags={availableTags}
// // // // // // // // // // // // // //               branches={branches}
// // // // // // // // // // // // // //               courses={courses}
// // // // // // // // // // // // // //               initialColumns={initialColumns}
// // // // // // // // // // // // // //             />
// // // // // // // // // // // // // //             {view === "kanban" && (
// // // // // // // // // // // // // //               <StageVisibilityDropdown
// // // // // // // // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // // // // // // // //                 initialColumns={initialColumns}
// // // // // // // // // // // // // //               />
// // // // // // // // // // // // // //             )}
// // // // // // // // // // // // // //           </div>
// // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // // // // // // // //         {view === "kanban" && (
// // // // // // // // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // // // // // // // //               {Object.entries(columns)
// // // // // // // // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // // // // // // // //                   <Column
// // // // // // // // // // // // // //                     key={columnId}
// // // // // // // // // // // // // //                     columnId={columnId}
// // // // // // // // // // // // // //                     column={column}
// // // // // // // // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // // // // // // // //                     handleViewEnquiry={handleViewEnquiry} // Updated to pass handleViewEnquiry
// // // // // // // // // // // // // //                   />
// // // // // // // // // // // // // //                 ))}
// // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // //           </DragDropContext>
// // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // //         {view === "list" && (
// // // // // // // // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // // // // // // // //             <table className="w-full text-left">
// // // // // // // // // // // // // //               <thead>
// // // // // // // // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // // // // // // // //                 </tr>
// // // // // // // // // // // // // //               </thead>
// // // // // // // // // // // // // //               <tbody>
// // // // // // // // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // // // // // // // //                   <tr>
// // // // // // // // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // // // // // // // //                   </tr>
// // // // // // // // // // // // // //                 ) : (
// // // // // // // // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // // // // // // // //                     <tr
// // // // // // // // // // // // // //                       key={item.id}
// // // // // // // // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // // // // // // // //                       onClick={() => handleViewEnquiry(item)} // Updated to call handleViewEnquiry
// // // // // // // // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // // // // // // // //                       <td className="p-4">
// // // // // // // // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // // // // // // // //                               {tag}
// // // // // // // // // // // // // //                             </span>
// // // // // // // // // // // // // //                           ))}
// // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // //                       </td>
// // // // // // // // // // // // // //                     </tr>
// // // // // // // // // // // // // //                   ))
// // // // // // // // // // // // // //                 )}
// // // // // // // // // // // // // //               </tbody>
// // // // // // // // // // // // // //             </table>
// // // // // // // // // // // // // //           </div>
// // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // //       <EnquiryModal
// // // // // // // // // // // // // //         isOpen={isModalOpen}
// // // // // // // // // // // // // //         onRequestClose={() => {
// // // // // // // // // // // // // //           setIsModalOpen(false);
// // // // // // // // // // // // // //           setSelectedEnquiry(null);
// // // // // // // // // // // // // //         }}
// // // // // // // // // // // // // //         courses={courses}
// // // // // // // // // // // // // //         branches={branches}
// // // // // // // // // // // // // //         instructors={instructors}
// // // // // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // // // // // // // //       />
// // // // // // // // // // // // // //       <TagsModal
// // // // // // // // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // // // // // // // //       />
// // // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // export default KanbanBoard;

// // // // // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
// // // // // // // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // // // // // // import Column from "./Column";

// // // // // // // // // // // // // const initialColumns = {
// // // // // // // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaTimesCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const initialVisibility = {
// // // // // // // // // // // // //   "pre-qualified": true,
// // // // // // // // // // // // //   "qualified": true,
// // // // // // // // // // // // //   "negotiation": true,
// // // // // // // // // // // // //   "closed-won": true,
// // // // // // // // // // // // //   "closed-lost": true,
// // // // // // // // // // // // //   "contact-in-future": true,
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const KanbanBoard = () => {
// // // // // // // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // // // // // // //   const [owners, setOwners] = useState([]); // New state for owners
// // // // // // // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);

// // // // // // // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // // // // // // //   if (!canDisplay) {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // // // // // // //         You don't have permission to view enquiries.
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     // Fetch tags from Firestore
// // // // // // // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     // Fetch courses
// // // // // // // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // // //       setCourses(coursesData);
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     // Fetch branches
// // // // // // // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // // // // // // //       (snapshot) => {
// // // // // // // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // // // // // // //         setBranches(branchesData);
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     );

// // // // // // // // // // // // //     // Fetch instructors
// // // // // // // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // // //       setInstructors(instructorsData);
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     // Fetch enquiries and extract unique owners
// // // // // // // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
// // // // // // // // // // // // //       // Extract unique owners from enquiries (using addedBy field)
// // // // // // // // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.addedBy).filter(Boolean))];
// // // // // // // // // // // // //       setOwners(uniqueOwners);

// // // // // // // // // // // // //       setColumns((prevColumns) => {
// // // // // // // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // // // // // // //           return acc;
// // // // // // // // // // // // //         }, {});
// // // // // // // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // // // // // // //           }
// // // // // // // // // // // // //         });
// // // // // // // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // // // // // // //         });
// // // // // // // // // // // // //         return { ...updatedColumns };
// // // // // // // // // // // // //       });
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // //       unsubscribeTags();
// // // // // // // // // // // // //       unsubscribeCourses();
// // // // // // // // // // // // //       unsubscribeBranches();
// // // // // // // // // // // // //       unsubscribeInstructors();
// // // // // // // // // // // // //       unsubscribeEnquiries();
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //   }, [filters, searchTerm]);

// // // // // // // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // // // // // // //     return items.filter((enquiry) => {
// // // // // // // // // // // // //       const matchesSearch =
// // // // // // // // // // // // //         !searchTerm ||
// // // // // // // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // // // // // // // //       const matchesOwner = !filters.owner || enquiry.addedBy === filters.owner;
// // // // // // // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // // // // // // // //     });
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // // // // // // //     const { source, destination } = result;
// // // // // // // // // // // // //     if (!destination) return;

// // // // // // // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // // // // // // //     } else {
// // // // // // // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // // // //       const updatedColumns = {
// // // // // // // // // // // // //         ...columns,
// // // // // // // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // // // // // // //       };
// // // // // // // // // // // // //       setColumns(updatedColumns);
// // // // // // // // // // // // //       try {
// // // // // // // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // // // // // // //         setColumns(columns);
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // // // // // // //     (enquiry) =>
// // // // // // // // // // // // //       !searchTerm ||
// // // // // // // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // // // // // // //   );

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // // // // // // //           <div>
// // // // // // // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // // // //             <button
// // // // // // // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // // // // // // //               Manage Tags
// // // // // // // // // // // // //             </button>
// // // // // // // // // // // // //             {canCreate && (
// // // // // // // // // // // // //               <button
// // // // // // // // // // // // //                 onClick={() => {
// // // // // // // // // // // // //                   setSelectedEnquiry(null);
// // // // // // // // // // // // //                   setIsModalOpen(true);
// // // // // // // // // // // // //                 }}
// // // // // // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // // // // // // //               >
// // // // // // // // // // // // //                 + Add Enquiry
// // // // // // // // // // // // //               </button>
// // // // // // // // // // // // //             )}
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // // // // // // //             <button
// // // // // // // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               Kanban View
// // // // // // // // // // // // //             </button>
// // // // // // // // // // // // //             <button
// // // // // // // // // // // // //               onClick={() => setView("list")}
// // // // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               List View
// // // // // // // // // // // // //             </button>
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // // // // // // //               <input
// // // // // // // // // // // // //                 type="text"
// // // // // // // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // // // // // // //                 value={searchTerm}
// // // // // // // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //             <FiltersDropdown
// // // // // // // // // // // // //               filters={filters}
// // // // // // // // // // // // //               setFilters={setFilters}
// // // // // // // // // // // // //               availableTags={availableTags}
// // // // // // // // // // // // //               branches={branches}
// // // // // // // // // // // // //               courses={courses}
// // // // // // // // // // // // //               instructors={instructors}
// // // // // // // // // // // // //               owners={owners} // Pass owners to FiltersDropdown
// // // // // // // // // // // // //               initialColumns={initialColumns}
// // // // // // // // // // // // //             />
// // // // // // // // // // // // //             {view === "kanban" && (
// // // // // // // // // // // // //               <StageVisibilityDropdown
// // // // // // // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // // // // // // //                 initialColumns={initialColumns}
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //             )}
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // // // // // // //         {view === "kanban" && (
// // // // // // // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // // // // // // //               {Object.entries(columns)
// // // // // // // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // // // // // // //                   <Column
// // // // // // // // // // // // //                     key={columnId}
// // // // // // // // // // // // //                     columnId={columnId}
// // // // // // // // // // // // //                     column={column}
// // // // // // // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // // // // // // // //                   />
// // // // // // // // // // // // //                 ))}
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //           </DragDropContext>
// // // // // // // // // // // // //         )}
// // // // // // // // // // // // //         {view === "list" && (
// // // // // // // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // // // // // // //             <table className="w-full text-left">
// // // // // // // // // // // // //               <thead>
// // // // // // // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // // // // // // //                 </tr>
// // // // // // // // // // // // //               </thead>
// // // // // // // // // // // // //               <tbody>
// // // // // // // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // // // // // // //                   <tr>
// // // // // // // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // // // // // // //                   </tr>
// // // // // // // // // // // // //                 ) : (
// // // // // // // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // // // // // // //                     <tr
// // // // // // // // // // // // //                       key={item.id}
// // // // // // // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // // // // // // //                       <td className="p-4">
// // // // // // // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // // // // // // //                               {tag}
// // // // // // // // // // // // //                             </span>
// // // // // // // // // // // // //                           ))}
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                       </td>
// // // // // // // // // // // // //                     </tr>
// // // // // // // // // // // // //                   ))
// // // // // // // // // // // // //                 )}
// // // // // // // // // // // // //               </tbody>
// // // // // // // // // // // // //             </table>
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //         )}
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //       <EnquiryModal
// // // // // // // // // // // // //         isOpen={isModalOpen}
// // // // // // // // // // // // //         onRequestClose={() => {
// // // // // // // // // // // // //           setIsModalOpen(false);
// // // // // // // // // // // // //           setSelectedEnquiry(null);
// // // // // // // // // // // // //         }}
// // // // // // // // // // // // //         courses={courses}
// // // // // // // // // // // // //         branches={branches}
// // // // // // // // // // // // //         instructors={instructors}
// // // // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // // // // // // //       />
// // // // // // // // // // // // //       <TagsModal
// // // // // // // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // // // // // // //       />
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default KanbanBoard;

// // // // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
// // // // // // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // // // // // import Column from "./Column";

// // // // // // // // // // // // const initialColumns = {
// // // // // // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // // };

// // // // // // // // // // // // const initialVisibility = {
// // // // // // // // // // // //   "pre-qualified": true,
// // // // // // // // // // // //   "qualified": true,
// // // // // // // // // // // //   "negotiation": true,
// // // // // // // // // // // //   "closed-won": true,
// // // // // // // // // // // //   "closed-lost": true,
// // // // // // // // // // // //   "contact-in-future": true,
// // // // // // // // // // // // };

// // // // // // // // // // // // const KanbanBoard = () => {
// // // // // // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // // // // // //   const [owners, setOwners] = useState([]); // Represents unique assignTo values
// // // // // // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);

// // // // // // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // // // // // //   if (!canDisplay) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // // // // // //         You don't have permission to view enquiries.
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // //   }

// // // // // // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // // // //   };

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     // Fetch tags from Firestore
// // // // // // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // // //     });

// // // // // // // // // // // //     // Fetch courses
// // // // // // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // //       setCourses(coursesData);
// // // // // // // // // // // //     });

// // // // // // // // // // // //     // Fetch branches
// // // // // // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // // // // // //       (snapshot) => {
// // // // // // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // // // // // //         setBranches(branchesData);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     );

// // // // // // // // // // // //     // Fetch instructors
// // // // // // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // // //       setInstructors(instructorsData);
// // // // // // // // // // // //     });

// // // // // // // // // // // //     // Fetch enquiries and extract unique assignTo values
// // // // // // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
// // // // // // // // // // // //       // Extract unique assignTo values
// // // // // // // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // // // // // // // //       setOwners(uniqueOwners);

// // // // // // // // // // // //       setColumns((prevColumns) => {
// // // // // // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // // // // // //           return acc;
// // // // // // // // // // // //         }, {});
// // // // // // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // // // // // //           }
// // // // // // // // // // // //         });
// // // // // // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // // // // // //         });
// // // // // // // // // // // //         return { ...updatedColumns };
// // // // // // // // // // // //       });
// // // // // // // // // // // //     });

// // // // // // // // // // // //     return () => {
// // // // // // // // // // // //       unsubscribeTags();
// // // // // // // // // // // //       unsubscribeCourses();
// // // // // // // // // // // //       unsubscribeBranches();
// // // // // // // // // // // //       unsubscribeInstructors();
// // // // // // // // // // // //       unsubscribeEnquiries();
// // // // // // // // // // // //     };
// // // // // // // // // // // //   }, [filters, searchTerm]);

// // // // // // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // // // // // //     return items.filter((enquiry) => {
// // // // // // // // // // // //       const matchesSearch =
// // // // // // // // // // // //         !searchTerm ||
// // // // // // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // // // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner; // Changed from addedBy to assignTo
// // // // // // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // // // // // // //     });
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // // // // // //     const { source, destination } = result;
// // // // // // // // // // // //     if (!destination) return;

// // // // // // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // // // // // //     } else {
// // // // // // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // // //       const updatedColumns = {
// // // // // // // // // // // //         ...columns,
// // // // // // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // // // // // //       };
// // // // // // // // // // // //       setColumns(updatedColumns);
// // // // // // // // // // // //       try {
// // // // // // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // // // // // //         setColumns(columns);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // // // // // //     (enquiry) =>
// // // // // // // // // // // //       !searchTerm ||
// // // // // // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // // // // // //   );

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // // // // // //           <div>
// // // // // // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // // //             <button
// // // // // // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // // // // // //             >
// // // // // // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // // // // // //               Manage Tags
// // // // // // // // // // // //             </button>
// // // // // // // // // // // //             {canCreate && (
// // // // // // // // // // // //               <button
// // // // // // // // // // // //                 onClick={() => {
// // // // // // // // // // // //                   setSelectedEnquiry(null);
// // // // // // // // // // // //                   setIsModalOpen(true);
// // // // // // // // // // // //                 }}
// // // // // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // // // // // //               >
// // // // // // // // // // // //                 + Add Enquiry
// // // // // // // // // // // //               </button>
// // // // // // // // // // // //             )}
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // // // // // //             <button
// // // // // // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               Kanban View
// // // // // // // // // // // //             </button>
// // // // // // // // // // // //             <button
// // // // // // // // // // // //               onClick={() => setView("list")}
// // // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               List View
// // // // // // // // // // // //             </button>
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // // // // // //               <input
// // // // // // // // // // // //                 type="text"
// // // // // // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // // // // // //                 value={searchTerm}
// // // // // // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // // // // // //               />
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //             <FiltersDropdown
// // // // // // // // // // // //               filters={filters}
// // // // // // // // // // // //               setFilters={setFilters}
// // // // // // // // // // // //               availableTags={availableTags}
// // // // // // // // // // // //               branches={branches}
// // // // // // // // // // // //               courses={courses}
// // // // // // // // // // // //               instructors={instructors}
// // // // // // // // // // // //               owners={owners} // Pass unique assignTo values
// // // // // // // // // // // //               initialColumns={initialColumns}
// // // // // // // // // // // //             />
// // // // // // // // // // // //             {view === "kanban" && (
// // // // // // // // // // // //               <StageVisibilityDropdown
// // // // // // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // // // // // //                 initialColumns={initialColumns}
// // // // // // // // // // // //               />
// // // // // // // // // // // //             )}
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // // // // // //         {view === "kanban" && (
// // // // // // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // // // // // //               {Object.entries(columns)
// // // // // // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // // // // // //                   <Column
// // // // // // // // // // // //                     key={columnId}
// // // // // // // // // // // //                     columnId={columnId}
// // // // // // // // // // // //                     column={column}
// // // // // // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 ))}
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //           </DragDropContext>
// // // // // // // // // // // //         )}
// // // // // // // // // // // //         {view === "list" && (
// // // // // // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // // // // // //             <table className="w-full text-left">
// // // // // // // // // // // //               <thead>
// // // // // // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // // // // // //                 </tr>
// // // // // // // // // // // //               </thead>
// // // // // // // // // // // //               <tbody>
// // // // // // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // // // // // //                   <tr>
// // // // // // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // // // // // //                   </tr>
// // // // // // // // // // // //                 ) : (
// // // // // // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // // // // // //                     <tr
// // // // // // // // // // // //                       key={item.id}
// // // // // // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // // // // // //                       <td className="p-4">
// // // // // // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // // // // // //                               {tag}
// // // // // // // // // // // //                             </span>
// // // // // // // // // // // //                           ))}
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                       </td>
// // // // // // // // // // // //                     </tr>
// // // // // // // // // // // //                   ))
// // // // // // // // // // // //                 )}
// // // // // // // // // // // //               </tbody>
// // // // // // // // // // // //             </table>
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         )}
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //       <EnquiryModal
// // // // // // // // // // // //         isOpen={isModalOpen}
// // // // // // // // // // // //         onRequestClose={() => {
// // // // // // // // // // // //           setIsModalOpen(false);
// // // // // // // // // // // //           setSelectedEnquiry(null);
// // // // // // // // // // // //         }}
// // // // // // // // // // // //         courses={courses}
// // // // // // // // // // // //         branches={branches}
// // // // // // // // // // // //         instructors={instructors}
// // // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // // // // // //       />
// // // // // // // // // // // //       <TagsModal
// // // // // // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // // // // // //       />
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default KanbanBoard;


// // // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // // // // import Column from "./Column";

// // // // // // // // // // // const initialColumns = {
// // // // // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // // };

// // // // // // // // // // // const initialVisibility = {
// // // // // // // // // // //   "pre-qualified": true,
// // // // // // // // // // //   "qualified": true,
// // // // // // // // // // //   "negotiation": true,
// // // // // // // // // // //   "closed-won": true,
// // // // // // // // // // //   "closed-lost": true,
// // // // // // // // // // //   "contact-in-future": true,
// // // // // // // // // // // };

// // // // // // // // // // // const KanbanBoard = () => {
// // // // // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // // // // //   const [owners, setOwners] = useState([]); // Represents unique assignTo values
// // // // // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // // // // // // // //   const [isNotesMode, setIsNotesMode] = useState(false); // New state for notes mode

// // // // // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // // // // //   if (!canDisplay) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // // // // //         You don't have permission to view enquiries.
// // // // // // // // // // //       </div>
// // // // // // // // // // //     );
// // // // // // // // // // //   }

// // // // // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // // //     setIsNotesMode(false); // View mode
// // // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleAddNotes = (enquiry) => {
// // // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // // //     setIsNotesMode(true); // Notes mode
// // // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // // //   };

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     // Fetch tags from Firestore
// // // // // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // // //     });

// // // // // // // // // // //     // Fetch courses
// // // // // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // //       setCourses(coursesData);
// // // // // // // // // // //     });

// // // // // // // // // // //     // Fetch branches
// // // // // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // // // // //       (snapshot) => {
// // // // // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // // // // //         setBranches(branchesData);
// // // // // // // // // // //       }
// // // // // // // // // // //     );

// // // // // // // // // // //     // Fetch instructors
// // // // // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // // //       setInstructors(instructorsData);
// // // // // // // // // // //     });

// // // // // // // // // // //     // Fetch enquiries and extract unique assignTo values
// // // // // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
// // // // // // // // // // //       // Extract unique assignTo values
// // // // // // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // // // // // // //       setOwners(uniqueOwners);

// // // // // // // // // // //       setColumns((prevColumns) => {
// // // // // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // // // // //           return acc;
// // // // // // // // // // //         }, {});
// // // // // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // // // // //           }
// // // // // // // // // // //         });
// // // // // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // // // // //         });
// // // // // // // // // // //         return { ...updatedColumns };
// // // // // // // // // // //       });
// // // // // // // // // // //     });

// // // // // // // // // // //     return () => {
// // // // // // // // // // //       unsubscribeTags();
// // // // // // // // // // //       unsubscribeCourses();
// // // // // // // // // // //       unsubscribeBranches();
// // // // // // // // // // //       unsubscribeInstructors();
// // // // // // // // // // //       unsubscribeEnquiries();
// // // // // // // // // // //     };
// // // // // // // // // // //   }, [filters, searchTerm]);

// // // // // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // // // // //     return items.filter((enquiry) => {
// // // // // // // // // // //       const matchesSearch =
// // // // // // // // // // //         !searchTerm ||
// // // // // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // // // // // //     });
// // // // // // // // // // //   };

// // // // // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // // // // //     const { source, destination } = result;
// // // // // // // // // // //     if (!destination) return;

// // // // // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // // // // //     } else {
// // // // // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // // // // //       const updatedColumns = {
// // // // // // // // // // //         ...columns,
// // // // // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // // // // //       };
// // // // // // // // // // //       setColumns(updatedColumns);
// // // // // // // // // // //       try {
// // // // // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // // // // //       } catch (error) {
// // // // // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // // // // //         setColumns(columns);
// // // // // // // // // // //       }
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // // // // //     (enquiry) =>
// // // // // // // // // // //       !searchTerm ||
// // // // // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // // // // //   );

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // // // // //           <div>
// // // // // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // // // // //           </div>
// // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // // // // //             >
// // // // // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // // // // //               Manage Tags
// // // // // // // // // // //             </button>
// // // // // // // // // // //             {canCreate && (
// // // // // // // // // // //               <button
// // // // // // // // // // //                 onClick={() => {
// // // // // // // // // // //                   setSelectedEnquiry(null);
// // // // // // // // // // //                   setIsModalOpen(true);
// // // // // // // // // // //                 }}
// // // // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // // // // //               >
// // // // // // // // // // //                 + Add Enquiry
// // // // // // // // // // //               </button>
// // // // // // // // // // //             )}
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // //             >
// // // // // // // // // // //               Kanban View
// // // // // // // // // // //             </button>
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={() => setView("list")}
// // // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // // //             >
// // // // // // // // // // //               List View
// // // // // // // // // // //             </button>
// // // // // // // // // // //           </div>
// // // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // // // // //               <input
// // // // // // // // // // //                 type="text"
// // // // // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // // // // //                 value={searchTerm}
// // // // // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // // // // //               />
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <FiltersDropdown
// // // // // // // // // // //               filters={filters}
// // // // // // // // // // //               setFilters={setFilters}
// // // // // // // // // // //               availableTags={availableTags}
// // // // // // // // // // //               branches={branches}
// // // // // // // // // // //               courses={courses}
// // // // // // // // // // //               instructors={instructors}
// // // // // // // // // // //               owners={owners} // Pass unique assignTo values
// // // // // // // // // // //               initialColumns={initialColumns}
// // // // // // // // // // //             />
// // // // // // // // // // //             {view === "kanban" && (
// // // // // // // // // // //               <StageVisibilityDropdown
// // // // // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // // // // //                 initialColumns={initialColumns}
// // // // // // // // // // //               />
// // // // // // // // // // //             )}
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // // // // //         {view === "kanban" && (
// // // // // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // // // // //               {Object.entries(columns)
// // // // // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // // // // //                   <Column
// // // // // // // // // // //                     key={columnId}
// // // // // // // // // // //                     columnId={columnId}
// // // // // // // // // // //                     column={column}
// // // // // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // // // // // //                     handleAddNotes={handleAddNotes} // Pass the new handler
// // // // // // // // // // //                   />
// // // // // // // // // // //                 ))}
// // // // // // // // // // //             </div>
// // // // // // // // // // //           </DragDropContext>
// // // // // // // // // // //         )}
// // // // // // // // // // //         {view === "list" && (
// // // // // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // // // // //             <table className="w-full text-left">
// // // // // // // // // // //               <thead>
// // // // // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // // // // //                 </tr>
// // // // // // // // // // //               </thead>
// // // // // // // // // // //               <tbody>
// // // // // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // // // // //                   <tr>
// // // // // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // // // // //                   </tr>
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // // // // //                     <tr
// // // // // // // // // // //                       key={item.id}
// // // // // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // // // // //                     >
// // // // // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // // // // //                       <td className="p-4">
// // // // // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // // // // //                               {tag}
// // // // // // // // // // //                             </span>
// // // // // // // // // // //                           ))}
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                       </td>
// // // // // // // // // // //                     </tr>
// // // // // // // // // // //                   ))
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </tbody>
// // // // // // // // // // //             </table>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         )}
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <EnquiryModal
// // // // // // // // // // //         isOpen={isModalOpen}
// // // // // // // // // // //         onRequestClose={() => {
// // // // // // // // // // //           setIsModalOpen(false);
// // // // // // // // // // //           setSelectedEnquiry(null);
// // // // // // // // // // //           setIsNotesMode(false);
// // // // // // // // // // //         }}
// // // // // // // // // // //         courses={courses}
// // // // // // // // // // //         branches={branches}
// // // // // // // // // // //         instructors={instructors}
// // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // // // // //         isNotesMode={isNotesMode} // Pass notes mode to modal
// // // // // // // // // // //       />
// // // // // // // // // // //       <TagsModal
// // // // // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // // // // //       />
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default KanbanBoard;

// // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // // // import Column from "./Column";

// // // // // // // // // // const initialColumns = {
// // // // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // // };

// // // // // // // // // // const initialVisibility = {
// // // // // // // // // //   "pre-qualified": true,
// // // // // // // // // //   "qualified": true,
// // // // // // // // // //   "negotiation": true,
// // // // // // // // // //   "closed-won": true,
// // // // // // // // // //   "closed-lost": true,
// // // // // // // // // //   "contact-in-future": true,
// // // // // // // // // // };

// // // // // // // // // // const KanbanBoard = () => {
// // // // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false); // New state for popup
// // // // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // // // //   const [owners, setOwners] = useState([]); // Represents unique assignTo values
// // // // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // // // // // // //   const [isNotesMode, setIsNotesMode] = useState(false); // For notes mode
// // // // // // // // // //   const [selectedEnquiryType, setSelectedEnquiryType] = useState("General Enquiry"); // Default type

// // // // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // // // //   if (!canDisplay) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // // // //         You don't have permission to view enquiries.
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // //     setIsNotesMode(false);
// // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // //   };

// // // // // // // // // //   const handleAddNotes = (enquiry) => {
// // // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // // //     setIsTypePopupOpen(true); // Open popup to select type
// // // // // // // // // //   };

// // // // // // // // // //   const handleTypeSubmit = () => {
// // // // // // // // // //     setIsTypePopupOpen(false);
// // // // // // // // // //     setIsNotesMode(true);
// // // // // // // // // //     setIsModalOpen(true);
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     // Fetch tags from Firestore
// // // // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // // //     });

// // // // // // // // // //     // Fetch courses
// // // // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // //       setCourses(coursesData);
// // // // // // // // // //     });

// // // // // // // // // //     // Fetch branches
// // // // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // // // //       (snapshot) => {
// // // // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // // // //         setBranches(branchesData);
// // // // // // // // // //       }
// // // // // // // // // //     );

// // // // // // // // // //     // Fetch instructors
// // // // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // // //       setInstructors(instructorsData);
// // // // // // // // // //     });

// // // // // // // // // //     // Fetch enquiries and extract unique assignTo values
// // // // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
// // // // // // // // // //       // Extract unique assignTo values
// // // // // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // // // // // //       setOwners(uniqueOwners);

// // // // // // // // // //       setColumns((prevColumns) => {
// // // // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // // // //           return acc;
// // // // // // // // // //         }, {});
// // // // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // // // //           }
// // // // // // // // // //         });
// // // // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // // // //         });
// // // // // // // // // //         return { ...updatedColumns };
// // // // // // // // // //       });
// // // // // // // // // //     });

// // // // // // // // // //     return () => {
// // // // // // // // // //       unsubscribeTags();
// // // // // // // // // //       unsubscribeCourses();
// // // // // // // // // //       unsubscribeBranches();
// // // // // // // // // //       unsubscribeInstructors();
// // // // // // // // // //       unsubscribeEnquiries();
// // // // // // // // // //     };
// // // // // // // // // //   }, [filters, searchTerm]);

// // // // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // // // //     return items.filter((enquiry) => {
// // // // // // // // // //       const matchesSearch =
// // // // // // // // // //         !searchTerm ||
// // // // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // // // // //     });
// // // // // // // // // //   };

// // // // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // // // //     const { source, destination } = result;
// // // // // // // // // //     if (!destination) return;

// // // // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // // // //     } else {
// // // // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // // // //       const updatedColumns = {
// // // // // // // // // //         ...columns,
// // // // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // // // //       };
// // // // // // // // // //       setColumns(updatedColumns);
// // // // // // // // // //       try {
// // // // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // // // //       } catch (error) {
// // // // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // // // //         setColumns(columns);
// // // // // // // // // //       }
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // // // //     (enquiry) =>
// // // // // // // // // //       !searchTerm ||
// // // // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // // // //   );

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // // // //           <div>
// // // // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // // // //           </div>
// // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // // // //             >
// // // // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // // // //               Manage Tags
// // // // // // // // // //             </button>
// // // // // // // // // //             {canCreate && (
// // // // // // // // // //               <button
// // // // // // // // // //                 onClick={() => {
// // // // // // // // // //                   setSelectedEnquiry(null);
// // // // // // // // // //                   setIsModalOpen(true);
// // // // // // // // // //                 }}
// // // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // // // //               >
// // // // // // // // // //                 + Add Enquiry
// // // // // // // // // //               </button>
// // // // // // // // // //             )}
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // //             >
// // // // // // // // // //               Kanban View
// // // // // // // // // //             </button>
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={() => setView("list")}
// // // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // // //             >
// // // // // // // // // //               List View
// // // // // // // // // //             </button>
// // // // // // // // // //           </div>
// // // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // // // //               <input
// // // // // // // // // //                 type="text"
// // // // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // // // //                 value={searchTerm}
// // // // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // // // //               />
// // // // // // // // // //             </div>
// // // // // // // // // //             <FiltersDropdown
// // // // // // // // // //               filters={filters}
// // // // // // // // // //               setFilters={setFilters}
// // // // // // // // // //               availableTags={availableTags}
// // // // // // // // // //               branches={branches}
// // // // // // // // // //               courses={courses}
// // // // // // // // // //               instructors={instructors}
// // // // // // // // // //               owners={owners}
// // // // // // // // // //               initialColumns={initialColumns}
// // // // // // // // // //             />
// // // // // // // // // //             {view === "kanban" && (
// // // // // // // // // //               <StageVisibilityDropdown
// // // // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // // // //                 initialColumns={initialColumns}
// // // // // // // // // //               />
// // // // // // // // // //             )}
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // // // //         {view === "kanban" && (
// // // // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // // // //               {Object.entries(columns)
// // // // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // // // //                   <Column
// // // // // // // // // //                     key={columnId}
// // // // // // // // // //                     columnId={columnId}
// // // // // // // // // //                     column={column}
// // // // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // // // // //                     handleAddNotes={handleAddNotes}
// // // // // // // // // //                   />
// // // // // // // // // //                 ))}
// // // // // // // // // //             </div>
// // // // // // // // // //           </DragDropContext>
// // // // // // // // // //         )}
// // // // // // // // // //         {view === "list" && (
// // // // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // // // //             <table className="w-full text-left">
// // // // // // // // // //               <thead>
// // // // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // // // //                 </tr>
// // // // // // // // // //               </thead>
// // // // // // // // // //               <tbody>
// // // // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // // // //                   <tr>
// // // // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // // // //                   </tr>
// // // // // // // // // //                 ) : (
// // // // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // // // //                     <tr
// // // // // // // // // //                       key={item.id}
// // // // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // // // //                     >
// // // // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // // // //                       <td className="p-4">
// // // // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // // // //                               {tag}
// // // // // // // // // //                             </span>
// // // // // // // // // //                           ))}
// // // // // // // // // //                         </div>
// // // // // // // // // //                       </td>
// // // // // // // // // //                     </tr>
// // // // // // // // // //                   ))
// // // // // // // // // //                 )}
// // // // // // // // // //               </tbody>
// // // // // // // // // //             </table>
// // // // // // // // // //           </div>
// // // // // // // // // //         )}
// // // // // // // // // //       </div>
// // // // // // // // // //       {/* Popup for selecting enquiry type */}
// // // // // // // // // //       {isTypePopupOpen && (
// // // // // // // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // // // // // // // //           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
// // // // // // // // // //             <h3 className="text-lg font-semibold mb-4">Select Enquiry Type</h3>
// // // // // // // // // //             <select
// // // // // // // // // //               value={selectedEnquiryType}
// // // // // // // // // //               onChange={(e) => setSelectedEnquiryType(e.target.value)}
// // // // // // // // // //               className="w-full p-2 border border-gray-300 rounded-md mb-4"
// // // // // // // // // //             >
// // // // // // // // // //               <option value="General Enquiry">General Enquiry</option>
// // // // // // // // // //               <option value="Corporate Enquiry">Corporate Enquiry</option>
// // // // // // // // // //               <option value="International Enquiry">International Enquiry</option>
// // // // // // // // // //               {/* Add more types as needed */}
// // // // // // // // // //             </select>
// // // // // // // // // //             <div className="flex justify-end gap-2">
// // // // // // // // // //               <button
// // // // // // // // // //                 onClick={() => setIsTypePopupOpen(false)}
// // // // // // // // // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // // // // // // // //               >
// // // // // // // // // //                 Cancel
// // // // // // // // // //               </button>
// // // // // // // // // //               <button
// // // // // // // // // //                 onClick={handleTypeSubmit}
// // // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // // // // // // //               >
// // // // // // // // // //                 Submit
// // // // // // // // // //               </button>
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       )}
// // // // // // // // // //       <EnquiryModal
// // // // // // // // // //         isOpen={isModalOpen}
// // // // // // // // // //         onRequestClose={() => {
// // // // // // // // // //           setIsModalOpen(false);
// // // // // // // // // //           setSelectedEnquiry(null);
// // // // // // // // // //           setIsNotesMode(false);
// // // // // // // // // //         }}
// // // // // // // // // //         courses={courses}
// // // // // // // // // //         branches={branches}
// // // // // // // // // //         instructors={instructors}
// // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // // // //         isNotesMode={isNotesMode}
// // // // // // // // // //         enquiryType={selectedEnquiryType} // Pass selected type
// // // // // // // // // //       />
// // // // // // // // // //       <TagsModal
// // // // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // // // //         availableTags={availableTags}
// // // // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // // // //       />
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default KanbanBoard;

// // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // // import Column from "./Column";

// // // // // // // // // const initialColumns = {
// // // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // // };

// // // // // // // // // const initialVisibility = {
// // // // // // // // //   "pre-qualified": true,
// // // // // // // // //   "qualified": true,
// // // // // // // // //   "negotiation": true,
// // // // // // // // //   "closed-won": true,
// // // // // // // // //   "closed-lost": true,
// // // // // // // // //   "contact-in-future": true,
// // // // // // // // // };

// // // // // // // // // const KanbanBoard = () => {
// // // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // // //   const [owners, setOwners] = useState([]);
// // // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // // // // // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // // // // // // // //   const [selectedEnquiryType, setSelectedEnquiryType] = useState("General Enquiry");

// // // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // // //   if (!canDisplay) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // // //         You don't have permission to view enquiries.
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // //     setIsNotesMode(false);
// // // // // // // // //     setIsModalOpen(true);
// // // // // // // // //   };

// // // // // // // // //   const handleAddNotes = (enquiry) => {
// // // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // // //     setIsTypePopupOpen(true);
// // // // // // // // //   };

// // // // // // // // //   const handleTypeSubmit = () => {
// // // // // // // // //     setIsTypePopupOpen(false);
// // // // // // // // //     setIsNotesMode(true);
// // // // // // // // //     setIsModalOpen(true);
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // // //     });

// // // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // //       setCourses(coursesData);
// // // // // // // // //     });

// // // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // // //       (snapshot) => {
// // // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // // //         setBranches(branchesData);
// // // // // // // // //       }
// // // // // // // // //     );

// // // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // //       setInstructors(instructorsData);
// // // // // // // // //     });

// // // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // // // // //       setOwners(uniqueOwners);

// // // // // // // // //       setColumns((prevColumns) => {
// // // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // // //           return acc;
// // // // // // // // //         }, {});
// // // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // // //           }
// // // // // // // // //         });
// // // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // // //         });
// // // // // // // // //         return { ...updatedColumns };
// // // // // // // // //       });
// // // // // // // // //     });

// // // // // // // // //     return () => {
// // // // // // // // //       unsubscribeTags();
// // // // // // // // //       unsubscribeCourses();
// // // // // // // // //       unsubscribeBranches();
// // // // // // // // //       unsubscribeInstructors();
// // // // // // // // //       unsubscribeEnquiries();
// // // // // // // // //     };
// // // // // // // // //   }, [filters, searchTerm]);

// // // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // // //     return items.filter((enquiry) => {
// // // // // // // // //       const matchesSearch =
// // // // // // // // //         !searchTerm ||
// // // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // // //     const { source, destination } = result;
// // // // // // // // //     if (!destination) return;

// // // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // // //     } else {
// // // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // // //       const updatedColumns = {
// // // // // // // // //         ...columns,
// // // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // // //       };
// // // // // // // // //       setColumns(updatedColumns);
// // // // // // // // //       try {
// // // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // // //       } catch (error) {
// // // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // // //         setColumns(columns);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // // //     (enquiry) =>
// // // // // // // // //       !searchTerm ||
// // // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // // //   );

// // // // // // // // //   return (
// // // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // // //           <div>
// // // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // // //           </div>
// // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // // //             >
// // // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // // //               Manage Tags
// // // // // // // // //             </button>
// // // // // // // // //             {canCreate && (
// // // // // // // // //               <button
// // // // // // // // //                 onClick={() => {
// // // // // // // // //                   setSelectedEnquiry(null);
// // // // // // // // //                   setIsModalOpen(true);
// // // // // // // // //                 }}
// // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // // //               >
// // // // // // // // //                 + Add Enquiry
// // // // // // // // //               </button>
// // // // // // // // //             )}
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // //             >
// // // // // // // // //               Kanban View
// // // // // // // // //             </button>
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => setView("list")}
// // // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // // //             >
// // // // // // // // //               List View
// // // // // // // // //             </button>
// // // // // // // // //           </div>
// // // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // // //               <input
// // // // // // // // //                 type="text"
// // // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // // //                 value={searchTerm}
// // // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // // //               />
// // // // // // // // //             </div>
// // // // // // // // //             <FiltersDropdown
// // // // // // // // //               filters={filters}
// // // // // // // // //               setFilters={setFilters}
// // // // // // // // //               availableTags={availableTags}
// // // // // // // // //               branches={branches}
// // // // // // // // //               courses={courses}
// // // // // // // // //               instructors={instructors}
// // // // // // // // //               owners={owners}
// // // // // // // // //               initialColumns={initialColumns}
// // // // // // // // //             />
// // // // // // // // //             {view === "kanban" && (
// // // // // // // // //               <StageVisibilityDropdown
// // // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // // //                 initialColumns={initialColumns}
// // // // // // // // //               />
// // // // // // // // //             )}
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // // //         {view === "kanban" && (
// // // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // // //               {Object.entries(columns)
// // // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // // //                   <Column
// // // // // // // // //                     key={columnId}
// // // // // // // // //                     columnId={columnId}
// // // // // // // // //                     column={column}
// // // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // // // //                     handleAddNotes={handleAddNotes}
// // // // // // // // //                   />
// // // // // // // // //                 ))}
// // // // // // // // //             </div>
// // // // // // // // //           </DragDropContext>
// // // // // // // // //         )}
// // // // // // // // //         {view === "list" && (
// // // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // // //             <table className="w-full text-left">
// // // // // // // // //               <thead>
// // // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // // //                 </tr>
// // // // // // // // //               </thead>
// // // // // // // // //               <tbody>
// // // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // // //                   <tr>
// // // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // // //                   </tr>
// // // // // // // // //                 ) : (
// // // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // // //                     <tr
// // // // // // // // //                       key={item.id}
// // // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // // //                     >
// // // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // // //                       <td className="p-4">
// // // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // // //                               {tag}
// // // // // // // // //                             </span>
// // // // // // // // //                           ))}
// // // // // // // // //                         </div>
// // // // // // // // //                       </td>
// // // // // // // // //                     </tr>
// // // // // // // // //                   ))
// // // // // // // // //                 )}
// // // // // // // // //               </tbody>
// // // // // // // // //             </table>
// // // // // // // // //           </div>
// // // // // // // // //         )}
// // // // // // // // //       </div>
// // // // // // // // //       {isTypePopupOpen && (
// // // // // // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // // // // // // //           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
// // // // // // // // //             <h3 className="text-lg font-semibold mb-4">Select Enquiry Type</h3>
// // // // // // // // //             <select
// // // // // // // // //               value={selectedEnquiryType}
// // // // // // // // //               onChange={(e) => setSelectedEnquiryType(e.target.value)}
// // // // // // // // //               className="w-full p-2 border border-gray-300 rounded-md mb-4"
// // // // // // // // //             >
// // // // // // // // //               <option value="General Enquiry">General Enquiry</option>
// // // // // // // // //               <option value="Corporate Enquiry">Corporate Enquiry</option>
// // // // // // // // //               <option value="International Enquiry">International Enquiry</option>
// // // // // // // // //             </select>
// // // // // // // // //             <div className="flex justify-end gap-2">
// // // // // // // // //               <button
// // // // // // // // //                 onClick={() => setIsTypePopupOpen(false)}
// // // // // // // // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // // // // // // //               >
// // // // // // // // //                 Cancel
// // // // // // // // //               </button>
// // // // // // // // //               <button
// // // // // // // // //                 onClick={handleTypeSubmit}
// // // // // // // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // // // // // //               >
// // // // // // // // //                 Submit
// // // // // // // // //               </button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       )}
// // // // // // // // //       <EnquiryModal
// // // // // // // // //         isOpen={isModalOpen}
// // // // // // // // //         onRequestClose={() => {
// // // // // // // // //           setIsModalOpen(false);
// // // // // // // // //           setSelectedEnquiry(null);
// // // // // // // // //           setIsNotesMode(false);
// // // // // // // // //         }}
// // // // // // // // //         courses={courses}
// // // // // // // // //         branches={branches}
// // // // // // // // //         instructors={instructors}
// // // // // // // // //         availableTags={availableTags}
// // // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // // //         isNotesMode={isNotesMode}
// // // // // // // // //         enquiryType={selectedEnquiryType}
// // // // // // // // //       />
// // // // // // // // //       <TagsModal
// // // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // // //         availableTags={availableTags}
// // // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default KanbanBoard;


// // // // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // // import TagsModal from "./TagsModal";
// // // // // // // // import Column from "./Column";

// // // // // // // // const initialColumns = {
// // // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // // };

// // // // // // // // const initialVisibility = {
// // // // // // // //   "pre-qualified": true,
// // // // // // // //   "qualified": true,
// // // // // // // //   "negotiation": true,
// // // // // // // //   "closed-won": true,
// // // // // // // //   "closed-lost": true,
// // // // // // // //   "contact-in-future": true,
// // // // // // // // };

// // // // // // // // const KanbanBoard = () => {
// // // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // // //   const [view, setView] = useState("kanban");
// // // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // // //   const [owners, setOwners] = useState([]);
// // // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // // // // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // // // // // // //   const [selectedEnquiryType, setSelectedEnquiryType] = useState("General Enquiry");
// // // // // // // //   const addButtonRef = useRef(null);

// // // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // // //   if (!canDisplay) {
// // // // // // // //     return (
// // // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // // //         You don't have permission to view enquiries.
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // //     setIsNotesMode(false);
// // // // // // // //     setIsModalOpen(true);
// // // // // // // //   };

// // // // // // // //   const handleAddNotes = (enquiry) => {
// // // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // // //     setIsTypePopupOpen(true);
// // // // // // // //   };

// // // // // // // //   const handleTypeSubmit = () => {
// // // // // // // //     setIsTypePopupOpen(false);
// // // // // // // //     setIsNotesMode(true);
// // // // // // // //     setIsModalOpen(true);
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // // //     });

// // // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // //       setCourses(coursesData);
// // // // // // // //     });

// // // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // // //       (snapshot) => {
// // // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // // //         setBranches(branchesData);
// // // // // // // //       }
// // // // // // // //     );

// // // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // //       setInstructors(instructorsData);
// // // // // // // //     });

// // // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // // // //       setOwners(uniqueOwners);

// // // // // // // //       setColumns((prevColumns) => {
// // // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // // //           return acc;
// // // // // // // //         }, {});
// // // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // // //           if (updatedColumns[columnId]) {
// // // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // // //           }
// // // // // // // //         });
// // // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // // //         });
// // // // // // // //         return { ...updatedColumns };
// // // // // // // //       });
// // // // // // // //     });

// // // // // // // //     return () => {
// // // // // // // //       unsubscribeTags();
// // // // // // // //       unsubscribeCourses();
// // // // // // // //       unsubscribeBranches();
// // // // // // // //       unsubscribeInstructors();
// // // // // // // //       unsubscribeEnquiries();
// // // // // // // //     };
// // // // // // // //   }, [filters, searchTerm]);

// // // // // // // //   const filteredEnquiries = (items) => {
// // // // // // // //     return items.filter((enquiry) => {
// // // // // // // //       const matchesSearch =
// // // // // // // //         !searchTerm ||
// // // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   const onDragEnd = async (result) => {
// // // // // // // //     const { source, destination } = result;
// // // // // // // //     if (!destination) return;

// // // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // // //     const destItems = [...destColumn.items];
// // // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // // //     } else {
// // // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // // //       const updatedColumns = {
// // // // // // // //         ...columns,
// // // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // // //       };
// // // // // // // //       setColumns(updatedColumns);
// // // // // // // //       try {
// // // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // // //       } catch (error) {
// // // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // // //         setColumns(columns);
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // // //     (enquiry) =>
// // // // // // // //       !searchTerm ||
// // // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // // //           <div>
// // // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // // //           </div>
// // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// // // // // // // //             <button
// // // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // // //             >
// // // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // // //               Manage Tags
// // // // // // // //             </button>
// // // // // // // //             {canCreate && (
// // // // // // // //               <div className="relative" ref={addButtonRef}>
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => {
// // // // // // // //                     setSelectedEnquiry(null);
// // // // // // // //                     setIsTypePopupOpen(true);
// // // // // // // //                   }}
// // // // // // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // // //                 >
// // // // // // // //                   + Add Enquiry
// // // // // // // //                 </button>
// // // // // // // //                 {isTypePopupOpen && addButtonRef.current && (
// // // // // // // //                   <div
// // // // // // // //                     className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50"
// // // // // // // //                     style={{
// // // // // // // //                       top: addButtonRef.current.offsetHeight + 5,
// // // // // // // //                       left: 0,
// // // // // // // //                       transform: "translateX(-50%)",
// // // // // // // //                     }}
// // // // // // // //                   >
// // // // // // // //                     <h3 className="text-lg font-semibold mb-4">Select Enquiry Type</h3>
// // // // // // // //                     <select
// // // // // // // //                       value={selectedEnquiryType}
// // // // // // // //                       onChange={(e) => setSelectedEnquiryType(e.target.value)}
// // // // // // // //                       className="w-full p-2 border border-gray-300 rounded-md mb-4"
// // // // // // // //                     >
// // // // // // // //                       <option value="General Enquiry">General Enquiry</option>
// // // // // // // //                       <option value="Corporate Enquiry">Corporate Enquiry</option>
// // // // // // // //                       <option value="International Enquiry">International Enquiry</option>
// // // // // // // //                     </select>
// // // // // // // //                     <div className="flex justify-end gap-2">
// // // // // // // //                       <button
// // // // // // // //                         onClick={() => setIsTypePopupOpen(false)}
// // // // // // // //                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // // // // // //                       >
// // // // // // // //                         Cancel
// // // // // // // //                       </button>
// // // // // // // //                       <button
// // // // // // // //                         onClick={handleTypeSubmit}
// // // // // // // //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // // // // //                       >
// // // // // // // //                         Submit
// // // // // // // //                       </button>
// // // // // // // //                     </div>
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //             )}
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // // //             <button
// // // // // // // //               onClick={() => setView("kanban")}
// // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // //             >
// // // // // // // //               Kanban View
// // // // // // // //             </button>
// // // // // // // //             <button
// // // // // // // //               onClick={() => setView("list")}
// // // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // // //             >
// // // // // // // //               List View
// // // // // // // //             </button>
// // // // // // // //           </div>
// // // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // // //               <input
// // // // // // // //                 type="text"
// // // // // // // //                 placeholder="Search enquiries..."
// // // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // // //                 value={searchTerm}
// // // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // //               />
// // // // // // // //             </div>
// // // // // // // //             <FiltersDropdown
// // // // // // // //               filters={filters}
// // // // // // // //               setFilters={setFilters}
// // // // // // // //               availableTags={availableTags}
// // // // // // // //               branches={branches}
// // // // // // // //               courses={courses}
// // // // // // // //               instructors={instructors}
// // // // // // // //               owners={owners}
// // // // // // // //               initialColumns={initialColumns}
// // // // // // // //             />
// // // // // // // //             {view === "kanban" && (
// // // // // // // //               <StageVisibilityDropdown
// // // // // // // //                 stageVisibility={stageVisibility}
// // // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // // //                 initialColumns={initialColumns}
// // // // // // // //               />
// // // // // // // //             )}
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // // //         {view === "kanban" && (
// // // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // // //               {Object.entries(columns)
// // // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // // //                 .map(([columnId, column]) => (
// // // // // // // //                   <Column
// // // // // // // //                     key={columnId}
// // // // // // // //                     columnId={columnId}
// // // // // // // //                     column={column}
// // // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // // //                     handleAddNotes={handleAddNotes}
// // // // // // // //                   />
// // // // // // // //                 ))}
// // // // // // // //             </div>
// // // // // // // //           </DragDropContext>
// // // // // // // //         )}
// // // // // // // //         {view === "list" && (
// // // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // // //             <table className="w-full text-left">
// // // // // // // //               <thead>
// // // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // // //                   <th className="p-4">Name</th>
// // // // // // // //                   <th className="p-4">Amount</th>
// // // // // // // //                   <th className="p-4">Phone</th>
// // // // // // // //                   <th className="p-4">Email</th>
// // // // // // // //                   <th className="p-4">Stage</th>
// // // // // // // //                   <th className="p-4">Tags</th>
// // // // // // // //                 </tr>
// // // // // // // //               </thead>
// // // // // // // //               <tbody>
// // // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // // //                   <tr>
// // // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // // //                   </tr>
// // // // // // // //                 ) : (
// // // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // // //                     <tr
// // // // // // // //                       key={item.id}
// // // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // // //                     >
// // // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // // //                       <td className="p-4">
// // // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // // //                           {item.tags?.map((tag) => (
// // // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // // //                               {tag}
// // // // // // // //                             </span>
// // // // // // // //                           ))}
// // // // // // // //                         </div>
// // // // // // // //                       </td>
// // // // // // // //                     </tr>
// // // // // // // //                   ))
// // // // // // // //                 )}
// // // // // // // //               </tbody>
// // // // // // // //             </table>
// // // // // // // //           </div>
// // // // // // // //         )}
// // // // // // // //       </div>
// // // // // // // //       <EnquiryModal
// // // // // // // //         isOpen={isModalOpen}
// // // // // // // //         onRequestClose={() => {
// // // // // // // //           setIsModalOpen(false);
// // // // // // // //           setSelectedEnquiry(null);
// // // // // // // //           setIsNotesMode(false);
// // // // // // // //         }}
// // // // // // // //         courses={courses}
// // // // // // // //         branches={branches}
// // // // // // // //         instructors={instructors}
// // // // // // // //         availableTags={availableTags}
// // // // // // // //         rolePermissions={rolePermissions}
// // // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // // //         isNotesMode={isNotesMode}
// // // // // // // //         enquiryType={selectedEnquiryType}
// // // // // // // //       />
// // // // // // // //       <TagsModal
// // // // // // // //         isOpen={isTagsModalOpen}
// // // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // // //         availableTags={availableTags}
// // // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // // //       />
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default KanbanBoard;

// // // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // // import { db } from "../../../config/firebase";
// // // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // // import TagsModal from "./TagsModal";
// // // // // // // import Column from "./Column";

// // // // // // // const initialColumns = {
// // // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // // };

// // // // // // // const initialVisibility = {
// // // // // // //   "pre-qualified": true,
// // // // // // //   "qualified": true,
// // // // // // //   "negotiation": true,
// // // // // // //   "closed-won": true,
// // // // // // //   "closed-lost": true,
// // // // // // //   "contact-in-future": true,
// // // // // // // };

// // // // // // // const KanbanBoard = () => {
// // // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // // //   const [view, setView] = useState("kanban");
// // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // // //   const [courses, setCourses] = useState([]);
// // // // // // //   const [branches, setBranches] = useState([]);
// // // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // // //   const [owners, setOwners] = useState([]);
// // // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // // // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // // // // // //   const [noteType, setNoteType] = useState("general-enquiry");
// // // // // // //   const [newNote, setNewNote] = useState("");
// // // // // // //   const addButtonRef = useRef(null);

// // // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // // //   if (!canDisplay) {
// // // // // // //     return (
// // // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // // //         You don't have permission to view enquiries.
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // //     setIsNotesMode(false);
// // // // // // //     setIsModalOpen(true);
// // // // // // //   };

// // // // // // //   const handleAddNotes = (enquiry) => {
// // // // // // //     setSelectedEnquiry(enquiry);
// // // // // // //     setIsTypePopupOpen(true);
// // // // // // //   };

// // // // // // //   const handleTypeSubmit = () => {
// // // // // // //     if (!newNote.trim()) {
// // // // // // //       alert("Please add a note before submitting.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     setIsTypePopupOpen(false);
// // // // // // //     setIsNotesMode(true);
// // // // // // //     setIsModalOpen(true);
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // // //     });

// // // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // //       setCourses(coursesData);
// // // // // // //     });

// // // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // // //       (snapshot) => {
// // // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // // //         setBranches(branchesData);
// // // // // // //       }
// // // // // // //     );

// // // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // //       setInstructors(instructorsData);
// // // // // // //     });

// // // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // // //       setOwners(uniqueOwners);

// // // // // // //       setColumns((prevColumns) => {
// // // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // // //           return acc;
// // // // // // //         }, {});
// // // // // // //         enquiries.forEach((enquiry) => {
// // // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // // //           if (updatedColumns[columnId]) {
// // // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // // //           }
// // // // // // //         });
// // // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // // //         });
// // // // // // //         return { ...updatedColumns };
// // // // // // //       });
// // // // // // //     });

// // // // // // //     return () => {
// // // // // // //       unsubscribeTags();
// // // // // // //       unsubscribeCourses();
// // // // // // //       unsubscribeBranches();
// // // // // // //       unsubscribeInstructors();
// // // // // // //       unsubscribeEnquiries();
// // // // // // //     };
// // // // // // //   }, [filters, searchTerm]);

// // // // // // //   const filteredEnquiries = (items) => {
// // // // // // //     return items.filter((enquiry) => {
// // // // // // //       const matchesSearch =
// // // // // // //         !searchTerm ||
// // // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const onDragEnd = async (result) => {
// // // // // // //     const { source, destination } = result;
// // // // // // //     if (!destination) return;

// // // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // // //     const destColumn = columns[destination.droppableId];
// // // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // // //     const destItems = [...destColumn.items];
// // // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // // //     } else {
// // // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // // //       const updatedColumns = {
// // // // // // //         ...columns,
// // // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // // //       };
// // // // // // //       setColumns(updatedColumns);
// // // // // // //       try {
// // // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // // //       } catch (error) {
// // // // // // //         console.error("Error updating Firestore:", error);
// // // // // // //         setColumns(columns);
// // // // // // //       }
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // // //     (enquiry) =>
// // // // // // //       !searchTerm ||
// // // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // // //           <div>
// // // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // // //           </div>
// // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// // // // // // //             <button
// // // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // // //             >
// // // // // // //               <FaCircle className="text-gray-400" />
// // // // // // //               Manage Tags
// // // // // // //             </button>
// // // // // // //             {canCreate && (
// // // // // // //               <div className="relative" ref={addButtonRef}>
// // // // // // //                 <button
// // // // // // //                   onClick={() => {
// // // // // // //                     setSelectedEnquiry(null);
// // // // // // //                     setIsTypePopupOpen(true);
// // // // // // //                   }}
// // // // // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // // //                 >
// // // // // // //                   + Add Enquiry
// // // // // // //                 </button>
// // // // // // //                 {isTypePopupOpen && addButtonRef.current && (
// // // // // // //                   <div
// // // // // // //                     className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
// // // // // // //                     style={{
// // // // // // //                       top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
// // // // // // //                       right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
// // // // // // //                     }}
// // // // // // //                   >
// // // // // // //                     <h3 className="text-lg font-semibold mb-4">Add Note</h3>
// // // // // // //                     <div className="mb-4">
// // // // // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
// // // // // // //                       <select
// // // // // // //                         value={noteType}
// // // // // // //                         onChange={(e) => setNoteType(e.target.value)}
// // // // // // //                         className="w-full p-2 border border-gray-300 rounded-md"
// // // // // // //                       >
// // // // // // //                         <option value="general-enquiry">General Enquiry</option>
// // // // // // //                         <option value="call-log">Call Log</option>
// // // // // // //                         <option value="call-schedule">Call Schedule</option>
// // // // // // //                         <option value="office-visit">Office Visit</option>
// // // // // // //                       </select>
// // // // // // //                     </div>
// // // // // // //                     <div className="mb-4">
// // // // // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
// // // // // // //                       <textarea
// // // // // // //                         value={newNote}
// // // // // // //                         onChange={(e) => setNewNote(e.target.value)}
// // // // // // //                         placeholder="Add your note here..."
// // // // // // //                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // //                         rows="4"
// // // // // // //                       />
// // // // // // //                     </div>
// // // // // // //                     <div className="flex justify-end gap-2">
// // // // // // //                       <button
// // // // // // //                         onClick={() => {
// // // // // // //                           setIsTypePopupOpen(false);
// // // // // // //                           setNewNote("");
// // // // // // //                           setNoteType("general-enquiry");
// // // // // // //                         }}
// // // // // // //                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // // // // //                       >
// // // // // // //                         Cancel
// // // // // // //                       </button>
// // // // // // //                       <button
// // // // // // //                         onClick={handleTypeSubmit}
// // // // // // //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // // // //                       >
// // // // // // //                         Submit
// // // // // // //                       </button>
// // // // // // //                     </div>
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               </div>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // // //             <button
// // // // // // //               onClick={() => setView("kanban")}
// // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // //             >
// // // // // // //               Kanban View
// // // // // // //             </button>
// // // // // // //             <button
// // // // // // //               onClick={() => setView("list")}
// // // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // // //             >
// // // // // // //               List View
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // // //             <div className="relative w-full sm:w-64">
// // // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // // //               <input
// // // // // // //                 type="text"
// // // // // // //                 placeholder="Search enquiries..."
// // // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // // //                 value={searchTerm}
// // // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //             <FiltersDropdown
// // // // // // //               filters={filters}
// // // // // // //               setFilters={setFilters}
// // // // // // //               availableTags={availableTags}
// // // // // // //               branches={branches}
// // // // // // //               courses={courses}
// // // // // // //               instructors={instructors}
// // // // // // //               owners={owners}
// // // // // // //               initialColumns={initialColumns}
// // // // // // //             />
// // // // // // //             {view === "kanban" && (
// // // // // // //               <StageVisibilityDropdown
// // // // // // //                 stageVisibility={stageVisibility}
// // // // // // //                 setStageVisibility={setStageVisibility}
// // // // // // //                 initialColumns={initialColumns}
// // // // // // //               />
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // // //         {view === "kanban" && (
// // // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // // //               {Object.entries(columns)
// // // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // // //                 .map(([columnId, column]) => (
// // // // // // //                   <Column
// // // // // // //                     key={columnId}
// // // // // // //                     columnId={columnId}
// // // // // // //                     column={column}
// // // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // // //                     handleAddNotes={handleAddNotes}
// // // // // // //                   />
// // // // // // //                 ))}
// // // // // // //             </div>
// // // // // // //           </DragDropContext>
// // // // // // //         )}
// // // // // // //         {view === "list" && (
// // // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // // //             <table className="w-full text-left">
// // // // // // //               <thead>
// // // // // // //                 <tr className="border-b border-gray-200">
// // // // // // //                   <th className="p-4">Name</th>
// // // // // // //                   <th className="p-4">Amount</th>
// // // // // // //                   <th className="p-4">Phone</th>
// // // // // // //                   <th className="p-4">Email</th>
// // // // // // //                   <th className="p-4">Stage</th>
// // // // // // //                   <th className="p-4">Tags</th>
// // // // // // //                 </tr>
// // // // // // //               </thead>
// // // // // // //               <tbody>
// // // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // // //                   <tr>
// // // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // // //                   </tr>
// // // // // // //                 ) : (
// // // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // // //                     <tr
// // // // // // //                       key={item.id}
// // // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // // //                       style={{ cursor: "pointer" }}
// // // // // // //                     >
// // // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // // //                       <td className="p-4">
// // // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // // //                           {item.tags?.map((tag) => (
// // // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // // //                               {tag}
// // // // // // //                             </span>
// // // // // // //                           ))}
// // // // // // //                         </div>
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   ))
// // // // // // //                 )}
// // // // // // //               </tbody>
// // // // // // //             </table>
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </div>
// // // // // // //       <EnquiryModal
// // // // // // //         isOpen={isModalOpen}
// // // // // // //         onRequestClose={() => {
// // // // // // //           setIsModalOpen(false);
// // // // // // //           setSelectedEnquiry(null);
// // // // // // //           setIsNotesMode(false);
// // // // // // //           setNewNote("");
// // // // // // //           setNoteType("general-enquiry");
// // // // // // //         }}
// // // // // // //         courses={courses}
// // // // // // //         branches={branches}
// // // // // // //         instructors={instructors}
// // // // // // //         availableTags={availableTags}
// // // // // // //         rolePermissions={rolePermissions}
// // // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // // //         isNotesMode={isNotesMode}
// // // // // // //         noteType={noteType}
// // // // // // //         newNote={newNote}
// // // // // // //       />
// // // // // // //       <TagsModal
// // // // // // //         isOpen={isTagsModalOpen}
// // // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // // //         availableTags={availableTags}
// // // // // // //         setAvailableTags={setAvailableTags}
// // // // // // //       />
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default KanbanBoard;

// // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // // import { db } from "../../../config/firebase";
// // // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // // import EnquiryModal from "./EnquiryModal";
// // // // // // import TagsModal from "./TagsModal";
// // // // // // import Column from "./Column";

// // // // // // const initialColumns = {
// // // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // // };

// // // // // // const initialVisibility = {
// // // // // //   "pre-qualified": true,
// // // // // //   "qualified": true,
// // // // // //   "negotiation": true,
// // // // // //   "closed-won": true,
// // // // // //   "closed-lost": true,
// // // // // //   "contact-in-future": true,
// // // // // // };

// // // // // // const KanbanBoard = () => {
// // // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // // //   const [view, setView] = useState("kanban");
// // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // // //   const [courses, setCourses] = useState([]);
// // // // // //   const [branches, setBranches] = useState([]);
// // // // // //   const [instructors, setInstructors] = useState([]);
// // // // // //   const [owners, setOwners] = useState([]);
// // // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // // // // //   const [noteType, setNoteType] = useState("general-enquiry");
// // // // // //   const [newNote, setNewNote] = useState("");
// // // // // //   const [currentSection, setCurrentSection] = useState()
// // // // // //   const addButtonRef = useRef(null);
// // // // // //   // const [newNote, setNewNote] = useState('');
// // // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // // //   const canCreate = rolePermissions.enquiries?.create || false;

// // // // // //   if (!canDisplay) {
// // // // // //     return (
// // // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // // //         You don't have permission to view enquiries.
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   const handleViewEnquiry = (enquiry) => {
// // // // // //     setSelectedEnquiry(enquiry);
// // // // // //     setIsNotesMode(false);
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   const handleAddNotes = (enquiry) => {
// // // // // //     setSelectedEnquiry(enquiry);
// // // // // //     setNoteType("general-enquiry");
// // // // // //     setNewNote("");
// // // // // //     setIsTypePopupOpen(true);
// // // // // //   };

// // // // // //   const handleTypeSubmit = () => {
// // // // // //     if (!newNote.trim()) {
// // // // // //       alert("Please add a note before submitting.");
// // // // // //       return;
// // // // // //     }
// // // // // //     setIsTypePopupOpen(false);
// // // // // //     setIsNotesMode(true);
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     if (isNotesMode) {
// // // // // //       setCurrentSection(4); // Automatically switch to Notes section
// // // // // //     }
// // // // // //   }, [isNotesMode]);

// // // // // //   // const handleTypeSubmit = () => {
// // // // // //   //   if (!newNote.trim()) {
// // // // // //   //     alert("Please add a note before submitting.");
// // // // // //   //     return;
// // // // // //   //   }
// // // // // //   //   setIsTypePopupOpen(false);
// // // // // //   //   setIsNotesMode(true);
// // // // // //   //   setIsModalOpen(true);
// // // // // //   // };

// // // // // //   useEffect(() => {
// // // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // // //     });

// // // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // //       setCourses(coursesData);
// // // // // //     });

// // // // // //     const unsubscribeBranches = onSnapshot(
// // // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // // //       (snapshot) => {
// // // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // // //         setBranches(branchesData);
// // // // // //       }
// // // // // //     );

// // // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // //       setInstructors(instructorsData);
// // // // // //     });

// // // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // // //       setOwners(uniqueOwners);

// // // // // //       setColumns((prevColumns) => {
// // // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // // //           return acc;
// // // // // //         }, {});
// // // // // //         enquiries.forEach((enquiry) => {
// // // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // // //           if (updatedColumns[columnId]) {
// // // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // // //             const amount = Number(enquiry.amount) || 0;
// // // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // // //           }
// // // // // //         });
// // // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // // //         });
// // // // // //         return { ...updatedColumns };
// // // // // //       });
// // // // // //     });

// // // // // //     return () => {
// // // // // //       unsubscribeTags();
// // // // // //       unsubscribeCourses();
// // // // // //       unsubscribeBranches();
// // // // // //       unsubscribeInstructors();
// // // // // //       unsubscribeEnquiries();
// // // // // //     };
// // // // // //   }, [filters, searchTerm]);

// // // // // //   const filteredEnquiries = (items) => {
// // // // // //     return items.filter((enquiry) => {
// // // // // //       const matchesSearch =
// // // // // //         !searchTerm ||
// // // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // // //     });
// // // // // //   };

// // // // // //   const onDragEnd = async (result) => {
// // // // // //     const { source, destination } = result;
// // // // // //     if (!destination) return;

// // // // // //     const sourceColumn = columns[source.droppableId];
// // // // // //     const destColumn = columns[destination.droppableId];
// // // // // //     const sourceItems = [...sourceColumn.items];
// // // // // //     const destItems = [...destColumn.items];
// // // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // // //     if (source.droppableId === destination.droppableId) {
// // // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // // //     } else {
// // // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // // //       const updatedColumns = {
// // // // // //         ...columns,
// // // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // // //       };
// // // // // //       setColumns(updatedColumns);
// // // // // //       try {
// // // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // // //       } catch (error) {
// // // // // //         console.error("Error updating Firestore:", error);
// // // // // //         setColumns(columns);
// // // // // //       }
// // // // // //     }
// // // // // //   };

// // // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // // //     (enquiry) =>
// // // // // //       !searchTerm ||
// // // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // // //   );

// // // // // //   return (
// // // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // // //           <div>
// // // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // // //           </div>
// // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// // // // // //             <button
// // // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // // //             >
// // // // // //               <FaCircle className="text-gray-400" />
// // // // // //               Manage Tags
// // // // // //             </button>
// // // // // //             {canCreate && (
// // // // // //               <div className="relative" ref={addButtonRef}>
// // // // // //                 <button
// // // // // //                   onClick={() => {
// // // // // //                     setSelectedEnquiry(null);
// // // // // //                     setIsTypePopupOpen(true);
// // // // // //                   }}
// // // // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // // //                 >
// // // // // //                   + Add Enquiry
// // // // // //                 </button>
// // // // // //                 {isTypePopupOpen && addButtonRef.current && (
// // // // // //                   <div
// // // // // //                     className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
// // // // // //                     style={{
// // // // // //                       top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
// // // // // //                       right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
// // // // // //                     }}
// // // // // //                   >
// // // // // //                     <h3 className="text-lg font-semibold mb-4">Add Note</h3>
// // // // // //                     <div className="mb-4">
// // // // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
// // // // // //                       <select
// // // // // //                         value={noteType}
// // // // // //                         onChange={(e) => setNoteType(e.target.value)}
// // // // // //                         className="w-full p-2 border border-gray-300 rounded-md"
// // // // // //                       >
// // // // // //                         <option value="general-enquiry">General Enquiry</option>
// // // // // //                         <option value="call-log">Call Log</option>
// // // // // //                         <option value="call-schedule">Call Schedule</option>
// // // // // //                         <option value="office-visit">Office Visit</option>
// // // // // //                       </select>
// // // // // //                     </div>
// // // // // //                     <div className="mb-4">
// // // // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
// // // // // //                       <textarea
// // // // // //                         value={newNote}
// // // // // //                         onChange={(e) => setNewNote(e.target.value)}
// // // // // //                         placeholder="Add your note here..."
// // // // // //                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // //                         rows="4"
// // // // // //                       />
// // // // // //                     </div>
// // // // // //                     <div className="flex justify-end gap-2">
// // // // // //                       <button
// // // // // //                         onClick={() => {
// // // // // //                           setIsTypePopupOpen(false);
// // // // // //                           setNewNote("");
// // // // // //                           setNoteType("general-enquiry");
// // // // // //                         }}
// // // // // //                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // // // //                       >
// // // // // //                         Cancel
// // // // // //                       </button>
// // // // // //                       <button
// // // // // //                         onClick={handleTypeSubmit}
// // // // // //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // // //                       >
// // // // // //                         Submit
// // // // // //                       </button>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // // //             <button
// // // // // //               onClick={() => setView("kanban")}
// // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // //             >
// // // // // //               Kanban View
// // // // // //             </button>
// // // // // //             <button
// // // // // //               onClick={() => setView("list")}
// // // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // // //             >
// // // // // //               List View
// // // // // //             </button>
// // // // // //           </div>
// // // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // // //             <div className="relative w-full sm:w-64">
// // // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // // //               <input
// // // // // //                 type="text"
// // // // // //                 placeholder="Search enquiries..."
// // // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // // //                 value={searchTerm}
// // // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // //               />
// // // // // //             </div>
// // // // // //             <FiltersDropdown
// // // // // //               filters={filters}
// // // // // //               setFilters={setFilters}
// // // // // //               availableTags={availableTags}
// // // // // //               branches={branches}
// // // // // //               courses={courses}
// // // // // //               instructors={instructors}
// // // // // //               owners={owners}
// // // // // //               initialColumns={initialColumns}
// // // // // //             />
// // // // // //             {view === "kanban" && (
// // // // // //               <StageVisibilityDropdown
// // // // // //                 stageVisibility={stageVisibility}
// // // // // //                 setStageVisibility={setStageVisibility}
// // // // // //                 initialColumns={initialColumns}
// // // // // //               />
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // // //         {view === "kanban" && (
// // // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // // //               {Object.entries(columns)
// // // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // // //                 .map(([columnId, column]) => (
// // // // // //                   <Column
// // // // // //                     key={columnId}
// // // // // //                     columnId={columnId}
// // // // // //                     column={column}
// // // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // // //                     handleAddNotes={handleAddNotes}
// // // // // //                   />
// // // // // //                 ))}
// // // // // //             </div>
// // // // // //           </DragDropContext>
// // // // // //         )}
// // // // // //         {view === "list" && (
// // // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // // //             <table className="w-full text-left">
// // // // // //               <thead>
// // // // // //                 <tr className="border-b border-gray-200">
// // // // // //                   <th className="p-4">Name</th>
// // // // // //                   <th className="p-4">Amount</th>
// // // // // //                   <th className="p-4">Phone</th>
// // // // // //                   <th className="p-4">Email</th>
// // // // // //                   <th className="p-4">Stage</th>
// // // // // //                   <th className="p-4">Tags</th>
// // // // // //                 </tr>
// // // // // //               </thead>
// // // // // //               <tbody>
// // // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // // //                   <tr>
// // // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // // //                   </tr>
// // // // // //                 ) : (
// // // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // // //                     <tr
// // // // // //                       key={item.id}
// // // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // // //                       style={{ cursor: "pointer" }}
// // // // // //                     >
// // // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // // //                       <td className="p-4">
// // // // // //                         <div className="flex flex-wrap gap-2">
// // // // // //                           {item.tags?.map((tag) => (
// // // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // // //                               {tag}
// // // // // //                             </span>
// // // // // //                           ))}
// // // // // //                         </div>
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   ))
// // // // // //                 )}
// // // // // //               </tbody>
// // // // // //             </table>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //       <EnquiryModal
// // // // // //         isOpen={isModalOpen}
// // // // // //         onRequestClose={() => {
// // // // // //           setIsModalOpen(false);
// // // // // //           setSelectedEnquiry(null);
// // // // // //           setIsNotesMode(false);
// // // // // //           setNewNote(""); // Reset newNote
// // // // // //           setNoteType("general-enquiry");
// // // // // //         }}
// // // // // //         // onRequestClose={() => {
// // // // // //         //   setIsModalOpen(false);
// // // // // //         //   setSelectedEnquiry(null);
// // // // // //         //   setIsNotesMode(false);
// // // // // //         //   setNewNote("");
// // // // // //         //   newNote={newNote}
// // // // // //         //   setNewNote={setNewNote}
// // // // // //         //   // setNoteType("general-enquiry");
// // // // // //         // }}
// // // // // //         courses={courses}
// // // // // //         branches={branches}
// // // // // //         instructors={instructors}
// // // // // //         availableTags={availableTags}
// // // // // //         rolePermissions={rolePermissions}
// // // // // //         selectedEnquiry={selectedEnquiry}
// // // // // //         isNotesMode={isNotesMode}
// // // // // //         noteType={noteType}
// // // // // //         setNoteType={setNoteType}
// // // // // //         newNote={newNote}
// // // // // //         setNewNote={setNewNote}
// // // // // //       />
// // // // // //       <TagsModal
// // // // // //         isOpen={isTagsModalOpen}
// // // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // // //         availableTags={availableTags}
// // // // // //         setAvailableTags={setAvailableTags}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default KanbanBoard;


// // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // // import { db, auth } from "../../../config/firebase";
// // // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from "react-icons/fa";
// // // // // import FiltersDropdown from "./FiltersDropdown";
// // // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // // import EnquiryModal from "./EnquiryModal";
// // // // // import TagsModal from "./TagsModal";
// // // // // import Column from "./Column";

// // // // // const initialColumns = {
// // // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // // };

// // // // // const initialVisibility = {
// // // // //   "pre-qualified": true,
// // // // //   "qualified": true,
// // // // //   "negotiation": true,
// // // // //   "closed-won": true,
// // // // //   "closed-lost": true,
// // // // //   "contact-in-future": true,
// // // // // };

// // // // // const KanbanBoard = () => {
// // // // //   const [columns, setColumns] = useState(initialColumns);
// // // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // // //   const [view, setView] = useState("kanban");
// // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // // //   const [courses, setCourses] = useState([]);
// // // // //   const [branches, setBranches] = useState([]);
// // // // //   const [instructors, setInstructors] = useState([]);
// // // // //   const [owners, setOwners] = useState([]);
// // // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // // // //   const [noteType, setNoteType] = useState("general-enquiry");
// // // // //   const [newNote, setNewNote] = useState("");
// // // // //   const [currentUser, setCurrentUser] = useState(null);
// // // // //   const addButtonRef = useRef(null);

// // // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // // //   const canUpdate = rolePermissions.enquiries?.update || false;

// // // // //   useEffect(() => {
// // // // //     const unsubscribe = auth.onAuthStateChanged((user) => {
// // // // //       setCurrentUser(user);
// // // // //     });
// // // // //     return () => unsubscribe();
// // // // //   }, []);

// // // // //   if (!canDisplay) {
// // // // //     return (
// // // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // // //         You don't have permission to view enquiries.
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   const handleViewEnquiry = (enquiry) => {
// // // // //     setSelectedEnquiry(enquiry);
// // // // //     setIsNotesMode(false);
// // // // //     setIsModalOpen(true);
// // // // //   };

// // // // //   const handleAddNotes = (enquiry) => {
// // // // //     setSelectedEnquiry(enquiry);
// // // // //     setNoteType("general-enquiry");
// // // // //     setNewNote("");
// // // // //     setIsTypePopupOpen(true);
// // // // //   };

// // // // //   const handleTypeSubmit = async () => {
// // // // //     if (!newNote.trim()) {
// // // // //       alert("Please add a note before submitting.");
// // // // //       return;
// // // // //     }
// // // // //     if (!selectedEnquiry) {
// // // // //       alert("No enquiry selected to add note.");
// // // // //       return;
// // // // //     }
// // // // //     if (!canUpdate) {
// // // // //       alert("You don't have permission to update enquiries.");
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const noteObject = {
// // // // //         content: newNote,
// // // // //         type: noteType,
// // // // //         createdAt: new Date().toISOString(),
// // // // //         addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// // // // //       };

// // // // //       const enquiryRef = doc(db, "enquiries", selectedEnquiry.id);
// // // // //       const updatedNotes = [...(selectedEnquiry.notes || []), noteObject];

// // // // //       await updateDoc(enquiryRef, {
// // // // //         notes: updatedNotes,
// // // // //         updatedAt: new Date().toISOString(),
// // // // //       });

// // // // //       setIsTypePopupOpen(false);
// // // // //       setNewNote("");
// // // // //       setNoteType("general-enquiry");
// // // // //       alert("Note added successfully!");
// // // // //     } catch (error) {
// // // // //       console.error("Error adding note:", error);
// // // // //       alert(`Failed to add note: ${error.message}`);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // // //     });

// // // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // //       setCourses(coursesData);
// // // // //     });

// // // // //     const unsubscribeBranches = onSnapshot(
// // // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // // //       (snapshot) => {
// // // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // // //         setBranches(branchesData);
// // // // //       }
// // // // //     );

// // // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // //       setInstructors(instructorsData);
// // // // //     });

// // // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // // //       setOwners(uniqueOwners);

// // // // //       setColumns((prevColumns) => {
// // // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // // //           return acc;
// // // // //         }, {});
// // // // //         enquiries.forEach((enquiry) => {
// // // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // // //           if (updatedColumns[columnId]) {
// // // // //             updatedColumns[columnId].items.push(enquiry);
// // // // //             const amount = Number(enquiry.amount) || 0;
// // // // //             updatedColumns[columnId].totalAmount += amount;
// // // // //           }
// // // // //         });
// // // // //         Object.keys(updatedColumns).forEach((key) => {
// // // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // // //         });
// // // // //         return { ...updatedColumns };
// // // // //       });
// // // // //     });

// // // // //     return () => {
// // // // //       unsubscribeTags();
// // // // //       unsubscribeCourses();
// // // // //       unsubscribeBranches();
// // // // //       unsubscribeInstructors();
// // // // //       unsubscribeEnquiries();
// // // // //     };
// // // // //   }, [filters, searchTerm]);

// // // // //   const filteredEnquiries = (items) => {
// // // // //     return items.filter((enquiry) => {
// // // // //       const matchesSearch =
// // // // //         !searchTerm ||
// // // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //         enquiry.phone?.includes(searchTerm) ||
// // // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // // //     });
// // // // //   };

// // // // //   const onDragEnd = async (result) => {
// // // // //     const { source, destination } = result;
// // // // //     if (!destination) return;

// // // // //     const sourceColumn = columns[source.droppableId];
// // // // //     const destColumn = columns[destination.droppableId];
// // // // //     const sourceItems = [...sourceColumn.items];
// // // // //     const destItems = [...destColumn.items];
// // // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // // //     if (source.droppableId === destination.droppableId) {
// // // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // // //     } else {
// // // // //       destItems.splice(destination.index, 0, movedItem);
// // // // //       const updatedColumns = {
// // // // //         ...columns,
// // // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // // //       };
// // // // //       setColumns(updatedColumns);
// // // // //       try {
// // // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // // //       } catch (error) {
// // // // //         console.error("Error updating Firestore:", error);
// // // // //         setColumns(columns);
// // // // //       }
// // // // //     }
// // // // //   };
// // // // //   const canCreate = rolePermissions.enquiries?.create || false;
// // // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // // //     (enquiry) =>
// // // // //       !searchTerm ||
// // // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //       enquiry.phone?.includes(searchTerm) ||
// // // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // //   );

// // // // //   return (
// // // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // // //       <div className="p-4 sm:p-6 shrink-0">
// // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // //           <div>
// // // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // // //           </div>
// // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// // // // //             <button
// // // // //               onClick={() => setIsTagsModalOpen(true)}
// // // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // // //             >
// // // // //               <FaCircle className="text-gray-400" />
// // // // //               Manage Tags
// // // // //             </button>
// // // // //             {canCreate && (
// // // // //               <div className="relative" ref={addButtonRef}>
// // // // //                 <button
// // // // //                   onClick={() => {
// // // // //                     setSelectedEnquiry(null);
// // // // //                     setIsTypePopupOpen(true);
// // // // //                   }}
// // // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // // //                 >
// // // // //                   + Add Enquiry
// // // // //                 </button>
// // // // //                 {isTypePopupOpen && addButtonRef.current && (
// // // // //                   <div
// // // // //                     className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
// // // // //                     style={{
// // // // //                       top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
// // // // //                       right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
// // // // //                     }}
// // // // //                   >
// // // // //                     <h3 className="text-lg font-semibold mb-4">Add Note</h3>
// // // // //                     <div className="mb-4">
// // // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
// // // // //                       <select
// // // // //                         value={noteType}
// // // // //                         onChange={(e) => setNoteType(e.target.value)}
// // // // //                         className="w-full p-2 border border-gray-300 rounded-md"
// // // // //                       >
// // // // //                         <option value="general-enquiry">General Enquiry</option>
// // // // //                         <option value="call-log">Call Log</option>
// // // // //                         <option value="call-schedule">Call Schedule</option>
// // // // //                         <option value="office-visit">Office Visit</option>
// // // // //                       </select>
// // // // //                     </div>
// // // // //                     <div className="mb-4">
// // // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
// // // // //                       <textarea
// // // // //                         value={newNote}
// // // // //                         onChange={(e) => setNewNote(e.target.value)}
// // // // //                         placeholder="Add your note here..."
// // // // //                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // //                         rows="4"
// // // // //                       />
// // // // //                     </div>
// // // // //                     <div className="flex justify-end gap-2">
// // // // //                       <button
// // // // //                         onClick={() => {
// // // // //                           setIsTypePopupOpen(false);
// // // // //                           setNewNote("");
// // // // //                           setNoteType("general-enquiry");
// // // // //                         }}
// // // // //                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // // //                       >
// // // // //                         Cancel
// // // // //                       </button>
// // // // //                       <button
// // // // //                         onClick={handleTypeSubmit}
// // // // //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // //                       >
// // // // //                         Submit
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // // //             <button
// // // // //               onClick={() => setView("kanban")}
// // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // //             >
// // // // //               Kanban View
// // // // //             </button>
// // // // //             <button
// // // // //               onClick={() => setView("list")}
// // // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // // //             >
// // // // //               List View
// // // // //             </button>
// // // // //           </div>
// // // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // // //             <div className="relative w-full sm:w-64">
// // // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // // //               <input
// // // // //                 type="text"
// // // // //                 placeholder="Search enquiries..."
// // // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // // //                 value={searchTerm}
// // // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // //               />
// // // // //             </div>
// // // // //             <FiltersDropdown
// // // // //               filters={filters}
// // // // //               setFilters={setFilters}
// // // // //               availableTags={availableTags}
// // // // //               branches={branches}
// // // // //               courses={courses}
// // // // //               instructors={instructors}
// // // // //               owners={owners}
// // // // //               initialColumns={initialColumns}
// // // // //             />
// // // // //             {view === "kanban" && (
// // // // //               <StageVisibilityDropdown
// // // // //                 stageVisibility={stageVisibility}
// // // // //                 setStageVisibility={setStageVisibility}
// // // // //                 initialColumns={initialColumns}
// // // // //               />
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // // //         {view === "kanban" && (
// // // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // // //               {Object.entries(columns)
// // // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // // //                 .map(([columnId, column]) => (
// // // // //                   <Column
// // // // //                     key={columnId}
// // // // //                     columnId={columnId}
// // // // //                     column={column}
// // // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // // //                     canUpdate={rolePermissions.enquiries?.update || false}
// // // // //                     handleViewEnquiry={handleViewEnquiry}
// // // // //                     handleAddNotes={handleAddNotes}
// // // // //                   />
// // // // //                 ))}
// // // // //             </div>
// // // // //           </DragDropContext>
// // // // //         )}
// // // // //         {view === "list" && (
// // // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // // //             <table className="w-full text-left">
// // // // //               <thead>
// // // // //                 <tr className="border-b border-gray-200">
// // // // //                   <th className="p-4">Name</th>
// // // // //                   <th className="p-4">Amount</th>
// // // // //                   <th className="p-4">Phone</th>
// // // // //                   <th className="p-4">Email</th>
// // // // //                   <th className="p-4">Stage</th>
// // // // //                   <th className="p-4">Tags</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // // //                   <tr>
// // // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // // //                   </tr>
// // // // //                 ) : (
// // // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // // //                     <tr
// // // // //                       key={item.id}
// // // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // // //                       onClick={() => handleViewEnquiry(item)}
// // // // //                       style={{ cursor: "pointer" }}
// // // // //                     >
// // // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // // //                       <td className="p-4">
// // // // //                         <div className="flex flex-wrap gap-2">
// // // // //                           {item.tags?.map((tag) => (
// // // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // // //                               {tag}
// // // // //                             </span>
// // // // //                           ))}
// // // // //                         </div>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))
// // // // //                 )}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //       <EnquiryModal
// // // // //         isOpen={isModalOpen}
// // // // //         onRequestClose={() => {
// // // // //           setIsModalOpen(false);
// // // // //           setSelectedEnquiry(null);
// // // // //           setIsNotesMode(false);
// // // // //           setNewNote("");
// // // // //           setNoteType("general-enquiry");
// // // // //         }}
// // // // //         courses={courses}
// // // // //         branches={branches}
// // // // //         instructors={instructors}
// // // // //         availableTags={availableTags}
// // // // //         rolePermissions={rolePermissions}
// // // // //         selectedEnquiry={selectedEnquiry}
// // // // //         isNotesMode={isNotesMode}
// // // // //         noteType={noteType}
// // // // //         setNoteType={setNoteType}
// // // // //         newNote={newNote}
// // // // //         setNewNote={setNewNote}
// // // // //       />
// // // // //       <TagsModal
// // // // //         isOpen={isTagsModalOpen}
// // // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // // //         availableTags={availableTags}
// // // // //         setAvailableTags={setAvailableTags}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default KanbanBoard;


// // // // import React, { useEffect, useState, useRef } from "react";
// // // // import { DragDropContext } from "@hello-pangea/dnd";
// // // // import { db, auth } from "../../../config/firebase";
// // // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
// // // // import { format } from "date-fns";
// // // // import FiltersDropdown from "./FiltersDropdown";
// // // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // // import EnquiryModal from "./EnquiryModal";
// // // // import TagsModal from "./TagsModal";
// // // // import Column from "./Column";

// // // // const initialColumns = {
// // // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // // };

// // // // const initialVisibility = {
// // // //   "pre-qualified": true,
// // // //   "qualified": true,
// // // //   "negotiation": true,
// // // //   "closed-won": true,
// // // //   "closed-lost": true,
// // // //   "contact-in-future": true,
// // // // };

// // // // const KanbanBoard = () => {
// // // //   const [columns, setColumns] = useState(initialColumns);
// // // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // // //   const [view, setView] = useState("kanban");
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // // //   const [courses, setCourses] = useState([]);
// // // //   const [branches, setBranches] = useState([]);
// // // //   const [instructors, setInstructors] = useState([]);
// // // //   const [owners, setOwners] = useState([]);
// // // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // // //   const [noteType, setNoteType] = useState("general-enquiry");
// // // //   const [newNote, setNewNote] = useState("");
// // // //   const [callDuration, setCallDuration] = useState("");
// // // //   const [callType, setCallType] = useState("incoming");
// // // //   const [callTime, setCallTime] = useState("");
// // // //   const [callDate, setCallDate] = useState("");
// // // //   const [callScheduledTime, setCallScheduledTime] = useState("");
// // // //   const [showReminder, setShowReminder] = useState(false);
// // // //   const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
// // // //   const [currentUser, setCurrentUser] = useState(null);
// // // //   const addButtonRef = useRef(null);

// // // //   // Define permissions
// // // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // // //   const canCreate = rolePermissions.enquiries?.create || false;
// // // //   const canUpdate = rolePermissions.enquiries?.update || false;

// // // //   useEffect(() => {
// // // //     const unsubscribe = auth.onAuthStateChanged((user) => {
// // // //       setCurrentUser(user);
// // // //     });
// // // //     return () => unsubscribe();
// // // //   }, []);

// // // //   if (!canDisplay) {
// // // //     return (
// // // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // // //         You don't have permission to view enquiries.
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const handleViewEnquiry = (enquiry) => {
// // // //     setSelectedEnquiry(enquiry);
// // // //     setIsNotesMode(false);
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   const handleAddNotes = (enquiry) => {
// // // //     setSelectedEnquiry(enquiry);
// // // //     setNoteType("general-enquiry");
// // // //     setNewNote("");
// // // //     setCallDuration("");
// // // //     setCallType("incoming");
// // // //     setCallTime("");
// // // //     setCallDate("");
// // // //     setCallScheduledTime("");
// // // //     setIsTypePopupOpen(true);
// // // //   };

// // // //   const handleTypeSubmit = async () => {
// // // //     if (!newNote.trim()) {
// // // //       alert("Please add a note before submitting.");
// // // //       return;
// // // //     }
// // // //     if (!selectedEnquiry) {
// // // //       alert("No enquiry selected to add note.");
// // // //       return;
// // // //     }
// // // //     if (!canUpdate) {
// // // //       alert("You don't have permission to update enquiries.");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const noteObject = {
// // // //         content: newNote,
// // // //         type: noteType,
// // // //         callDuration: noteType === "call-log" ? callDuration : null,
// // // //         callType: noteType === "call-log" ? callType : null,
// // // //         callTime: noteType === "call-log" ? callTime : null,
// // // //         callDate: noteType === "call-schedule" ? callDate : null,
// // // //         callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
// // // //         createdAt: new Date().toISOString(),
// // // //         addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// // // //       };

// // // //       const enquiryRef = doc(db, "enquiries", selectedEnquiry.id);
// // // //       const updatedNotes = [...(selectedEnquiry.notes || []), noteObject];

// // // //       await updateDoc(enquiryRef, {
// // // //         notes: updatedNotes,
// // // //         updatedAt: new Date().toISOString(),
// // // //       });

// // // //       if (noteType === "call-schedule" && callDate && callScheduledTime) {
// // // //         setReminderDetails({
// // // //           name: selectedEnquiry.name || "this lead",
// // // //           date: callDate,
// // // //           time: callScheduledTime,
// // // //         });
// // // //         setShowReminder(true);
// // // //       }

// // // //       setIsTypePopupOpen(false);
// // // //       setNewNote("");
// // // //       setNoteType("general-enquiry");
// // // //       setCallDuration("");
// // // //       setCallType("incoming");
// // // //       setCallTime("");
// // // //       setCallDate("");
// // // //       setCallScheduledTime("");
// // // //       alert("Note added successfully!");
// // // //     } catch (error) {
// // // //       console.error("Error adding note:", error);
// // // //       alert(`Failed to add note: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const handleClearNote = () => {
// // // //     setNewNote("");
// // // //     setNoteType("general-enquiry");
// // // //     setCallDuration("");
// // // //     setCallType("incoming");
// // // //     setCallTime("");
// // // //     setCallDate("");
// // // //     setCallScheduledTime("");
// // // //   };

// // // //   useEffect(() => {
// // // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // // //     });

// // // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // //       setCourses(coursesData);
// // // //     });

// // // //     const unsubscribeBranches = onSnapshot(
// // // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // // //       (snapshot) => {
// // // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // // //         setBranches(branchesData);
// // // //       }
// // // //     );

// // // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // //       setInstructors(instructorsData);
// // // //     });

// // // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // // //       setOwners(uniqueOwners);

// // // //       setColumns((prevColumns) => {
// // // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // // //           return acc;
// // // //         }, {});
// // // //         enquiries.forEach((enquiry) => {
// // // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // // //           if (updatedColumns[columnId]) {
// // // //             updatedColumns[columnId].items.push(enquiry);
// // // //             const amount = Number(enquiry.amount) || 0;
// // // //             updatedColumns[columnId].totalAmount += amount;
// // // //           }
// // // //         });
// // // //         Object.keys(updatedColumns).forEach((key) => {
// // // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // // //         });
// // // //         return { ...updatedColumns };
// // // //       });
// // // //     });

// // // //     return () => {
// // // //       unsubscribeTags();
// // // //       unsubscribeCourses();
// // // //       unsubscribeBranches();
// // // //       unsubscribeInstructors();
// // // //       unsubscribeEnquiries();
// // // //     };
// // // //   }, [filters, searchTerm]);

// // // //   const filteredEnquiries = (items) => {
// // // //     return items.filter((enquiry) => {
// // // //       const matchesSearch =
// // // //         !searchTerm ||
// // // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //         enquiry.phone?.includes(searchTerm) ||
// // // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // // //     });
// // // //   };

// // // //   const onDragEnd = async (result) => {
// // // //     const { source, destination } = result;
// // // //     if (!destination) return;

// // // //     const sourceColumn = columns[source.droppableId];
// // // //     const destColumn = columns[destination.droppableId];
// // // //     const sourceItems = [...sourceColumn.items];
// // // //     const destItems = [...destColumn.items];
// // // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // // //     if (source.droppableId === destination.droppableId) {
// // // //       sourceItems.splice(destination.index, 0, movedItem);
// // // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // // //     } else {
// // // //       destItems.splice(destination.index, 0, movedItem);
// // // //       const updatedColumns = {
// // // //         ...columns,
// // // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // // //       };
// // // //       setColumns(updatedColumns);
// // // //       try {
// // // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // // //         await updateDoc(enquiryRef, { stage: destination.droppableId });
// // // //       } catch (error) {
// // // //         console.error("Error updating Firestore:", error);
// // // //         setColumns(columns);
// // // //       }
// // // //     }
// // // //   };

// // // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // // //     (enquiry) =>
// // // //       !searchTerm ||
// // // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //       enquiry.phone?.includes(searchTerm) ||
// // // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // // //   );

// // // //   return (
// // // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // // //       <div className="p-4 sm:p-6 shrink-0">
// // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // //           <div>
// // // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // // //           </div>
// // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// // // //             <button
// // // //               onClick={() => setIsTagsModalOpen(true)}
// // // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // // //             >
// // // //               <FaCircle className="text-gray-400" />
// // // //               Manage Tags
// // // //             </button>
// // // //             {canCreate && (
// // // //               <div className="relative" ref={addButtonRef}>
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     setSelectedEnquiry(null);
// // // //                     setIsModalOpen(true);
// // // //                   }}
// // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // // //                 >
// // // //                   + Add Enquiry
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // // //           <div className="flex gap-2 w-full sm:w-auto">
// // // //             <button
// // // //               onClick={() => setView("kanban")}
// // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // //             >
// // // //               Kanban View
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setView("list")}
// // // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // // //             >
// // // //               List View
// // // //             </button>
// // // //           </div>
// // // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // // //             <div className="relative w-full sm:w-64">
// // // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Search enquiries..."
// // // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //                 value={searchTerm}
// // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // //               />
// // // //             </div>
// // // //             <FiltersDropdown
// // // //               filters={filters}
// // // //               setFilters={setFilters}
// // // //               availableTags={availableTags}
// // // //               branches={branches}
// // // //               courses={courses}
// // // //               instructors={instructors}
// // // //               owners={owners}
// // // //               initialColumns={initialColumns}
// // // //             />
// // // //             {view === "kanban" && (
// // // //               <StageVisibilityDropdown
// // // //                 stageVisibility={stageVisibility}
// // // //                 setStageVisibility={setStageVisibility}
// // // //                 initialColumns={initialColumns}
// // // //               />
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // // //         {view === "kanban" && (
// // // //           <DragDropContext onDragEnd={onDragEnd}>
// // // //             <div className="flex overflow-x-auto gap-4 h-full">
// // // //               {Object.entries(columns)
// // // //                 .filter(([columnId]) => stageVisibility[columnId])
// // // //                 .map(([columnId, column]) => (
// // // //                   <Column
// // // //                     key={columnId}
// // // //                     columnId={columnId}
// // // //                     column={column}
// // // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // // //                     canUpdate={canUpdate}
// // // //                     handleViewEnquiry={handleViewEnquiry}
// // // //                     handleAddNotes={handleAddNotes}
// // // //                   />
// // // //                 ))}
// // // //             </div>
// // // //           </DragDropContext>
// // // //         )}
// // // //         {view === "list" && (
// // // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // // //             <table className="w-full text-left">
// // // //               <thead>
// // // //                 <tr className="border-b border-gray-200">
// // // //                   <th className="p-4">Name</th>
// // // //                   <th className="p-4">Amount</th>
// // // //                   <th className="p-4">Phone</th>
// // // //                   <th className="p-4">Email</th>
// // // //                   <th className="p-4">Stage</th>
// // // //                   <th className="p-4">Tags</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // // //                   <tr>
// // // //                     <td colSpan="6" className="p-4 text-center text-gray-500">No enquiries found</td>
// // // //                   </tr>
// // // //                 ) : (
// // // //                   filteredEnquiries(allEnquiries).map((item) => (
// // // //                     <tr
// // // //                       key={item.id}
// // // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // // //                       onClick={() => handleViewEnquiry(item)}
// // // //                       style={{ cursor: "pointer" }}
// // // //                     >
// // // //                       <td className="p-4 truncate">{item.name || "Unnamed"}</td>
// // // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // // //                       <td className="p-4 truncate">{item.phone || "No phone"}</td>
// // // //                       <td className="p-4 truncate">{item.email || "No email"}</td>
// // // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // // //                       <td className="p-4">
// // // //                         <div className="flex flex-wrap gap-2">
// // // //                           {item.tags?.map((tag) => (
// // // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // // //                               <FaCircle className="text-orange-500 text-xs" />
// // // //                               {tag}
// // // //                             </span>
// // // //                           ))}
// // // //                         </div>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //       <EnquiryModal
// // // //         isOpen={isModalOpen}
// // // //         onRequestClose={() => {
// // // //           setIsModalOpen(false);
// // // //           setSelectedEnquiry(null);
// // // //           setIsNotesMode(false);
// // // //           setNewNote("");
// // // //           setNoteType("general-enquiry");
// // // //         }}
// // // //         courses={courses}
// // // //         branches={branches}
// // // //         instructors={instructors}
// // // //         availableTags={availableTags}
// // // //         rolePermissions={rolePermissions}
// // // //         selectedEnquiry={selectedEnquiry}
// // // //         isNotesMode={isNotesMode}
// // // //         noteType={noteType}
// // // //         setNoteType={setNoteType}
// // // //         newNote={newNote}
// // // //         setNewNote={setNewNote}
// // // //       />
// // // //       <TagsModal
// // // //         isOpen={isTagsModalOpen}
// // // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // // //         availableTags={availableTags}
// // // //         setAvailableTags={setAvailableTags}
// // // //       />
// // // //       {isTypePopupOpen && addButtonRef.current && (
// // // //         <div
// // // //           className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
// // // //           style={{
// // // //             top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
// // // //             right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
// // // //           }}
// // // //         >
// // // //           <h3 className="text-lg font-semibold mb-4">Add Note</h3>
// // // //           <div className="mb-4">
// // // //             <label className="block text-sm font-medium text-gray-700">Note Type</label>
// // // //             <select
// // // //               value={noteType}
// // // //               onChange={(e) => setNoteType(e.target.value)}
// // // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //             >
// // // //               <option value="general-enquiry">General Enquiry</option>
// // // //               <option value="call-log">Call Log</option>
// // // //               <option value="call-schedule">Call Schedule</option>
// // // //               <option value="office-visit">Office Visit</option>
// // // //             </select>
// // // //           </div>
// // // //           {noteType === "call-log" && (
// // // //             <div className="space-y-4 mb-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
// // // //                 <input
// // // //                   type="number"
// // // //                   value={callDuration}
// // // //                   onChange={(e) => setCallDuration(e.target.value)}
// // // //                   placeholder="Enter call duration"
// // // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //                   min="0"
// // // //                   step="1"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700">Call Type</label>
// // // //                 <select
// // // //                   value={callType}
// // // //                   onChange={(e) => setCallType(e.target.value)}
// // // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //                 >
// // // //                   <option value="incoming">Incoming</option>
// // // //                   <option value="outgoing">Outgoing</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
// // // //                 <input
// // // //                   type="time"
// // // //                   value={callTime}
// // // //                   onChange={(e) => setCallTime(e.target.value)}
// // // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           {noteType === "call-schedule" && (
// // // //             <div className="space-y-4 mb-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700">Call Date</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={callDate}
// // // //                   onChange={(e) => setCallDate(e.target.value)}
// // // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
// // // //                 <input
// // // //                   type="time"
// // // //                   value={callScheduledTime}
// // // //                   onChange={(e) => setCallScheduledTime(e.target.value)}
// // // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           <div className="mb-4">
// // // //             <label className="block text-sm font-medium text-gray-700">Note</label>
// // // //             <textarea
// // // //               value={newNote}
// // // //               onChange={(e) => setNewNote(e.target.value)}
// // // //               placeholder="Add your note here..."
// // // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //               rows="4"
// // // //             />
// // // //           </div>
// // // //           <div className="flex justify-end gap-2">
// // // //             <button
// // // //               onClick={handleClearNote}
// // // //               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // //             >
// // // //               Clear
// // // //             </button>
// // // //             <button
// // // //               onClick={handleTypeSubmit}
// // // //               disabled={!canUpdate || !newNote?.trim()}
// // // //               className={`px-4 py-2 rounded-md ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
// // // //             >
// // // //               Add Note
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //       {showReminder && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// // // //             <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
// // // //             <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong> in 10 minutes:</p>
// // // //             <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
// // // //             <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
// // // //             <button
// // // //               onClick={() => setShowReminder(false)}
// // // //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // // //             >
// // // //               Dismiss
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //       {/* {
// // // //          */}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default KanbanBoard;




// // // import React, { useEffect, useState, useRef } from "react";
// // // import { DragDropContext } from "@hello-pangea/dnd";
// // // import { db, auth } from "../../../config/firebase";
// // // import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
// // // import { format } from "date-fns";
// // // import FiltersDropdown from "./FiltersDropdown";
// // // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // // import EnquiryModal from "./EnquiryModal";
// // // import TagsModal from "./TagsModal";
// // // import Column from "./Column";

// // // const initialColumns = {
// // //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// // //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// // //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// // //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// // //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// // //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // // };

// // // const initialVisibility = {
// // //   "pre-qualified": true,
// // //   "qualified": true,
// // //   "negotiation": true,
// // //   "closed-won": true,
// // //   "closed-lost": true,
// // //   "contact-in-future": true,
// // // };

// // // const KanbanBoard = () => {
// // //   const [columns, setColumns] = useState(initialColumns);
// // //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// // //   const [view, setView] = useState("kanban");
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// // //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// // //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// // //   const [courses, setCourses] = useState([]);
// // //   const [branches, setBranches] = useState([]);
// // //   const [instructors, setInstructors] = useState([]);
// // //   const [owners, setOwners] = useState([]);
// // //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// // //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// // //   const [isNotesMode, setIsNotesMode] = useState(false);
// // //   const [noteType, setNoteType] = useState("general-enquiry");
// // //   const [newNote, setNewNote] = useState("");
// // //   const [callDuration, setCallDuration] = useState("");
// // //   const [callType, setCallType] = useState("incoming");
// // //   const [callTime, setCallTime] = useState("");
// // //   const [callDate, setCallDate] = useState("");
// // //   const [callScheduledTime, setCallScheduledTime] = useState("");
// // //   const [showReminder, setShowReminder] = useState(false);
// // //   const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
// // //   const [currentUser, setCurrentUser] = useState(null);
// // //   const addButtonRef = useRef(null);

// // //   // Define permissions
// // //   const canDisplay = rolePermissions.enquiries?.display || false;
// // //   const canCreate = rolePermissions.enquiries?.create || false;
// // //   const canUpdate = rolePermissions.enquiries?.update || false;

// // //   useEffect(() => {
// // //     const unsubscribe = auth.onAuthStateChanged((user) => {
// // //       setCurrentUser(user);
// // //     });
// // //     return () => unsubscribe();
// // //   }, []);

// // //   // Utility function to format dates safely
// // //   const formatDateSafely = (dateString, formatString) => {
// // //     if (!dateString) return "Not available";
// // //     const date = new Date(dateString);
// // //     if (isNaN(date.getTime())) return "Not available";
// // //     return format(date, formatString);
// // //   };

// // //   // Utility function to render fields with fallback
// // //   const renderField = (value, placeholder = "Not provided") => {
// // //     return value || placeholder;
// // //   };

// // //   if (!canDisplay) {
// // //     return (
// // //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// // //         You don't have permission to view enquiries.
// // //       </div>
// // //     );
// // //   }

// // //   const handleViewEnquiry = (enquiry) => {
// // //     setSelectedEnquiry(enquiry);
// // //     setIsNotesMode(false);
// // //     setIsModalOpen(true);
// // //   };

// // //   const handleAddNotes = (enquiry) => {
// // //     setSelectedEnquiry(enquiry);
// // //     setNoteType("general-enquiry");
// // //     setNewNote("");
// // //     setCallDuration("");
// // //     setCallType("incoming");
// // //     setCallTime("");
// // //     setCallDate("");
// // //     setCallScheduledTime("");
// // //     setIsTypePopupOpen(true);
// // //   };

// // //   const handleTypeSubmit = async () => {
// // //     if (!newNote.trim()) {
// // //       alert("Please add a note before submitting.");
// // //       return;
// // //     }
// // //     if (!selectedEnquiry) {
// // //       alert("No enquiry selected to add note.");
// // //       return;
// // //     }
// // //     if (!canUpdate) {
// // //       alert("You don't have permission to update enquiries.");
// // //       return;
// // //     }

// // //     try {
// // //       const noteObject = {
// // //         content: newNote,
// // //         type: noteType,
// // //         callDuration: noteType === "call-log" ? callDuration : null,
// // //         callType: noteType === "call-log" ? callType : null,
// // //         callTime: noteType === "call-log" ? callTime : null,
// // //         callDate: noteType === "call-schedule" ? callDate : null,
// // //         callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
// // //         createdAt: new Date().toISOString(),
// // //         addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// // //       };

// // //       const enquiryRef = doc(db, "enquiries", selectedEnquiry.id);
// // //       const updatedNotes = [...(selectedEnquiry.notes || []), noteObject];
// // //       const historyEntry = {
// // //         action: `Added ${noteType.replace(/-/g, " ").toLowerCase()} note: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
// // //         performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// // //         timestamp: new Date().toISOString(),
// // //       };
// // //       const updatedHistory = [...(selectedEnquiry.history || []), historyEntry];

// // //       await updateDoc(enquiryRef, {
// // //         notes: updatedNotes,
// // //         history: updatedHistory,
// // //         updatedAt: new Date().toISOString(),
// // //       });

// // //       if (noteType === "call-schedule" && callDate && callScheduledTime) {
// // //         setReminderDetails({
// // //           name: selectedEnquiry.name || "this lead",
// // //           date: callDate,
// // //           time: callScheduledTime,
// // //         });
// // //         setShowReminder(true);
// // //       }

// // //       setIsTypePopupOpen(false);
// // //       setNewNote("");
// // //       setNoteType("general-enquiry");
// // //       setCallDuration("");
// // //       setCallType("incoming");
// // //       setCallTime("");
// // //       setCallDate("");
// // //       setCallScheduledTime("");
// // //       alert("Note added successfully!");
// // //     } catch (error) {
// // //       console.error("Error adding note:", error);
// // //       alert(`Failed to add note: ${error.message}`);
// // //     }
// // //   };

// // //   const handleClearNote = () => {
// // //     setNewNote("");
// // //     setNoteType("general-enquiry");
// // //     setCallDuration("");
// // //     setCallType("incoming");
// // //     setCallTime("");
// // //     setCallDate("");
// // //     setCallScheduledTime("");
// // //   };

// // //   useEffect(() => {
// // //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// // //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// // //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// // //     });

// // //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// // //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //       setCourses(coursesData);
// // //     });

// // //     const unsubscribeBranches = onSnapshot(
// // //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// // //       (snapshot) => {
// // //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// // //         setBranches(branchesData);
// // //       }
// // //     );

// // //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// // //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //       setInstructors(instructorsData);
// // //     });

// // //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// // //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// // //       setOwners(uniqueOwners);

// // //       setColumns((prevColumns) => {
// // //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// // //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// // //           return acc;
// // //         }, {});
// // //         enquiries.forEach((enquiry) => {
// // //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// // //           if (updatedColumns[columnId]) {
// // //             updatedColumns[columnId].items.push(enquiry);
// // //             const amount = Number(enquiry.amount) || 0;
// // //             updatedColumns[columnId].totalAmount += amount;
// // //           }
// // //         });
// // //         Object.keys(updatedColumns).forEach((key) => {
// // //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// // //         });
// // //         return { ...updatedColumns };
// // //       });
// // //     });

// // //     return () => {
// // //       unsubscribeTags();
// // //       unsubscribeCourses();
// // //       unsubscribeBranches();
// // //       unsubscribeInstructors();
// // //       unsubscribeEnquiries();
// // //     };
// // //   }, [filters, searchTerm]);

// // //   const filteredEnquiries = (items) => {
// // //     return items.filter((enquiry) => {
// // //       const matchesSearch =
// // //         !searchTerm ||
// // //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         enquiry.phone?.includes(searchTerm) ||
// // //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// // //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// // //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// // //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// // //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// // //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// // //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// // //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// // //     });
// // //   };

// // //   const onDragEnd = async (result) => {
// // //     const { source, destination } = result;
// // //     if (!destination) return;

// // //     const sourceColumn = columns[source.droppableId];
// // //     const destColumn = columns[destination.droppableId];
// // //     const sourceItems = [...sourceColumn.items];
// // //     const destItems = [...destColumn.items];
// // //     const [movedItem] = sourceItems.splice(source.index, 1);

// // //     if (source.droppableId === destination.droppableId) {
// // //       sourceItems.splice(destination.index, 0, movedItem);
// // //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// // //     } else {
// // //       destItems.splice(destination.index, 0, movedItem);
// // //       const updatedColumns = {
// // //         ...columns,
// // //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// // //         [destination.droppableId]: { ...destColumn, items: destItems },
// // //       };
// // //       setColumns(updatedColumns);
// // //       try {
// // //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// // //         const historyEntry = {
// // //           action: `Changed stage to ${initialColumns[destination.droppableId].name}`,
// // //           performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// // //           timestamp: new Date().toISOString(),
// // //         };
// // //         await updateDoc(enquiryRef, {
// // //           stage: destination.droppableId,
// // //           history: [...(movedItem.history || []), historyEntry],
// // //           updatedAt: new Date().toISOString(),
// // //         });
// // //       } catch (error) {
// // //         console.error("Error updating Firestore:", error);
// // //         setColumns(columns);
// // //       }
// // //     }
// // //   };

// // //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// // //     (enquiry) =>
// // //       !searchTerm ||
// // //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       enquiry.phone?.includes(searchTerm) ||
// // //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// // //   );

// // //   // Function to get the last updater from history
// // //   const getLastUpdater = (enquiry) => {
// // //     if (enquiry.history && enquiry.history.length > 0) {
// // //       const latestEntry = enquiry.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
// // //       return latestEntry.performedBy;
// // //     }
// // //     return enquiry.createdBy || "Unknown User";
// // //   };

// // //   return (
// // //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// // //       <div className="p-4 sm:p-6 shrink-0">
// // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // //           <div>
// // //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// // //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// // //           </div>
// // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// // //             <button
// // //               onClick={() => setIsTagsModalOpen(true)}
// // //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // //             >
// // //               <FaCircle className="text-gray-400" />
// // //               Manage Tags
// // //             </button>
// // //             {canCreate && (
// // //               <div className="relative" ref={addButtonRef}>
// // //                 <button
// // //                   onClick={() => {
// // //                     setSelectedEnquiry(null);
// // //                     setIsModalOpen(true);
// // //                   }}
// // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// // //                 >
// // //                   + Add Enquiry
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // //           <div className="flex gap-2 w-full sm:w-auto">
// // //             <button
// // //               onClick={() => setView("kanban")}
// // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // //             >
// // //               Kanban View
// // //             </button>
// // //             <button
// // //               onClick={() => setView("list")}
// // //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// // //             >
// // //               List View
// // //             </button>
// // //           </div>
// // //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// // //             <div className="relative w-full sm:w-64">
// // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search enquiries..."
// // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //               />
// // //             </div>
// // //             <FiltersDropdown
// // //               filters={filters}
// // //               setFilters={setFilters}
// // //               availableTags={availableTags}
// // //               branches={branches}
// // //               courses={courses}
// // //               instructors={instructors}
// // //               owners={owners}
// // //               initialColumns={initialColumns}
// // //             />
// // //             {view === "kanban" && (
// // //               <StageVisibilityDropdown
// // //                 stageVisibility={stageVisibility}
// // //                 setStageVisibility={setStageVisibility}
// // //                 initialColumns={initialColumns}
// // //               />
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// // //         {view === "kanban" && (
// // //           <DragDropContext onDragEnd={onDragEnd}>
// // //             <div className="flex overflow-x-auto gap-4 h-full">
// // //               {Object.entries(columns)
// // //                 .filter(([columnId]) => stageVisibility[columnId])
// // //                 .map(([columnId, column]) => (
// // //                   <Column
// // //                     key={columnId}
// // //                     columnId={columnId}
// // //                     column={column}
// // //                     filteredEnquiries={filteredEnquiries(column.items)}
// // //                     canUpdate={canUpdate}
// // //                     handleViewEnquiry={handleViewEnquiry}
// // //                     handleAddNotes={handleAddNotes}
// // //                   />
// // //                 ))}
// // //             </div>
// // //           </DragDropContext>
// // //         )}
// // //         {view === "list" && (
// // //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// // //             <table className="w-full text-left">
// // //               <thead>
// // //                 <tr className="border-b border-gray-200">
// // //                   <th className="p-4">Name</th>
// // //                   <th className="p-4">Amount</th>
// // //                   <th className="p-4">Phone</th>
// // //                   <th className="p-4">Email</th>
// // //                   <th className="p-4">Stage</th>
// // //                   <th className="p-4">Tags</th>
// // //                   <th className="p-4">Created At</th>
// // //                   <th className="p-4">Created By</th>
// // //                   <th className="p-4">Last Updated At</th>
// // //                   <th className="p-4">Last Updated By</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan="10" className="p-4 text-center text-gray-500">No enquiries found</td>
// // //                   </tr>
// // //                 ) : (
// // //                   filteredEnquiries(allEnquiries).map((item) => (
// // //                     <tr
// // //                       key={item.id}
// // //                       className="border-b border-gray-200 hover:bg-gray-50"
// // //                       onClick={() => handleViewEnquiry(item)}
// // //                       style={{ cursor: "pointer" }}
// // //                     >
// // //                       <td className="p-4 truncate max-w-[150px]">{item.name || "Unnamed"}</td>
// // //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// // //                       <td className="p-4 truncate max-w-[120px]">{item.phone || "No phone"}</td>
// // //                       <td className="p-4 truncate max-w-[200px]">{item.email || "No email"}</td>
// // //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// // //                       <td className="p-4">
// // //                         <div className="flex flex-wrap gap-2">
// // //                           {item.tags?.map((tag) => (
// // //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // //                               <FaCircle className="text-orange-500 text-xs" />
// // //                               {tag}
// // //                             </span>
// // //                           ))}
// // //                         </div>
// // //                       </td>
// // //                       <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.createdAt, "MMM d, yyyy h:mm a")}</td>
// // //                       <td className="p-4 truncate max-w-[150px]">{renderField(item.createdBy)}</td>
// // //                       <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.updatedAt, "MMM d, yyyy h:mm a")}</td>
// // //                       <td className="p-4 truncate max-w-[150px]">{renderField(getLastUpdater(item))}</td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}
// // //       </div>
// // //       <EnquiryModal
// // //         isOpen={isModalOpen}
// // //         onRequestClose={() => {
// // //           setIsModalOpen(false);
// // //           setSelectedEnquiry(null);
// // //           setIsNotesMode(false);
// // //           setNewNote("");
// // //           setNoteType("general-enquiry");
// // //         }}
// // //         courses={courses}
// // //         branches={branches}
// // //         instructors={instructors}
// // //         availableTags={availableTags}
// // //         rolePermissions={rolePermissions}
// // //         selectedEnquiry={selectedEnquiry}
// // //         isNotesMode={isNotesMode}
// // //         noteType={noteType}
// // //         setNoteType={setNoteType}
// // //         newNote={newNote}
// // //         setNewNote={setNewNote}
// // //       />
// // //       <TagsModal
// // //         isOpen={isTagsModalOpen}
// // //         onRequestClose={() => setIsTagsModalOpen(false)}
// // //         availableTags={availableTags}
// // //         setAvailableTags={setAvailableTags}
// // //       />
// // //       {isTypePopupOpen && addButtonRef.current && (
// // //         <div
// // //           className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
// // //           style={{
// // //             top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
// // //             right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
// // //           }}
// // //         >
// // //           <h3 className="text-lg font-semibold mb-4">Add Note</h3>
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Note Type</label>
// // //             <select
// // //               value={noteType}
// // //               onChange={(e) => setNoteType(e.target.value)}
// // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //             >
// // //               <option value="general-enquiry">General Enquiry</option>
// // //               <option value="call-log">Call Log</option>
// // //               <option value="call-schedule">Call Schedule</option>
// // //               <option value="office-visit">Office Visit</option>
// // //             </select>
// // //           </div>
// // //           {noteType === "call-log" && (
// // //             <div className="space-y-4 mb-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
// // //                 <input
// // //                   type="number"
// // //                   value={callDuration}
// // //                   onChange={(e) => setCallDuration(e.target.value)}
// // //                   placeholder="Enter call duration"
// // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //                   min="0"
// // //                   step="1"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700">Call Type</label>
// // //                 <select
// // //                   value={callType}
// // //                   onChange={(e) => setCallType(e.target.value)}
// // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //                 >
// // //                   <option value="incoming">Incoming</option>
// // //                   <option value="outgoing">Outgoing</option>
// // //                 </select>
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
// // //                 <input
// // //                   type="time"
// // //                   value={callTime}
// // //                   onChange={(e) => setCallTime(e.target.value)}
// // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}
// // //           {noteType === "call-schedule" && (
// // //             <div className="space-y-4 mb-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700">Call Date</label>
// // //                 <input
// // //                   type="date"
// // //                   value={callDate}
// // //                   onChange={(e) => setCallDate(e.target.value)}
// // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
// // //                 <input
// // //                   type="time"
// // //                   value={callScheduledTime}
// // //                   onChange={(e) => setCallScheduledTime(e.target.value)}
// // //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Note</label>
// // //             <textarea
// // //               value={newNote}
// // //               onChange={(e) => setNewNote(e.target.value)}
// // //               placeholder="Add your note here..."
// // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //               rows="4"
// // //             />
// // //           </div>
// // //           <div className="flex justify-end gap-2">
// // //             <button
// // //               onClick={handleClearNote}
// // //               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // //             >
// // //               Clear
// // //             </button>
// // //             <button
// // //               onClick={handleTypeSubmit}
// // //               disabled={!canUpdate || !newNote?.trim()}
// // //               className={`px-4 py-2 rounded-md ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
// // //             >
// // //               Add Note
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {showReminder && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// // //             <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
// // //             <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong> in 10 minutes:</p>
// // //             <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
// // //             <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
// // //             <button
// // //               onClick={() => setShowReminder(false)}
// // //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //             >
// // //               Dismiss
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default KanbanBoard;



// // import React, { useEffect, useState, useRef } from "react";
// // import { DragDropContext } from "@hello-pangea/dnd";
// // import { db, auth } from "../../../config/firebase";
// // import { collection, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";
// // import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
// // import { format } from "date-fns";
// // import FiltersDropdown from "./FiltersDropdown";
// // import StageVisibilityDropdown from "./StageVisibilityDropdown";
// // import EnquiryModal from "./EnquiryModal";
// // import TagsModal from "./TagsModal";
// // import Column from "./Column";

// // const initialColumns = {
// //   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
// //   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
// //   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
// //   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
// //   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
// //   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// // };

// // const initialVisibility = {
// //   "pre-qualified": true,
// //   "qualified": true,
// //   "negotiation": true,
// //   "closed-won": true,
// //   "closed-lost": true,
// //   "contact-in-future": true,
// // };

// // const KanbanBoard = () => {
// //   const [columns, setColumns] = useState(initialColumns);
// //   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
// //   const [view, setView] = useState("kanban");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
// //   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
// //   const [isEnquiryTypeModalOpen, setIsEnquiryTypeModalOpen] = useState(false);
// //   const [isBulkEnquiryModalOpen, setIsBulkEnquiryModalOpen] = useState(false);
// //   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
// //   const [courses, setCourses] = useState([]);
// //   const [branches, setBranches] = useState([]);
// //   const [instructors, setInstructors] = useState([]);
// //   const [owners, setOwners] = useState([]);
// //   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// //   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
// //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// //   const [isNotesMode, setIsNotesMode] = useState(false);
// //   const [noteType, setNoteType] = useState("general-enquiry");
// //   const [newNote, setNewNote] = useState("");
// //   const [callDuration, setCallDuration] = useState("");
// //   const [callType, setCallType] = useState("incoming");
// //   const [callTime, setCallTime] = useState("");
// //   const [callDate, setCallDate] = useState("");
// //   const [callScheduledTime, setCallScheduledTime] = useState("");
// //   const [showReminder, setShowReminder] = useState(false);
// //   const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [bulkEnquiries, setBulkEnquiries] = useState([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
// //   const addButtonRef = useRef(null);

// //   // Define permissions
// //   const canDisplay = rolePermissions.enquiries?.display || false;
// //   const canCreate = rolePermissions.enquiries?.create || false;
// //   const canUpdate = rolePermissions.enquiries?.update || false;

// //   useEffect(() => {
// //     const unsubscribe = auth.onAuthStateChanged((user) => {
// //       setCurrentUser(user);
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   // Utility function to format dates safely
// //   const formatDateSafely = (dateString, formatString) => {
// //     if (!dateString) return "Not available";
// //     const date = new Date(dateString);
// //     if (isNaN(date.getTime())) return "Not available";
// //     return format(date, formatString);
// //   };

// //   // Utility function to render fields with fallback
// //   const renderField = (value, placeholder = "Not provided") => {
// //     return value || placeholder;
// //   };

// //   if (!canDisplay) {
// //     return (
// //       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
// //         You don't have permission to view enquiries.
// //       </div>
// //     );
// //   }

// //   const handleViewEnquiry = (enquiry) => {
// //     setSelectedEnquiry(enquiry);
// //     setIsNotesMode(false);
// //     setIsModalOpen(true);
// //   };

// //   const handleAddNotes = (enquiry) => {
// //     setSelectedEnquiry(enquiry);
// //     setNoteType("general-enquiry");
// //     setNewNote("");
// //     setCallDuration("");
// //     setCallType("incoming");
// //     setCallTime("");
// //     setCallDate("");
// //     setCallScheduledTime("");
// //     setIsTypePopupOpen(true);
// //   };

// //   const handleTypeSubmit = async () => {
// //     if (!newNote.trim()) {
// //       alert("Please add a note before submitting.");
// //       return;
// //     }
// //     if (!selectedEnquiry) {
// //       alert("No enquiry selected to add note.");
// //       return;
// //     }
// //     if (!canUpdate) {
// //       alert("You don't have permission to update enquiries.");
// //       return;
// //     }

// //     try {
// //       const noteObject = {
// //         content: newNote,
// //         type: noteType,
// //         callDuration: noteType === "call-log" ? callDuration : null,
// //         callType: noteType === "call-log" ? callType : null,
// //         callTime: noteType === "call-log" ? callTime : null,
// //         callDate: noteType === "call-schedule" ? callDate : null,
// //         callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
// //         createdAt: new Date().toISOString(),
// //         addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// //       };

// //       const enquiryRef = doc(db, "enquiries", selectedEnquiry.id);
// //       const updatedNotes = [...(selectedEnquiry.notes || []), noteObject];
// //       const historyEntry = {
// //         action: `Added ${noteType.replace(/-/g, " ").toLowerCase()} note: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
// //         performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //       };
// //       const updatedHistory = [...(selectedEnquiry.history || []), historyEntry];

// //       await updateDoc(enquiryRef, {
// //         notes: updatedNotes,
// //         history: updatedHistory,
// //         updatedAt: new Date().toISOString(),
// //       });

// //       if (noteType === "call-schedule" && callDate && callScheduledTime) {
// //         setReminderDetails({
// //           name: selectedEnquiry.name || "this lead",
// //           date: callDate,
// //           time: callScheduledTime,
// //         });
// //         setShowReminder(true);
// //       }

// //       setIsTypePopupOpen(false);
// //       setNewNote("");
// //       setNoteType("general-enquiry");
// //       setCallDuration("");
// //       setCallType("incoming");
// //       setCallTime("");
// //       setCallDate("");
// //       setCallScheduledTime("");
// //       alert("Note added successfully!");
// //     } catch (error) {
// //       console.error("Error adding note:", error);
// //       alert(`Failed to add note: ${error.message}`);
// //     }
// //   };

// //   const handleClearNote = () => {
// //     setNewNote("");
// //     setNoteType("general-enquiry");
// //     setCallDuration("");
// //     setCallType("incoming");
// //     setCallTime("");
// //     setCallDate("");
// //     setCallScheduledTime("");
// //   };

// //   useEffect(() => {
// //     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
// //       const tagsData = snapshot.docs.map((doc) => doc.data().name);
// //       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
// //     });

// //     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
// //       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setCourses(coursesData);
// //     });

// //     const unsubscribeBranches = onSnapshot(
// //       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
// //       (snapshot) => {
// //         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
// //         setBranches(branchesData);
// //       }
// //     );

// //     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
// //       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setInstructors(instructorsData);
// //     });

// //     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
// //       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
// //       setOwners(uniqueOwners);

// //       setColumns((prevColumns) => {
// //         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
// //           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
// //           return acc;
// //         }, {});
// //         enquiries.forEach((enquiry) => {
// //           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
// //           if (updatedColumns[columnId]) {
// //             updatedColumns[columnId].items.push(enquiry);
// //             const amount = Number(enquiry.amount) || 0;
// //             updatedColumns[columnId].totalAmount += amount;
// //           }
// //         });
// //         Object.keys(updatedColumns).forEach((key) => {
// //           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
// //         });
// //         return { ...updatedColumns };
// //       });
// //     });

// //     return () => {
// //       unsubscribeTags();
// //       unsubscribeCourses();
// //       unsubscribeBranches();
// //       unsubscribeInstructors();
// //       unsubscribeEnquiries();
// //     };
// //   }, [filters, searchTerm]);

// //   const filteredEnquiries = (items) => {
// //     return items.filter((enquiry) => {
// //       const matchesSearch =
// //         !searchTerm ||
// //         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         enquiry.phone?.includes(searchTerm) ||
// //         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
// //       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
// //       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
// //       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
// //       const matchesCourse = !filters.course || enquiry.course === filters.course;
// //       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
// //       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
// //       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
// //     });
// //   };

// //   const onDragEnd = async (result) => {
// //     const { source, destination } = result;
// //     if (!destination) return;

// //     const sourceColumn = columns[source.droppableId];
// //     const destColumn = columns[destination.droppableId];
// //     const sourceItems = [...sourceColumn.items];
// //     const destItems = [...destColumn.items];
// //     const [movedItem] = sourceItems.splice(source.index, 1);

// //     if (source.droppableId === destination.droppableId) {
// //       sourceItems.splice(destination.index, 0, movedItem);
// //       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
// //     } else {
// //       destItems.splice(destination.index, 0, movedItem);
// //       const updatedColumns = {
// //         ...columns,
// //         [source.droppableId]: { ...sourceColumn, items: sourceItems },
// //         [destination.droppableId]: { ...destColumn, items: destItems },
// //       };
// //       setColumns(updatedColumns);
// //       try {
// //         const enquiryRef = doc(db, "enquiries", movedItem.id);
// //         const historyEntry = {
// //           action: `Changed stage to ${initialColumns[destination.droppableId].name}`,
// //           performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
// //           timestamp: new Date().toISOString(),
// //         };
// //         await updateDoc(enquiryRef, {
// //           stage: destination.droppableId,
// //           history: [...(movedItem.history || []), historyEntry],
// //           updatedAt: new Date().toISOString(),
// //         });
// //       } catch (error) {
// //         console.error("Error updating Firestore:", error);
// //         setColumns(columns);
// //       }
// //     }
// //   };

// //   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
// //     (enquiry) =>
// //       !searchTerm ||
// //       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       enquiry.phone?.includes(searchTerm) ||
// //       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
// //   );

// //   // Function to get the last updater from history
// //   const getLastUpdater = (enquiry) => {
// //     if (enquiry.history && enquiry.history.length > 0) {
// //       const latestEntry = enquiry.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
// //       return latestEntry.performedBy;
// //     }
// //     return enquiry.createdBy || "Unknown User";
// //   };

// //   const handleAddEnquiryClick = () => {
// //     setIsEnquiryTypeModalOpen(true);
// //   };

// //   const handleEnquiryTypeSelect = (type) => {
// //     setIsEnquiryTypeModalOpen(false);
// //     if (type === "single") {
// //       setSelectedEnquiry(null);
// //       setIsModalOpen(true);
// //     } else if (type === "bulk") {
// //       setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
// //       setIsBulkEnquiryModalOpen(true);
// //     }
// //   };

// //   const handleAddBulkEnquiryRow = () => {
// //     setBulkEnquiries([...bulkEnquiries, { fullName: "", phoneNumber: "", email: "", college: "" }]);
// //   };

// //   const handleBulkEnquiryChange = (index, field, value) => {
// //     const updatedEnquiries = [...bulkEnquiries];
// //     updatedEnquiries[index][field] = value;
// //     setBulkEnquiries(updatedEnquiries);
// //   };

// //   const handleRemoveBulkEnquiryRow = (index) => {
// //     if (bulkEnquiries.length === 1) {
// //       alert("At least one enquiry is required.");
// //       return;
// //     }
// //     const updatedEnquiries = bulkEnquiries.filter((_, i) => i !== index);
// //     setBulkEnquiries(updatedEnquiries);
// //   };

// //   const handleSubmitBulkEnquiries = async () => {
// //     if (!canCreate) {
// //       alert("You don't have permission to create enquiries.");
// //       return;
// //     }

// //     const invalidEnquiries = bulkEnquiries.filter(
// //       (enquiry) => !enquiry.fullName.trim() || !enquiry.phoneNumber.trim() || !enquiry.email.trim()
// //     );

// //     if (invalidEnquiries.length > 0) {
// //       alert("Please fill in all required fields (Full Name, Phone Number, Email) for all enquiries.");
// //       return;
// //     }

// //     try {
// //       const enquiriesCollection = collection(db, "enquiries");
// //       const timestamp = new Date().toISOString();
// //       const userName = currentUser?.displayName || currentUser?.email || "Unknown User";

// //       for (const enquiry of bulkEnquiries) {
// //         await addDoc(enquiriesCollection, {
// //           name: enquiry.fullName,
// //           phone: enquiry.phoneNumber,
// //           email: enquiry.email,
// //           college: enquiry.college || "",
// //           stage: "pre-qualified",
// //           createdAt: timestamp,
// //           updatedAt: timestamp,
// //           createdBy: userName,
// //           history: [
// //             {
// //               action: "Enquiry created",
// //               performedBy: userName,
// //               timestamp: timestamp,
// //             },
// //           ],
// //           tags: [],
// //           notes: [],
// //           amount: 0,
// //         });
// //       }

// //       setIsBulkEnquiryModalOpen(false);
// //       setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
// //       alert("Bulk enquiries added successfully!");
// //     } catch (error) {
// //       console.error("Error adding bulk enquiries:", error);
// //       alert(`Failed to add bulk enquiries: ${error.message}`);
// //     }
// //   };

// //   return (
// //     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
// //       <div className="p-4 sm:p-6 shrink-0">
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// //           <div>
// //             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
// //             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
// //           </div>
// //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
// //             <button
// //               onClick={() => setIsTagsModalOpen(true)}
// //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// //             >
// //               <FaCircle className="text-gray-400" />
// //               Manage Tags
// //             </button>
// //             {canCreate && (
// //               <div className="relative" ref={addButtonRef}>
// //                 <button
// //                   onClick={handleAddEnquiryClick}
// //                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
// //                 >
// //                   + Add Enquiry
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //           <div className="flex gap-2 w-full sm:w-auto">
// //             <button
// //               onClick={() => setView("kanban")}
// //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// //             >
// //               Kanban View
// //             </button>
// //             <button
// //               onClick={() => setView("list")}
// //               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
// //             >
// //               List View
// //             </button>
// //           </div>
// //           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
// //             <div className="relative w-full sm:w-64">
// //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search enquiries..."
// //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>
// //             <FiltersDropdown
// //               filters={filters}
// //               setFilters={setFilters}
// //               availableTags={availableTags}
// //               branches={branches}
// //               courses={courses}
// //               instructors={instructors}
// //               owners={owners}
// //               initialColumns={initialColumns}
// //             />
// //             {view === "kanban" && (
// //               <StageVisibilityDropdown
// //                 stageVisibility={stageVisibility}
// //                 setStageVisibility={setStageVisibility}
// //                 initialColumns={initialColumns}
// //               />
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
// //         {view === "kanban" && (
// //           <DragDropContext onDragEnd={onDragEnd}>
// //             <div className="flex overflow-x-auto gap-4 h-full">
// //               {Object.entries(columns)
// //                 .filter(([columnId]) => stageVisibility[columnId])
// //                 .map(([columnId, column]) => (
// //                   <Column
// //                     key={columnId}
// //                     columnId={columnId}
// //                     column={column}
// //                     filteredEnquiries={filteredEnquiries(column.items)}
// //                     canUpdate={canUpdate}
// //                     handleViewEnquiry={handleViewEnquiry}
// //                     handleAddNotes={handleAddNotes}
// //                   />
// //                 ))}
// //             </div>
// //           </DragDropContext>
// //         )}
// //         {view === "list" && (
// //           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
// //             <table className="w-full text-left">
// //               <thead>
// //                 <tr className="border-b border-gray-200">
// //                   <th className="p-4">Name</th>
// //                   <th className="p-4">Amount</th>
// //                   <th className="p-4">Phone</th>
// //                   <th className="p-4">Email</th>
// //                   <th className="p-4">Stage</th>
// //                   <th className="p-4">Tags</th>
// //                   <th className="p-4">Created At</th>
// //                   <th className="p-4">Created By</th>
// //                   <th className="p-4">Last Updated At</th>
// //                   <th className="p-4">Last Updated By</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredEnquiries(allEnquiries).length === 0 ? (
// //                   <tr>
// //                     <td colSpan="10" className="p-4 text-center text-gray-500">No enquiries found</td>
// //                   </tr>
// //                 ) : (
// //                   filteredEnquiries(allEnquiries).map((item) => (
// //                     <tr
// //                       key={item.id}
// //                       className="border-b border-gray-200 hover:bg-gray-50"
// //                       onClick={() => handleViewEnquiry(item)}
// //                       style={{ cursor: "pointer" }}
// //                     >
// //                       <td className="p-4 truncate max-w-[150px]">{item.name || "Unnamed"}</td>
// //                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
// //                       <td className="p-4 truncate max-w-[120px]">{item.phone || "No phone"}</td>
// //                       <td className="p-4 truncate max-w-[200px]">{item.email || "No email"}</td>
// //                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
// //                       <td className="p-4">
// //                         <div className="flex flex-wrap gap-2">
// //                           {item.tags?.map((tag) => (
// //                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// //                               <FaCircle className="text-orange-500 text-xs" />
// //                               {tag}
// //                             </span>
// //                           ))}
// //                         </div>
// //                       </td>
// //                       <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.createdAt, "MMM d, yyyy h:mm a")}</td>
// //                       <td className="p-4 truncate max-w-[150px]">{renderField(item.createdBy)}</td>
// //                       <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.updatedAt, "MMM d, yyyy h:mm a")}</td>
// //                       <td className="p-4 truncate max-w-[150px]">{renderField(getLastUpdater(item))}</td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //       <EnquiryModal
// //         isOpen={isModalOpen}
// //         onRequestClose={() => {
// //           setIsModalOpen(false);
// //           setSelectedEnquiry(null);
// //           setIsNotesMode(false);
// //           setNewNote("");
// //           setNoteType("general-enquiry");
// //         }}
// //         courses={courses}
// //         branches={branches}
// //         instructors={instructors}
// //         availableTags={availableTags}
// //         rolePermissions={rolePermissions}
// //         selectedEnquiry={selectedEnquiry}
// //         isNotesMode={isNotesMode}
// //         noteType={noteType}
// //         setNoteType={setNoteType}
// //         newNote={newNote}
// //         setNewNote={setNewNote}
// //       />
// //       <TagsModal
// //         isOpen={isTagsModalOpen}
// //         onRequestClose={() => setIsTagsModalOpen(false)}
// //         availableTags={availableTags}
// //         setAvailableTags={setAvailableTags}
// //       />
// //       {isTypePopupOpen && addButtonRef.current && (
// //         <div
// //           className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
// //           style={{
// //             top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
// //             right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
// //           }}
// //         >
// //           <h3 className="text-lg font-semibold mb-4">Add Note</h3>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Note Type</label>
// //             <select
// //               value={noteType}
// //               onChange={(e) => setNoteType(e.target.value)}
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             >
// //               <option value="general-enquiry">General Enquiry</option>
// //               <option value="call-log">Call Log</option>
// //               <option value="call-schedule">Call Schedule</option>
// //               <option value="office-visit">Office Visit</option>
// //             </select>
// //           </div>
// //           {noteType === "call-log" && (
// //             <div className="space-y-4 mb-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
// //                 <input
// //                   type="number"
// //                   value={callDuration}
// //                   onChange={(e) => setCallDuration(e.target.value)}
// //                   placeholder="Enter call duration"
// //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                   min="0"
// //                   step="1"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Call Type</label>
// //                 <select
// //                   value={callType}
// //                   onChange={(e) => setCallType(e.target.value)}
// //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 >
// //                   <option value="incoming">Incoming</option>
// //                   <option value="outgoing">Outgoing</option>
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
// //                 <input
// //                   type="time"
// //                   value={callTime}
// //                   onChange={(e) => setCallTime(e.target.value)}
// //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           )}
// //           {noteType === "call-schedule" && (
// //             <div className="space-y-4 mb-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Call Date</label>
// //                 <input
// //                   type="date"
// //                   value={callDate}
// //                   onChange={(e) => setCallDate(e.target.value)}
// //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
// //                 <input
// //                   type="time"
// //                   value={callScheduledTime}
// //                   onChange={(e) => setCallScheduledTime(e.target.value)}
// //                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           )}
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Note</label>
// //             <textarea
// //               value={newNote}
// //               onChange={(e) => setNewNote(e.target.value)}
// //               placeholder="Add your note here..."
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               rows="4"
// //             />
// //           </div>
// //           <div className="flex justify-end gap-2">
// //             <button
// //               onClick={handleClearNote}
// //               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //             >
// //               Clear
// //             </button>
// //             <button
// //               onClick={handleTypeSubmit}
// //               disabled={!canUpdate || !newNote?.trim()}
// //               className={`px-4 py-2 rounded-md ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
// //             >
// //               Add Note
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //       {showReminder && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// //             <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
// //             <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong> in 10 minutes:</p>
// //             <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
// //             <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
// //             <button
// //               onClick={() => setShowReminder(false)}
// //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //             >
// //               Dismiss
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //       {isEnquiryTypeModalOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// //             <h3 className="text-lg font-semibold mb-4">Add Enquiry</h3>
// //             <p className="mb-4">Please select the type of enquiry to add:</p>
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 onClick={() => handleEnquiryTypeSelect("single")}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //               >
// //                 Single Enquiry
// //               </button>
// //               <button
// //                 onClick={() => handleEnquiryTypeSelect("bulk")}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //               >
// //                 Bulk Enquiry
// //               </button>
// //               <button
// //                 onClick={() => setIsEnquiryTypeModalOpen(false)}
// //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       {isBulkEnquiryModalOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[80vh]">
// //             <h3 className="text-lg font-semibold mb-4">Add Bulk Enquiries</h3>
// //             {bulkEnquiries.map((enquiry, index) => (
// //               <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md relative">
// //                 <h4 className="text-md font-medium mb-2">Enquiry {index + 1}</h4>
// //                 <button
// //                   onClick={() => handleRemoveBulkEnquiryRow(index)}
// //                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
// //                 >
// //                   Remove
// //                 </button>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700">Full Name *</label>
// //                     <input
// //                       type="text"
// //                       value={enquiry.fullName}
// //                       onChange={(e) => handleBulkEnquiryChange(index, "fullName", e.target.value)}
// //                       placeholder="Enter full name"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
// //                     <input
// //                       type="tel"
// //                       value={enquiry.phoneNumber}
// //                       onChange={(e) => handleBulkEnquiryChange(index, "phoneNumber", e.target.value)}
// //                       placeholder="Enter phone number"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700">Email *</label>
// //                     <input
// //                       type="email"
// //                       value={enquiry.email}
// //                       onChange={(e) => handleBulkEnquiryChange(index, "email", e.target.value)}
// //                       placeholder="Enter email"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700">College</label>
// //                     <input
// //                       type="text"
// //                       value={enquiry.college}
// //                       onChange={(e) => handleBulkEnquiryChange(index, "college", e.target.value)}
// //                       placeholder="Enter college (optional)"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //             <button
// //               onClick={handleAddBulkEnquiryRow}
// //               className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
// //             >
// //               + Add Another Enquiry
// //             </button>
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 onClick={() => setIsBulkEnquiryModalOpen(false)}
// //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSubmitBulkEnquiries}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //               >
// //                 Submit Enquiries
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default KanbanBoard;


// import React, { useEffect, useState, useRef } from "react";
// import { DragDropContext } from "@hello-pangea/dnd";
// import { db, auth } from "../../../config/firebase";
// import { collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
// import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaTrash } from "react-icons/fa";
// import { format } from "date-fns";
// import FiltersDropdown from "./FiltersDropdown";
// import StageVisibilityDropdown from "./StageVisibilityDropdown";
// import EnquiryModal from "./EnquiryModal";
// import TagsModal from "./TagsModal";
// import Column from "./Column";

// const initialColumns = {
//   "pre-qualified": { name: "Pre Qualified", items: [], icon: <FaCircle className="text-blue-500" />, count: 0, totalAmount: 0 },
//   "qualified": { name: "Qualified", items: [], icon: <FaCircle className="text-purple-500" />, count: 0, totalAmount: 0 },
//   "negotiation": { name: "Negotiation", items: [], icon: <FaCircle className="text-yellow-500" />, count: 0, totalAmount: 0 },
//   "closed-won": { name: "Closed Won", items: [], icon: <FaCheckCircle className="text-green-500" />, count: 0, totalAmount: 0 },
//   "closed-lost": { name: "Closed Lost", items: [], icon: <FaCheckCircle className="text-red-500" />, count: 0, totalAmount: 0 },
//   "contact-in-future": { name: "Contact in Future", items: [], icon: <FaClock className="text-gray-500" />, count: 0, totalAmount: 0 },
// };

// const initialVisibility = {
//   "pre-qualified": true,
//   "qualified": true,
//   "negotiation": true,
//   "closed-won": true,
//   "closed-lost": true,
//   "contact-in-future": true,
// };

// const KanbanBoard = () => {
//   const [columns, setColumns] = useState(initialColumns);
//   const [stageVisibility, setStageVisibility] = useState(initialVisibility);
//   const [view, setView] = useState("kanban");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
//   const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
//   const [isEnquiryTypeModalOpen, setIsEnquiryTypeModalOpen] = useState(false);
//   const [isBulkEnquiryModalOpen, setIsBulkEnquiryModalOpen] = useState(false);
//   const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
//   const [courses, setCourses] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [instructors, setInstructors] = useState([]);
//   const [owners, setOwners] = useState([]);
//   const [availableTags, setAvailableTags] = useState(["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
//   const [rolePermissions] = useState({ enquiries: { create: true, update: true, delete: true, display: true } });
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [isNotesMode, setIsNotesMode] = useState(false);
//   const [noteType, setNoteType] = useState("general-enquiry");
//   const [newNote, setNewNote] = useState("");
//   const [callDuration, setCallDuration] = useState("");
//   const [callType, setCallType] = useState("incoming");
//   const [callTime, setCallTime] = useState("");
//   const [callDate, setCallDate] = useState("");
//   const [callScheduledTime, setCallScheduledTime] = useState("");
//   const [showReminder, setShowReminder] = useState(false);
//   const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
//   const [currentUser, setCurrentUser] = useState(null);
//   const [bulkEnquiries, setBulkEnquiries] = useState([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
//   const [selectedForDeletion, setSelectedForDeletion] = useState([]);
//   const addButtonRef = useRef(null);

//   // Define permissions
//   const canDisplay = rolePermissions.enquiries?.display || false;
//   const canCreate = rolePermissions.enquiries?.create || false;
//   const canUpdate = rolePermissions.enquiries?.update || false;
//   const canDelete = rolePermissions.enquiries?.delete || false;

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Utility function to format dates safely
//   const formatDateSafely = (dateString, formatString) => {
//     if (!dateString) return "Not available";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Not available";
//     return format(date, formatString);
//   };

//   // Utility function to render fields with fallback
//   const renderField = (value, placeholder = "Not provided") => {
//     return value || placeholder;
//   };

//   if (!canDisplay) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
//         You don't have permission to view enquiries.
//       </div>
//     );
//   }

//   const handleViewEnquiry = (enquiry) => {
//     setSelectedEnquiry(enquiry);
//     setIsNotesMode(false);
//     setIsModalOpen(true);
//   };

//   const handleAddNotes = (enquiry) => {
//     setSelectedEnquiry(enquiry);
//     setNoteType("general-enquiry");
//     setNewNote("");
//     setCallDuration("");
//     setCallType("incoming");
//     setCallTime("");
//     setCallDate("");
//     setCallScheduledTime("");
//     setIsTypePopupOpen(true);
//   };

//   const handleTypeSubmit = async () => {
//     if (!newNote.trim()) {
//       alert("Please add a note before submitting.");
//       return;
//     }
//     if (!selectedEnquiry) {
//       alert("No enquiry selected to add note.");
//       return;
//     }
//     if (!canUpdate) {
//       alert("You don't have permission to update enquiries.");
//       return;
//     }

//     try {
//       const noteObject = {
//         content: newNote,
//         type: noteType,
//         callDuration: noteType === "call-log" ? callDuration : null,
//         callType: noteType === "call-log" ? callType : null,
//         callTime: noteType === "call-log" ? callTime : null,
//         callDate: noteType === "call-schedule" ? callDate : null,
//         callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
//         createdAt: new Date().toISOString(),
//         addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
//       };

//       const enquiryRef = doc(db, "enquiries", selectedEnquiry.id);
//       const updatedNotes = [...(selectedEnquiry.notes || []), noteObject];
//       const historyEntry = {
//         action: `Added ${noteType.replace(/-/g, " ").toLowerCase()} note: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
//         performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
//         timestamp: new Date().toISOString(),
//       };
//       const updatedHistory = [...(selectedEnquiry.history || []), historyEntry];

//       await updateDoc(enquiryRef, {
//         notes: updatedNotes,
//         history: updatedHistory,
//         updatedAt: new Date().toISOString(),
//       });

//       if (noteType === "call-schedule" && callDate && callScheduledTime) {
//         setReminderDetails({
//           name: selectedEnquiry.name || "this lead",
//           date: callDate,
//           time: callScheduledTime,
//         });
//         setShowReminder(true);
//       }

//       setIsTypePopupOpen(false);
//       setNewNote("");
//       setNoteType("general-enquiry");
//       setCallDuration("");
//       setCallType("incoming");
//       setCallTime("");
//       setCallDate("");
//       setCallScheduledTime("");
//       alert("Note added successfully!");
//     } catch (error) {
//       console.error("Error adding note:", error);
//       alert(`Failed to add note: ${error.message}`);
//     }
//   };

//   const handleClearNote = () => {
//     setNewNote("");
//     setNoteType("general-enquiry");
//     setCallDuration("");
//     setCallType("incoming");
//     setCallTime("");
//     setCallDate("");
//     setCallScheduledTime("");
//   };

//   useEffect(() => {
//     const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
//       const tagsData = snapshot.docs.map((doc) => doc.data().name);
//       setAvailableTags(tagsData.length > 0 ? tagsData : ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"]);
//     });

//     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
//       const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setCourses(coursesData);
//     });

//     const unsubscribeBranches = onSnapshot(
//       collection(db, "instituteSetup", "9z6G6BLzfDScI0mzMOlB", "Center"),
//       (snapshot) => {
//         const branchesData = snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
//         setBranches(branchesData);
//       }
//     );

//     const unsubscribeInstructors = onSnapshot(collection(db, "Instructor"), (snapshot) => {
//       const instructorsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setInstructors(instructorsData);
//     });

//     const unsubscribeEnquiries = onSnapshot(collection(db, "enquiries"), (snapshot) => {
//       const enquiries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       const uniqueOwners = [...new Set(enquiries.map((enquiry) => enquiry.assignTo).filter(Boolean))];
//       setOwners(uniqueOwners);

//       setColumns((prevColumns) => {
//         const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
//           acc[key] = { ...initialColumns[key], items: [], totalAmount: 0 };
//           return acc;
//         }, {});
//         enquiries.forEach((enquiry) => {
//           const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
//           if (updatedColumns[columnId]) {
//             updatedColumns[columnId].items.push(enquiry);
//             const amount = Number(enquiry.amount) || 0;
//             updatedColumns[columnId].totalAmount += amount;
//           }
//         });
//         Object.keys(updatedColumns).forEach((key) => {
//           updatedColumns[key].count = filteredEnquiries(updatedColumns[key].items).length;
//         });
//         return { ...updatedColumns };
//       });
//     });

//     return () => {
//       unsubscribeTags();
//       unsubscribeCourses();
//       unsubscribeBranches();
//       unsubscribeInstructors();
//       unsubscribeEnquiries();
//     };
//   }, [filters, searchTerm]);

//   const filteredEnquiries = (items) => {
//     return items.filter((enquiry) => {
//       const matchesSearch =
//         !searchTerm ||
//         enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         enquiry.phone?.includes(searchTerm) ||
//         enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
//       const matchesTags = filters.tags.length === 0 || enquiry.tags?.some((tag) => filters.tags.includes(tag));
//       const matchesStage = !filters.stage || enquiry.stage === filters.stage;
//       const matchesBranch = !filters.branch || enquiry.branch === filters.branch;
//       const matchesCourse = !filters.course || enquiry.course === filters.course;
//       const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
//       const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
//       return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
//     });
//   };

//   const onDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceColumn = columns[source.droppableId];
//     const destColumn = columns[destination.droppableId];
//     const sourceItems = [...sourceColumn.items];
//     const destItems = [...destColumn.items];
//     const [movedItem] = sourceItems.splice(source.index, 1);

//     if (source.droppableId === destination.droppableId) {
//       sourceItems.splice(destination.index, 0, movedItem);
//       setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
//     } else {
//       destItems.splice(destination.index, 0, movedItem);
//       const updatedColumns = {
//         ...columns,
//         [source.droppableId]: { ...sourceColumn, items: sourceItems },
//         [destination.droppableId]: { ...destColumn, items: destItems },
//       };
//       setColumns(updatedColumns);
//       try {
//         const enquiryRef = doc(db, "enquiries", movedItem.id);
//         const historyEntry = {
//           action: `Changed stage to ${initialColumns[destination.droppableId].name}`,
//           performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
//           timestamp: new Date().toISOString(),
//         };
//         await updateDoc(enquiryRef, {
//           stage: destination.droppableId,
//           history: [...(movedItem.history || []), historyEntry],
//           updatedAt: new Date().toISOString(),
//         });
//       } catch (error) {
//         console.error("Error updating Firestore:", error);
//         setColumns(columns);
//       }
//     }
//   };

//   const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
//     (enquiry) =>
//       !searchTerm ||
//       enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       enquiry.phone?.includes(searchTerm) ||
//       enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // Function to get the last updater from history
//   const getLastUpdater = (enquiry) => {
//     if (enquiry.history && enquiry.history.length > 0) {
//       const latestEntry = enquiry.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
//       return latestEntry.performedBy;
//     }
//     return enquiry.createdBy || "Unknown User";
//   };

//   const handleAddEnquiryClick = () => {
//     setIsEnquiryTypeModalOpen(true);
//   };

//   const handleEnquiryTypeSelect = (type) => {
//     setIsEnquiryTypeModalOpen(false);
//     if (type === "single") {
//       setSelectedEnquiry(null);
//       setIsModalOpen(true);
//     } else if (type === "bulk") {
//       setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
//       setIsBulkEnquiryModalOpen(true);
//     }
//   };

//   const handleAddBulkEnquiryRow = () => {
//     setBulkEnquiries([...bulkEnquiries, { fullName: "", phoneNumber: "", email: "", college: "" }]);
//   };

//   const handleBulkEnquiryChange = (index, field, value) => {
//     const updatedEnquiries = [...bulkEnquiries];
//     updatedEnquiries[index][field] = value;
//     setBulkEnquiries(updatedEnquiries);
//   };

//   const handleRemoveBulkEnquiryRow = (index) => {
//     if (bulkEnquiries.length === 1) {
//       alert("At least one enquiry is required.");
//       return;
//     }
//     const updatedEnquiries = bulkEnquiries.filter((_, i) => i !== index);
//     setBulkEnquiries(updatedEnquiries);
//   };

//   const handleSubmitBulkEnquiries = async () => {
//     if (!canCreate) {
//       alert("You don't have permission to create enquiries.");
//       return;
//     }

//     const invalidEnquiries = bulkEnquiries.filter(
//       (enquiry) => !enquiry.fullName.trim() || !enquiry.phoneNumber.trim() || !enquiry.email.trim()
//     );

//     if (invalidEnquiries.length > 0) {
//       alert("Please fill in all required fields (Full Name, Phone Number, Email) for all enquiries.");
//       return;
//     }

//     try {
//       const enquiriesCollection = collection(db, "enquiries");
//       const timestamp = new Date().toISOString();
//       const userName = currentUser?.displayName || currentUser?.email || "Unknown User";

//       for (const enquiry of bulkEnquiries) {
//         await addDoc(enquiriesCollection, {
//           name: enquiry.fullName,
//           phone: enquiry.phoneNumber,
//           email: enquiry.email,
//           college: enquiry.college || "",
//           stage: "pre-qualified",
//           createdAt: timestamp,
//           updatedAt: timestamp,
//           createdBy: userName,
//           history: [
//             {
//               action: "Enquiry created",
//               performedBy: userName,
//               timestamp: timestamp,
//             },
//           ],
//           tags: [],
//           notes: [],
//           amount: 0,
//         });
//       }

//       setIsBulkEnquiryModalOpen(false);
//       setBulkEnquiries([{ fullName: "", phoneNumber: "", email: "", college: "" }]);
//       alert("Bulk enquiries added successfully!");
//     } catch (error) {
//       console.error("Error adding bulk enquiries:", error);
//       alert(`Failed to add bulk enquiries: ${error.message}`);
//     }
//   };

//   const handleSelectForDeletion = (enquiryId) => {
//     setSelectedForDeletion((prev) =>
//       prev.includes(enquiryId)
//         ? prev.filter((id) => id !== enquiryId)
//         : [...prev, enquiryId]
//     );
//   };

//   const handleDeleteSelected = async () => {
//     if (!canDelete) {
//       alert("You don't have permission to delete enquiries.");
//       return;
//     }

//     if (selectedForDeletion.length === 0) {
//       alert("No enquiries selected for deletion.");
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to delete ${selectedForDeletion.length} enquiry(ies)?`)) {
//       return;
//     }

//     try {
//       for (const enquiryId of selectedForDeletion) {
//         const enquiryRef = doc(db, "enquiries", enquiryId);
//         await deleteDoc(enquiryRef);
//       }
//       setSelectedForDeletion([]);
//       alert("Selected enquiries deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting enquiries:", error);
//       alert(`Failed to delete enquiries: ${error.message}`);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
//       <div className="p-4 sm:p-6 shrink-0">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-semibold">Enquiry Management</h1>
//             <p className="text-gray-500 text-sm sm:text-base">Manage and track enquiries from initial contact to conversion.</p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative">
//             <button
//               onClick={() => setIsTagsModalOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
//             >
//               <FaCircle className="text-gray-400" />
//               Manage Tags
//             </button>
//             {canCreate && (
//               <div className="relative" ref={addButtonRef}>
//                 <button
//                   onClick={handleAddEnquiryClick}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
//                 >
//                   + Add Enquiry
//                 </button>
//               </div>
//             )}
//             {canDelete && selectedForDeletion.length > 0 && (
//               <button
//                 onClick={handleDeleteSelected}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md w-full sm:w-auto hover:bg-red-700 transition-colors"
//               >
//                 <FaTrash />
//                 Delete Selected ({selectedForDeletion.length})
//               </button>
//             )}
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex gap-2 w-full sm:w-auto">
//             <button
//               onClick={() => setView("kanban")}
//               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "kanban" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
//             >
//               Kanban View
//             </button>
//             <button
//               onClick={() => setView("list")}
//               className={`px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto ${view === "list" ? "bg-white text-gray-700" : "bg-gray-100 text-gray-500"} hover:bg-white`}
//             >
//               List View
//             </button>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search enquiries..."
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <FiltersDropdown
//               filters={filters}
//               setFilters={setFilters}
//               availableTags={availableTags}
//               branches={branches}
//               courses={courses}
//               instructors={instructors}
//               owners={owners}
//               initialColumns={initialColumns}
//             />
//             {view === "kanban" && (
//               <StageVisibilityDropdown
//                 stageVisibility={stageVisibility}
//                 setStageVisibility={setStageVisibility}
//                 initialColumns={initialColumns}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
//         {view === "kanban" && (
//           <DragDropContext onDragEnd={onDragEnd}>
//             <div className="flex overflow-x-auto gap-4 h-full">
//               {Object.entries(columns)
//                 .filter(([columnId]) => stageVisibility[columnId])
//                 .map(([columnId, column]) => (
//                   <Column
//                     key={columnId}
//                     columnId={columnId}
//                     column={column}
//                     filteredEnquiries={filteredEnquiries(column.items)}
//                     canUpdate={canUpdate}
//                     handleViewEnquiry={handleViewEnquiry}
//                     handleAddNotes={handleAddNotes}
//                     handleSelectForDeletion={handleSelectForDeletion}
//                     selectedForDeletion={selectedForDeletion}
//                   />
//                 ))}
//             </div>
//           </DragDropContext>
//         )}
//         {view === "list" && (
//           <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="p-4">
//                     {canDelete && (
//                       <input
//                         type="checkbox"
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedForDeletion(filteredEnquiries(allEnquiries).map((item) => item.id));
//                           } else {
//                             setSelectedForDeletion([]);
//                           }
//                         }}
//                         checked={filteredEnquiries(allEnquiries).length > 0 && selectedForDeletion.length === filteredEnquiries(allEnquiries).length}
//                       />
//                     )}
//                   </th>
//                   <th className="p-4">Name</th>
//                   <th className="p-4">Amount</th>
//                   <th className="p-4">Phone</th>
//                   <th className="p-4">Email</th>
//                   <th className="p-4">Stage</th>
//                   <th className="p-4">Tags</th>
//                   <th className="p-4">Created At</th>
//                   <th className="p-4">Created By</th>
//                   <th className="p-4">Last Updated At</th>
//                   <th className="p-4">Last Updated By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEnquiries(allEnquiries).length === 0 ? (
//                   <tr>
//                     <td colSpan="11" className="p-4 text-center text-gray-500">No enquiries found</td>
//                   </tr>
//                 ) : (
//                   filteredEnquiries(allEnquiries).map((item) => (
//                     <tr
//                       key={item.id}
//                       className={`border-b border-gray-200 hover:bg-gray-50 ${selectedForDeletion.includes(item.id) ? "bg-red-100" : ""}`}
//                       onClick={() => handleViewEnquiry(item)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <td className="p-4" onClick={(e) => e.stopPropagation()}>
//                         {canDelete && (
//                           <input
//                             type="checkbox"
//                             checked={selectedForDeletion.includes(item.id)}
//                             onChange={() => handleSelectForDeletion(item.id)}
//                           />
//                         )}
//                       </td>
//                       <td className="p-4 truncate max-w-[150px]">{item.name || "Unnamed"}</td>
//                       <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
//                       <td className="p-4 truncate max-w-[120px]">{item.phone || "No phone"}</td>
//                       <td className="p-4 truncate max-w-[200px]">{item.email || "No email"}</td>
//                       <td className="p-4">{initialColumns[item.stage]?.name || "Unknown"}</td>
//                       <td className="p-4">
//                         <div className="flex flex-wrap gap-2">
//                           {item.tags?.map((tag) => (
//                             <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
//                               <FaCircle className="text-orange-500 text-xs" />
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.createdAt, "MMM d, yyyy h:mm a")}</td>
//                       <td className="p-4 truncate max-w-[150px]">{renderField(item.createdBy)}</td>
//                       <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.updatedAt, "MMM d, yyyy h:mm a")}</td>
//                       <td className="p-4 truncate max-w-[150px]">{renderField(getLastUpdater(item))}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <EnquiryModal
//         isOpen={isModalOpen}
//         onRequestClose={() => {
//           setIsModalOpen(false);
//           setSelectedEnquiry(null);
//           setIsNotesMode(false);
//           setNewNote("");
//           setNoteType("general-enquiry");
//         }}
//         courses={courses}
//         branches={branches}
//         instructors={instructors}
//         availableTags={availableTags}
//         rolePermissions={rolePermissions}
//         selectedEnquiry={selectedEnquiry}
//         isNotesMode={isNotesMode}
//         noteType={noteType}
//         setNoteType={setNoteType}
//         newNote={newNote}
//         setNewNote={setNewNote}
//       />
//       <TagsModal
//         isOpen={isTagsModalOpen}
//         onRequestClose={() => setIsTagsModalOpen(false)}
//         availableTags={availableTags}
//         setAvailableTags={setAvailableTags}
//       />
//       {isTypePopupOpen && addButtonRef.current && (
//         <div
//           className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
//           style={{
//             top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
//             right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
//           }}
//         >
//           <h3 className="text-lg font-semibold mb-4">Add Note</h3>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Note Type</label>
//             <select
//               value={noteType}
//               onChange={(e) => setNoteType(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="general-enquiry">General Enquiry</option>
//               <option value="call-log">Call Log</option>
//               <option value="call-schedule">Call Schedule</option>
//               <option value="office-visit">Office Visit</option>
//             </select>
//           </div>
//           {noteType === "call-log" && (
//             <div className="space-y-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
//                 <input
//                   type="number"
//                   value={callDuration}
//                   onChange={(e) => setCallDuration(e.target.value)}
//                   placeholder="Enter call duration"
//                   className="mt-1 p-2 w assaults-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Call Type</label>
//                 <select
//                   value={callType}
//                   onChange={(e) => setCallType(e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="incoming">Incoming</option>
//                   <option value="outgoing">Outgoing</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
//                 <input
//                   type="time"
//                   value={callTime}
//                   onChange={(e) => setCallTime(e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           )}
//           {noteType === "call-schedule" && (
//             <div className="space-y-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Call Date</label>
//                 <input
//                   type="date"
//                   value={callDate}
//                   onChange={(e) => setCallDate(e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Call Time</label>
//                 <input
//                   type="time"
//                   value={callScheduledTime}
//                   onChange={(e) => setCallScheduledTime(e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           )}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Note</label>
//             <textarea
//               value={newNote}
//               onChange={(e) => setNewNote(e.target.value)}
//               placeholder="Add your note here..."
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               rows="4"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={handleClearNote}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//             >
//               Clear
//             </button>
//             <button
//               onClick={handleTypeSubmit}
//               disabled={!canUpdate || !newNote?.trim()}
//               className={`px-4 py-2 rounded-md ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
//             >
//               Add Note
//             </button>
//           </div>
//         </div>
//       )}
//       {showReminder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
//             <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong> in 10 minutes:</p>
//             <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
//             <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
//             <button
//               onClick={() => setShowReminder(false)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       )}
//       {isEnquiryTypeModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h3 className="text-lg font-semibold mb-4">Add Enquiry</h3>
//             <p className="mb-4">Please select the type of enquiry to add:</p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => handleEnquiryTypeSelect("single")}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Single Enquiry
//               </button>
//               <button
//                 onClick={() => handleEnquiryTypeSelect("bulk")}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Bulk Enquiry
//               </button>
//               <button
//                 onClick={() => setIsEnquiryTypeModalOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {isBulkEnquiryModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[80vh]">
//             <h3 className="text-lg font-semibold mb-4">Add Bulk Enquiries</h3>
//             {bulkEnquiries.map((enquiry, index) => (
//               <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md relative">
//                 <h4 className="text-md font-medium mb-2">Enquiry {index + 1}</h4>
//                 <button
//                   onClick={() => handleRemoveBulkEnquiryRow(index)}
//                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                 >
//                   Remove
//                 </button>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Full Name *</label>
//                     <input
//                       type="text"
//                       value={enquiry.fullName}
//                       onChange={(e) => handleBulkEnquiryChange(index, "fullName", e.target.value)}
//                       placeholder="Enter full name"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
//                     <input
//                       type="tel"
//                       value={enquiry.phoneNumber}
//                       onChange={(e) => handleBulkEnquiryChange(index, "phoneNumber", e.target.value)}
//                       placeholder="Enter phone number"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Email *</label>
//                     <input
//                       type="email"
//                       value={enquiry.email}
//                       onChange={(e) => handleBulkEnquiryChange(index, "email", e.target.value)}
//                       placeholder="Enter email"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">College</label>
//                     <input
//                       type="text"
//                       value={enquiry.college}
//                       onChange={(e) => handleBulkEnquiryChange(index, "college", e.target.value)}
//                       placeholder="Enter college (optional)"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <button
//               onClick={handleAddBulkEnquiryRow}
//               className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//             >
//               + Add Another Enquiry
//             </button>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setIsBulkEnquiryModalOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitBulkEnquiries}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Submit Enquiries
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default KanbanBoard;


import React, { useEffect, useState, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { db, auth } from "../../../config/firebase";
import { collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { FaSearch, FaCircle, FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaEdit } from "react-icons/fa";
import { format } from "date-fns";
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
  const [isTypePopupOpen, setIsTypePopupOpen] = useState(false);
  const [isEnquiryTypeModalOpen, setIsEnquiryTypeModalOpen] = useState(false);
  const [isBulkEnquiryModalOpen, setIsBulkEnquiryModalOpen] = useState(false);
  const [isMassUpdateModalOpen, setIsMassUpdateModalOpen] = useState(false);
  const [filters, setFilters] = useState({ tags: [], stage: "", branch: "", course: "", instructor: "", owner: "" });
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
  const addButtonRef = useRef(null);

  // Define permissions
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

  // Utility function to format dates safely
  const formatDateSafely = (dateString, formatString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not available";
    return format(date, formatString);
  };

  // Utility function to render fields with fallback
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
      const matchesInstructor = !filters.instructor || enquiry.assignTo === filters.instructor;
      const matchesOwner = !filters.owner || enquiry.assignTo === filters.owner;
      return matchesSearch && matchesTags && matchesStage && matchesBranch && matchesCourse && matchesInstructor && matchesOwner;
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

  const allEnquiries = Object.values(columns).flatMap((column) => column.items).filter(
    (enquiry) =>
      !searchTerm ||
      enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.includes(searchTerm) ||
      enquiry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to get the last updater from history
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
      setIsBulkEnquiryModalOpen(true);
    }
  };

  const handleAddBulkEnquiryRow = () => {
    setBulkEnquiries([...bulkEnquiries, { fullName: "", phoneNumber: "", email: "", college: "" }]);
  };

  const handleBulkEnquiryChange = (index, field, value) => {
    const updatedEnquiries = [...bulkEnquiries];
    updatedEnquiries[index][field] = value;
    setBulkEnquiries(updatedEnquiries);
  };

  const handleRemoveBulkEnquiryRow = (index) => {
    if (bulkEnquiries.length === 1) {
      alert("At least one enquiry is required.");
      return;
    }
    const updatedEnquiries = bulkEnquiries.filter((_, i) => i !== index);
    setBulkEnquiries(updatedEnquiries);
  };

  const handleSubmitBulkEnquiries = async () => {
    if (!canCreate) {
      alert("You don't have permission to create enquiries.");
      return;
    }

    const invalidEnquiries = bulkEnquiries.filter(
      (enquiry) => !enquiry.fullName.trim() || !enquiry.phoneNumber.trim() || !enquiry.email.trim()
    );

    if (invalidEnquiries.length > 0) {
      alert("Please fill in all required fields (Full Name, Phone Number, Email) for all enquiries.");
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
      alert("Bulk enquiries added successfully!");
    } catch (error) {
      console.error("Error adding bulk enquiries:", error);
      alert(`Failed to add bulk enquiries: ${error.message}`);
    }
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

  return (
    <div className="h-screen flex flex-col bg-gray-100 w-[calc(100vw-360px)]">
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
          <div className="bg-white rounded-lg shadow-md overflow-x-auto h-full">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4">
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
                  </th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4">Last Updated At</th>
                  <th className="p-4">Last Updated By</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries(allEnquiries).length === 0 ? (
                  <tr>
                    <td colSpan="11" className="p-4 text-center text-gray-500">No enquiries found</td>
                  </tr>
                ) : (
                  filteredEnquiries(allEnquiries).map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${selectedEnquiries.includes(item.id) ? "bg-blue-100" : ""}`}
                      onClick={() => handleViewEnquiry(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        {(canUpdate || canDelete) && (
                          <input
                            type="checkbox"
                            checked={selectedEnquiries.includes(item.id)}
                            onChange={() => handleSelectForAction(item.id)}
                          />
                        )}
                      </td>
                      <td className="p-4 truncate max-w-[150px]">{item.name || "Unnamed"}</td>
                      <td className="p-4">₹{item.amount?.toLocaleString() || "0"}</td>
                      <td className="p-4 truncate max-w-[120px]">{item.phone || "No phone"}</td>
                      <td className="p-4 truncate max-w-[200px]">{item.email || "No email"}</td>
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
                      <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.createdAt, "MMM d, yyyy h:mm a")}</td>
                      <td className="p-4 truncate max-w-[150px]">{renderField(item.createdBy)}</td>
                      <td className="p-4 truncate max-w-[150px]">{formatDateSafely(item.updatedAt, "MMM d, yyyy h:mm a")}</td>
                      <td className="p-4 truncate max-w-[150px]">{renderField(getLastUpdater(item))}</td>
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
          className="absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 sm:right-0 sm:top-0 sm:mt-12 mt-2 right-auto"
          style={{
            top: window.innerWidth < 640 ? addButtonRef.current.offsetHeight + 5 : 0,
            right: window.innerWidth >= 640 ? -addButtonRef.current.offsetWidth : 0,
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
                      onChange={(e) => handleBulkEnquiryChange(index, "compiler-fullName", e.target.value)}
                      placeholder="Enter full name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      value={enquiry.phoneNumber}
                      onChange={(e) => handleBulkEnquiryChange(index, "phoneNumber", e.target.value)}
                      placeholder="Enter phone number"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={enquiry.email}
                      onChange={(e) => handleBulkEnquiryChange(index, "email", e.target.value)}
                      placeholder="Enter email"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
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
                onClick={() => setIsBulkEnquiryModalOpen(false)}
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