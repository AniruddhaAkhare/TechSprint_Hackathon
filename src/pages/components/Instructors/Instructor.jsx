import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { getDocs, collection, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";
import AddInstructor from "./AddInstructor";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Instructor() {
  const navigate = useNavigate();
  const { rolePermissions, currentUser } = useAuth();
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorList, setInstructorList] = useState([]);
  const [centers, setCenters] = useState([]);

  const instructorCollectionRef = collection(db, "Instructor");
  const roleCollectionRef = collection(db, "roles");
  const activityLogsCollectionRef = collection(db, "activityLogs");

  const canCreate = rolePermissions?.Instructor?.create || false;
  const canUpdate = rolePermissions?.Instructor?.update || false;
  const canDelete = rolePermissions?.Instructor?.delete || false;
  const canDisplay = rolePermissions?.Instructor?.display || false;

  const countryCodes = [
    
    { code: "+1", label: "Canada (+1)" }, 
    
    { code: "+994", label: "Azerbaijan (+994)" },
    { code: "+995", label: "Georgia (+995)" },
    { code: "+996", label: "Kyrgyzstan (+996)" },
    { code: "+998", label: "Uzbekistan (+998)" },
  ];


  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized");
      return;
    }
    const fetchData = async () => {
      try {
        const instructorsQuery = query(instructorCollectionRef, orderBy("created_at", "desc"));
        const instructors = await getDocs(instructorsQuery);
        setInstructorList(instructors.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!instituteSnapshot.empty) {
          const instituteId = instituteSnapshot.docs[0].id;
          const centerQuery = query(
            collection(db, "instituteSetup", instituteId, "Center"),
            where("isActive", "==", true)
          );
          const centerData = await getDocs(centerQuery);
          setCenters(centerData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }

        const rolesData = await getDocs(roleCollectionRef);
        setRoles(rolesData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [canDisplay, navigate, instructorCollectionRef, roleCollectionRef]);

  const logActivity = async (action, details) => {
    if (!currentUser) {
      console.error("No currentUser for logging");
      return;
    }
    try {
      const logData = {
        userId: currentUser.uid,
        userEmail: currentUser.email || "Unknown",
        timestamp: serverTimestamp(),
        action,
        details,
      };
      console.log("Logging from Instructor:", logData); 
      await addDoc(activityLogsCollectionRef, logData);
    } catch (error) {
      console.error("Error logging activity in Instructor:", error);
    }
  };

  const handleDeleteInstructor = async () => {
    if (!canDelete || !selectedInstructor?.id) return;
    try {
      const instructorDetails = { ...selectedInstructor };
      await deleteDoc(doc(db, "Instructor", selectedInstructor.id));
      setInstructorList((prevList) =>
        prevList.filter((inst) => inst.id !== selectedInstructor.id)
      );
      await logActivity("Deleted Instructor", { instructor: instructorDetails });
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const handleInstructorSave = (instructorData, isUpdate = false) => {
    setInstructorList((prevList) =>
      isUpdate
        ? prevList.map((i) => (i.id === instructorData.id ? instructorData : i))
        : [...prevList, instructorData]
    );
    setOpenDrawer(false);
  };

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (!canDisplay) return null; // Render nothing if no display permission

  return (
    <div className="p-4 fixed inset-0 left-[300px] overflow-auto">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Staff Details</h1>
          {/* {canCreate && (
            <button
              onClick={() => {
                setSelectedInstructor({});
                setOpenDrawer(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              + Add Instructor
            </button>
          )} */}
          {canCreate && (
            <button
              onClick={() => {
                navigate('/addstaff');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              + Add Staff
            </button>
          )}
        </div>

        {/* Search and Table Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Name</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Email</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Phone</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Specialization</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Center</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Role</th>
                  {(canUpdate || canDelete) && (
                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {instructorList
                  .filter((i) => i.Name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((instructor) => (
                    <tr key={instructor.id} className="border-b hover:bg-gray-50 cursor-pointer" >
                      <td className="p-3 text-gray-700" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>
                        {capitalizeFirstLetter(instructor.Name)}{" "}
                      </td>
                      <td className="p-3 text-gray-700" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>{instructor.email || "N/A"}</td>
                      <td className="p-3 text-gray-700" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>
                        {instructor.phone ? ` ${instructor.phone}` : "N/A"}
                      </td>
                      <td className="p-3 text-gray-700" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>{instructor.specialization || "N/A"}</td>
                      <td className="p-3 text-gray-700" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>{instructor.center || "N/A"}</td>
                      <td className="p-3 text-gray-700" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>{instructor.role || "N/A"}</td>
                      {(canUpdate || canDelete) && (
                        <td className="p-3">
                          <div className="flex space-x-2">
                            {canUpdate && (
                              <button
                                onClick={() => {
                                  navigate(`/editstaff/${instructor.id}`)
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => {
                                  setSelectedInstructor(instructor);
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

        {/* Delete Confirmation Dialog */}
        {openDelete && canDelete && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setOpenDelete(false)}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this instructor? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setOpenDelete(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInstructor}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add/Edit Instructor Drawer */}
        {(canCreate || canUpdate) && (
        <AddInstructor
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          instructor={selectedInstructor}
          centers={centers}
          roles={roles}
          setInstructorList={setInstructorList}
          onSave={handleInstructorSave}
          currentUser={currentUser} // Pass currentUser here
        />
      )}
      </div>
    </div>
  );
}
