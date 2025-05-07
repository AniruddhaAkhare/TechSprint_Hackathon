import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { getDocs, collection, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";
import AddInstructor from "./AddInstructor";
import { useAuth } from "../../../context/AuthContext"; // Adjust the import path as needed
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

  // Define permissions for Instructor
  const canCreate = rolePermissions?.Instructor?.create || false;
  const canUpdate = rolePermissions?.Instructor?.update || false;
  const canDelete = rolePermissions?.Instructor?.delete || false;
  const canDisplay = rolePermissions?.Instructor?.display || false;

  const countryCodes = [
    { code: "+1", label: "USA (+1)" },
    { code: "+1", label: "Canada (+1)" }, // Note: Canada shares +1 with the USA, but you might differentiate by region if needed
    { code: "+7", label: "Russia (+7)" },
    { code: "+20", label: "Egypt (+20)" },
    { code: "+27", label: "South Africa (+27)" },
    { code: "+30", label: "Greece (+30)" },
    { code: "+31", label: "Netherlands (+31)" },
    { code: "+32", label: "Belgium (+32)" },
    { code: "+33", label: "France (+33)" },
    { code: "+34", label: "Spain (+34)" },
    { code: "+39", label: "Italy (+39)" },
    { code: "+41", label: "Switzerland (+41)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+45", label: "Denmark (+45)" },
    { code: "+46", label: "Sweden (+46)" },
    { code: "+47", label: "Norway (+47)" },
    { code: "+48", label: "Poland (+48)" },
    { code: "+49", label: "Germany (+49)" },
    { code: "+51", label: "Peru (+51)" },
    { code: "+52", label: "Mexico (+52)" },
    { code: "+53", label: "Cuba (+53)" },
    { code: "+54", label: "Argentina (+54)" },
    { code: "+55", label: "Brazil (+55)" },
    { code: "+56", label: "Chile (+56)" },
    { code: "+57", label: "Colombia (+57)" },
    { code: "+58", label: "Venezuela (+58)" },
    { code: "+60", label: "Malaysia (+60)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+62", label: "Indonesia (+62)" },
    { code: "+63", label: "Philippines (+63)" },
    { code: "+64", label: "New Zealand (+64)" },
    { code: "+65", label: "Singapore (+65)" },
    { code: "+66", label: "Thailand (+66)" },
    { code: "+81", label: "Japan (+81)" },
    { code: "+82", label: "South Korea (+82)" },
    { code: "+84", label: "Vietnam (+84)" },
    { code: "+86", label: "China (+86)" },
    { code: "+90", label: "Turkey (+90)" },
    { code: "+91", label: "India (+91)" },
    { code: "+92", label: "Pakistan (+92)" },
    { code: "+93", label: "Afghanistan (+93)" },
    { code: "+94", label: "Sri Lanka (+94)" },
    { code: "+95", label: "Myanmar (+95)" },
    { code: "+98", label: "Iran (+98)" },
    { code: "+211", label: "South Sudan (+211)" },
    { code: "+212", label: "Morocco (+212)" },
    { code: "+213", label: "Algeria (+213)" },
    { code: "+216", label: "Tunisia (+216)" },
    { code: "+218", label: "Libya (+218)" },
    { code: "+220", label: "Gambia (+220)" },
    { code: "+221", label: "Senegal (+221)" },
    { code: "+233", label: "Ghana (+233)" },
    { code: "+234", label: "Nigeria (+234)" },
    { code: "+236", label: "Central African Republic (+236)" },
    { code: "+237", label: "Cameroon (+237)" },
    { code: "+241", label: "Gabon (+241)" },
    { code: "+242", label: "Congo (+242)" },
    { code: "+243", label: "DR Congo (+243)" },
    { code: "+244", label: "Angola (+244)" },
    { code: "+248", label: "Seychelles (+248)" },
    { code: "+249", label: "Sudan (+249)" },
    { code: "+250", label: "Rwanda (+250)" },
    { code: "+251", label: "Ethiopia (+251)" },
    { code: "+252", label: "Somalia (+252)" },
    { code: "+253", label: "Djibouti (+253)" },
    { code: "+254", label: "Kenya (+254)" },
    { code: "+255", label: "Tanzania (+255)" },
    { code: "+256", label: "Uganda (+256)" },
    { code: "+260", label: "Zambia (+260)" },
    { code: "+261", label: "Madagascar (+261)" },
    { code: "+262", label: "Réunion (+262)" },
    { code: "+263", label: "Zimbabwe (+263)" },
    { code: "+264", label: "Namibia (+264)" },
    { code: "+265", label: "Malawi (+265)" },
    { code: "+266", label: "Lesotho (+266)" },
    { code: "+267", label: "Botswana (+267)" },
    { code: "+268", label: "Eswatini (+268)" },
    { code: "+269", label: "Comoros (+269)" },
    { code: "+291", label: "Eritrea (+291)" },
    { code: "+297", label: "Aruba (+297)" },
    { code: "+298", label: "Faroe Islands (+298)" },
    { code: "+299", label: "Greenland (+299)" },
    { code: "+351", label: "Portugal (+351)" },
    { code: "+352", label: "Luxembourg (+352)" },
    { code: "+353", label: "Ireland (+353)" },
    { code: "+354", label: "Iceland (+354)" },
    { code: "+355", label: "Albania (+355)" },
    { code: "+356", label: "Malta (+356)" },
    { code: "+357", label: "Cyprus (+357)" },
    { code: "+358", label: "Finland (+358)" },
    { code: "+359", label: "Bulgaria (+359)" },
    { code: "+370", label: "Lithuania (+370)" },
    { code: "+371", label: "Latvia (+371)" },
    { code: "+372", label: "Estonia (+372)" },
    { code: "+373", label: "Moldova (+373)" },
    { code: "+374", label: "Armenia (+374)" },
    { code: "+375", label: "Belarus (+375)" },
    { code: "+376", label: "Andorra (+376)" },
    { code: "+377", label: "Monaco (+377)" },
    { code: "+378", label: "San Marino (+378)" },
    { code: "+380", label: "Ukraine (+380)" },
    { code: "+381", label: "Serbia (+381)" },
    { code: "+382", label: "Montenegro (+382)" },
    { code: "+383", label: "Kosovo (+383)" },
    { code: "+385", label: "Croatia (+385)" },
    { code: "+386", label: "Slovenia (+386)" },
    { code: "+387", label: "Bosnia and Herzegovina (+387)" },
    { code: "+389", label: "North Macedonia (+389)" },
    { code: "+420", label: "Czech Republic (+420)" },
    { code: "+421", label: "Slovakia (+421)" },
    { code: "+423", label: "Liechtenstein (+423)" },
    { code: "+501", label: "Belize (+501)" },
    { code: "+502", label: "Guatemala (+502)" },
    { code: "+503", label: "El Salvador (+503)" },
    { code: "+504", label: "Honduras (+504)" },
    { code: "+505", label: "Nicaragua (+505)" },
    { code: "+506", label: "Costa Rica (+506)" },
    { code: "+507", label: "Panama (+507)" },
    { code: "+508", label: "Saint Pierre and Miquelon (+508)" },
    { code: "+509", label: "Haiti (+509)" },
    { code: "+590", label: "Guadeloupe (+590)" },
    { code: "+591", label: "Bolivia (+591)" },
    { code: "+592", label: "Guyana (+592)" },
    { code: "+593", label: "Ecuador (+593)" },
    { code: "+594", label: "French Guiana (+594)" },
    { code: "+595", label: "Paraguay (+595)" },
    { code: "+596", label: "Martinique (+596)" },
    { code: "+597", label: "Suriname (+597)" },
    { code: "+598", label: "Uruguay (+598)" },
    { code: "+599", label: "Curaçao (+599)" },
    { code: "+670", label: "East Timor (+670)" },
    { code: "+672", label: "Norfolk Island (+672)" },
    { code: "+673", label: "Brunei (+673)" },
    { code: "+674", label: "Nauru (+674)" },
    { code: "+675", label: "Papua New Guinea (+675)" },
    { code: "+676", label: "Tonga (+676)" },
    { code: "+677", label: "Solomon Islands (+677)" },
    { code: "+678", label: "Vanuatu (+678)" },
    { code: "+679", label: "Fiji (+679)" },
    { code: "+680", label: "Palau (+680)" },
    { code: "+681", label: "Wallis and Futuna (+681)" },
    { code: "+682", label: "Cook Islands (+682)" },
    { code: "+683", label: "Niue (+683)" },
    { code: "+685", label: "Samoa (+685)" },
    { code: "+686", label: "Kiribati (+686)" },
    { code: "+687", label: "New Caledonia (+687)" },
    { code: "+688", label: "Tuvalu (+688)" },
    { code: "+689", label: "French Polynesia (+689)" },
    { code: "+690", label: "Tokelau (+690)" },
    { code: "+691", label: "Micronesia (+691)" },
    { code: "+692", label: "Marshall Islands (+692)" },
    { code: "+850", label: "North Korea (+850)" },
    { code: "+852", label: "Hong Kong (+852)" },
    { code: "+853", label: "Macau (+853)" },
    { code: "+855", label: "Cambodia (+855)" },
    { code: "+856", label: "Laos (+856)" },
    { code: "+880", label: "Bangladesh (+880)" },
    { code: "+886", label: "Taiwan (+886)" },
    { code: "+960", label: "Maldives (+960)" },
    { code: "+961", label: "Lebanon (+961)" },
    { code: "+962", label: "Jordan (+962)" },
    { code: "+963", label: "Syria (+963)" },
    { code: "+964", label: "Iraq (+964)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+967", label: "Yemen (+967)" },
    { code: "+968", label: "Oman (+968)" },
    { code: "+970", label: "Palestine (+970)" },
    { code: "+971", label: "United Arab Emirates (+971)" },
    { code: "+972", label: "Israel (+972)" },
    { code: "+973", label: "Bahrain (+973)" },
    { code: "+974", label: "Qatar (+974)" },
    { code: "+975", label: "Bhutan (+975)" },
    { code: "+976", label: "Mongolia (+976)" },
    { code: "+977", label: "Nepal (+977)" },
    { code: "+992", label: "Tajikistan (+992)" },
    { code: "+993", label: "Turkmenistan (+993)" },
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
        const instructorsQuery = query(instructorCollectionRef, orderBy("f_name"));
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
    <div className="p-4 fixed inset-0 left-[300px]">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Staff Details</h1>
          {canCreate && (
            <button
              onClick={() => {
                setSelectedInstructor({});
                setOpenDrawer(true);
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
                  .filter((i) => i.f_name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((instructor) => (
                    <tr key={instructor.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={()=>(navigate(`/employee-profile/${instructor.id}`))}>
                      <td className="p-3 text-gray-700">
                        {capitalizeFirstLetter(instructor.f_name)}{" "}
                        {capitalizeFirstLetter(instructor.l_name)}
                      </td>
                      <td className="p-3 text-gray-700">{instructor.email || "N/A"}</td>
                      <td className="p-3 text-gray-700">
                        {instructor.phone ? `+91 ${instructor.phone}` : "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">{instructor.specialization || "N/A"}</td>
                      <td className="p-3 text-gray-700">{instructor.center || "N/A"}</td>
                      <td className="p-3 text-gray-700">{instructor.role || "N/A"}</td>
                      {(canUpdate || canDelete) && (
                        <td className="p-3">
                          <div className="flex space-x-2">
                            {canUpdate && (
                              <button
                                onClick={() => {
                                  setSelectedInstructor(instructor);
                                  setOpenDrawer(true);
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
