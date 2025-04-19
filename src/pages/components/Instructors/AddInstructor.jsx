import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { addDoc, updateDoc, doc, collection, serverTimestamp } from "firebase/firestore";

const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  { code: "+91", label: "India (+91)" },
  // ... (rest of your country codes)
];

const AddInstructor = ({
  open,
  onClose,
  instructor,
  centers,
  roles,
  setInstructorList,
  onSave,
  currentUser, // Ensure this is passed from parent
}) => {
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    specialization: "",
    center: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const instructorCollectionRef = collection(db, "Instructor");
  const activityLogsCollectionRef = collection(db, "activityLogs");

  useEffect(() => {
    if (instructor && instructor.id) {
      setFormData({
        id: instructor.id,
        f_name: instructor.f_name || "",
        l_name: instructor.l_name || "",
        email: instructor.email || "",
        countryCode: instructor.countryCode || "+91",
        phone: instructor.phone || "",
        specialization: instructor.specialization || "",
        center: instructor.center || "",
        role: instructor.role || "",
      });
    } else {
      resetForm();
    }
  }, [instructor]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.f_name.trim()) newErrors.f_name = "First name is required";
    if (!formData.l_name.trim()) newErrors.l_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(formData.phone)) newErrors.phone = "Phone number must be 7-15 digits";
    if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required";
    if (!formData.center) newErrors.center = "Center is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const logActivity = async (action, details) => {
    if (!currentUser) {
      console.error("No currentUser provided for logging");
      return;
    }
    try {
      const logData = {
        userId: currentUser.uid,
        userEmail: currentUser.email || "Unknown",
        timestamp: serverTimestamp(),
        action,
        details,
      };
      console.log("Attempting to log:", logData); // Debug log
      const docRef = await addDoc(activityLogsCollectionRef, logData);
      console.log(`Activity logged successfully with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Failed to log activity:", error);
      throw error; // Re-throw to handle in handleSubmit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const instructorData = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        specialization: formData.specialization,
        center: formData.center,
        role: formData.role,
      };

      if (formData.id) {
        // Update instructor
        const instructorRef = doc(db, "Instructor", formData.id);
        await updateDoc(instructorRef, instructorData);
        const updatedInstructor = { id: formData.id, ...instructorData };
        setInstructorList((prev) =>
          prev.map((i) => (i.id === formData.id ? updatedInstructor : i))
        );
        await logActivity("Updated Instructor", {
          before: instructor,
          after: updatedInstructor,
        });
        if (onSave) onSave(updatedInstructor, true);
        alert("Instructor updated successfully!");
      } else {
        // Create instructor
        const newDoc = await addDoc(instructorCollectionRef, instructorData);
        const newInstructor = { id: newDoc.id, ...instructorData };
        setInstructorList((prev) => [...prev, newInstructor]);
        await logActivity("Created Instructor", { instructor: newInstructor });
        if (onSave) onSave(newInstructor, false);
        alert("Instructor created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error saving instructor or logging activity:", error);
      alert(`Failed to save instructor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      f_name: "",
      l_name: "",
      email: "",
      countryCode: "+91",
      phone: "",
      specialization: "",
      center: "",
      role: "",
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/5 md:w-1/3 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } z-50 overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {formData.id ? "Edit Staff" : "Add Staff"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.f_name}
                onChange={(e) => handleChange("f_name", e.target.value)}
                placeholder="Enter first name"
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.f_name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.f_name && <p className="mt-1 text-sm text-red-500">{errors.f_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.l_name}
                onChange={(e) => handleChange("l_name", e.target.value)}
                placeholder="Enter last name"
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.l_name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.l_name && <p className="mt-1 text-sm text-red-500">{errors.l_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="flex mt-1">
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleChange("countryCode", e.target.value)}
                  className={`w-1/3 px-3 py-2 border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code + country.label} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 15))
                  }
                  placeholder="Enter phone number"
                  className={`w-2/3 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleChange("specialization", e.target.value)}
                placeholder="Enter specialization"
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.specialization ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Center</label>
              <select
                value={formData.center}
                onChange={(e) => handleChange("center", e.target.value)}
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.center ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              >
                <option value="">Select a center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.name}>
                    {center.name}
                  </option>
                ))}
              </select>
              {errors.center && <p className="mt-1 text-sm text-red-500">{errors.center}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center"
                disabled={loading}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {formData.id ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddInstructor;