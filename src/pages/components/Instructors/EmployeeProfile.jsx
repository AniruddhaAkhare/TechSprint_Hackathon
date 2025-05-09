import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import EProfile from "../HRManagement/EmployeeDirectory/EProfile";

export default function EmployeeProfile() {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        // residential_address: [],
        // experience: [],
        // date_of_birth: "",
        // date_of_joining: "",
    });

    const [selectedForm, setSelectedForm] = useState(1);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const employeeRef = doc(db, "Instructor", employeeId);
                const employeeSnap = await getDoc(employeeRef);

                if (employeeSnap.exists()) {
                    const data = employeeSnap.data();
                    setEmployee({
                        f_name: data.f_name || "",
                        l_name: data.l_name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        // date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "N/A",
                        // date_of_joining: data.date_of_joining ? data.date_of_joining.toDate().toISOString().split("T")[0] : "N/A",
                    });
                } else {
                    alert("Student not found.");
                    navigate(-1);
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchEmployee();
    }, [employeeId, navigate]);

    const handleFormSelection = (formNumber) => {
        setSelectedForm(formNumber);
    };

    return (
        <div className="p-4 fixed inset-0 left-[300px] min-h-screen overflow-scroll">
        {/* <div className="min-h-screen bg-gray-50 p-6 ml-80 w-[calc(100vw-20rem)]"> */}
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate("/instructor")}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 mb-0 p-0 ml-0">
                                {employee.f_name} {employee.l_name}
                            </h1>
                            <p className="text-sm text-gray-600 mt-0 p-0 ml-0">{employee.email}</p>
                        </div>
                    </div>
                    {/* <button
                        onClick={() => navigate(`/add-course/${employeeId}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Courses
                    </button> */}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Registered on:</span> 
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Reg. ID:</span> {employeeId}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {employee.phone}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex space-x-6 border-b border-gray-200">
                        <button
                            onClick={() => handleFormSelection(1)}
                            className={`p-2 text-sm font-medium bg-transparent border-none ${selectedForm === 1 ? "text-blue-600" : "text-gray-600 hover:text-blue-600"} transition duration-200`}
                        >
                            Profile
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {selectedForm === 1 && <EProfile />}
                </div>
            </div>
        </div>
    );
}