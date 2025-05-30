import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import CheckInOut from './CheckInOut';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setError('No user is signed in');
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('User data not found');
        }
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex p-4">
      <div className="flex flex-col md:flex-row w-screen max-w-6xl mx-auto gap-4">
        {/* Profile Card (Left Side) */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3 ml-36">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={userData?.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  userData?.active ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            {userData?.displayName || 'N/A'}
          </h1>
          <p className="text-center text-gray-600 mt-2">{userData?.email || 'N/A'}</p>
      <div className="mt-6 p-6 bg-white shadow-md rounded-2xl border border-gray-200 max-w-md">
  <h2 className="text-xl font-bold text-gray-800 mb-4">User Info</h2>
  <div className="space-y-3 text-gray-700 text-sm">
    <div className="flex justify-between items-center">
      <span className="font-medium">Branch:</span>
      <span>{userData?.branchName || 'N/A'}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-medium">Status:</span>
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          userData?.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {userData?.active ? 'Active' : 'Inactive'}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-medium">Checked In:</span>
      <span>{userData?.checkedIn ? 'Yes' : 'No'}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-medium">Last Login:</span>
      <span>{userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}</span>
    </div>
  </div>

  <div className="mt-4">
    <CheckInOut />
  </div>
</div>

        </div>
        {/* Placeholder for Additional Content (Right Side) */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-2/3">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Content</h2>
          <p className="text-gray-600">
            Add your new content here (e.g., forms, charts, or other components).
          </p>
          {/* Add your components here */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;