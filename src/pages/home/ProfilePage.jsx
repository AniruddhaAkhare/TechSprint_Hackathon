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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 fixed inset-0 left-[300px]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
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
        <div className="mt-6">
          <p className="text-gray-700">
            <span className="font-semibold">Branch:</span> {userData?.branchName || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Status:</span> {userData?.active ? 'Active' : 'Inactive'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Checked In:</span> {userData?.checkedIn ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Last Login:</span>{' '}
            {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}
          </p>
          <CheckInOut />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;