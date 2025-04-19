import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
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


export default function StudentDetails() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const { rolePermissions, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [course, setCourse] = useState([]);
  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
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

  // Define permissions for Student
  const canCreate = rolePermissions?.student?.create || false;
  const canUpdate = rolePermissions?.student?.update || false;
  const canDelete = rolePermissions?.student?.delete || false;
  const canDisplay = rolePermissions?.student?.display || false;
  const canEnroll = rolePermissions?.student?.enroll || true;

  // Activity logging function
  const logActivity = async (action, details) => {
    if (!user?.email) {
      console.warn("No user email available for logging");
      return;
    }
    try {
      const activityLog = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user.email,
        userId: user.uid,
        adminId: adminId || "N/A",
      };
      await addDoc(collection(db, "activityLogs"), activityLog);
      console.log(`Logged activity: ${action}`, details);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  useEffect(() => {
    if (!canDisplay) {
      toast.error("You don't have permission to view student details");
      navigate("/");
      return;
    }
    const fetchData = async () => {
      await Promise.all([
        fetchStudents(),
        fetchCourse(),
        fetchCenters(),
        fetchBatches(),
      ]);
    };
    fetchData();
  }, [canDisplay, navigate]);

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "student"));
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
      // Extract unique goal values
      const uniqueGoals = [
        ...new Set(
          studentList
            .map((student) => student.goal)
            .filter((goal) => goal && goal.trim() !== "")
        ),
      ].sort();
      setGoalOptions(uniqueGoals);
      applyFilters(studentList, filters, searchQuery);
      return studentList.length;
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
      return 0;
    }
  };

  const fetchCourse = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Course"));
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourse(courseList);
      return courseList.length;
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
      return 0;
    }
  };

  const fetchCenters = async () => {
    try {
      const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
      if (instituteSnapshot.empty) {
        console.error("No instituteSetup document found");
        setCenters([]);
        return 0;
      }

      const instituteId = instituteSnapshot.docs[0].id;
      const centerQuery = query(
        collection(db, "instituteSetup", instituteId, "Center"),
        where("isActive", "==", true)
      );
      const centerSnapshot = await getDocs(centerQuery);
      const centerList = centerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centerList);
      return centerList.length;
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast.error("Failed to fetch centers");
      return 0;
    }
  };

  const fetchBatches = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Batch"));
      const batchList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBatches(batchList);
      return batchList.length;
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches");
      return 0;
    }
  };

  const applyFilters = (studentList, currentFilters, query) => {
    console.log("Applying filters:", { currentFilters, query, studentList });
    let filtered = [...studentList];

    // Apply search query
    if (query) {
      filtered = filtered.filter((student) =>
        [
          student.first_name,
          student.last_name,
          student.email,
          student.phone,
        ].some(
          (field) =>
            field &&
            field.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    // Apply course filter
    if (currentFilters.course) {
      filtered = filtered.filter((student) => {
        const courseIds = student.course_details?.map((c) => c.courseId) || [];
        console.log(
          `Course filter: student ${student.id}, courseIds:`,
          courseIds,
          `filter: ${currentFilters.course}`
        );
        return courseIds.includes(currentFilters.course);
      });
    }

    // Apply center filter
    if (currentFilters.center) {
      filtered = filtered.filter((student) => {
        const centers = student.preferred_centers || [];
        console.log(
          `Center filter: student ${student.id}, centers:`,
          centers,
          `filter: ${currentFilters.center}`
        );
        return centers.includes(currentFilters.center);
      });
    }

    // Apply batch filter
    if (currentFilters.batch) {
      filtered = filtered.filter((student) => {
        console.log(
          `Batch filter: student ${student.id}, batchId:`,
          student.batchId,
          `filter: ${currentFilters.batch}`
        );
        return student.batchId === currentFilters.batch;
      });
    }

    // Apply status filter
    if (currentFilters.status) {
      filtered = filtered.filter((student) => {
        console.log(
          `Status filter: student ${student.id}, status:`,
          student.status,
          `filter: ${currentFilters.status}`
        );
        return student.status === currentFilters.status;
      });
    }

    // Apply goal filter
    if (currentFilters.goal) {
      filtered = filtered.filter((student) => {
        console.log(
          `Goal filter: student ${student.id}, goal:`,
          student.goal,
          `filter: ${currentFilters.goal}`
        );
        return (
          student.goal &&
          student.goal.toLowerCase() === currentFilters.goal.toLowerCase()
        );
      });
    }

    setFilteredStudents(filtered);
    if (filtered.length === 0) {
      toast.warn("No students match the selected filters.");
    } else {
      toast.success(`Filtered to ${filtered.length} student(s).`);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(students, filters, query);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // Apply filters immediately for better UX
    applyFilters(students, newFilters, searchQuery);
  };

  const resetFilters = () => {
    const newFilters = {
      course: "",
      center: "",
      batch: "",
      status: "",
      goal: "",
    };
    setFilters(newFilters);
    setSearchQuery("");
    applyFilters(students, newFilters, "");
    setOpenFilter(false);
    toast.success("Filters reset successfully.");
  };

  const handleApplyFilters = () => {
    applyFilters(students, filters, searchQuery);
    setOpenFilter(false);
  };

  const handleStudentSelect = (id) => {
    if (!canEnroll) {
      toast.error("You don't have permission to enroll students");
      return;
    }
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCourseSelect = (e) => {
    if (!canEnroll) {
      toast.error("You don't have permission to enroll students");
      return;
    }
    const courseId = e.target.value;
    setSelectedCourse([courseId]);
  };

  const handleStatusChange = async (studentId, newStatus) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update student status");
      return;
    }
    try {
      const studentRef = doc(db, "student", studentId);
      await updateDoc(studentRef, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      await fetchStudents();
      logActivity("UPDATE STUDENT STATUS", { studentId, newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteStudent = async () => {
    if (!canDelete || !deleteId) {
      toast.error("You don't have permission to delete students");
      return;
    }
    try {
      await deleteDoc(doc(db, "student", deleteId));
      toast.success("Student deleted successfully!");
      await fetchStudents();
      logActivity("DELETE STUDENT", { studentId: deleteId });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
    setOpenDelete(false);
  };

  const handleBulkEnrollment = async () => {
    if (!canEnroll) {
      toast.error("You don't have permission to enroll students");
      return;
    }
    if (selectedStudents.length === 0 || selectedCourse.length === 0) {
      toast.error("Please select at least one student and one course.");
      return;
    }

    try {
      const batch = writeBatch(db);
      const enrollmentTimestamp = new Date();
      let studentsSkipped = 0;
      let enrollmentsCreated = 0;
      const courseMap = new Map(course.map((c) => [c.id, c]));

      for (const studentId of selectedStudents) {
        const studentRef = doc(db, "student", studentId);
        const studentSnapshot = await getDocs(collection(db, "student"));
        const student = studentSnapshot.docs.find(
          (doc) => doc.id === studentId
        )?.data();

        if (!student) {
          console.warn(`Student not found: ${studentId}`);
          studentsSkipped++;
          continue;
        }

        const existingCourses =
          student.course_details?.map((c) => c.courseId) || [];
        const newCourseIds = selectedCourse.filter(
          (courseId) => !existingCourses.includes(courseId)
        );

        if (newCourseIds.length === 0) {
          studentsSkipped++;
          continue;
        }

        const newCourseDetails = newCourseIds.map((courseId) => {
          const courseDetails = courseMap.get(courseId);
          return {
            courseId,
            courseName: courseDetails?.name || "Unknown Course",
            enrolledAt: enrollmentTimestamp,
          };
        });

        const updatedCourseDetails = [
          ...(student.course_details || []),
          ...newCourseDetails,
        ];
        batch.update(studentRef, { course_details: updatedCourseDetails });

        for (const courseId of newCourseIds) {
          const enrollmentRef = doc(collection(db, "enrollment"));
          const courseDetails = courseMap.get(courseId);

          batch.set(enrollmentRef, {
            enrollmentId: enrollmentRef.id,
            studentId,
            studentName: `${student.first_name} ${student.last_name}`,
            studentEmail: student.email,
            courseId,
            courseName: courseDetails?.name || "Unknown Course",
            enrolledAt: enrollmentTimestamp,
            status: "active",
            lastUpdated: enrollmentTimestamp,
          });
          enrollmentsCreated++;
        }
      }

      await batch.commit();
      await fetchStudents();

      if (studentsSkipped > 0) {
        toast.warn(
          `${studentsSkipped} students were already enrolled in the selected courses.`
        );
      }
      toast.success(
        `Created ${enrollmentsCreated} enrollment records for ${
          selectedStudents.length - studentsSkipped
        } students.`
      );
      logActivity("BULK ENROLL SUCCESS", {
        enrolledCount: enrollmentsCreated,
        studentCount: selectedStudents.length - studentsSkipped,
        courseIds: selectedCourse,
      });

      setSelectedStudents([]);
      setSelectedCourse([]);
    } catch (error) {
      console.error("Error enrolling students:", error);
      toast.error("Failed to enroll students. Please try again.");
    }
  };

  const getCenterNames = (centerIds) => {
    if (!centerIds || centerIds.length === 0) return "No Centers";
    return centerIds
      .map((id) => {
        const center = centers.find((c) => c.id === id);
        return center ? center.name : "Unknown Center";
      })
      .join(", ");
  };

  if (!canDisplay) return null;

  return (
    <div className="p-4 fixed inset-0 left-[300px]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Student Details
          </h1>
          <div className="flex space-x-2">
            <button
                      onClick={() => setOpenFilter(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FaFilter />
                      Filters
                      <FaChevronDown />
                    </button>
            {canCreate && (
              <button
                onClick={() => navigate("/studentdetails/addstudent")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Student
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, email, or phone..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10">
                  {canEnroll && (
                    <th className="p-3 text-sm font-medium text-gray-600 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setSelectedStudents(
                            e.target.checked
                              ? filteredStudents.map((s) => s.id)
                              : []
                          )
                        }
                        className="rounded"
                      />
                    </th>
                  )}
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    First Name
                  </th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    Last Name
                  </th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    Email
                  </th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    Phone
                  </th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    Preferred Learning Centers
                  </th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    Status
                  </th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">
                    Goal
                  </th>
                  {(canUpdate || canDelete) && (
                    <th className="p-3 text-sm font-medium text-gray-600 text-left">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    {canEnroll && (
                      <td className="p-3 min-w-40">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentSelect(student.id)}
                          className="rounded"
                        />
                      </td>
                    )}
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${student.id}`)}
                    >
                      {student.first_name || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${student.id}`)}
                    >
                      {student.last_name || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${student.id}`)}
                    >
                      {student.email || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${student.id}`)}
                    >
                      {student.phone || "N/A"}
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-80"
                      onClick={() => navigate(`/studentdetails/${student.id}`)}
                    >
                      {getCenterNames(student.preferred_centers)}
                    </td>
                    <td className="p-3">
                      <select
                        value={student.status || "enrolled"}
                        onChange={(e) =>
                          handleStatusChange(student.id, e.target.value)
                        }
                        disabled={!canUpdate}
                        className="w-full min-w-40 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="enquiry">Enquiry</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="deferred">Deferred</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td
                      className="p-3 text-gray-700 cursor-pointer hover:text-blue-600 min-w-40"
                      onClick={() => navigate(`/studentdetails/${student.id}`)}
                    >
                      {student.goal || "N/A"}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="p-3 min-w-40">
                        <div className="flex space-x-2">
                          {canUpdate && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/studentdetails/updatestudent/${student.id}`
                                )
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
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
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {canEnroll && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Bulk Enrollment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Courses
                </label>
                <select
                  value={selectedCourse.length > 0 ? selectedCourse[0] : ""}
                  onChange={handleCourseSelect}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a course --</option>
                  {course.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBulkEnrollment}
                disabled={
                  selectedStudents.length === 0 || selectedCourse.length === 0
                }
                className={`bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 ${
                  selectedStudents.length === 0 || selectedCourse.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
                }`}
              >
                Enroll Selected Students
              </button>
            </div>
          </div>
        )}

        {canDelete && openDelete && (
          <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
            <DialogHeader className="text-gray-800">
              Confirm Deletion
            </DialogHeader>
            <DialogBody className="text-gray-700">
              Are you sure you want to delete this student? This action cannot be
              undone.
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="gray"
                onClick={() => setOpenDelete(false)}
                className="mr-2"
              >
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
            className="w-[500px] max-h-[80vh] mx-auto bg-transparent shadow-lg"
          >
            <DialogHeader className="text-gray-800 bg-white rounded-t-lg">
              Filter Students
            </DialogHeader>
            <DialogBody className="text-gray-700 bg-white overflow-y-auto max-h-[50vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Course
                  </label>
                  <select
                    name="course"
                    value={filters.course}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Courses</option>
                    {course.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Center
                  </label>
                  <select
                    name="center"
                    value={filters.center}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Centers</option>
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Batch
                  </label>
                  <select
                    name="batch"
                    value={filters.batch}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Batches</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="enquiry">Enquiry</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="deferred">Deferred</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Goal
                  </label>
                  <select
                    name="goal"
                    value={filters.goal}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={resetFilters}
                className="mr-2"
              >
                Reset
              </Button>
              <Button
                variant="filled"
                color="green"
                onClick={handleApplyFilters}
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