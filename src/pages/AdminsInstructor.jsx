import React, { useState } from "react";

const AdminsInstructors = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "seri",
      role: "INSTRUCTOR",
      email: "seri123456@gmail.com",
      phone: "+91 9874561230",
      dateAdded: "Feb 08, 2025",
      branch: "Fireblaze",
    },
    {
      id: 2,
      name: "samiksha",
      role: "SUPER ADMIN",
      email: "samikshasr1704@gmail.com",
      phone: "7385784461",
      dateAdded: "Feb 05, 2025",
      branch: "Fireblaze",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admins & Instructors</h1>
      <p className="text-gray-600 mb-6">
        Create and manage users with different roles on the platform.
      </p>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email, Mobile..."
          className="p-2 border border-gray-300 rounded-lg w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          + Add Instructors
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Sr</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Contact Details</th>
            <th className="p-3 text-left">Date Added</th>
            <th className="p-3 text-left">Branch</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user.id}
              className={`border-b ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-lg text-white ${
                    user.role === "SUPER ADMIN"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="p-3">
                {user.email}
                <br />
                {user.phone}
              </td>
              <td className="p-3">{user.dateAdded}</td>
              <td className="p-3">{user.branch}</td>
              <td className="p-3">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center">
          <button className="px-3 py-1 border border-gray-300 rounded-l-lg">
            {"<"}
          </button>
          <span className="px-4 py-1 border-t border-b border-gray-300">
            1
          </span>
          <button className="px-3 py-1 border border-gray-300 rounded-r-lg">
            {">"}
          </button>
        </div>
        <select className="border border-gray-300 rounded-lg p-1">
          <option>50 / page</option>
          <option>100 / page</option>
        </select>
      </div>
    </div>
  );
};

export default AdminsInstructors;
