
import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { getDoc, getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CreateEnquiryForm = ({ isOpen, toggleSidebar, logActivity }) => {
  const [formName, setFormName] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [enquiryFields, setEnquiryFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  // Enquiry fields based on EnquiryModal
  const allEnquiryFields = [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "phone", label: "Mobile", type: "tel" },
    { id: "streetAddress", label: "Street Address", type: "text" },
    { id: "city", label: "City", type: "text" },
    { id: "stateRegionProvince", label: "State/Region/Province", type: "text" },
    { id: "postalZipCode", label: "Postal/Zip Code", type: "text" },
    { id: "country", label: "Country", type: "select" },
    { id: "gender", label: "Gender", type: "select" },
    { id: "dateOfBirth", label: "Date of Birth", type: "date" },
    { id: "studentType", label: "Student Type", type: "select" },
    { id: "sscPercentage", label: "SSC Percentage", type: "number" },
    { id: "schoolName", label: "School Name", type: "text" },
    { id: "sscPassOutYear", label: "SSC Pass Out Year", type: "number" },
    { id: "hscPercentage", label: "HSC Percentage", type: "number" },
    { id: "juniorCollegeName", label: "Junior College Name", type: "text" },
    { id: "hscPassOutYear", label: "HSC Pass Out Year", type: "number" },
    { id: "graduationStream", label: "Graduation Stream", type: "select" },
    { id: "graduationPercentage", label: "Graduation Percentage", type: "number" },
    { id: "collegeName", label: "College Name", type: "text" },
    { id: "graduationPassOutYear", label: "Graduation Pass Out Year", type: "number" },
    { id: "postGraduationStream", label: "Post Graduation Stream", type: "text" },
    { id: "postGraduationPercentage", label: "Post Graduation Percentage", type: "number" },
    { id: "postGraduationCollegeName", label: "Post Graduation College Name", type: "text" },
    { id: "postGraduationPassOutYear", label: "Post Graduation Pass Out Year", type: "number" },
    { id: "branch", label: "Branch", type: "select" },
    { id: "course", label: "Course", type: "select" },
    { id: "source", label: "Source", type: "select" },
    { id: "assignTo", label: "Assign To", type: "select" },
    { id: "fee", label: "Fee", type: "number" },
    { id: "degree", label: "Degree", type: "select" },
    { id: "currentProfession", label: "Current Profession", type: "text" },
    { id: "workingCompanyName", label: "Company Name", type: "text" },
    { id: "workingDomain", label: "Working Domain", type: "text" },
    { id: "experienceInYears", label: "Experience in Years", type: "number" },
    { id: "guardianName", label: "Guardian Name", type: "text" },
    { id: "guardianContact", label: "Guardian Contact", type: "tel" },
    { id: "courseMotivation", label: "Course Motivation", type: "textarea" },
    { id: "stage", label: "Stage", type: "select" },
  ];


 


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users
        const userSnapshot = await getDocs(collection(db, "Users"));
        const usersList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setAvailableUsers(usersList);
        console.log("Users fetched:", usersList);
  
        // Fetch Roles
        const roleSnapshot = await getDocs(collection(db, "Roles"));
        const rolesList = roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesList);
        setAvailableRoles(rolesList);
        console.log("Roles fetched:", rolesList);
  
        // Set enquiry fields
        setEnquiryFields(allEnquiryFields);
        console.log("Enquiry fields set:", allEnquiryFields);
      } catch (err) {
        console.error("Error fetching data in CreateEnquiryForm:", err.message);
      }
    };
    fetchData();
  }, []);
  
  console.log("Current enquiryFields state:", enquiryFields);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch Users
  //       const userSnapshot = await getDocs(collection(db, "Users"));
  //       const usersList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setUsers(usersList);
  //       setAvailableUsers(usersList);

  //       // Fetch Roles
  //       const roleSnapshot = await getDocs(collection(db, "Roles"));
  //       const rolesList = roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setRoles(rolesList);
  //       setAvailableRoles(rolesList);

  //       // Set enquiry fields
  //       setEnquiryFields(allEnquiryFields);
  //     } catch (err) {
  //       console.error("Error fetching data in CreateEnquiryForm:", err.message);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      name: formName,
      users: selectedUsers,
      roles: selectedRoles,
      fields: selectedFields,
      createdAt: serverTimestamp(),
    };
  
    try {
      await addDoc(collection(db, "enquiryForms"), formData);
      await logActivity("Created enquiry form", { name: formName });
      alert("Enquiry form created successfully!");
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving enquiry form:", error.message);
      alert(`Failed to save enquiry form: ${error.message}`);
    }
  };

 
  const resetForm = () => {
    setFormName("");
    setSelectedUsers([]);
    setSelectedRoles([]);
    setSelectedFields([]);
    setAvailableUsers(users);
    setAvailableRoles(roles);
  };

  const handleAddUser = (userId) => {
    if (userId && !selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
      setAvailableUsers(availableUsers.filter((u) => u.id !== userId));
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    const removedUser = users.find((u) => u.id === userId);
    if (removedUser) setAvailableUsers([...availableUsers, removedUser]);
  };

  const handleAddRole = (roleId) => {
    if (roleId && !selectedRoles.includes(roleId)) {
      setSelectedRoles([...selectedRoles, roleId]);
      setAvailableRoles(availableRoles.filter((r) => r.id !== roleId));
    }
  };

  const handleRemoveRole = (roleId) => {
    setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    const removedRole = roles.find((r) => r.id === roleId);
    if (removedRole) setAvailableRoles([...availableRoles, removedRole]);
  };

  const handleFieldToggle = (fieldId) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleDragEnd = (result) => {
    console.log("Drag end result:", result); // Debug drag event
    if (!result.destination) {
      console.log("No destination, drag canceled");
      return;
    }

    const items = Array.from(selectedFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    console.log("Reordered items:", items); // Debug new order
    setSelectedFields(items);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enquiry Form</h1>
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="formName" className="block text-base font-medium text-gray-700">
            Form Name
          </label>
          <input
            type="text"
            value={formName}
            placeholder="Enquiry Form Name"
            onChange={(e) => setFormName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700">Assign to Users</label>
          <select
            onChange={(e) => handleAddUser(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          >
            <option value="">Select a User</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          {selectedUsers.length > 0 && (
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedUsers.map((userId, index) => {
                    const user = users.find((u) => u.id === userId);
                    return (
                      <tr key={userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{user?.name || user?.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(userId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700">Assign to Roles</label>
          <select
            onChange={(e) => handleAddRole(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          >
            <option value="">Select a Role</option>
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {selectedRoles.length > 0 && (
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedRoles.map((roleId, index) => {
                    const role = roles.find((r) => r.id === roleId);
                    return (
                      <tr key={roleId}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{role?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(roleId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
  <label className="block text-base font-medium text-gray-700">Select Enquiry Fields</label>
  {console.log("Rendering enquiryFields:", enquiryFields)}
  {/* <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="fields">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {selectedFields.map((fieldId, index) => {
          const field = enquiryFields.find(f => f.id === fieldId);
          return (
            <Draggable key={field.id} draggableId={field.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className="flex items-center mb-2 p-2 bg-gray-50 rounded"
                >
                  <div
                    {...provided.dragHandleProps}
                    className="mr-2 cursor-move"
                  >
                    ≡
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleFieldToggle(field.id)}
                  />
                  <span className="ml-2">
                    {field.label} ({field.type})
                  </span>
                </div>
              )}
            </Draggable>
          );
        })}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext> */}

<div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
    {enquiryFields.length > 0 ? (
      enquiryFields.map((field) => (
        <div key={field.id} className="flex items-center">
          <input
            type="checkbox"
            id={field.id}
            checked={selectedFields.includes(field.id)}
            onChange={() => handleFieldToggle(field.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={field.id} className="ml-2 text-base text-gray-700">
            {field.label} ({field.type})
          </label>
        </div>
      ))
    ) : (
      <p>No enquiry fields available</p>
    )}
  </div>

  {selectedFields.length > 0 && (
    <div className="mt-4">
      <h3 className="text-base font-medium text-gray-700">Selected Fields (Drag to Reorder)</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mt-2 space-y-2 p-4 border rounded-md"
            >
              {selectedFields.map((fieldId, index) => {
                const field = enquiryFields.find((f) => f.id === fieldId);
                if (!field) return null; // Safety check
                return (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <span className="mr-2 cursor-move">≡</span>
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleFieldToggle(field.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-base text-gray-700">
                          {field.label} ({field.type})
                        </span>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )}
</div>
  {/* <div className="mt-2 space-y-2">
    {enquiryFields.length > 0 ? (
      enquiryFields.map((field) => (
        <div key={field.id} className="flex items-center">
          <input
            type="checkbox"
            id={field.id}
            checked={selectedFields.includes(field.id)}
            onChange={() => handleFieldToggle(field.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={field.id} className="ml-2 text-base text-gray-700">
            {field.label} ({field.type})
          </label>
        </div>
      ))
    ) : (
      <p>No enquiry fields available</p>
    )}
  </div> */}
{/* </div> */}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEnquiryForm;