import React from "react";

export default function InstructorProfile () {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-3xl font-bold mr-4">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold">seri</h1>
            <span className="text-green-500 bg-green-100 px-2 py-1 rounded-lg text-sm font-semibold">
              INSTRUCTOR
            </span>
            <p className="text-gray-500">seri123456@gmail.com · +91 9874561230</p>
            <p className="text-gray-500 mt-1">
              Added on <span className="font-medium">Feb 08, 2025</span>
              · Branches <span className="font-medium">Fireblaze</span>
            </p>
          </div>
        </div>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border">
            View Calendar
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border">
            Actions
          </button>
        </div>
      </div>


      <div className="border-b border-gray-200 mb-6">
        <ul className="flex space-x-4">
          <li className="text-gray-700 pb-2 border-b-2 border-transparent hover:border-blue-500 cursor-pointer">
            Classes Taught
          </li>
          <li className="text-blue-500 pb-2 border-b-2 border-blue-500 cursor-pointer">
            Profile
          </li>
        </ul>
      </div>

     
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              value="seri"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              value="seri1206609"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              className="mt-1 p-2 w-full border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select className="mt-1 p-2 w-full border rounded-lg">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <div className="flex items-center">
              <span className="p-2 bg-gray-100 border rounded-l-lg">+91</span>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-r-lg"
                value="9874561230"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alternate Contact
            </label>
            <div className="flex items-center">
              <span className="p-2 bg-gray-100 border rounded-l-lg">+91</span>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-r-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 p-2 w-full border rounded-lg"
              value="seri123456@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Landline No.
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="Landline number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              About
            </label>
            <textarea
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="About"
              maxLength="400"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};
