import { useState, useEffect, useCallback } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  increment,
  arrayUnion,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";
import CreateCourses from "./CreateCourses";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import LearnerList from "./LearnerList";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useAuth } from "../../../../context/AuthContext";
import debounce from "lodash/debounce";
import { runTransaction } from "firebase/firestore";

export default function Courses() {
  const { user, rolePermissions } = useAuth();
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState(
    "Are you sure you want to delete this course? This action cannot be undone."
  );
  const [openLearnersDialog, setOpenLearnersDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [centerFilter, setCenterFilter] = useState("All");
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [logs, setLogs] = useState([]);

  const canCreate = rolePermissions?.Course?.create || false;
  const canUpdate = rolePermissions?.Course?.update || false;
  const canDelete = rolePermissions?.Course?.delete || false;
  const canDisplay = rolePermissions?.Course?.display || false;
  const isAdmin = rolePermissions?.role === "Admin";

  const CourseCollectionRef = collection(db, "Course");
  const EnrollmentsCollectionRef = collection(db, "enrollments");
  const LogsCollectionRef = collection(db, "activityLogs");
  const instituteId = "RDJ9wMXGrIUk221MzDxP";
  const CenterCollectionRef = collection(db, "Branch");

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLearnersClick = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenLearnersDialog(true);
  };

  const logActivity = async (action, details) => {
  if (!user?.email) return;

  const activityLogRef = doc(db, "activityLogs", "logDocument");

  const logEntry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    userId: user.uid,
    section: "Course",
    // adminId: adminId || "N/A",
  };

  try {
    await runTransaction(db, async (transaction) => {
      const logDoc = await transaction.get(activityLogRef);
      let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

      // Ensure logs is an array and contains only valid data
      if (!Array.isArray(logs)) {
        logs = [];
      }

      // Append the new log entry
      logs.push(logEntry);

      // Trim to the last 1000 entries if necessary
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }

      // Update the document with the new logs array
      transaction.set(activityLogRef, { logs }, { merge: true });
    });
    console.log("Activity logged successfully");
  } catch (error) {
    console.error("Error logging activity:", error);
    // toast.error("Failed to log activity");
  }
};
  
  // const fetchLogs = useCallback(() => {
  //   if (!isAdmin) return;
  //   const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
  //   const unsubscribe = onSnapshot(
  //     q,
  //     (snapshot) => {
  //       const allLogs = [];
  //       snapshot.docs.forEach((doc) => {
  //         const data = doc.data();
  //         (data.logs || []).forEach((log) => {
  //           allLogs.push({ id: doc.id, ...log });
  //         });
  //       });
  //       allLogs.sort(
  //         (a, b) =>
  //           (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
  //       );
  //       setLogs(allLogs);
  //     },
  //   );
  //   return unsubscribe;
  // }, [isAdmin]);

  const fetchCenters = useCallback(async () => {
    if (!canDisplay) {
      setLoadingCenters(false);
      return [];
    }
    try {
      setLoadingCenters(true);

      const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
      if (instituteSnapshot.empty) {
        console.warn("No institute found in instituteSetup collection");
        setCenters([]);
        return [];
      }
      const instituteId = 'RDJ9wMXGrIUk221MzDxP';

      const CenterCollectionRef = collection(db, "Branch");
      const q = query(CenterCollectionRef, where("isActive", "==", true));
      const snapshot = await getDocs(q);
      const centerData = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, // Use document ID as id
            centerId: data.centerId || doc.id, // Fallback to doc.id if centerId is missing
            name: data.name || `Center ${doc.id}`, // Fallback name
            isActive: data.isActive || false,
            createdAt: data.createdAt || null,
          };
        })
        .filter((center) => center.isActive)
        .sort((a, b) => {
          const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });
      if (centerData.length === 0) {
        console.warn("No active centers found.");
      }
      setCenters(centerData);
      return centerData;
    } catch (err) {
      setCenters([]);
      return [];
    } finally {
      setLoadingCenters(false);
    }
  }, [canDisplay]);



  const fetchCourses = useCallback(() => {
    if (!canDisplay) return;
    const q = query(CourseCollectionRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const courseData = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Handle both centerId (string) and centerIds (array)
          const centerIds = data.centerIds
            ? Array.isArray(data.centerIds)
              ? data.centerIds
              : typeof data.centerIds === "string"
              ? [data.centerIds]
              : []
            : data.centerId
            ? typeof data.centerId === "string"
              ? [data.centerId]
              : []
            : [];
          return {
            id: doc.id,
            ...data,
            status: data.status || "Active",
            mode: data.mode || "Online",
            centerIds, // Always store as centerIds
          };
        });
        let filteredCourses = courseData;
        if (statusFilter !== "All") {
          filteredCourses = filteredCourses.filter(
            (course) => course.status === statusFilter
          );
        }
        if (modeFilter !== "All") {
          filteredCourses = filteredCourses.filter(
            (course) => course.mode === modeFilter
          );
        }
        if (centerFilter !== "All") {
          filteredCourses = filteredCourses.filter((course) => {
            const includes = course.centerIds.includes(centerFilter);
            return includes;
          });
        }
        setCourses(filteredCourses);
        setSearchResults(filteredCourses);
      },
    );
    return unsubscribe;
  }, [canDisplay, statusFilter, modeFilter, centerFilter]);


  // Add debug log before useEffect
  
  useEffect(() => {
    if (!canDisplay) {
      setLoadingCenters(false);
      return;
    }
    const unsubscribeCourses = fetchCourses();
    fetchCenters().then(() => {
      // if (isAdmin) fetchLogs();
    });
    return () => unsubscribeCourses && unsubscribeCourses();
  }, [fetchCourses, fetchCenters, canDisplay]);
  
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (!term.trim()) {
        setSearchResults(courses);
        return;
      }
      const results = courses.filter((course) =>
        course.name?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    }, 300),
    [courses]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (!canDisplay) {
      setLoadingCenters(false);
      return;
    }
    const unsubscribeCourses = fetchCourses();
    fetchCenters().then(() => {
      // if (isAdmin) fetchLogs();
    });
    return () => unsubscribeCourses && unsubscribeCourses();
  }, [fetchCourses, fetchCenters, canDisplay, isAdmin]);

  // useEffect(() => {
  //   if (!canDisplay) return;
  //   const unsubscribeCourses = fetchCourses();
  //   fetchCenters().then(() => {
  //     if (isAdmin) fetchLogs();
  //   });
  //   return () => unsubscribeCourses && unsubscribeCourses();
  // }, [fetchCourses, fetchCenters, S, canDisplay, isAdmin]);

  const handleCreateCourseClick = () => {
    if (!canCreate) {
      alert("You do not have permission to create courses.");
      return;
    }
    setCurrentCourse(null);
    setIsOpen(true);
  };

  const handleEditClick = (course) => {
    if (!canUpdate) {
      alert("You do not have permission to update courses.");
      return;
    }
    setCurrentCourse(course);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentCourse(null);
  };

  const checkStudentsInCourse = async (courseId) => {
    try {
      const q = query(
        EnrollmentsCollectionRef,
        where("courses.selectedCourse.id", "==", courseId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      return false;
    }
  };

  const deleteCourse = async () => {
    if (!deleteId || !canDelete) {
      if (!canDelete) alert("You do not have permission to delete courses.");
      return;
    }
    try {
      const hasStudents = await checkStudentsInCourse(deleteId);
      if (hasStudents) {
        setDeleteMessage(
          "This course cannot be deleted because students are enrolled in it."
        );
        return;
      }
      const courseRef = doc(db, "Course", deleteId);
      const courseSnapshot = await getDoc(courseRef);
      const courseData = courseSnapshot.exists() ? courseSnapshot.data() : {};
      await deleteDoc(courseRef);
      await logActivity("Course deleted", { name: courseData.name || "Unknown" });
      setOpenDelete(false);
      setDeleteMessage(
        "Are you sure you want to delete this course? This action cannot be undone."
      );
    } catch (err) {
      setDeleteMessage("An error occurred while trying to delete the course.");
    }
  };

  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view courses.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
    <div className="flex justify-between items-center mb-6">
<h1 className="text-2xl font-bold text-[#333333] font-sans">
  Courses
</h1>






  <div className="flex gap-4">
    {isAdmin && (
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 text-white shadow hover:bg-gray-800 transition duration-200"
        onClick={() => setOpenLogsDialog(true)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        View Logs
      </button>
    )}

    {canCreate && (
      <button
        type="button"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        onClick={handleCreateCourseClick}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Course
      </button>
    )}
  </div>
</div>


      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 flex items-center space-x-4">
          
          <div className="relative w-full max-w-md">
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
    placeholder="Search courses by name..."
    className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Courses</MenuItem>
              <MenuItem value="Active">Active Courses</MenuItem>
              <MenuItem value="Inactive">Inactive Courses</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="mode-filter-label">Filter by Mode</InputLabel>
            <Select
              labelId="mode-filter-label"
              value={modeFilter}
              label="Filter by Mode"
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <MenuItem value="All">All Modes</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
  <InputLabel id="center-filter-label">Filter by Center</InputLabel>
  <Select
    labelId="center-filter-label"
    value={centerFilter}
    label="Filter by Center"
    onChange={(e) => setCenterFilter(e.target.value)}
    disabled={loadingCenters}
  >
    <MenuItem value="All">All Centers</MenuItem>
    {loadingCenters ? (
      <MenuItem disabled>Loading centers...</MenuItem>
    ) : centers.length > 0 ? (
      centers.map((center) => (
        <MenuItem key={center.id} value={center.id}>
          {center.name || `Center ${center.id}`}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Centers Available</MenuItem>
    )}
  </Select>
</FormControl>


          {/* <FormControl sx={{ minWidth: 200 }} size="small">
  <InputLabel id="center-filter-label">Filter by Center</InputLabel>
  <Select
    labelId="center-filter-label"
    value={centerFilter}
    label="Filter by Center"
    onChange={(e) => setCenterFilter(e.target.value)}
    disabled={loadingCenters}
  >
    <MenuItem value="All">All Centers</MenuItem>
    {loadingCenters ? (
      <MenuItem disabled>Loading centers...</MenuItem>
    ) : centers.length > 0 ? (
      centers.map((center) => (
        <MenuItem key={center.id} value={center.id}>
          {center.name || `Center ${center.id}`}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Centers Available</MenuItem>
    )}
  </Select>
</FormControl> */}
          {/* <FormControl sx={{ minWidth: 200 }} size="small">
  <InputLabel id="center-filter-label">Filter by Center</InputLabel>
  <Select
    labelId="center-filter-label"
    value={centerFilter}
    label="Filter by Center"
    onChange={(e) => setCenterFilter(e.target.value)}
  >
    <MenuItem value="All">All Centers</MenuItem>
    {centers.length > 0 ? (
      centers.map((center) => (
        <MenuItem key={center.id} value={center.id}>
          {center.name || `Center ${center.id}`}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>Loading centers...</MenuItem>
    )}
  </Select>
</FormControl> */}
          {/* <FormControl sx={{ minWidth: 200 }} size="small">
  <InputLabel id="center-filter-label">Filter by Center</InputLabel>
  <Select
    labelId="center-filter-label"
    value={centerFilter}
    label="Filter by Center"
    onChange={(e) => setCenterFilter(e.target.value)}
  >
    <MenuItem value="All">All Centers</MenuItem>
    {centers.map((center) => (
      <MenuItem key={center.id} value={center.id}>
        {center.name}
      </MenuItem>
    ))}
  </Select>
</FormControl> */}
          {/* <FormControl sx={{ minWidth: 200 }} size="small">
  <InputLabel id="center-filter-label">Filter by Center</InputLabel>
  <Select
    labelId="center-filter-label"
    value={centerFilter}
    label="Filter by Center"
    onChange={(e) => setCenterFilter(e.target.value)}
  >
    <MenuItem value="All">All Centers</MenuItem>
    {centers.length > 0 ? (
      centers.map((center) => (
        <MenuItem key={center.id} value={center.id}>
          {center.name || "Unnamed Center"}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Centers Available</MenuItem>
    )}
  </Select>
</FormControl> */}
          {/* <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="center-filter-label">Filter by Center</InputLabel>
            <Select
              labelId="center-filter-label"
              value={centerFilter}
              label="Filter by Center"
              onChange={(e) => setCenterFilter(e.target.value)}
            >
              <MenuItem value="All">All Centers</MenuItem>
              {centers.map((center) => (
                <MenuItem key={center.id} value={center.id}>
                  {center.name || "Unnamed Center"}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </div>

     <div className="rounded-xl shadow-lg border border-gray-200 overflow-x-auto max-h-[70vh] overflow-y-auto bg-white">
  <table className="w-full table-auto text-sm">
    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
      <tr>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[5%]">Sr No</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[20%]">Course Name</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[10%]">Fee (₹)</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[8%]">Duration</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[8%]">Mode</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[22%]">Center</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[7%]">Status</th>
        <th className="px-3 py-3 font-semibold text-gray-700 uppercase tracking-wide text-center w-[15%]">Action</th>
      </tr>
    </thead>
    <tbody>
      {(searchResults.length > 0 || searchTerm.trim() ? searchResults : courses).map(
        (course, index) => (
          <tr
            key={course.id}
            className="border-b border-gray-200 hover:bg-gray-50 transition duration-200 text-center"
          >
            <td className="px-3 py-3">{index + 1}</td>
            <td className="px-3 py-3">{course.name || "N/A"}</td>
            <td className="px-3 py-3">{course.fee || "N/A"}</td>
            <td className="px-3 py-3">{course.duration || "N/A"}</td>
            <td className="px-3 py-3">{course.mode || "N/A"}</td>
            <td className="px-3 py-3">
              {course.centerIds && Array.isArray(course.centerIds) && course.centerIds.length > 0
                ? course.centerIds
                    .map((centerId) => {
                      const center =
                        centers.find((c) => c.id === centerId || c.centerId === centerId);
                      return center ? center.name || `Center ${centerId}` : `Unknown (${centerId})`;
                    })
                    .join(", ")
                : "No Centers"}
            </td>
            <td className="px-3 py-3">
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                  course.status === "Inactive"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {course.status || "Active"}
              </span>
            </td>
            <td className="px-3 py-3">
              <FormControl size="small">
                <Select
                  value=""
                  onChange={(e) => {
                    const action = e.target.value;
                    if (action === "delete" && canDelete) {
                      setDeleteId(course.id);
                      setOpenDelete(true);
                      setDeleteMessage(
                        "Are you sure you want to delete this course? This action cannot be undone."
                      );
                    } else if (action === "update" && canUpdate) {
                      handleEditClick(course);
                    } else if (action === "learners") {
                      handleLearnersClick(course.id);
                    }
                  }}
                  displayEmpty
                  renderValue={() => "Actions"}
                  disabled={!canUpdate && !canDelete}
                  className="bg-white border rounded-md"
                >
                  <MenuItem value="" disabled>
                    Actions
                  </MenuItem>
                  {canUpdate && <MenuItem value="update">Update</MenuItem>}
                  {canDelete && <MenuItem value="delete">Delete</MenuItem>}
                  <MenuItem value="learners">Learners</MenuItem>
                </Select>
              </FormControl>
            </td>
          </tr>
        )
      )}
      {!(searchResults.length > 0 || searchTerm.trim() ? searchResults : courses).length && (
        <tr>
          <td colSpan="8" className="px-5 py-4 text-center text-gray-500">
            No courses found.
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
          <CreateCourses
            isOpen={isOpen}
            toggleSidebar={handleClose}
            course={currentCourse}
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
          <DialogBody className="text-gray-600 text-base p-4">{deleteMessage}</DialogBody>
          <DialogFooter className="space-x-4 p-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            {deleteMessage ===
              "Are you sure you want to delete this course? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deleteCourse}
                className="text-sm"
              >
                Yes, Delete
              </Button>
            )}
          </DialogFooter>
        </Dialog>
      )}

      {isAdmin && (
        <Dialog
          open={openLogsDialog}
          handler={() => setOpenLogsDialog(false)}
          className="rounded-lg shadow-lg max-w-4xl"
        >
          <DialogHeader className="text-gray-800 font-semibold">Activity Logs</DialogHeader>
          <DialogBody className="text-gray-600 max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Timestamp</th>
                    <th className="px-2 py-1 text-left">User</th>
                    <th className="px-2 py-1 text-left">Action</th>
                    <th className="px-2 py-1 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={`${log.id}-${log.timestamp?.toMillis()}`}
                      className="border-b"
                    >
                      <td className="px-2 py-1">
                        {log.timestamp
                          ? new Date(log.timestamp.toDate()).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1">{log.userEmail}</td>
                      <td className="px-2 py-1">{log.action}</td>
                      <td className="px-2 py-1">{JSON.stringify(log.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No logs available.</p>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenLogsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {openLearnersDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <LearnerList
              courseId={selectedCourseId}
              open={openLearnersDialog}
              onClose={() => setOpenLearnersDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}