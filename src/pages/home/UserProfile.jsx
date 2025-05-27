import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEllipsisV } from "react-icons/fa";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const UserProfile = ({ authUser, handleLogout, toggleMenu, showMenu }) => {
    const db = getFirestore();
    const [status, setStatus] = useState("inactive");
    const { user } = useAuth();
    const [name, setName] = useState();


    // Fetch user's check-in status
    useEffect(() => {
        const fetchCheckInStatus = async () => {
            if (!user.email) {
                setStatus("inactive");
                return;
            }

            try {
                const userDocRef = doc(db, "Users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    // Use checkedIn boolean for status
                    setStatus(userData.checkedIn ? "active" : "inactive");
                    setName(userData.displayName);
                } else {
                    setStatus("inactive");
                }
            } catch (err) {
                //console.error("Error fetching check-in status:", err);
                setStatus("inactive");
            }
        };

        fetchCheckInStatus();
    }, [authUser, db]);

    return (
        <div className="admin-profile flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={toggleMenu}>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <FaUser className="text-gray-600 text-xl" />
                    <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                    />
                </div>
                <span className="text-gray-800 font-medium">
                    {/* {user ? `${user.f_name} ${user.l_name}` : user?.displayName || "Admin Profile"} */}
                    {/* {user.displayName} */}
                    {name}
                </span>
                {/* <span className="text-gray-600 text-sm bg-gray-200 rounded-full px-2 py-1">
                    {name.split(" ").map((n) => n[0]).join("").toUpperCase() || "AD"}
                </span> */}
            </div>
            <FaEllipsisV className="text-gray-600" />
            <div className={`absolute bottom-16 left-0 w-full bg-white shadow-lg rounded-t-lg ${showMenu ? "block" : "hidden"}`}>
                <Link
                    to="/my-profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => toggleMenu()}
                >
                    Profile
                </Link>
                <Link
                    to="/leave-application"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => toggleMenu()}
                >
                    Apply Leaves
                </Link>
                <div
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                >
                    Logout
                </div>
            </div>
        </div>
    );
};

export default UserProfile;