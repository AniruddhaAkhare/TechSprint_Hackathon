import { useEffect, useState } from "react";
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [adminDetails, setAdminDetails] = useState(null);
    const navigate = useNavigate();

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
                }
            });
        };

        fetchAdminData();
    }, []);


    return (
        <>
            <div className="h-screen flex items-center justify-center w-screen">
                <div className="bg-blue-500 text-white p-5 rounded">
                {adminDetails ? (
                    <>
                        <h3>Welcome {adminDetails.f_name} {adminDetails.l_name}</h3>
                        <div>
                            <p>Email: {adminDetails.email}</p>
                            <p>Mobile No.: {adminDetails.phone}</p>
                            <p>Specialization: {adminDetails.specialization}</p>
                        </div>
                    </>
                ) : (
                    <p>Loading....</p>
                )}
                </div>
            </div>
        </>
    );
};

// export default Profile;
