

import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { db, auth } from "../../../config/firebase";
import { addDoc, updateDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { s3Client } from "../../../config/aws-config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { debugS3Config } from "../../../config/aws-config";
// import { format } from "date-fns";

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
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  // const [audioError, setAudioError] = useState({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioError, setAudioError] = useState({});


  const [audioStatus, setAudioStatus] = useState({});

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
      closingDate: "",
      lostReason: "",
      createdAt: "",
      createdBy: "",
      history: [],
    }
  );

  const sourceOptions = ["Instagram", "Friend", "Family", "LinkedIn", "College"];
  const canCreate = rolePermissions.enquiries?.create || false;
  const canUpdate = rolePermissions.enquiries?.update || false;
  const canDisplay = rolePermissions.enquiries?.display || false;
  const lostReasonOptions = ["Price", "Location", "Schedule Conflict", "Not Interested", "Other"];

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
        closingDate: selectedEnquiry.closingDate || "",
        lostReason: selectedEnquiry.lostReason || "",
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
        closingDate: "",
        lostReason: "",
        createdAt: newCreatedAt,
        createdBy: currentUser?.displayName || currentUser?.email || "Unknown User",
        history: [],
      });
    }
  }, [selectedEnquiry, currentUser]);

   // Start recording function
   // Start recording function
   
  // Start recording function
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !MediaRecorder.isTypeSupported("audio/webm")) {
        alert("Audio recording is not supported in this browser.");
        return;
      }
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        console.log("Audio blob created:", audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        alert(`Recording failed: ${event.error.message}`);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Recording error:", error);
      alert(`Failed to start recording: ${error.message}. Please ensure microphone access is granted.`);
    }
  };
 
   // Upload to S3 function
   const uploadToS3 = async (audioBlob) => {
    if (!audioBlob) {
      console.error("No audio blob available for upload");
      alert("No audio recording to upload.");
      return null;
    }

    try {
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error("Missing AWS configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION not set");
      }

      const fileKey = `recordings/visit-recording-${editingEnquiryId || "new"}-${Date.now()}.webm`;
      const fileBuffer = await audioBlob.arrayBuffer();

      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: "audio/webm",
        ACL: "public-read", // Ensure public access
      };

      console.log("Uploading to S3 with params:", { bucketName, fileKey });
      await s3Client.send(new PutObjectCommand(params));
      const audioUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      console.log("Recording uploaded successfully:", audioUrl);
      alert("Recording uploaded successfully to S3!");
      setAudioBlob(null);
      return audioUrl;
    } catch (error) {
      console.error("S3 Upload Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
      });
      let errorMessage = "Failed to upload recording: ";
      if (error.name === "CredentialsError") {
        errorMessage += "Invalid or missing AWS credentials.";
      } else if (error.name === "AccessDenied") {
        errorMessage += "Access denied. Check S3 bucket policy and IAM permissions.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage += "Network or CORS issue. Verify CORS settings on the S3 bucket and network connectivity.";
      } else {
        errorMessage += error.message;
      }
      console.error(errorMessage);
      alert(errorMessage);
      return null;
    }
  };

   // Stop recording function
    // Stop recording function
  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsUploading(true);
      try {
        // Wait for audioBlob to be set
        const audioBlob = await new Promise((resolve) => {
          const checkBlob = () => {
            if (audioBlob) {
              resolve(audioBlob);
            } else {
              setTimeout(checkBlob, 100);
            }
          };
          checkBlob();
        });
        const audioUrl = await uploadToS3(audioBlob);
        if (audioUrl) {
          const noteObject = {
            content: "Office visit recording",
            type: "office-visit",
            audioUrl: audioUrl,
            createdAt: new Date().toISOString(),
            addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
          };
          const updatedNotes = [...newEnquiry.notes, noteObject];
          setNewEnquiry((prev) => ({
            ...prev,
            notes: updatedNotes,
          }));
          await handleAddNoteToFirebase(updatedNotes, noteObject);
        } else {
          alert("Failed to upload recording. Please try again.");
        }
      } catch (error) {
        console.error("Stop recording error:", error);
        alert(`Failed to process recording: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  };


  // Validate audio URL accessibility
   // Validate audio URL accessibility with retry
   const validateAudioUrl = async (url, index, retries = 2) => {
    setAudioStatus((prev) => ({ ...prev, [index]: "loading" }));
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        setAudioStatus((prev) => ({ ...prev, [index]: "valid" }));
        console.log(`Audio URL validated successfully: ${url}`);
      } else {
        if (response.status === 403) {
          throw new Error("HTTP 403: Forbidden - Check S3 bucket permissions or object ACL");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error(`Attempt ${3 - retries} failed to validate audio URL ${url}:`, error);
      if (retries > 0) {
        console.log(`Retrying validation for ${url} (${retries} retries left)...`);
        setTimeout(() => validateAudioUrl(url, index, retries - 1), 1000);
      } else {
        let errorMessage = "Unable to load audio: ";
        if (error.message.includes("403")) {
          errorMessage += "Access denied (HTTP 403). Ensure the S3 bucket policy allows public read access and verify the object's ACL is set to public-read.";
        } else {
          errorMessage += `${error.message}. Try downloading the file or check S3 configuration.`;
        }
        setAudioError((prev) => ({ ...prev, [index]: errorMessage }));
        setAudioStatus((prev) => ({ ...prev, [index]: "invalid" }));
      }
    }
  };



  const deleteFromS3 = async (fileKey) => {
    try {
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error("Missing AWS configuration: VITE_S3_BUCKET_NAME not set");
      }

      const params = {
        Bucket: bucketName,
        Key: fileKey,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      console.log(`Successfully deleted S3 object: ${fileKey}`);
    } catch (error) {
      console.error("S3 Delete Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
      });
      throw new Error(`Failed to delete recording from S3: ${error.message}`);
    }
  };

  const deleteRecording = async (note, index) => {
    if (!canUpdate) {
      alert("You don't have permission to update enquiries");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this recording? This action cannot be undone.")) {
      return;
    }

    try {
      const fileKey = note.audioUrl.split(".amazonaws.com/")[1];
      await deleteFromS3(fileKey);

      const updatedNotes = newEnquiry.notes.filter((_, i) => i !== index);
      const enquiryRef = doc(db, "enquiries", editingEnquiryId);
      const historyEntry = {
        action: `Deleted office visit note: "${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}"`,
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
        notes: updatedNotes,
        history: updatedHistory,
      }));

      alert("Recording deleted successfully!");
    } catch (error) {
      console.error("Delete Recording Error:", error);
      alert(`Failed to delete recording: ${error.message}`);
    }
  };

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
    const requiredFields = ["name", "email", "phone"];
    const missingFields = requiredFields.filter((field) => !newEnquiry[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (newEnquiry.stage === "closed-lost" && !newEnquiry.lostReason) {
      alert("Please select a Lost Reason for Closed Lost status.");
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
        closingDate: newEnquiry.closingDate || "",
        lostReason: newEnquiry.lostReason || "",
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
          closingDate: "",
          lostReason: "",
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
    if (isNaN(date.getTime())) return "Invalid date";
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

  const handleVisitToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

   // Handle audio error
   const handleAudioError = (index, error) => {
    console.error(`Audio error for note ${index}:`, error);
    let errorMessage = "Failed to play audio: ";
    if (error.target?.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
      errorMessage += "The audio format is not supported by your browser.";
    } else {
      errorMessage += "The file may be corrupted or inaccessible. Try downloading the file.";
    }
    setAudioError((prev) => ({ ...prev, [index]: errorMessage }));
    setAudioStatus((prev) => ({ ...prev, [index]: "invalid" }));
  };
  useEffect(() => {
    newEnquiry.notes.forEach((note, index) => {
      if (note.type === "office-visit" && note.audioUrl && !audioStatus[index]) {
        validateAudioUrl(note.audioUrl, index);
      }
    });
  }, [newEnquiry.notes]);

  // Validate audio URLs when notes change
  useEffect(() => {
    newEnquiry.notes.forEach((note, index) => {
      if (note.type === "office-visit" && note.audioUrl && !audioStatus[index]) {
        validateAudioUrl(note.audioUrl, index);
      }
    });
  }, [newEnquiry.notes]);


  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="fixed inset-0 mx-auto my-4 max-w-full sm:max-w-3xl w-[95%] sm:w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        style={{
          content: {
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          },
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold">
              {newEnquiry.name || (editingEnquiryId ? (isEditing ? "Edit Enquiry" : "View Enquiry") : "Add New Enquiry")}
            </h2>
            {newEnquiry.stage && newEnquiry.stage !== "" && (
              <span
                className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${stageDisplay[newEnquiry.stage]?.color || "bg-gray-100 text-gray-700"}`}
              >
                {stageDisplay[newEnquiry.stage]?.name || newEnquiry.stage}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
            {newEnquiry.assignTo && (
              <p className="text-xs sm:text-sm text-gray-600">Assigned to: {newEnquiry.assignTo}</p>
            )}
            <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isUploading}
        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white text-sm ${
          isUploading ? "bg-gray-400 cursor-not-allowed" : isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        } transition-colors`}
      >
        {isUploading ? "Uploading..." : isRecording ? "Stop Visit" : "Start Visit"}
      </button>
            
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mb-4 flex-wrap gap-2">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentSection(1)}
              className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setCurrentSection(2)}
              className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Additional Details
            </button>
            <button
              onClick={() => setCurrentSection(3)}
              className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Enquiry Details
            </button>
            <button
              onClick={() => setCurrentSection(4)}
              className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Notes
            </button>
            <button
              onClick={() => setCurrentSection(5)}
              className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              History
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {currentSection === 1 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.name}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                      placeholder="Enter name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.name)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={newEnquiry.email}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                      placeholder="Enter email"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.email)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Mobile</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.phone}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.phone)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Gender</label>
                  {isEditing ? (
                    <div className="mt-1 flex flex-wrap gap-3 sm:gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={newEnquiry.gender === "Female"}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })}
                          className="mr-1 sm:mr-2"
                        />
                        <span className="text-xs sm:text-sm">Female</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={newEnquiry.gender === "Male"}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })}
                          className="mr-1 sm:mr-2"
                        />
                        <span className="text-xs sm:text-sm">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="notToDisclose"
                          checked={newEnquiry.gender === "notToDisclose"}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })}
                          className="mr-1 sm:mr-2"
                        />
                        <span className="text-xs sm:text-sm">Not to disclose</span>
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.gender)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={newEnquiry.dateOfBirth}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, dateOfBirth: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.dateOfBirth)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Student Type</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.studentType}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, studentType: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select student type</option>
                      <option value="School Student">School Student</option>
                      <option value="College Student">College Student</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.studentType)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Address</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newEnquiry.streetAddress}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, streetAddress: e.target.value })}
                        placeholder="Street Address"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={newEnquiry.city}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, city: e.target.value })}
                        placeholder="City"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={newEnquiry.stateRegionProvince}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, stateRegionProvince: e.target.value })}
                        placeholder="State/Region/Province"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={newEnquiry.postalZipCode}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, postalZipCode: e.target.value })}
                        placeholder="Postal/Zip Code"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <select
                        value={newEnquiry.country}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, country: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    <div className="mt-1 text-xs sm:text-sm text-gray-900">
                      <p>{renderField(newEnquiry.streetAddress)}</p>
                      <p>{renderField(newEnquiry.city)}</p>
                      <p>{renderField(newEnquiry.stateRegionProvince)}</p>
                      <p>{renderField(newEnquiry.postalZipCode)}</p>
                      <p>{renderField(newEnquiry.country)}</p>
                    </div>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Creation Date and Time</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">
                    {formatDateSafely(newEnquiry.createdAt, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Creator Name</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.createdBy)}</p>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Owner Name</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.assignTo)}</p>
                </div>
              </div>
            </div>
          )}
          {currentSection === 2 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Additional Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">SSC Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.sscPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, sscPercentage: e.target.value })}
                      placeholder="Enter SSC percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.sscPercentage)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">School Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.schoolName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, schoolName: e.target.value })}
                      placeholder="Enter school name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.schoolName)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">SSC Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.sscPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, sscPassOutYear: e.target.value })}
                      placeholder="Enter SSC pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.sscPassOutYear)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">HSC Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.hscPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, hscPercentage: e.target.value })}
                      placeholder="Enter HSC percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.hscPercentage)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Junior College Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.juniorCollegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, juniorCollegeName: e.target.value })}
                      placeholder="Enter junior college name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.juniorCollegeName)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">HSC Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.hscPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, hscPassOutYear: e.target.value })}
                      placeholder="Enter HSC pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.hscPassOutYear)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Degree</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.degree}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, degree: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select degree</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.degree)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Graduation Stream</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.graduationStream}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationStream: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.graduationStream)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">College Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.collegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, collegeName: e.target.value })}
                      placeholder="Enter college name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.collegeName)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Graduation Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.graduationPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationPercentage: e.target.value })}
                      placeholder="Enter graduation percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.graduationPercentage)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Graduation Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.graduationPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationPassOutYear: e.target.value })}
                      placeholder="Enter graduation pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.graduationPassOutYear)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Post Graduation Stream</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.postGraduationStream}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationStream: e.target.value })}
                      placeholder="Enter post graduation stream"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationStream)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Post Graduation Percentage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.postGraduationPercentage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationPercentage: e.target.value })}
                      placeholder="Enter post graduation percentage"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationPercentage)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Post Graduation College Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.postGraduationCollegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationCollegeName: e.target.value })}
                      placeholder="Enter post graduation college name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationCollegeName)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Post Graduation Pass Out Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.postGraduationPassOutYear}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationPassOutYear: e.target.value })}
                      placeholder="Enter post graduation pass out year"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationPassOutYear)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Current Profession</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.currentProfession}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, currentProfession: e.target.value })}
                      placeholder="Enter current profession"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.currentProfession)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.workingCompanyName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, workingCompanyName: e.target.value })}
                      placeholder="Enter company name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.workingCompanyName)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Working Domain</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.workingDomain}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, workingDomain: e.target.value })}
                      placeholder="Enter working domain"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.workingDomain)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Experience in Years</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.experienceInYears}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, experienceInYears: e.target.value })}
                      placeholder="Enter experience in years"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      step="0.1"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.experienceInYears)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Guardian Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.guardianName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, guardianName: e.target.value })}
                      placeholder="Enter guardian name"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.guardianName)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Guardian Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.guardianContact}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, guardianContact: e.target.value })}
                      placeholder="Enter guardian contact"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.guardianContact)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Why do they want to do the course?</label>
                  {isEditing ? (
                    <textarea
                      value={newEnquiry.courseMotivation}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, courseMotivation: e.target.value })}
                      placeholder="Enter reason for taking the course"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows="4"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.courseMotivation)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {currentSection === 3 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Enquiry Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Branch</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.branch}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, branch: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.name}>{branch.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.branch)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Course</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.course}
                      onChange={handleCourseChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.name}>{course.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.course)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Fee</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={newEnquiry.fee}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, fee: e.target.value })}
                      placeholder="Enter fee"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.fee)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Source</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.source}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, source: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select source</option>
                      {sourceOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.source)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Assign To</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.assignTo}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, assignTo: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.f_name}>{instructor.f_name} {instructor.l_name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.assignTo)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Closing Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={newEnquiry.closingDate}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, closingDate: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.closingDate)}</p>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Stage</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.stage}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, stage: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select stage</option>
                      {Object.keys(stageDisplay).map((stage) => (
                        <option key={stage} value={stage}>{stageDisplay[stage].name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(stageDisplay[newEnquiry.stage]?.name)}</p>
                  )}
                </div>
                {newEnquiry.stage === "closed-lost" && (
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Lost Reason *</label>
                    {isEditing ? (
                      <select
                        value={newEnquiry.lostReason}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, lostReason: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      >
                        <option value="">Select reason</option>
                        {lostReasonOptions.map((reason) => (
                          <option key={reason} value={reason}>{reason}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.lostReason)}</p>
                    )}
                  </div>
                )}
              </div>
              {isEditing ? (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags && availableTags.length > 0 ? (
                      availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-xs sm:text-sm ${newEnquiry.tags.includes(tag)
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {tag}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">No tags available</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {newEnquiry.tags.length > 0 ? (
                      newEnquiry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-xs sm:text-sm bg-blue-100 border-blue-500 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-900">No tags assigned</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

{currentSection === 4 && (
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
          <div className="space-y-4">
            {newEnquiry.notes && newEnquiry.notes.length > 0 ? (
              newEnquiry.notes.map((note, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{formatNoteType(note.type)}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{formatDateSafely(note.createdAt, "MMM d, yyyy h:mm a")}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-900 mt-1">{note.content}</p>
                  {note.type === "office-visit" && note.audioUrl && (
                    <div className="mt-2">
                      {audioStatus[index] === "loading" ? (
                        <p className="text-xs sm:text-sm text-gray-500">Loading audio...</p>
                      ) : audioError[index] || audioStatus[index] === "invalid" ? (
                        <div>
                          <p className="text-xs sm:text-sm text-red-600">{audioError[index]}</p>
                          <a
                            href={note.audioUrl}
                            download
                            className="text-xs sm:text-sm text-blue-600 hover:underline"
                          >
                            Download Audio
                          </a>
                        </div>
                      ) : (
                        <audio
                          controls
                          src={note.audioUrl}
                          onError={(e) => handleAudioError(index, e)}
                          className="w-full max-w-md"
                        >
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {canUpdate && audioStatus[index] === "valid" && (
                        <button
                          onClick={() => deleteRecording(note, index)}
                          className="mt-2 px-2 py-1 text-xs sm:text-sm text-red-600 hover:text-red-800"
                        >
                          Delete Recording
                        </button>
                      )}
                    </div>
                  )}
                  {note.addedBy && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Added by: {note.addedBy}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">No notes available.</p>
            )}
          </div>
        </div>
         )}


         
          {currentSection === 5 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium">History</h3>
              {canDisplay && newEnquiry.history && newEnquiry.history.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {newEnquiry.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((entry, index) => (
                    <div key={index} className=" rounded-md">
                      <p className="text-sm text-gray-900">
                        {entry.action} by {entry.performedBy} on {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
                      </p>
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
                      closingDate: selectedEnquiry.closingDate || "",
                      lostReason: selectedEnquiry.lostReason || "",
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