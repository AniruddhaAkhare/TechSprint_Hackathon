import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CreateEnquiryForm = ({ isOpen, toggleSidebar, form, logActivity }) => {
  const [formName, setFormName] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [assignmentType, setAssignmentType] = useState("Users");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formLink, setFormLink] = useState(null);
  const droppableId = `selectedFields-${form?.id || "new"}`;
  const droppableRef = useRef(null);

  useEffect(() => {
    if (form) {
      setFormName(form.name || "");
      setSelectedUsers(Array.isArray(form.users) ? form.users : []);
      setSelectedRoles(Array.isArray(form.roles) ? form.roles : []);
      setAssignmentType(form.users?.length > 0 ? "Users" : "Roles");
      setSelectedFields(
        Array.isArray(form.fields)
          ? form.fields.map((field) => ({
              id: field.id || "",
              defaultValue: field.defaultValue ?? "",
            }))
          : []
      );
      setFormLink(form.formLink || `https://shikshasaarathi.web.app/enquiry/${form.id}`)
    } else {
      setFormName("");
      setSelectedUsers([]);
      setSelectedRoles([]);
      setAssignmentType("Users");
      setSelectedFields([]);
      setFormLink(null);
    }
  }, [form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const userSnapshot = await getDocs(collection(db, "Users"));
        setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setAvailableUsers(form ? userSnapshot.docs.filter((doc) => !form.users?.includes(doc.id)).map((doc) => ({ id: doc.id, ...doc.data() })) : userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        const roleSnapshot = await getDocs(collection(db, "roles"));
        setRoles(roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setAvailableRoles(form ? roleSnapshot.docs.filter((doc) => !form.roles?.includes(doc.id)).map((doc) => ({ id: doc.id, ...doc.data() })) : roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form]);

  useEffect(() => {
    return () => {
      console.log(`Droppable unmounted with ID: ${droppableId}`);
    };
  }, [droppableId]);

  const sanitizeData = (data) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) sanitized[key] = null;
      else if (Array.isArray(value)) sanitized[key] = value.map((item) => (typeof item === "object" && item !== null ? sanitizeData(item) : item));
      else if (typeof value === "object" && value !== null && !(value instanceof Date)) sanitized[key] = sanitizeData(value);
      else sanitized[key] = value;
    }
    return sanitized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Form name is required.");
      return;
    }
    if (selectedFields.length === 0) {
      setError("At least one enquiry field must be selected.");
      return;
    }
    if (assignmentType === "Users" && selectedUsers.length === 0) {
      setError("At least one user must be selected.");
      return;
    }
    if (assignmentType === "Roles" && selectedRoles.length === 0) {
      setError("At least one role must be selected.");
      return;
    }

    let formId;
    const formData = {
      name: formName,
      users: assignmentType === "Users" ? selectedUsers : [],
      roles: assignmentType === "Roles" ? selectedRoles : [],
      fields: selectedFields,
      enquiryCount: form?.enquiryCount || 0,
      updatedAt: serverTimestamp(),
      ...(form ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      setLoading(true);
      setError(null);
      const sanitizedFormData = sanitizeData(formData);

      if (form) {
        const formRef = doc(db, "enquiryForms", form.id);
        await updateDoc(formRef, sanitizedFormData);
        await logActivity("Updated enquiry form", { name: formName });
        formId = form.id;
      } else {
        const docRef = await addDoc(collection(db, "enquiryForms"), sanitizedFormData);
        formId = docRef.id;
        const newFormLink = `https://enquiry-form-app-2025.web.app/enquiry/${formId}`;

        // const newFormLink = `https://shikshasaarathi.web.app/enquiry/${formId}`;
        await updateDoc(doc(db, "enquiryForms", formId), { formLink: newFormLink });
        setFormLink(newFormLink);
        await logActivity("Created enquiry form", { name: formName });
      }

      resetForm();
      toggleSidebar();
    } catch (error) {
      setError(`Failed to save enquiry form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setSelectedUsers([]);
    setSelectedRoles([]);
    setSelectedFields([]);
    setAvailableUsers(users);
    setAvailableRoles(roles);
    setAssignmentType("Users");
    setError(null);
    setFormLink(null);
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
    if (isDragging || !fieldId) return;
    if (selectedFields.some((field) => field.id === fieldId)) {
      setSelectedFields(selectedFields.filter((field) => field.id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, { id: fieldId, defaultValue: "" }]);
    }
  };

  const handleDefaultValueChange = (fieldId, value) => {
    if (isDragging) return;
    setSelectedFields(
      selectedFields.map((field) => (field.id === fieldId ? { ...field, defaultValue: value } : field))
    );
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const items = Array.from(selectedFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedFields(items);
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-6 overflow-y-auto`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{form ? "Update Enquiry Form" : "Create Enquiry Form"}</h1>
        <button onClick={toggleSidebar} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">Back</button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
      {loading && <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">Loading...</div>}
      {formLink && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          <p className="font-medium">Form Submission Link</p>
          <a href={formLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all block mt-2">{formLink}</a>
          <div className="mt-2 space-x-2">
            <a href={formLink} download={`${formName}-form-link.txt`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Download Link</a>
            <button onClick={() => navigator.clipboard.writeText(formLink)} className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Copy Link</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div>
            <label htmlFor="formName" className="block text-base font-medium text-gray-700">Form Name</label>
            <input type="text" id="formName" value={formName} placeholder="Enter form name" onChange={(e) => setFormName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-separate focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" disabled={loading} />
          </div>

          <div>
            <label htmlFor="assignmentType" className="block text-base font-medium text-gray-700">Assign To</label>
            <select id="assignmentType" value={assignmentType} onChange={(e) => { setAssignmentType(e.target.value); setSelectedUsers([]); setSelectedRoles([]); setAvailableUsers(users); setAvailableRoles(roles); }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" disabled={loading}>
              <option value="Users">Users</option>
              <option value="Roles">Roles</option>
            </select>
          </div>

          {assignmentType === "Users" && (
            <div>
              <label className="block text-base font-medium text-gray-700">Select Users</label>
              <select onChange={(e) => handleAddUser(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" disabled={loading}>
                <option value="">Select a User</option>
                {availableUsers.map((user) => <option key={user.id} value={user.id}>{user.name || user.email}</option>)}
              </select>
              {selectedUsers.length > 0 && (
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th></tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">{selectedUsers.map((userId, index) => {
                      const user = users.find((u) => u.id === userId);
                      return <tr key={userId}><td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td><td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{user?.name || user?.email}</td><td className="px-6 py-4 whitespace-nowrap"><button type="button" onClick={() => handleRemoveUser(userId)} className="text-red-600 hover:text-red-800" disabled={loading}>✕</button></td></tr>;
                    })}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {assignmentType === "Roles" && (
            <div>
              <label className="block text-base font-medium text-gray-700">Select Roles</label>
              <select onChange={(e) => handleAddRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" disabled={loading}>
                <option value="">Select a Role</option>
                {availableRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
              {selectedRoles.length > 0 && (
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th></tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">{selectedRoles.map((roleId, index) => {
                      const role = roles.find((r) => r.id === roleId);
                      return <tr key={roleId}><td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td><td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{role?.name}</td><td className="px-6 py-4 whitespace-nowrap"><button type="button" onClick={() => handleRemoveRole(roleId)} className="text-red-600 hover:text-red-800" disabled={loading}>✕</button></td></tr>;
                    })}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-base font-medium text-gray-700">Select Enquiry Fields</label>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
              {allEnquiryFields.length > 0 ? allEnquiryFields.map((field) => (
                <div key={field.id} className="flex items-center">
                  <input type="checkbox" id={field.id} checked={selectedFields.some((f) => f.id === field.id)} onChange={() => handleFieldToggle(field.id)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" disabled={loading || isDragging} />
                  <label htmlFor={field.id} className="ml-2 text-base text-gray-700">{field.label} ({field.type})</label>
                </div>
              )) : <p>No enquiry fields available</p>}
            </div>

            <div className="mt-4">
              <h3 className="text-base font-medium text-gray-700">Selected Fields (Drag to Reorder)</h3>
              <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={(el) => { provided.innerRef(el); droppableRef.current = el; }} className={`mt-2 space-y-2 p-4 border rounded-md min-h-[100px] ${snapshot.isDraggingOver ? "bg-blue-50 border-blue-500" : "bg-white border-gray-300"}`}>
                    {selectedFields.length > 0 ? selectedFields.map((field, index) => {
                      const enquiryField = allEnquiryFields.find((f) => f.id === field.id);
                      if (!enquiryField) return null;
                      return (
                        <Draggable key={field.id} draggableId={field.id.toString()} index={index} isDragDisabled={loading}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`flex items-center p-2 rounded hover:bg-gray-100 ${snapshot.isDragging ? "bg-blue-100 shadow-lg" : "bg-gray-50"}`}>
                              <span className="mr-2 cursor-move text-gray-500 text-lg">☰</span>
                              <input type="checkbox" checked={true} onChange={(e) => { e.stopPropagation(); handleFieldToggle(field.id); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" disabled={loading || isDragging} />
                              <span className="ml-2 text-base text-gray-700 flex-1">{enquiryField.label} ({enquiryField.type})</span>
                              <input type="text" value={field.defaultValue} onChange={(e) => { e.stopPropagation(); handleDefaultValueChange(field.id, e.target.value); }} placeholder="Default value" className="ml-2 p-1 border border-gray-300 rounded-md text-sm w-1/3" disabled={loading || isDragging} />
                            </div>
                          )}
                        </Draggable>
                      );
                    }) : <p className="text-gray-500 text-center">No fields selected</p>}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
              {loading ? "Saving..." : form ? "Update" : "Save"}
            </button>
          </div>
        </DragDropContext>
      </form>
    </div>
  );
};

export default CreateEnquiryForm;