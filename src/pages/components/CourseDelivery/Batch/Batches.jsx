import { useState, useEffect, useCallback } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  where,
  arrayUnion,
  increment
} from "firebase/firestore";
import CreateBatch from "./CreateBatch";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from 'lodash/debounce';
import { runTransaction } from "firebase/firestore";

export default function Batches() {
  const { user, rolePermissions } = useAuth();

  const canCreate = rolePermissions.Batch?.create || false;
  const canUpdate = rolePermissions.Batch?.update || false;
  const canDelete = rolePermissions.Batch?.delete || false;
  const canDisplay = rolePermissions.Batch?.display || false;

  const [currentBatch, setCurrentBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCenter, setFilterCenter] = useState("All");
  const [centers, setCenters] = useState([]);
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(
    "Are you sure you want to delete this batch? This action cannot be undone."
  );

  const BatchCollectionRef = collection(db, "Batch");
  const StudentCollectionRef = collection(db, "student");
  const instituteId = "RDJ9wMXGrIUk221MzDxP"; // Hardcoded institute ID
  const CenterCollectionRef = collection(db, "Branch");

  const toggleSidebar = () => setIsOpen((prev) => !prev);

const logActivity = async (action, details) => {
    if (!user?.email) {
      console.warn("No user email found, skipping activity log");
      return;
    }

    const activityLogRef = doc(db, "activityLogs", "logDocument");

    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Batch",
      // adminId: adminId || "N/A",
    };

    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

        if (!Array.isArray(logs)) {
          logs = [];
        }

        logs.push(logEntry);

        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }

        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully:", action);
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
    }
  };


  const fetchCenters = useCallback(() => {
    if (!canDisplay) return;
    const unsubscribe = onSnapshot(CenterCollectionRef, (snapshot) => {
      const centerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centerData);
    }, (err) => {
      toast.error("Failed to fetch centers", err);
    });
    return unsubscribe;
  }, [canDisplay]);

  const fetchBatches = useCallback(() => {
    if (!canDisplay) return;
    const q = query(BatchCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const currentDate = new Date();
      const batchData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const batchEndDate = data.endDate?.toDate
          ? data.endDate.toDate()
          : new Date(data.endDate);
        const status = currentDate > batchEndDate && data.status !== "Inactive"
          ? "Inactive"
          : data.status || "Active";
        return {
          id: doc.id,
          ...data,
          status
        };
      });
      setBatches(batchData);
      setSearchResults(batchData);
    }, (err) => {
      toast.error("Failed to fetch batches", err);
    });
    return unsubscribe;
  }, [canDisplay]);

  const debouncedApplyFilters = useCallback(
    debounce(() => {
      let filteredBatches = [...batches];

      if (filterStatus !== "All") {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.status === filterStatus
        );
      }

      if (filterCenter !== "All") {
        filteredBatches = filteredBatches.filter((batch) => {
          const batchCenters = Array.isArray(batch.centers)
            ? batch.centers
            : batch.center
            ? [batch.center]
            : [];
          const center = centers.find((c) => c.id === filterCenter);
          return (
            batchCenters.includes(filterCenter) ||
            (center && batchCenters.includes(center.name))
          );
        });
      }

      if (startDateFrom && startDateTo) {
        const fromDate = new Date(startDateFrom);
        const toDate = new Date(startDateTo);
        filteredBatches = filteredBatches.filter((batch) => {
          const batchStartDate = batch.startDate?.toDate
            ? batch.startDate.toDate()
            : new Date(batch.startDate);
          return batchStartDate >= fromDate && batchStartDate <= toDate;
        });
      }

      if (searchTerm.trim()) {
        filteredBatches = filteredBatches.filter((batch) =>
          batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setSearchResults(filteredBatches);
      if (filteredBatches.length === 0) {
        toast.warn("No batches match the selected filters.");
      } else {
        toast.success(`Filtered to ${filteredBatches.length} batch(es).`);
      }
    }, 300),
    [batches, filterStatus, filterCenter, startDateFrom, startDateTo, searchTerm, centers]
  );

  useEffect(() => {
    if (canDisplay) {
      const unsubscribeCenters = fetchCenters();
      const unsubscribeBatches = fetchBatches();
      return () => {
        unsubscribeCenters && unsubscribeCenters();
        unsubscribeBatches && unsubscribeBatches();
      };
    }
  }, [canDisplay, fetchCenters, fetchBatches]);

  useEffect(() => {
    debouncedApplyFilters();
    return () => debouncedApplyFilters.cancel();
  }, [debouncedApplyFilters]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterCenter("All");
    setStartDateFrom("");
    setStartDateTo("");
    setSearchResults(batches);
    toast.success("Filters reset successfully.");
  };

  const handleCreateBatchClick = () => {
    if (!canCreate) {
      toast.error("You do not have permission to create batches.");
      return;
    }
    setCurrentBatch(null);
    toggleSidebar();
  };

  const handleEditClick = (batch) => {
    if (!canUpdate) {
      toast.error("You do not have permission to update batches.");
      return;
    }
    setCurrentBatch(batch);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentBatch(null);
  };

  const checkStudentsInBatch = async (batchId) => {
    try {
      const q = query(StudentCollectionRef, where("course_details.batch", "==", batchId));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      return false;
    }
  };

  const deleteBatch = async () => {
    if (!deleteId || !canDelete) {
      if (!canDelete) toast.error("You do not have permission to delete batches.");
      return;
    }
    try {
      const hasStudents = await checkStudentsInBatch(deleteId);
      if (hasStudents) {
        setDeleteMessage(
          "This batch cannot be deleted because students are enrolled in it."
        );
        return;
      }
      const batch = batches.find((b) => b.id === deleteId);
      await deleteDoc(doc(db, "Batch", deleteId));
      await logActivity("Batch deleted", { name: batch.batchName || "Unknown" });
      setOpenDelete(false);
      setDeleteMessage(
        "Are you sure you want to delete this batch? This action cannot be undone."
      );
      toast.success("Batch deleted successfully.");
    } catch (err) {
      setDeleteMessage("An error occurred while trying to delete the batch.");
      toast.error("Failed to delete batch.");
    }
  };

  const handleBatchSubmit = async (formData) => {
    try {
      if (currentBatch) {
        await logActivity("Batch updated", {
          name: formData.batchName,
          changes: { oldName: currentBatch.batchName, newName: formData.batchName }
        });
      } else {
        await logActivity("Batch created", { name: formData.batchName });
      }
      handleClose();
    } catch (err) {      toast.error("Failed to log batch action.", err);
    }
  };

  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view batches.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#333333] font-sans">Batches</h1>
        {canCreate && (
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            onClick={handleCreateBatchClick}
          >
            + Create Batch
          </button>
        )}
      </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
  {/* Filters Section */}
<div className="flex flex-col md:flex-row flex-wrap md:items-center gap-4 mb-6">
  <div className="relative w-48">
  <svg
    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search batches by name..."
    className="h-10 w-full px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    aria-label="Search batches by name"
  />
</div>

  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="h-10 w-48 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    aria-label="Filter by status"
  >
    <option value="All">All Batches</option>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>

  <select
    value={filterCenter}
    onChange={(e) => setFilterCenter(e.target.value)}
    className="h-10 w-48 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    aria-label="Filter by center"
  >
    <option value="All">All Centers</option>
    {centers.map((center) => (
      <option key={center.id} value={center.id}>
        {center.name}
      </option>
    ))}
  </select>

  <div className="flex flex-col space-y-1 mb-6">
    <label htmlFor="startDateFrom" className="text-sm font-medium text-gray-700">
      Start Date From
    </label>
    <input
      type="date"
      id="startDateFrom"
      value={startDateFrom}
      onChange={(e) => setStartDateFrom(e.target.value)}
      className="h-10 w-48 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  <div className="flex flex-col space-y-1 mb-6">
    <label htmlFor="startDateTo" className="text-sm font-medium text-gray-700">
      Start Date To
    </label>
    <input
      type="date"
      id="startDateTo"
      value={startDateTo}
      onChange={(e) => setStartDateTo(e.target.value)}
      className="h-10 w-48 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  <button
    onClick={resetFilters}
    className="self-start bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
    aria-label="Reset Filters"
  >
    Reset Filters
  </button>
</div>


  {/* Table Section */}
 <div className="rounded-xl shadow-lg border border-gray-200 overflow-x-auto max-h-[70vh] overflow-y-auto bg-white">
  <table className="w-full min-w-[600px] table-auto text-left text-sm md:text-base">
   <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
  <tr>
    <th className="px-3 py-1 font-semibold text-gray-700 uppercase tracking-wide w-14">Sr No</th>
    <th className="px-3 py-1 font-semibold text-gray-700 uppercase tracking-wide">Batch Name</th>
    <th className="px-3 py-1 font-semibold text-gray-700 uppercase tracking-wide w-28">Status</th>
    <th className="px-3 py-1 font-semibold text-gray-700 uppercase tracking-wide">Centers</th>
    <th className="px-3 py-1 font-semibold text-gray-700 uppercase tracking-wide w-36">Action</th>
  </tr>
</thead>

    <tbody>
      {searchResults.length > 0 ? (
        searchResults.map((batch, index) => (
          <tr
            key={batch.id}
            className={`border-b last:border-none transition-colors duration-300 hover:bg-gray-50 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <td className="px-6 py-3 text-gray-700 font-medium">{index + 1}</td>
            <td className="px-6 py-3 text-gray-900 font-semibold">{batch.batchName}</td>
            <td className="px-6 py-3 text-gray-700 capitalize">{batch.status}</td>
            <td
              className="px-6 py-3 text-gray-700 max-w-xs truncate"
              title={
                batch.centers
                  ? batch.centers
                      .map((centerId) => centers.find((c) => c.id === centerId)?.name || centerId)
                      .join(', ')
                  : batch.center || 'N/A'
              }
            >
              {batch.centers
                ? batch.centers
                    .map((centerId) => centers.find((c) => c.id === centerId)?.name || centerId)
                    .join(', ')
                : batch.center || 'N/A'}
            </td>
            <td className="px-6 py-3">
              {(canUpdate || canDelete) && (
                <div className="flex items-center space-x-3">
                  {canDelete && (
                    <button
                      onClick={() => {
                        setDeleteId(batch.id);
                        setOpenDelete(true);
                        setDeleteMessage(
                          'Are you sure you want to delete this batch? This action cannot be undone.'
                        );
                      }}
                      className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      aria-label={`Delete batch ${batch.batchName}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                  {canUpdate && (
                    <button
                      onClick={() => handleEditClick(batch)}
                      className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
                      aria-label={`Update batch ${batch.batchName}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5h6M6 12h12M6 19h12"
                        />
                      </svg>
                      <span>Update</span>
                    </button>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-6 py-6 text-center text-gray-500 italic">
            No batches found matching the selected filters.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

</div>


      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {isOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } z-50 overflow-y-auto`}
        >
          <CreateBatch
            isOpen={isOpen}
            toggleSidebar={handleClose}
            batch={currentBatch}
            onSubmit={handleBatchSubmit}
            logActivity={logActivity}
            centers={centers}
          />
        </div>
      )}

      {canDelete && (
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg w-96 max-w-[90%] mx-auto"
        >
          <DialogHeader className="text-gray-800 font-semibold text-lg p-4">
            Confirm Deletion
          </DialogHeader>
          <DialogBody className="text-gray-600 text-base p-4">
            {deleteMessage}
          </DialogBody>
          <DialogFooter className="space-x-4 p-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
              className="hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </Button>
            {deleteMessage ===
              "Are you sure you want to delete this batch? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deleteBatch}
                className="bg-red-500 hover:bg-red-600 transition duration-200 text-sm"
              >
                Yes, Delete
              </Button>
            )}
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}