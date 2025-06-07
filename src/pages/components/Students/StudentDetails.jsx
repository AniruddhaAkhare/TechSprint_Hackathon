import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  writeBatch,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useAuth } from "../../../context/AuthContext";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { debounce } from "lodash";

export default function StudentDetails() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const { rolePermissions, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    course: "",
    center: "",
    batch: "",
    status: "",
    goal: "",
  });
  const [goalOptions, setGoalOptions] = useState([]);

  const canCreate = rolePermissions?.student?.create || false;
  const canUpdate = rolePermissions?.student?.update || false;
  const canDelete = rolePermissions?.student?.delete || false;
  const canDisplay = rolePermissions?.student?.display || false;

  const debouncedSetSearchQuery = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    []
  );

  // Activity logging with batch support
  // const logActivity = async (batch, action, details) => {
  //   if (!user?.email) return;
  //   batch.set(doc(collection(db, "activityLogs")), {
  //     action,
  //     details,
  //     timestamp: new Date().toISOString(),
  //     userEmail: user.email,
  //     userId: user.uid,
  //     adminId: adminId || "N/A",
  //   });
  // };

  const logActivity = async (action, details) => {
  if (!user?.email) return;

  const activityLogRef = doc(db, "activityLogs", "logDocument");

  const logEntry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    userId: user.uid,
    section:"Student",
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
    toast.error("Failed to log activity");
  }
};

  useEffect(() => {
    if (!canDisplay) {
      toast.error("You don't have permission to view student details");
      navigate("/");
      return;
    }

    // Fetch Students
    const studentsQuery = query(collection(db, "student"));
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
      const uniqueGoals = [
        ...new Set(studentList.map((s) => s.goal).filter((g) => g && g.trim())),
      ].sort();
      setGoalOptions(uniqueGoals);
    }, (error) => {
      //console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    });

    // Fetch Courses
    const coursesQuery = query(collection(db, "Course"));
    const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        centerIds: doc.data().centerIds || [],
      }));
      setCourses(courseList);
    }, (error) => {
      //console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    });

    // Fetch Centers
    const centersQuery = query(collection(db, "instituteSetup", "RDJ9wMXGrIUk221MzDxP", "Center"));
    const unsubscribeCenters = onSnapshot(centersQuery, (snapshot) => {
      const centerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centerList);
      setAvailableCenters(centerList);
    }, (error) => {
      //console.error("Error fetching centers:", error);
      toast.error("Failed to fetch centers");
    });

    // Fetch Batches
    const batchesQuery = query(collection(db, "Batch"));
    const unsubscribeBatches = onSnapshot(batchesQuery, (snapshot) => {
      const batchList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        courseId: doc.data().courseId || "",
        centerId: doc.data().centerId || "",
      }));
      setBatches(batchList);
      setAvailableBatches(batchList);
    }, (error) => {
      //console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches");
    });

    return () => {
      unsubscribeStudents();
      unsubscribeCourses();
      unsubscribeCenters();
      unsubscribeBatches();
    };
  }, [canDisplay, navigate]);

  // Memoized filter application
  const applyFilters = useMemo(() => (studentList, filters, query) => {
    let filtered = [...studentList];
    if (query) {
      filtered = filtered.filter((student) =>
        [
          student.Name,
          // student.last_name,
          student.email,
          student.phone,
        ].some((field) => field?.toLowerCase().includes(query.toLowerCase()))
      );
    }
    if (filters.course) {
      filtered = filtered.filter((student) =>
        (student.course_details?.map((c) => c.courseId) || []).includes(filters.course)
      );
    }
    if (filters.center) {
      filtered = filtered.filter((student) =>
        (student.preferred_centers || []).includes(filters.center)
      );
    }
    if (filters.batch) {
      filtered = filtered.filter((student) => student.batchId === filters.batch);
    }
    if (filters.status) {
      filtered = filtered.filter((student) => student.status === filters.status);
    }
    if (filters.goal) {
      filtered = filtered.filter((student) =>
        student.goal?.toLowerCase() === filters.goal.toLowerCase()
      );
    }
    setFilteredStudents(filtered);
    toast.success(`Filtered to ${filtered.length} student(s).`);
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      applyFilters(students, filters, searchQuery);
    }
  }, [students, filters, searchQuery, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "course") {
        newFilters.center = "";
        newFilters.batch = "";
        const selectedCourse = courses.find((c) => c.id === value);
        const validCenterIds = selectedCourse ? selectedCourse.centerIds : [];
        setAvailableCenters(centers.filter((center) => validCenterIds.includes(center.id)));
        setAvailableBatches(batches.filter((batch) => batch.courseId === value));
      } else if (name === "center") {
        newFilters.batch = "";
        setAvailableBatches(batches.filter((batch) => batch.courseId === filters.course && batch.centerId === value));
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({ course: "", center: "", batch: "", status: "", goal: "" });
    setSearchQuery("");
    setAvailableCenters(centers);
    setAvailableBatches(batches);
    setFilteredStudents(students);
    setOpenFilter(false);
    toast.success("Filters reset successfully.");
  };

  const handleStudentSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (studentId, newStatus) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update student status");
      return;
    }
    const batch = writeBatch(db);
    batch.update(doc(db, "student", studentId), { status: newStatus });
    logActivity("Student status updated", { studentId, newStatus });
    try {
      await batch.commit();
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      //console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteStudent = async () => {
    if (!canDelete || !deleteId) {
      toast.error("You don't have permission to delete students");
      return;
    }
    const batch = writeBatch(db);
    batch.delete(doc(db, "student", deleteId));
    logActivity("Student details deleted", { student: deleteId.Name });
    try {
      await batch.commit();
      toast.success("Student deleted successfully!");
      setOpenDelete(false);
    } catch (error) {
      //console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  const getCenterNames = useMemo(() => (centerIds) => {
    if (!centerIds || centerIds.length === 0) return "No Centers";
    return centerIds
      .map((id) => centers.find((c) => c.id === id)?.name || "Unknown Center")
      .join(", ");
  }, [centers]);

  if (!canDisplay) return null;

  return (
<div className="p-6 fixed inset-0 left-[300px] bg-gray-50">
  <ToastContainer position="top-right" autoClose={3000} />

  <main className="max-w-[1400px] mx-auto">
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-[#333333] font-sans">Student Details</h1>

      <div className="flex space-x-3">
        <button
          onClick={() => setOpenFilter(true)}
          className="inline-flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label="Open filters"
        >
          <FaFilter className="text-lg" />
          Filters
          <FaChevronDown className="text-sm" />
        </button>

        {canCreate && (
          <>
            <button
              onClick={() => navigate("/studentdetails/addstudent")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              Add Student
            </button>
            <button
              onClick={() => navigate("/studentdetails/bulkadd")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            >
              Bulk Add Students
            </button>
          </>
        )}
      </div>
    </header>

    <section className="bg-white p-8 rounded-xl shadow-lg flex flex-col min-h-[70vh]">
      <div className="mb-8">
       <div className="relative w-full max-w-lg">
  <svg
    className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
    onChange={(e) => debouncedSetSearchQuery(e.target.value)}
    placeholder="Search by name, email, or phone..."
    className="w-full px-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
    aria-label="Search students"
  />
</div>

      </div>

      <div className="overflow-auto max-h-[calc(100vh-350px)] rounded-lg border border-gray-200 shadow-inner">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-gray-100 sticky top-0 z-20">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Name</th>
              <th className="text-left p-4 font-semibold text-gray-600">Email</th>
              <th className="text-left p-4 font-semibold text-gray-600">Phone</th>
              <th className="text-left p-4 font-semibold text-gray-600">Preferred Learning Centers</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 font-semibold text-gray-600">Goal</th>
              {(canUpdate || canDelete) && <th className="p-4"></th>}
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {/** Name */}
                <td
                  className="p-4 text-gray-800 font-medium hover:text-blue-600"
                  onClick={() => navigate(`/studentdetails/${student.id}`)}
                >
                  {student.Name || "N/A"}
                </td>

                {/** Email */}
                <td
                  className="p-4 text-gray-700 hover:text-blue-600"
                  onClick={() => navigate(`/studentdetails/${student.id}`)}
                >
                  {student.email || "N/A"}
                </td>

                {/** Phone */}
                <td
                  className="p-4 text-gray-700 hover:text-blue-600"
                  onClick={() => navigate(`/studentdetails/${student.id}`)}
                >
                  {student.phone || "N/A"}
                </td>

                {/** Preferred Learning Centers */}
                <td
                  className="p-4 text-gray-700 hover:text-blue-600 min-w-[180px]"
                  onClick={() => navigate(`/studentdetails/${student.id}`)}
                >
                  {getCenterNames(student.preferred_centers)}
                </td>

                {/** Status dropdown */}
                <td className="p-4">
                  <select
                    value={student.status || "enrolled"}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    disabled={!canUpdate}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-label={`Change status for ${student.Name}`}
                  >
                    <option value="enquiry">Enquiry</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="deferred">Deferred</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                {/** Goal */}
                <td
                  className="p-4 text-gray-700 hover:text-blue-600"
                  onClick={() => navigate(`/studentdetails/${student.id}`)}
                >
                  {student.goal || "N/A"}
                </td>

                {(canUpdate || canDelete) && (
                  <td className="p-4 flex space-x-3 justify-end">
                    {canUpdate && (
                      <button
                        onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)}
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        aria-label={`Update ${student.Name}`}
                      >
                        Update
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          setDeleteId(student.id);
                          setOpenDelete(true);
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                        aria-label={`Delete ${student.Name}`}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {canDelete && openDelete && (
      <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
        <DialogHeader className="text-gray-900 font-semibold">Confirm Deletion</DialogHeader>
        <DialogBody className="text-gray-700">
          Are you sure you want to delete this student? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenDelete(false)} className="mr-4">
            Cancel
          </Button>
          <Button variant="filled" color="red" onClick={deleteStudent}>
            Yes, Delete
          </Button>
        </DialogFooter>
      </Dialog>
    )}

    {openFilter && (
      <Dialog
        open={openFilter}
        handler={() => setOpenFilter(false)}
        className="w-[480px] max-h-[80vh] mx-auto bg-transparent shadow-lg"
      >
        <DialogHeader className="text-gray-900 bg-white rounded-t-lg font-semibold text-lg">
          Filter Students
        </DialogHeader>
        <DialogBody className="text-gray-700 bg-white overflow-y-auto max-h-[50vh] px-6 py-5 space-y-6">
          <FilterSelect label="Course" name="course" value={filters.course} onChange={handleFilterChange} options={courses} allText="All Courses" />
          <FilterSelect label="Center" name="center" value={filters.center} onChange={handleFilterChange} options={availableCenters} allText="All Centers" />
          <FilterSelect label="Batch" name="batch" value={filters.batch} onChange={handleFilterChange} options={availableBatches} allText="All Batches" />
          <FilterSelect label="Status" name="status" value={filters.status} onChange={handleFilterChange} options={[
            { id: "enquiry", name: "Enquiry" },
            { id: "enrolled", name: "Enrolled" },
            { id: "deferred", name: "Deferred" },
            { id: "completed", name: "Completed" },
          ]} allText="All Statuses" />
          <FilterSelect label="Goal" name="goal" value={filters.goal} onChange={handleFilterChange} options={goalOptions.map(goal => ({ id: goal, name: goal }))} allText="All Goals" />
        </DialogBody>
        <DialogFooter className="bg-white rounded-b-lg">
          <Button variant="text" color="gray" onClick={() => setOpenFilter(false)} className="mr-3">
            Cancel
          </Button>
          <Button variant="filled" color="blue" onClick={resetFilters} className="mr-3">
            Reset
          </Button>
          <Button variant="filled" color="green" onClick={() => setOpenFilter(false)}>
            Apply
          </Button>
        </DialogFooter>
      </Dialog>
    )}
  </main>
</div>

  );
}