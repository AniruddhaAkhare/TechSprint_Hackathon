import { useEffect, useState } from "react";
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [adminDetails, setAdminDetails] = useState(null);
    const navigate = useNavigate();
    const admin = auth.currentUser;
    console.log("ADMIN",admin);

    useEffect(() => {
        const fetchAdminData = async () => {
            auth.onAuthStateChanged(async (admin) => {
                if (admin) {
                    const docRef = doc(db, "Instructor", admin.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setAdminDetails({ id: admin.uid, ...docSnap.data() });
                    } else {
                        console.log("Admin is not logged in");
                    }
                } else {
                    navigate('/login');
                }
            });
        };

        fetchAdminData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 ml-80 p-4 flex items-center justify-center w-screen">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full transform transition-all duration-300 hover:shadow-xl">
                {adminDetails ? (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Welcome, {adminDetails.f_name} {adminDetails.l_name}!
                            </h2>
                            <p className="text-gray-500 mt-1">Instructor Dashboard</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium w-24">Email:</span>
                                <span className="text-gray-800">{adminDetails.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium w-24">Mobile:</span>
                                <span className="text-gray-800">{adminDetails.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium w-24">Specialization:</span>
                                <span className="text-gray-800">{adminDetails.specialization}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/courses')}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                            >
                                View Courses
                            </button>
                            <button
                                onClick={() => navigate('/students')}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                            >
                                Manage Students
                            </button>
                            <button
                                onClick={() => navigate('/logout')}
                                className="bg-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-500 text-lg">Loading your profile...</p>
                        <div className="mt-4 flex justify-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};