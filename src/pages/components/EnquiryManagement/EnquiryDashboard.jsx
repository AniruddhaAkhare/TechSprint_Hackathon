import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { db, auth } from "../../../config/firebase";
import { addDoc, updateDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";

Modal.setAppElement("#root");

const EnquiryModal = ({ isOpen, onRequestClose, courses, branches, instructors, availableTags, rolePermissions, selectedEnquiry, isNotesMode, noteType, setNoteType, newNote, setNewNote }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEnquiryId, setEditingEnquiryId] = useState(null);
  const [callDuration, setCallDuration] = useState("");
  const [callType, setCallType] = useState("incoming");
  const [callTime, setCallTime] = useState("");
  const [callDate, setCallDate] = useState("");
  const [callScheduledTime, setCallScheduledTime] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [newEnquiry, setNewEnquiry] = useState(
    selectedEnquiry || {
      name: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      stateRegionProvince: "",
      postalZipCode: "",
      country: "",
      gender: "",
      dateOfBirth: "",
      studentType: "",
      sscPercentage: "",
      schoolName: "",
      sscPassOutYear: "",
      hscPercentage: "",
      juniorCollegeName: "",
      hscPassOutYear: "",
      graduationStream: "",
      graduationPercentage: "",
      collegeName: "",
      graduationPassOutYear: "",
      postGraduationStream: "",
      postGraduationPercentage: "",
      postGraduationCollegeName: "",
      postGraduationPassOutYear: "",
      branch: "",
      course: "",
      source: "",
      assignTo: "",
      notes: [],
      tags: [],
      fee: "",
      degree: "",
      currentProfession: "",
      workingCompanyName: "",
      workingDomain: "",
      experienceInYears: "",
      guardianName: "",
      guardianContact: "",
      courseMotivation: "",
      stage: "",
      createdAt: "",
      createdBy: "",
      history: [],
    }
  );

  const sourceOptions = ["Instagram", "Friend", "Family", "LinkedIn", "College"];
  const canCreate = rolePermissions.enquiries?.create || false;
  const canUpdate = rolePermissions.enquiries?.update || false;
  const canDisplay = rolePermissions.enquiries?.display || false;

  const stageDisplay = {
    "pre-qualified": { name: "Pre Qualified", color: "bg-blue-100 text-blue-700" },
    "qualified": { name: "Qualified", color: "bg-purple-100 text-purple-700" },
    "negotiation": { name: "Negotiation", color: "bg-yellow-100 text-yellow-700" },
    "closed-won": { name: "Closed Won", color: "bg-green-100 text-green-700" },
    "closed-lost": { name: "Closed Lost", color: "bg-red-100 text-red-700" },
    "contact-in-future": { name: "Contact in Future", color: "bg-gray-100 text-gray-700" },
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedEnquiry) {
      const defaultCreatedAt = new Date().toISOString();
      setEditingEnquiryId(selectedEnquiry.id);
      const inferredHistory = [
        {
          action: `Created enquiry`,
          performedBy: selectedEnquiry.createdBy || "Unknown User",
          timestamp: selectedEnquiry.createdAt || defaultCreatedAt,
        },
        ...(selectedEnquiry.notes || []).map((note) => ({
          action: `Added ${formatNoteType(note.type).toLowerCase()} note: "${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}"`,
          performedBy: note.addedBy || "Unknown User",
          timestamp: note.createdAt,
        })),
        ...(selectedEnquiry.updatedAt && selectedEnquiry.updatedAt !== selectedEnquiry.createdAt
          ? [{
              action: `Updated enquiry`,
              performedBy: selectedEnquiry.createdBy || "Unknown User",
              timestamp: selectedEnquiry.updatedAt,
            }]
          : []),
        ...(selectedEnquiry.stage
          ? [{
              action: `Changed stage to ${stageDisplay[selectedEnquiry.stage]?.name || selectedEnquiry.stage}`,
              performedBy: selectedEnquiry.createdBy || "Unknown User",
              timestamp: selectedEnquiry.updatedAt || selectedEnquiry.createdAt,
            }]
          : []),
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setNewEnquiry({
        ...selectedEnquiry,
        notes: Array.isArray(selectedEnquiry.notes) ? selectedEnquiry.notes : [],
        tags: Array.isArray(selectedEnquiry.tags) ? selectedEnquiry.tags : [],
        stage: selectedEnquiry.stage || "",
        fee: selectedEnquiry.fee || "",
        createdAt: selectedEnquiry.createdAt || defaultCreatedAt,
        createdBy: selectedEnquiry.createdBy || currentUser?.displayName || currentUser?.email || "Unknown User",
        history: selectedEnquiry.history || inferredHistory,
      });
      setIsEditing(false);
    } else {
      const newCreatedAt = new Date().toISOString();
      setEditingEnquiryId(null);
      setIsEditing(true);
      setCurrentSection(1);
      setNewEnquiry({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        stateRegionProvince: "",
        postalZipCode: "",
        country: "",
        gender: "",
        dateOfBirth: "",
        studentType: "",
        sscPercentage: "",
        schoolName: "",
        sscPassOutYear: "",
        hscPercentage: "",
        juniorCollegeName: "",
        hscPassOutYear: "",
        graduationStream: "",
        graduationPercentage: "",
        collegeName: "",
        graduationPassOutYear: "",
        postGraduationStream: "",
        postGraduationPercentage: "",
        postGraduationCollegeName: "",
        postGraduationPassOutYear: "",
        branch: "",
        course: "",
        source: "",
        assignTo: "",
        notes: [],
        tags: [],
        fee: "",
        degree: "",
        currentProfession: "",
        workingCompanyName: "",
        workingDomain: "",
        experienceInYears: "",
        guardianName: "",
        guardianContact: "",
        courseMotivation: "",
        stage: "",
        createdAt: newCreatedAt,
        createdBy: currentUser?.displayName || currentUser?.email || "Unknown User",
        history: [],
      });
    }
  }, [selectedEnquiry, currentUser]);

  const handleAddNoteToFirebase = async (updatedNotes, noteObject) => {
    if (!editingEnquiryId) {
      alert("No enquiry selected to add note.");
      return;
    }
    if (!canUpdate) {
      alert("You don't have permission to update enquiries");
      return;
    }

    try {
      const enquiryRef = doc(db, "enquiries", editingEnquiryId);
      const historyEntry = {
        action: `Added ${formatNoteType(noteObject.type).toLowerCase()} note: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
        performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...(newEnquiry.history || []), historyEntry];
      await updateDoc(enquiryRef, {
        notes: updatedNotes,
        history: updatedHistory,
        updatedAt: new Date().toISOString(),
      });
      setNewEnquiry((prev) => ({
        ...prev,
        history: updatedHistory,
      }));
      if (noteObject.type === "call-schedule" && noteObject.callDate && noteObject.callScheduledTime) {
        const callDateTime = new Date(`${noteObject.callDate}T${noteObject.callScheduledTime}`);
        const timeUntilReminder = callDateTime - new Date() - 10 * 60 * 1000;
        if (timeUntilReminder > 0) {
          setTimeout(() => {
            setReminderDetails({
              name: newEnquiry.name || "this lead",
              date: noteObject.callDate,
              time: noteObject.callScheduledTime,
            });
            setShowReminder(true);
          }, timeUntilReminder);
        }
      }
      onRequestClose();
      alert("Note added successfully!");
    } catch (error) {
      alert(`Failed to add note: ${error.message}`);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert("Please add a note before submitting.");
      return;
    }
    const noteObject = {
      content: newNote,
      type: noteType,
      callDuration: noteType === "call-log" ? callDuration : null,
      callType: noteType === "call-log" ? callType : null,
      callTime: noteType === "call-log" ? callTime : null,
      callDate: noteType === "call-schedule" ? callDate : null,
      callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
      createdAt: new Date().toISOString(),
      addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
    };
    const updatedNotes = [...newEnquiry.notes, noteObject];
    setNewEnquiry((prev) => ({
      ...prev,
      notes: updatedNotes,
    }));
    await handleAddNoteToFirebase(updatedNotes, noteObject);
  };

  const handleAddEnquiry = async () => {
    const requiredFields = ["name", "email", "phone", "source", "streetAddress", "city", "stateRegionProvince", "postalZipCode", "country"];
    const missingFields = requiredFields.filter((field) => !newEnquiry[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (!canCreate && !editingEnquiryId) {
      alert("You don't have permission to create enquiries");
      return;
    }

    try {
      const emailQuery = query(collection(db, "enquiries"), where("email", "==", newEnquiry.email));
      const phoneQuery = query(collection(db, "enquiries"), where("phone", "==", newEnquiry.phone));
      const [emailSnapshot, phoneSnapshot] = await Promise.all([getDocs(emailQuery), getDocs(phoneQuery)]);

      let emailConflict = !emailSnapshot.empty;
      let phoneConflict = !phoneSnapshot.empty;

      if (editingEnquiryId) {
        const emailDocs = emailSnapshot.docs.filter((doc) => doc.id !== editingEnquiryId);
        const phoneDocs = phoneSnapshot.docs.filter((doc) => doc.id !== editingEnquiryId);
        emailConflict = emailDocs.length > 0;
        phoneConflict = phoneDocs.length > 0;
      }

      if (emailConflict) {
        alert("An enquiry with this email already exists.");
        return;
      }

      if (phoneConflict) {
        alert("An enquiry with this phone number already exists.");
        return;
      }

      const selectedCourse = courses.find((course) => course.name === newEnquiry.course);

      const enquiryData = {
        ...newEnquiry,
        stage: editingEnquiryId ? newEnquiry.stage : "pre-qualified",
        amount: Number(newEnquiry.fee) || 0,
        createdAt: newEnquiry.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: Array.isArray(newEnquiry.tags) ? newEnquiry.tags : [],
        createdBy: newEnquiry.createdBy || currentUser?.displayName || currentUser?.email || "Unknown User",
        history: newEnquiry.history || [],
      };

      const historyEntry = {
        action: editingEnquiryId ? `Updated enquiry` : `Created enquiry`,
        performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };

      if (editingEnquiryId && newEnquiry.stage !== selectedEnquiry?.stage) {
        enquiryData.history = [
          ...enquiryData.history,
          {
            action: `Changed stage to ${stageDisplay[newEnquiry.stage]?.name || newEnquiry.stage}`,
            performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
            timestamp: new Date().toISOString(),
          },
        ];
      }

      enquiryData.history = [...enquiryData.history, historyEntry];

      if (editingEnquiryId) {
        if (!canUpdate) {
          alert("You don't have permission to update enquiries");
          return;
        }
        const enquiryRef = doc(db, "enquiries", editingEnquiryId);
        await updateDoc(enquiryRef, enquiryData);
      } else {
        const docRef = await addDoc(collection(db, "enquiries"), enquiryData);
        setEditingEnquiryId(docRef.id);
      }

      setNewEnquiry((prev) => ({
        ...prev,
        history: enquiryData.history,
      }));

      if (currentSection < 4 && !isNotesMode) {
        setCurrentSection(currentSection + 1);
      } else {
        setNewEnquiry({
          name: "",
          email: "",
          phone: "",
          streetAddress: "",
          city: "",
          stateRegionProvince: "",
          postalZipCode: "",
          country: "",
          gender: "",
          dateOfBirth: "",
          studentType: "",
          sscPercentage: "",
          schoolName: "",
          sscPassOutYear: "",
          hscPercentage: "",
          juniorCollegeName: "",
          hscPassOutYear: "",
          graduationStream: "",
          graduationPercentage: "",
          collegeName: "",
          graduationPassOutYear: "",
          postGraduationStream: "",
          postGraduationPercentage: "",
          postGraduationCollegeName: "",
          postGraduationPassOutYear: "",
          branch: "",
          course: "",
          source: "",
          assignTo: "",
          notes: [],
          tags: [],
          fee: "",
          degree: "",
          currentProfession: "",
          workingCompanyName: "",
          workingDomain: "",
          experienceInYears: "",
          guardianName: "",
          guardianContact: "",
          courseMotivation: "",
          stage: "",
          createdAt: "",
          createdBy: "",
          history: [],
        });
        setEditingEnquiryId(null);
        setIsEditing(false);
        onRequestClose();
        alert("Enquiry saved successfully!");
      }
    } catch (error) {
      alert(`Failed to save enquiry: ${error.message}`);
    }
  };

  const handleTagToggle = (tag) => {
    setNewEnquiry((prev) => {
      const updatedTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return {
        ...prev,
        tags: updatedTags,
      };
    });
  };

  const formatDateSafely = (dateString, formatString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not available";
    return format(date, formatString);
  };

  const formatNoteType = (type) => {
    switch (type) {
      case "general-enquiry":
        return "General Enquiry";
      case "call-log":
        return "Call Log";
      case "call-schedule":
        return "Call Schedule";
      case "office-visit":
        return "Office Visit";
      default:
        return type;
    }
  };

  const renderField = (value, placeholder = "Not provided") => {
    return value || placeholder;
  };

  const handleCourseChange = (e) => {
    const selectedCourseName = e.target.value;
    setNewEnquiry((prev) => {
      const selectedCourse = courses.find((course) => course.name === selectedCourseName);
      return {
        ...prev,
        course: selectedCourseName,
        fee: selectedCourse ? selectedCourse.fee || "" : "",
      };
    });
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="fixed top-0 right-0 h-full w-full sm:w-[1600px] bg-white rounded-l-lg shadow-lg p-4 sm:p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        style={{
          content: {
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
          },
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              {newEnquiry.name || (editingEnquiryId ? (isEditing ? "Edit Enquiry" : "View Enquiry") : "Add New Enquiry")}
            </h2>
            {newEnquiry.stage && newEnquiry.stage !== "" && (
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${stageDisplay[newEnquiry.stage]?.color || "bg-gray-100 text-gray-700"}`}
              >
                {stageDisplay[newEnquiry.stage]?.name || newEnquiry.stage}
              </span>
            )}
          </div>
          {newEnquiry.assignTo && (
            <p className="text-sm text-gray-600">Assigned to: {newEnquiry.assignTo}</p>
          )}
        </div>
        <div className="flex justify-between mb-4 flex-wrap gap-2">
          <div className="flex space-x-2 sm:space-x-4">
            <button
              onClick={() => setCurrentSection(1)}
              className={`px-4 py-2 border rounded-md ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setCurrentSection(2)}
              className={`px-4 py-2 border rounded-md ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Additional Details
            </button>
            <button
              onClick={() => setCurrentSection(3)}
              className={`px-4 py-2 border rounded-md ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Enquiry Details
            </button>
            <button
              onClick={() => setCurrentSection(4)}
              className={`px-4 py-2 border rounded-md ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Notes
            </button>
            <button
              onClick={() => setCurrentSection(5)}
              className={`px-4 py-2 border rounded-md ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              History
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {currentSection === 1 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.name}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                      placeholder="Enter name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.name)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={newEnquiry.email}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                      placeholder="Enter email"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.email)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.phone}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.phone)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  {isEditing ? (
                    <div className="mt-1 flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={newEnquiry.gender === "Female"}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })}
                          className="mr-2"
                        />
                        Female
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={newEnquiry.gender === "Male"}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })}
                          className="mr-2"
                        />
                        Male
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="notToDisclose"
                          checked={newEnquiry.gender === "notToDisclose"}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })}
                          className="mr-2"
                        />
                        Not to disclose
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.gender)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={newEnquiry.dateOfBirth}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, dateOfBirth: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.dateOfBirth)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Student Type</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.studentType}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, studentType: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select student type</option>
                      <option value="School Student">School Student</option>
                      <option value="College Student">College Student</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.studentType)}</p>
                  )}
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newEnquiry.streetAddress}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, streetAddress: e.target.value })}
                        placeholder="Street Address"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        type="text"
                        value={newEnquiry.city}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, city: e.target.value })}
                        placeholder="City"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        type="text"
                        value={newEnquiry.stateRegionProvince}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, stateRegionProvince: e.target.value })}
                        placeholder="State/Region/Province"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        type="text"
                        value={newEnquiry.postalZipCode}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, postalZipCode: e.target.value })}
                        placeholder="Postal/Zip Code"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <select
                        value={newEnquiry.country}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, country: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select country</option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-gray-900">
                      <p>{renderField(newEnquiry.streetAddress)}</p>
                      <p>{renderField(newEnquiry.city)}</p>
                      <p>{renderField(newEnquiry.stateRegionProvince)}</p>
                      <p>{renderField(newEnquiry.postalZipCode)}</p>
                      <p>{renderField(newEnquiry.country)}</p>
                    </div>
                  )}
                </div>
                <div></div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Creation Date and Time</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateSafely(newEnquiry.createdAt, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Creator Name</label>
                  <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.createdBy)}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                  <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.assignTo)}</p>
                </div>
              </div>
            </div>
          )}
          {currentSection === 2 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Additional Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">SSC Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.sscPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, sscPercentage: e.target.value })}
                      placeholder="Enter SSC percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.sscPercentage)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">School Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.schoolName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, schoolName: e.target.value })}
                      placeholder="Enter school name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.schoolName)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">SSC Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.sscPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, sscPassOutYear: e.target.value })}
                      placeholder="Enter SSC pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.sscPassOutYear)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">HSC Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.hscPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, hscPercentage: e.target.value })}
                      placeholder="Enter HSC percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.hscPercentage)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Junior College Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.juniorCollegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, juniorCollegeName: e.target.value })}
                      placeholder="Enter junior college name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.juniorCollegeName)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">HSC Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.hscPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, hscPassOutYear: e.target.value })}
                      placeholder="Enter HSC pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.hscPassOutYear)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Degree</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.degree}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, degree: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select degree</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.degree)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Graduation Stream</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.graduationStream}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationStream: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select graduation stream</option>
                      <option value="B.Com/M.Com">B.Com/M.Com</option>
                      <option value="B.E/B.Tech">B.E/B.Tech</option>
                      <option value="BA">BA</option>
                      <option value="BBA">BBA</option>
                      <option value="BCA/MCA">BCA/MCA</option>
                      <option value="BSc/MSc">BSc/MSc</option>
                      <option value="M.E/M.Tech">M.E/M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="Others">Others</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.graduationStream)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">College Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.collegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, collegeName: e.target.value })}
                      placeholder="Enter college name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.collegeName)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Graduation Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.graduationPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationPercentage: e.target.value })}
                      placeholder="Enter graduation percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.graduationPercentage)}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Graduation Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.graduationPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationPassOutYear: e.target.value })}
                      placeholder="Enter graduation pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.graduationPassOutYear)}</p>
                  )}
                </div>
                <div>
                  </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Post Graduation Stream</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.postGraduationStream}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationStream: e.target.value })}
                      placeholder="Enter post graduation stream"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.postGraduationStream)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Post Graduation Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.postGraduationPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationPercentage: e.target.value })}
                      placeholder="Enter post graduation percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.postGraduationPercentage)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Post Graduation College Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.postGraduationCollegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationCollegeName: e.target.value })}
                      placeholder="Enter post graduation college name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.postGraduationCollegeName)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Post Graduation Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.postGraduationPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationPassOutYear: e.target.value })}
                      placeholder="Enter post graduation pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.postGraduationPassOutYear)}</p>
                  )}
                </div>
                <div></div>
                <div></div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Current Profession</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.currentProfession}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, currentProfession: e.target.value })}
                      placeholder="Enter current profession"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.currentProfession)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.workingCompanyName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, workingCompanyName: e.target.value })}
                      placeholder="Enter company name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.workingCompanyName)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Working Domain</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.workingDomain}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, workingDomain: e.target.value })}
                      placeholder="Enter working domain"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.workingDomain)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Experience in Years</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.experienceInYears}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, experienceInYears: e.target.value })}
                      placeholder="Enter experience in years"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.experienceInYears)}</p>
                  )}
                </div>
                <div></div>
                <div></div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.guardianName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, guardianName: e.target.value })}
                      placeholder="Enter guardian name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.guardianName)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Guardian Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.guardianContact}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, guardianContact: e.target.value })}
                      placeholder="Enter guardian contact"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.guardianContact)}</p>
                  )}
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Why do they want to do the course?</label>
                  {isEditing ? (
                    <textarea
                      value={newEnquiry.courseMotivation}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, courseMotivation: e.target.value })}
                      placeholder="Enter reason for taking the course"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.courseMotivation)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {currentSection === 3 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Enquiry Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.branch}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, branch: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.name}>{branch.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.branch)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.course}
                      onChange={handleCourseChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.name}>{course.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.course)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Fee</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.fee}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, fee: e.target.value })}
                      placeholder="Enter fee"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.fee)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Source</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.source}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, source: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select source</option>
                      {sourceOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.source)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Assign To</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.assignTo}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, assignTo: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.f_name}>{instructor.f_name} {instructor.l_name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{renderField(newEnquiry.assignTo)}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags && availableTags.length > 0 ? (
                      availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-full text-sm ${
                            newEnquiry.tags.includes(tag)
                              ? "bg-blue-100 border-blue-500 text-blue-700"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {tag}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tags available</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {newEnquiry.tags.length > 0 ? (
                      newEnquiry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 sm:px-4 sm:py-2 border rounded-full text-sm bg-blue-100 border-blue-500 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-900">No tags assigned</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {currentSection === 4 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
              {(!isNotesMode || (isNotesMode && selectedEnquiry)) && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Note Type</label>
                    <select
                      value={noteType || "general-enquiry"}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general-enquiry">General Enquiry</option>
                      <option value="call-log">Call Log</option>
                      <option value="call-schedule">Call Schedule</option>
                      <option value="office-visit">Office Visit</option>
                    </select>
                  </div>
                  {noteType === "call-log" && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
                        <input
                          type="number"
                          value={callDuration}
                          onChange={(e) => setCallDuration(e.target.value)}
                          placeholder="Enter call duration"
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Call Type</label>
                        <select
                          value={callType}
                          onChange={(e) => setCallType(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="incoming">Incoming</option>
                          <option value="outgoing">Outgoing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Call Time</label>
                        <input
                          type="time"
                          value={callTime}
                          onChange={(e) => setCallTime(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                  {noteType === "call-schedule" && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Call Date</label>
                        <input
                          type="date"
                          value={callDate}
                          onChange={(e) => setCallDate(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Call Time</label>
                        <input
                          type="time"
                          value={callScheduledTime}
                          onChange={(e) => setCallScheduledTime(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Note</label>
                    <textarea
                      value={newNote || ""}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add your note here..."
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mb-4">
                    <button
                      onClick={() => {
                        setNewNote("");
                        setNoteType("general-enquiry");
                        setCallDuration("");
                        setCallType("incoming");
                        setCallTime("");
                        setCallDate("");
                        setCallScheduledTime("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!canUpdate || !newNote?.trim()}
                      className={`px-4 py-2 rounded-md ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      Add Note
                    </button>
                  </div>
                </>
              )}
              <div>
                {newEnquiry.notes && newEnquiry.notes.length > 0 ? (
                  newEnquiry.notes.map((note, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">{formatNoteType(note.type)}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateSafely(note.createdAt, "MMM d, yyyy h:mm a")} by {note.addedBy}
                        </p>
                      </div>
                      {note.type === "call-log" && (
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Duration: {note.callDuration || "Not specified"} minutes</p>
                          <p>Type: {note.callType || "Not specified"}</p>
                          <p>Time: {note.callTime || "Not specified"}</p>
                        </div>
                      )}
                      {note.type === "call-schedule" && (
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Date: {note.callDate || "Not specified"}</p>
                          <p>Time: {note.callScheduledTime || "Not specified"}</p>
                        </div>
                      )}
                      <p className="text-sm text-gray-900">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No notes available</p>
                )}
              </div>
            </div>
          )}
          {currentSection === 5 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">History</h3>
              {canDisplay && newEnquiry.history && newEnquiry.history.length > 0 ? (
                <div className="space-y-4">
                  {newEnquiry.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((entry, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">{entry.action}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-900">Performed by: {entry.performedBy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No history available</p>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (selectedEnquiry) {
                    setNewEnquiry({
                      ...selectedEnquiry,
                      notes: Array.isArray(selectedEnquiry.notes) ? selectedEnquiry.notes : [],
                      tags: Array.isArray(selectedEnquiry.tags) ? selectedEnquiry.tags : [],
                      stage: selectedEnquiry.stage || "",
                      fee: selectedEnquiry.fee || "",
                      history: selectedEnquiry.history || [],
                    });
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEnquiry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {currentSection < 4 ? "Next Section" : (editingEnquiryId ? "Update Enquiry" : "Save Enquiry")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRequestClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              {selectedEnquiry && canUpdate && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Reminder Popup */}
      {showReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
            <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong> in 10 minutes:</p>
            <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
            <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
            <button
              onClick={() => setShowReminder(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryModal;
