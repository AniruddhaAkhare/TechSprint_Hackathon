import React, { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { s3Client, debugS3Config } from '../../config/aws-config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import CheckInOut from './CheckInOut';

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
    <div className="bg-gray-100 flex flex-col items-center sm:px-6 lg:px-8 p-4 fixed inset-0 left-[300px] min-h-screen overflow-scroll">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/3">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={userData?.photoURL || placeholderImage}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => {
                  console.error('Image load error:', e.target.src); // Debug log
                  e.target.src = placeholderImage;
                }}
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  userData?.active ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            {userData?.displayName || 'N/A'}
          </h1>
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
            {userData?.email || 'N/A'}
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-semibold">Branch:</span> {userData?.branchName || 'N/A'}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-semibold">Status:</span> {userData?.active ? 'Active' : 'Inactive'}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-semibold">Checked In:</span> {userData?.checkedIn ? 'Yes' : 'No'}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-semibold">Last Login:</span>{' '}
              {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}
            </p>
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
            <CheckInOut />
          </div>
        </div>
        {/* Additional Content */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-2/3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Additional Content</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Add your new content here (e.g., forms, charts, or other components).
          </p>
          {/* Add your components here */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;