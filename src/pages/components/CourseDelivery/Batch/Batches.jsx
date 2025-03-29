import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import CreateBatch from "./CreateBatch";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { useAuth } from '../../../../context/AuthContext';

export default function Batches() {
  const { rolePermissions } = useAuth();
  
  // Permission checks for 'Batch' section
  const canCreate = rolePermissions.Batch?.create || false;
  const canUpdate = rolePermissions.Batch?.update || false;
  const canDelete = rolePermissions.Batch?.delete || false;
  const canDisplay = rolePermissions.Batch?.display || false;

  const [currentBatch, setCurrentBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCenter, setFilterCenter] = useState("All");
  const [centers, setCenters] = useState([]);
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');

  const BatchCollectionRef = collection(db, "Batch");
  const StudentCollectionRef = collection(db, "student");
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this batch? This action cannot be undone.");

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const fetchCenters = async () => {
    if (!canDisplay) return;
    try {
      const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
      if (instituteSnapshot.empty) {
        console.error("No institute found");
        return;
      }
      const instituteId = instituteSnapshot.docs[0].id;
      const centersSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
      const centerData = centersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centerData);
    } catch (err) {
      console.error("Error fetching centers:", err);
    }
  };

  const fetchBatches = async () => {
    if (!canDisplay) return;
    try {
      const q = query(BatchCollectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const batchData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const currentDate = new Date();
      
      const updatedBatches = await Promise.all(
        batchData.map(async (batch) => {
          // Convert endDate safely: if it's a firestore Timestamp, use .toDate(), otherwise use new Date()
          const batchEndDate = batch.endDate && batch.endDate.toDate 
            ? batch.endDate.toDate() 
            : new Date(batch.endDate);
            
          if (currentDate > batchEndDate && batch.status !== "Inactive") {
            const batchRef = doc(db, "Batch", batch.id);
            await updateDoc(batchRef, { status: "Inactive" });
            return { ...batch, status: "Inactive" };
          }
          return batch;
        })
      );
  
      setBatches(updatedBatches);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };
  

  const applyFilters = () => {
    let filteredBatches = [...batches];

    if (filterStatus !== "All") {
      filteredBatches = filteredBatches.filter(batch => batch.status === filterStatus);
    }

    if (filterCenter !== "All") {
      filteredBatches = filteredBatches.filter(batch => 
        batch.centers && Array.isArray(batch.centers) && batch.centers.includes(filterCenter)
      );
    }

    if (startDateFrom && startDateTo) {
      const fromDate = new Date(startDateFrom);
      const toDate = new Date(startDateTo);
      filteredBatches = filteredBatches.filter(batch => {
        const batchStartDate = new Date(batch.startDate);
        return batchStartDate >= fromDate && batchStartDate <= toDate;
      });
    }

    if (searchTerm.trim()) {
      filteredBatches = filteredBatches.filter(batch =>
        batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSearchResults(filteredBatches);
  };

  useEffect(() => {
    fetchCenters();
    fetchBatches();
  }, [canDisplay]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, filterCenter, startDateFrom, startDateTo, batches]);

  const handleCreateBatchClick = () => {
    if (!canCreate) {
      alert("You do not have permission to create batches.");
      return;
    }
    setCurrentBatch(null);
    toggleSidebar();
  };

  const handleEditClick = (batch) => {
    if (!canUpdate) {
      alert("You do not have permission to update batches.");
      return;
    }
    setCurrentBatch(batch);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentBatch(null);
    fetchBatches();
  };

  const checkStudentsInBatch = async (batchId) => {
    try {
      const snapshot = await getDocs(StudentCollectionRef);
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const hasStudents = students.some(student => {
        const courseDetails = student.course_details || [];
        return courseDetails.some(course => course.batch === batchId);
      });
      return hasStudents;
    } catch (err) {
      console.error("Error checking students in batch:", err);
      return false;
    }
  };

  const deleteBatch = async () => {
    if (!deleteId || !canDelete) {
      if (!canDelete) alert("You do not have permission to delete batches.");
      return;
    }

    try {
      const hasStudents = await checkStudentsInBatch(deleteId);
      if (hasStudents) {
        setDeleteMessage("This batch cannot be deleted because students are enrolled in it.");
        return;
      }

      await deleteDoc(doc(db, "Batch", deleteId));
      fetchBatches();
      setOpenDelete(false);
      setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone.");
    } catch (err) {
      console.error("Error deleting batch:", err);
      setDeleteMessage("An error occurred while trying to delete the batch.");
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
    <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2">
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
            {centers.map(center => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
          <div>
            <label htmlFor="startDateFrom" className="block text-sm font-medium text-gray-700">Start Date From</label>
            <input
              type="date"
              id="startDateFrom"
              value={startDateFrom}
              onChange={(e) => setStartDateFrom(e.target.value)}
              className="mt-1 block w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="startDateTo" className="block text-sm font-medium text-gray-700">Start Date To</label>
            <input
              type="date"
              id="startDateTo"
              value={startDateTo}
              onChange={(e) => setStartDateTo(e.target.value)}
              className="mt-1 block w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Batch Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0 || (!searchTerm.trim() && filterStatus === "All" && filterCenter === "All" && !startDateFrom && !startDateTo) ? searchResults : batches).length > 0 ? (
                (searchResults.length > 0 || (!searchTerm.trim() && filterStatus === "All" && filterCenter === "All" && !startDateFrom && !startDateTo) ? searchResults : batches).map((batch, index) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{batch.batchName}</td>
                    <td className="px-4 py-3 text-gray-600">{batch.status}</td>
                    <td className="px-4 py-3">
                      {(canUpdate || canDelete) && (
                        <div className="flex items-center space-x-2">
                          {canDelete && (
                            <button
                              onClick={() => {
                                setDeleteId(batch.id);
                                setOpenDelete(true);
                                setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone.");
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
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-600">
                    No batches found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && canCreate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {canCreate && (
        <div
          className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } z-50 overflow-y-auto`}
        >
          <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />
        </div>
      )}

      {canDelete && (
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg"
        >
          <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
          <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
          <DialogFooter className="space-x-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
              className="hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </Button>
            {deleteMessage === "Are you sure you want to delete this batch? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deleteBatch}
                className="bg-red-500 hover:bg-red-600 transition duration-200"
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