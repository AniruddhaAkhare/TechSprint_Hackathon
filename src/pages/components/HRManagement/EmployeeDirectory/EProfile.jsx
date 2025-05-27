import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

export default function EProfile() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  // Utility to format Firebase Timestamp or other values
  const formatTimestamp = (value) => {
    if (value?.toDate) {
      return value.toDate().toLocaleString();
    }
    return value || 'N/A';
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const docRef = doc(db, 'Users', employeeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Employee Data:', {
            ...data,
            joining_date: data.joining_date?.toDate ? data.joining_date.toDate().toISOString() : data.joining_date,
            exit_date: data.exit_date?.toDate ? data.exit_date.toDate().toISOString() : data.exit_date,
            created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
            date_of_birth: data.date_of_birth ? formatTimestamp(data.date_of_birth) : 'N/A',
          });
          setEmployee({
            ...data,
            joining_date: data.joining_date ? formatTimestamp(data.joining_date) : 'N/A',
            exit_date: data.exit_date ? formatTimestamp(data.exit_date) : 'N/A',
            created_at: data.created_at ? formatTimestamp(data.created_at) : 'N/A',
            date_of_birth: data.date_of_birth ? formatTimestamp(data.date_of_birth) : 'N/A',
          });
        } else {
          console.warn('Employee document not found');
          // Optionally navigate to an error page
          // navigate('/not-found');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  if (!employee) return <div className="text-gray-600 text-center py-10">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      {/* Personal Details */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={employee.Name || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="text"
              value={employee.email || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <input
              type="text"
              value={employee.phone || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
            <input
              type="text"
              value={formatTimestamp(employee.date_of_birth)}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Joining Date</label>
            <input
              type="text"
              value={employee.joining_date}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Exit Date</label>
            <input
              type="text"
              value={employee.exit_date}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <input
              type="text"
              value={employee.role || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={employee.emergency_details?.name || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <input
              type="text"
              value={employee.emergency_details?.phone || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="text"
              value={employee.emergency_details?.email || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Relation</label>
            <input
              type="text"
              value={employee.emergency_details?.relation || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Occupation</label>
            <input
              type="text"
              value={employee.emergency_details?.occupation || 'N/A'}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Residential Address</label>
            <input
              type="text"
              value={
                employee.address
                  ? `${employee.address.street}, ${employee.address.area}, ${employee.address.city}, ${employee.address.state}, ${employee.address.country} - ${employee.address.zip}`
                  : 'Address not available'
              }
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Document Details */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Document Details</h2>
        {employee.staff && Object.keys(employee.staff).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Document Type</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Link</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(employee.staff).map(([docType, urls], index) =>
                  urls.length > 0 ? (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-700">
                        {docType
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </td>
                      <td className="p-3 text-gray-700">
                        {urls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            View Document
                          </a>
                        ))}
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No documents available.</p>
        )}
      </div>

      {/* Education Details */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Education Details</h2>
        {employee.education_details && employee.education_details.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Level</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Institute</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Degree</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Specialization</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Grade</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Passing Year</th>
                </tr>
              </thead>
              <tbody>
                {employee.education_details.map((edu, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3 text-gray-700">{edu.level || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{edu.institute || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{edu.degree || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{edu.specialization || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{edu.grade || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{edu.passingyr || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No education mentioned.</p>
        )}
      </div>

      {/* Experience Details */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
        {employee.experience_details && employee.experience_details.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Sr. No.</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Company Name</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Designation</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Salary</th>
                  <th className="p-3 text-sm font-medium text-gray-600 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {employee.experience_details.map((exp, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3 text-gray-700">{exp.companyName || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{exp.designation || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{exp.salary || 'N/A'}</td>
                    <td className="p-3 text-gray-700">{exp.description || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No experience.</p>
        )}
      </div>

      {/* Edit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/editstaff/${employeeId}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}