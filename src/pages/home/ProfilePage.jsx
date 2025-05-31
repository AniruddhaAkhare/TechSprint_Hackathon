/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import CheckInOut from './CheckInOut';
import EmployeeDashboard from './EmployeeDashboard';

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
  <div className="flex justify-center mb-4">
    <div className="relative">
      <img
        src={userData?.photoURL || 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-32 h-32 object-cover border-4 border-gray-200" // Removed 'rounded-full' for square
      />
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          userData?.active ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
    </div>
  </div>

  {/* Name centered below photo */}
  <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
    {userData?.displayName || 'N/A'}
  </h1>

  {/* Email */}
  <p className="text-center text-gray-600 mb-4">{userData?.email || 'N/A'}</p>

  {/* Info section */}
  <div className="mb-6 bg-white rounded-xl shadow-sm p-4 max-w-md">
  {/* Header */}

  {/* Two-column grid layout */}
  <div className="grid grid-cols-2 gap-4">
    {/* Labels Column */}
    <div className="space-y-3 text-gray-600 font-medium">
      <p>Branch:</p>
      <p>Status:</p>
      <p>Checked In:</p>
      <p>Last Login:</p>
    </div>

    {/* Values Column */}
    <div className="space-y-3 text-gray-800 font-medium">
      <p>{userData?.branchName || 'N/A'}</p>
      <p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          userData?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {userData?.active ? 'Active' : 'Inactive'}
        </span>
      </p>
      <p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          userData?.checkedIn ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {userData?.checkedIn ? 'Yes' : 'No'}
        </span>
      </p>
      <p>{userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}</p>
    </div>
  </div>
</div>

  <div className="mt-4">
    <CheckInOut />
  </div>
</div>

     
<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-2/3">
  
  {/* Render EmployeeDashboard here */}
  <EmployeeDashboard />
</div>

      </div>
    </div>
  );
};

export default ProfilePage;