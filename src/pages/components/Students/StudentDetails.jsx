import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
  serverTimestamp,
  arrayUnion,
  increment,
  limit,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setDoc } from "firebase/firestore";
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

// Utility function to verify instituteId
const verifyInstituteId = async (uid, documentInstituteId) => {
  try {
    const userDocRef = doc(db, "Users", uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    const userInstituteId = userDoc.data().instituteId;
    return userInstituteId === documentInstituteId;
  } catch (error) {
    console.error("Error verifying instituteId:", error);
    return false;
  }
};

export default function StudentDetails() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const { rolePermissions, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
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
  const [instituteId, setInstituteId] = useState(null);
  const [error, setError] = useState(null);

  const canCreate = rolePermissions?.student?.create || false;
  const canUpdate = rolePermissions?.student?.update || false;
  const canDelete = rolePermissions?.student?.delete || false;
  const canDisplay = rolePermissions?.student?.display || false;

  const debouncedSetSearchQuery = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    []
  );

  // Fetch user's instituteId
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("No user is signed in");
        return;
      }

      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const institute = data.instituteId;
          if (institute) {
            setInstituteId(institute);
          } else {
            setError("Institute ID not found in user document");
          }
        } else {
          setError("User data not found");
        }
      } catch (err) {
        setError("Failed to fetch user data: " + err.message);
      }
    };

    fetchData();
  }, [user]);

  // Log activity
  const logActivity = async (action, details) => {
    if (!user?.email) return;
    try {
      const logDocRef = doc(db, "activityLogs", "currentLog");
      const logEntry = {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        action,
        details: { ...details, adminId: adminId || "N/A" },
      };
      await updateDoc(logDocRef, {
        logs: arrayUnion(logEntry),
        count: increment(1),
      }).catch(async (err) => {
        if (err.code === "not-found") {
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

  // Fetch data with instituteId filtering
  useEffect(() => {
    if (!canDisplay) {
      toast.error("You don't have permission to view student details");
      navigate("/");
      return;
    }

    if (!instituteId) return;

    const unsubscribes = [];

    // Fetch students
    unsubscribes.push(
      onSnapshot(
        query(
          collection(db, "student"),
          where("instituteId", "==", instituteId),
          limit(100)
        ),
        (snapshot) => {
          const studentList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudents(studentList);
          const uniqueGoals = [
            ...new Set(studentList.map((s) => s.goal).filter((g) => g && g.trim())),
          ].sort();
          setGoalOptions(uniqueGoals);
        },
        (error) => {
          console.error("Error fetching students:", error);
          setError("Failed to fetch students: " + error.message);
        }
      )
    );

    // Fetch courses
    unsubscribes.push(
      onSnapshot(
        query(
          collection(db, "Course"),
          where("instituteId", "==", instituteId),
          limit(100)
        ),
        (snapshot) => {
          const courseList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            centerIds: doc.data().centerIds || [],
          }));
          setCourses(courseList);
        },
        (error) => {
          console.error("Error fetching courses:", error);
          setError("Failed to fetch courses: " + error.message);
        }
      )
    );

    // Fetch centers (subcollection under instituteSetup/{instituteId})
    unsubscribes.push(
      onSnapshot(
        query(collection(db, "instituteSetup", instituteId, "Center"), limit(100)),
        (snapshot) => {
          const centerList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCenters(centerList);
          setAvailableCenters(centerList);
        },
        (error) => {
          console.error("Error fetching centers:", error);
          setError("Failed to fetch centers: " + error.message);
        }
      )
    );

    // Fetch batches
    unsubscribes.push(
      onSnapshot(
        query(
          collection(db, "Batch"),
          where("instituteId", "==", instituteId),
          limit(100)
        ),
        (snapshot) => {
          const batchList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            courseId: doc.data().courseId || "",
            centerId: doc.data().centerId || "",
          }));
          setBatches(batchList);
          setAvailableBatches(batchList);
        },
        (error) => {
          console.error("Error fetching batches:", error);
          setError("Failed to fetch batches: " + error.message);
        }
      )
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [canDisplay, instituteId, navigate]);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const queryMatch =
        !searchQuery ||
        [
          student.Name,
          student.email,
          student.phone,
        ].some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));

      const courseMatch =
        !filters.course ||
        (student.course_details?.map((c) => c.courseId) || []).includes(filters.course);

      const centerMatch =
        !filters.center ||
        (student.preferred_centers || []).includes(filters.center);

      const batchMatch = !filters.batch || student.batchId === filters.batch;

      const statusMatch = !filters.status || student.status === filters.status;

      const goalMatch =
        !filters.goal || student.goal?.toLowerCase() === filters.goal.toLowerCase();

      return queryMatch && courseMatch && centerMatch && batchMatch && statusMatch && goalMatch;
    });
  }, [students, searchQuery, filters]);

  // Toast for filtered results
  const debouncedUpdateToast = useMemo(
    () =>
      debounce(() => {
        if (
          filteredStudents.length === 0 &&
          (searchQuery || Object.values(filters).some((v) => v))
        ) {
          toast.warn("No students match the selected filters.", {
            toastId: "filter-warning",
          });
        } else if (searchQuery || Object.values(filters).some((v) => v)) {
          toast.success(`Filtered to ${filteredStudents.length} student(s).`, {
            toastId: "filter-success",
          });
        }
      }, 300),
    [filteredStudents]
  );

  useEffect(() => {
    debouncedUpdateToast();
    return () => debouncedUpdateToast.cancel();
  }, [filteredStudents, debouncedUpdateToast]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "course") {
        newFilters.center = "";
        newFilters.batch = "";
        const selectedCourse = courses.find((c) => c.id === value);
        const validCenterIds = selectedCourse ? selectedCourse.centerIds : [];
        setAvailableCenters(centers.filter((center) => !value || validCenterIds.includes(center.id)));
        setAvailableBatches(batches.filter((batch) => !value || batch.courseId === value));
      } else if (name === "center") {
        newFilters.batch = "";
        setAvailableBatches(
          batches.filter(
            (batch) => (!filters.course || batch.courseId === filters.course) && (!value || batch.centerId === value)
          )
        );
      }
      return newFilters;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ course: "", center: "", batch: "", status: "", goal: "" });
    setSearchQuery("");
    setAvailableCenters(centers);
    setAvailableBatches(batches);
    setOpenFilter(false);
    toast.success("Filters reset successfully.");
  };

  // Update student status
  const handleStatusChange = async (studentId, newStatus) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update student status");
      return;
    }
    try {
      const studentDocRef = doc(db, "student", studentId);
      const studentDoc = await getDoc(studentDocRef);
      if (!studentDoc.exists()) {
        throw new Error("Student not found");
      }
      const isAuthorized = await verifyInstituteId(user.uid, studentDoc.data().instituteId);
      if (!isAuthorized) {
        throw new Error("Unauthorized to update this student");
      }
      await updateDoc(studentDocRef, { status: newStatus });
      await logActivity("UPDATE STUDENT STATUS", { studentId, newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status: " + error.message);
      toast.error(error.message);
    }
  };

  // Delete student
  const deleteStudent = async () => {
    if (!canDelete || !deleteId) {
      toast.error("You don't have permission to delete students");
      return;
    }
    try {
      const studentDocRef = doc(db, "student", deleteId);
      const studentDoc = await getDoc(studentDocRef);
      if (!studentDoc.exists()) {
        throw new Error("Student not found");
      }
      const isAuthorized = await verifyInstituteId(user.uid, studentDoc.data().instituteId);
      if (!isAuthorized) {
        throw new Error("Unauthorized to delete this student");
      }
      await deleteDoc(studentDocRef);
      await logActivity("DELETE STUDENT", { studentId: deleteId });
      toast.success("Student deleted successfully!");
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student: " + error.message);
      toast.error(error.message);
    }
  };

  // Get center names
  const getCenterNames = useMemo(
    () => (centerIds) => {
      if (!centerIds || centerIds.length === 0) return "No Centers";
      return centerIds
        .map((id) => centers.find((c) => c.id === id)?.name || "Unknown Center")
        .join(", ");
    },
    [centers]
  );

  if (!canDisplay) return null;

  return (
    <div className="p-4 fixed inset-0 left-[300px]">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && (
        <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-md mb-4">
          {error}
        </div>
      )}
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Student Details</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setOpenFilter(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Open filter dialog"
            >
              <FaFilter />
              Filters
              <FaChevronDown />
            </button>
            {canCreate && (
              <>
                <button
                  onClick={() => navigate(`/studentdetails/${adminId}/addstudent`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Add a new student"
                >
                  Add Student
                </button>
                <button
                  onClick={() => navigate(`/studentdetails/${adminId}/bulkadd`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="Bulk add students"
                >
                  Bulk Add Students
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
          <div className="mb-6">
            <input
              type="text"
              onChange={(e) => debouncedSetSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search students by name, email, or phone"
            />
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10">
                  <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-40">Name</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-40">Email</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-40">Phone</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-80">Preferred Learning Centers</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-40">Status</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-40">Goal</th>
                  {(canUpdate || canDelete) && (
                    <th className="p-3 text-sm font-medium text-gray-800 min-w-40"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${adminId}/${student.id}`)}
                    >
                      {student.Name || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${adminId}/${student.id}`)}
                    >
                      {student.email || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${adminId}/${student.id}`)}
                    >
                      {student.phone || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-80"
                      onClick={() => navigate(`/studentdetails/${adminId}/${student.id}`)}
                    >
                      {getCenterNames(student.preferred_centers)}
                    </td>
                    <td className="p-3 min-w-40">
                      <select
                        value={student.status || "enrolled"}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        disabled={!canUpdate}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Status for student ${student.Name || "Unnamed"}`}
                      >
                        <option value="enquiry">Enquiry</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="deferred">Deferred</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${adminId}/${student.id}`)}
                    >
                      {student.goal || "N/A"}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="p-3 min-w-40">
                        <div className="flex space-x-2">
                          {canUpdate && (
                            <button
                              onClick={() => navigate(`/studentdetails/${adminId}/updatestudent/${student.id}`)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              aria-label={`Update student ${student.Name || "Unnamed"}`}
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
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              aria-label={`Delete student ${student.Name || "Unnamed"}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={canUpdate || canDelete ? 7 : 6} className="p-3 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {canDelete && openDelete && (
          <Dialog
            open={openDelete}
            handler={() => setOpenDelete(false)}
            className="rounded-lg shadow-lg w-96 max-w-[90%] mx-auto"
            role="alertdialog"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogHeader id="delete-dialog-title" className="text-gray-800">
              Confirm Deletion
            </DialogHeader>
            <DialogBody id="delete-dialog-description" className="text-gray-700">
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="gray"
                onClick={() => setOpenDelete(false)}
                className="mr-2 hover:bg-gray-100 transition duration-200"
                aria-label="Cancel deletion"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={deleteStudent}
                className="bg-red-600 hover:bg-red-700 transition duration-200"
                aria-label="Confirm delete student"
              >
                Yes, Delete
              </Button>
            </DialogFooter>
          </Dialog>
        )}

        {openFilter && (
          <Dialog
            open={openFilter}
            handler={() => setOpenFilter(false)}
            className="w-[500px] max-h-[80vh] mx-auto bg-transparent shadow-lg"
            role="dialog"
            aria-labelledby="filter-dialog-title"
          >
            <DialogHeader id="filter-dialog-title" className="text-gray-800 bg-white rounded-t-lg">
              Filter Students
            </DialogHeader>
            <DialogBody className="text-gray-700 bg-white overflow-y-auto max-h-[50vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Course</label>
                  <select
                    name="course"
                    value={filters.course}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by course"
                  >
                    <option value="">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || "Unnamed Course"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Center</label>
                  <select
                    name="center"
                    value={filters.center}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by center"
                  >
                    <option value="">All Centers</option>
                    {availableCenters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || "Unnamed Center"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Batch</label>
                  <select
                    name="batch"
                    value={filters.batch}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by batch"
                  >
                    <option value="">All Batches</option>
                    {availableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name || "Unnamed Batch"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by status"
                  >
                    <option value="">All Statuses</option>
                    <option value="enquiry">Enquiry</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="deferred">Deferred</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Goal</label>
                  <select
                    name="goal"
                    value={filters.goal}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by goal"
                  >
                    <option value="">All Goals</option>
                    {goalOptions.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </DialogBody>
            <DialogFooter className="bg-white rounded-b-lg">
              <Button
                variant="text"
                color="gray"
                onClick={() => setOpenFilter(false)}
                className="mr-2 hover:bg-gray-100 transition duration-200"
                aria-label="Cancel filter changes"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={resetFilters}
                className="mr-2 bg-blue-600 hover:bg-blue-700 transition duration-200"
                aria-label="Reset filters"
              >
                Reset
              </Button>
              <Button
                variant="filled"
                color="green"
                onClick={() => setOpenFilter(false)}
                className="bg-green-600 hover:bg-green-700 transition duration-200"
                aria-label="Apply filters"
              >
                Apply
              </Button>
            </DialogFooter>
          </Dialog>
        )}
      </div>
    </div>
  );
}