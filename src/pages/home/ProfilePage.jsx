/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { s3Client, debugS3Config } from '../../config/aws-config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import CheckInOut from './CheckInOut';
import EmployeeDashboard from './EmployeeDashboard';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const placeholderImage = 'https://placehold.co/150x150'; 

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

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    // Validate file type (only images)
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP).');
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setUploadError(`File size exceeds ${maxSizeInMB}MB limit.`);
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      debugS3Config();
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION');
      }

      const photoKey = `profile-photos/${user.uid}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const fileBuffer = await file.arrayBuffer();
      const params = {
        Bucket: bucketName,
        Key: photoKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
      };

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(Math.min(progress, 90));
        if (progress >= 90) clearInterval(interval);
      }, 200);

      await s3Client.send(new PutObjectCommand(params));
      clearInterval(interval);
      setUploadProgress(100);

      const photoURL = `https://${bucketName}.s3.${region}.amazonaws.com/${photoKey}`;
      console.log('Generated photoURL:', photoURL); // Debug log

      // Update Firestore with new photoURL
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, { photoURL });

      // Update local state with cache-busting query
      setUserData((prev) => ({ ...prev, photoURL: `${photoURL}?t=${Date.now()}` }));
      alert('Photo uploaded successfully!');
    } catch (err) {
      setUploadError(`Failed to upload photo: ${err.message}`);
      setUploadProgress(0);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 fixed inset-0 left-[300px] overflow-y-auto">
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
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Upload Profile Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePhotoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="mt-2 w-full h-5 bg-gray-200 rounded-md relative">
                    <div
                      className="absolute h-full bg-indigo-600 rounded-md transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className="absolute inset-0 text-xs text-white text-center leading-5">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="text-red-600 text-sm mt-2">{uploadError}</p>
              )}
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