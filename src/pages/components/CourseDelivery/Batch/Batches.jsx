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
  addDoc,
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
  const instituteId = "9z6G6BLzfDScI0mzMOlB"; // Hardcoded institute ID
  const CenterCollectionRef = collection(db, "instituteSetup", instituteId, "Center");

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const logActivity = async (action, details) => {
    if (!user) return;
    try {
      const logDocRef = doc(db, "activityLogs", "currentLog");
      const logEntry = {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        action,
        details
      };
      await updateDoc(logDocRef, {
        logs: arrayUnion(logEntry),
        count: increment(1)
      }).catch(async (err) => {
        if (err.code === 'not-found') {
          await setDoc(logDocRef, { logs: [logEntry], count: 1 });
        } else {
          throw err;
        }
      });
    } catch (err) {
      console.error("Error logging activity:", err.message);
      toast.error("Failed to log activity.");
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
      console.error("Error fetching centers:", err.message);
      toast.error("Failed to fetch centers");
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
      console.error("Error fetching batches:", err.message);
      toast.error("Failed to fetch batches");
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
      console.error("Error checking students in batch:", err.message);
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
      await logActivity("Deleted batch", { name: batch.batchName || "Unknown" });
      setOpenDelete(false);
      setDeleteMessage(
        "Are you sure you want to delete this batch? This action cannot be undone."
      );
      toast.success("Batch deleted successfully.");
    } catch (err) {
      console.error("Error deleting batch:", err.message);
      setDeleteMessage("An error occurred while trying to delete the batch.");
      toast.error("Failed to delete batch.");
    }
  };

  const handleBatchSubmit = async (formData) => {
    try {
      if (currentBatch) {
        await logActivity("Updated batch", {
          name: formData.batchName,
          changes: { oldName: currentBatch.batchName, newName: formData.batchName }
        });
      } else {
        await logActivity("Created batch", { name: formData.batchName });
      }
      handleClose();
    } catch (err) {
      console.error("Error logging batch action:", err.message);
      toast.error("Failed to log batch action.");
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
        <h1 className="text-2xl font-semibold text-gray-800">Batches</h1>
        {canCreate && (
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
            onClick={handleCreateBatchClick}
          >
            + Create Batch
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6 space-x-4 flex-wrap">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search batches by name..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Batches</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filterCenter}
            onChange={(e) => setFilterCenter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Centers</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
          <div>
            <label
              htmlFor="startDateFrom"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date From
            </label>
            <input
              type="date"
              id="startDateFrom"
              value={startDateFrom}
              onChange={(e) => setStartDateFrom(e.target.value)}
              className="mt-1 block w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="startDateTo"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date To
            </label>
            <input
              type="date"
              id="startDateTo"
              value={startDateTo}
              onChange={(e) => setStartDateTo(e.target.value)}
              className="mt-1 block w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Reset Filters
          </button>
        </div>

        <div className="rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Sr No
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Batch Name
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Centers
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? (
                searchResults.map((batch, index) => (
                  <tr
                    key={batch.id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{batch.batchName}</td>
                    <td className="px-4 py-3 text-gray-600">{batch.status}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {batch.centers
                        ? batch.centers
                            .map((centerId) =>
                              centers.find((c) => c.id === centerId)?.name || centerId
                            )
                            .join(", ")
                        : batch.center || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {(canUpdate || canDelete) && (
                        <div className="flex items-center space-x-2">
                          {canDelete && (
                            <button
                              onClick={() => {
                                setDeleteId(batch.id);
                                setOpenDelete(true);
                                setDeleteMessage(
                                  "Are you sure you want to delete this batch? This action cannot be undone."
                                );
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          )}
                          {canUpdate && (
                            <button
                              onClick={() => handleEditClick(batch)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Update
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-3 text-center text-gray-600"
                  >
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