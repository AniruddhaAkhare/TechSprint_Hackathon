import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { db, auth } from "../../../config/firebase";
import { addDoc, updateDoc, doc, collection, query, where, getDocs, getDoc} from "firebase/firestore";
import { format } from "date-fns";
import { s3Client } from "../../../config/aws-config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

Modal.setAppElement("#root");

const EnquiryModal = ({ isOpen, onRequestClose, courses, branches, Users, availableTags, rolePermissions, selectedEnquiry, isNotesMode, noteType, setNoteType, newNote, setNewNote, onNavigateToEnquiry }) => {
  const [salesRoleIds, setSalesRoleIds] = useState([]);
  const [currentSection, setCurrentSection] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEnquiryId, setEditingEnquiryId] = useState(null);
  const [callDuration, setCallDuration] = useState("");
  const [callType, setCallType] = useState("incoming");
  const [callTime, setCallTime] = useState("");
  // const [newEnquiry, setNewEnquiry] = useState({ /* existing initial state */ });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  useEffect(() => {
    const fetchSalesRoleIds = async () => {
      try {
        const rolesQuery = query(collection(db, 'roles'), where('name', '==', 'Sales'));
        const rolesSnapshot = await getDocs(rolesQuery);
        const roleIds = rolesSnapshot.docs.map(doc => doc.id);
        console.log("Sales role IDs:", roleIds);
        setSalesRoleIds(roleIds);
      } catch (error) {
        console.error('Error fetching Sales role IDs:', error);
        setSalesRoleIds([]);
      }
    };

    fetchSalesRoleIds();
  }, []);
  const [playbackSpeeds, setPlaybackSpeeds] = useState({});


  const [callDate, setCallDate] = useState(getTodayDate());
  const [callLogDate, setCallLogDate] = useState(getTodayDate());
  const [callScheduledTime, setCallScheduledTime] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDetails, setReminderDetails] = useState({ name: "", date: "", time: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
      lastModifiedTime: "",
      lastTouched: "",
    }
  );

  // const [newEnquiry, setNewEnquiry] = useState(
  //   selectedEnquiry || {
  //     name: "",
  //     email: "",
  //     phone: "",
  //     streetAddress: "",
  //     city: "",
  //     stateRegionProvince: "",
  //     postalZipCode: "",
  //     country: "",
  //     gender: "",
  //     dateOfBirth: "",
  //     studentType: "",
  //     sscPercentage: "",
  //     schoolName: "",
  //     sscPassOutYear: "",
  //     hscPercentage: "",
  //     juniorCollegeName: "",
  //     hscPassOutYear: "",
  //     graduationStream: "",
  //     graduationPercentage: "",
  //     postGraduationStream: "",

  //     collegeName: "",
  //     graduationPassOutYear: "",
  //     // postGraduationStream: "",
  //     postGraduationPercentage: "",
  //     postGraduationCollegeName: "",
  //     postGraduationPassOutYear: "",
  //     branch: "",
  //     course: "",
  //     source: "",
  //     assignTo: "",
  //     notes: [],
  //     tags: [],
  //     fee: "",
  //     degree: "",
  //     currentProfession: "",
  //     workingCompanyName: "",
  //     workingDomain: "",
  //     experienceInYears: "",
  //     guardianName: "",
  //     guardianContact: "",
  //     courseMotivation: "",
  //     stage: "",
  //     closingDate: "",
  //     lostReason: "",
  //     createdAt: "",
  //     createdBy: "",
  //     owner: "", // New field for Lead Owner
  //     history: [],
  //     lastModifiedTime: "",
  //     lastTouched: "",

  //   }
  // );
  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);

  const sourceOptions = [" Instagram Ads", "Google Ads", "Referrals", "Google Search", "Emails", "Cold Calls", "Email Campaigns", "Blogs", "Webinar", "LinkedIn", "Events" ];
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
          performedBy: getUserDisplayName(selectedEnquiry.createdBy || "Unknown User"),
          timestamp: selectedEnquiry.createdAt || defaultCreatedAt,
        },
        ...(selectedEnquiry.notes || []).map((note) => ({
          action: `Added ${formatNoteType(note.type).toLowerCase()} note: "${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}"`,
          performedBy: getUserDisplayName(note.addedBy || "Unknown User"),
          timestamp: note.createdAt,
        })),
        ...(selectedEnquiry.updatedAt && selectedEnquiry.updatedAt !== selectedEnquiry.createdAt
          ? [{
            action: `Updated enquiry`,
            performedBy: getUserDisplayName(selectedEnquiry.createdBy || "Unknown User"),
            timestamp: selectedEnquiry.updatedAt,
          }]
          : []),
        ...(selectedEnquiry.stage
          ? [{
            action: `Changed stage to ${stageDisplay[selectedEnquiry.stage]?.name || selectedEnquiry.stage}`,
            performedBy: getUserDisplayName(selectedEnquiry.createdBy || "Unknown User"),
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
        createdBy: getUserDisplayName(selectedEnquiry.createdBy || currentUser?.uid || "Unknown User"),
        assignTo: getUserDisplayName(selectedEnquiry.assignTo || selectedEnquiry.createdBy || currentUser?.uid || "Unknown User"),
        history: selectedEnquiry.history || inferredHistory,
      });
      setIsEditing(false);
    } else {
      const newCreatedAt = new Date();
      const defaultClosingDate = new Date(newCreatedAt);
      defaultClosingDate.setDate(newCreatedAt.getDate() + 7);
      const userIdentity = getUserDisplayName(currentUser?.uid);
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
        educationBreak: "",
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
        stage: "pre-qualified",
        closingDate: defaultClosingDate.toISOString().split("T")[0],
        lostReason: "",
        createdAt: newCreatedAt.toISOString(),
        createdBy: userIdentity,
        history: [],
        lastModifiedTime: "",
        lastTouched: "",
      });
    }
  }, [selectedEnquiry, currentUser, Users]);

  // useEffect(() => {
  //   if (selectedEnquiry) {
  //     const defaultCreatedAt = new Date().toISOString();
  //     setEditingEnquiryId(selectedEnquiry.id);
  //     const inferredHistory = [
  //       {
  //         action: `Created enquiry`,
  //         performedBy: getUserDisplayName(selectedEnquiry.createdBy || "Unknown User"),
  //         timestamp: selectedEnquiry.createdAt || defaultCreatedAt,
  //       },
  //       ...(selectedEnquiry.notes || []).map((note) => ({
  //         action: `Added ${formatNoteType(note.type).toLowerCase()} note: "${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}"`,
  //         performedBy: getUserDisplayName(note.addedBy || "Unknown User"),
  //         timestamp: note.createdAt,
  //       })),
  //       ...(selectedEnquiry.updatedAt && selectedEnquiry.updatedAt !== selectedEnquiry.createdAt
  //         ? [{
  //           action: `Updated enquiry`,
  //           performedBy: getUserDisplayName(selectedEnquiry.createdBy || "Unknown User"),
  //           timestamp: selectedEnquiry.updatedAt,
  //         }]
  //         : []),
  //       ...(selectedEnquiry.stage
  //         ? [{
  //           action: `Changed stage to ${stageDisplay[selectedEnquiry.stage]?.name || selectedEnquiry.stage}`,
  //           performedBy: getUserDisplayName(selectedEnquiry.createdBy || "Unknown User"),
  //           timestamp: selectedEnquiry.updatedAt || selectedEnquiry.createdAt,
  //         }]
  //         : []),
  //     ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  //     setNewEnquiry({
  //       ...selectedEnquiry,
  //       notes: Array.isArray(selectedEnquiry.notes) ? selectedEnquiry.notes : [],
  //       tags: Array.isArray(selectedEnquiry.tags) ? selectedEnquiry.tags : [],
  //       stage: selectedEnquiry.stage || "",
  //       fee: selectedEnquiry.fee || "",
  //       closingDate: selectedEnquiry.closingDate || "",
  //       lostReason: selectedEnquiry.lostReason || "",
  //       createdAt: selectedEnquiry.createdAt || defaultCreatedAt,
  //       createdBy: getUserDisplayName(selectedEnquiry.createdBy || currentUser?.uid || "Unknown User"),
  //       owner: getUserDisplayName(selectedEnquiry.owner || selectedEnquiry.assignTo || selectedEnquiry.createdBy || currentUser?.uid || "Unknown User"),
  //       history: selectedEnquiry.history || inferredHistory,
  //     });
  //     setIsEditing(false);
  //   } else {
  //     const newCreatedAt = new Date();
  //     const defaultClosingDate = new Date(newCreatedAt);
  //     defaultClosingDate.setDate(newCreatedAt.getDate() + 7);
  //     const userIdentity = getUserDisplayName(currentUser?.uid);
  //     setEditingEnquiryId(null);
  //     setIsEditing(true);
  //     setCurrentSection(1);
  //     setNewEnquiry({
  //       name: "",
  //       email: "",
  //       phone: "",
  //       streetAddress: "",
  //       city: "",
  //       stateRegionProvince: "",
  //       postalZipCode: "",
  //       country: "",
  //       gender: "",
  //       dateOfBirth: "",
  //       studentType: "",
  //       sscPercentage: "",
  //       schoolName: "",
  //       sscPassOutYear: "",
  //       hscPercentage: "",
  //       juniorCollegeName: "",
  //       hscPassOutYear: "",
  //       graduationStream: "",
  //       graduationPercentage: "",
  //       collegeName: "",
  //       graduationPassOutYear: "",
  //       postGraduationStream: "",
  //       postGraduationPercentage: "",
  //       postGraduationCollegeName: "",
  //       postGraduationPassOutYear: "",
  //       educationBreak: "",
  //       branch: "",
  //       course: "",
  //       source: "",
  //       assignTo: "",
  //       notes: [],
  //       tags: [],
  //       fee: "",
  //       degree: "",
  //       currentProfession: "",
  //       workingCompanyName: "",
  //       workingDomain: "",
  //       experienceInYears: "",
  //       guardianName: "",
  //       guardianContact: "",
  //       courseMotivation: "",
  //       stage: "pre-qualified",
  //       closingDate: defaultClosingDate.toISOString().split("T")[0],
  //       lostReason: "",
  //       createdAt: newCreatedAt.toISOString(),
  //       createdBy: userIdentity,
  //       owner: userIdentity,
  //       history: [],
  //       lastModifiedTime: "",
  //       lastTouched: "",
  //     });
  //   }
  // }, [selectedEnquiry, currentUser, Users]); // Add Users to dependencies



  const getUserDisplayName = (identifier) => {
    if (!Users || !Array.isArray(Users)) {
      console.warn("Users prop is invalid or empty");
      return identifier || "Unknown User";
    }
    const user = Users.find(
      (u) => u.id === identifier || u.email === identifier
    );
    if (!user) {
      console.warn(`User not found for identifier: ${identifier}`);
      return identifier || "Unknown User";
    }
    return user.displayName || user.email || "Unknown User";
  };


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
        // ACL: "public-read",
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

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      console.log("Stopping recording...");
      setIsRecording(false);
      setIsUploading(true);

      try {
        // Create a promise to wait for the audioBlob to be set
        const audioBlobResolved = await new Promise((resolve, reject) => {
          let timeoutId = setTimeout(() => {
            reject(new Error("Audio blob creation timed out"));
          }, 5000); // 5-second timeout to prevent infinite wait

          mediaRecorderRef.current.onstop = () => {
            clearTimeout(timeoutId);
            const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            if (blob.size === 0) {
              reject(new Error("Audio blob is empty"));
            } else {
              setAudioBlob(blob);
              resolve(blob);
            }
            audioChunksRef.current = []; // Reset chunks
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
          };

          mediaRecorderRef.current.onerror = (event) => {
            clearTimeout(timeoutId);
            reject(new Error(`MediaRecorder error: ${event.error.message}`));
          };

          mediaRecorderRef.current.stop();
        });

        // Upload the audio blob to S3
        const audioUrl = await uploadToS3(audioBlobResolved);
        if (audioUrl) {
          const noteObject = {
            content: "Office visit recording",
            type: "office-visit",
            audioUrl: audioUrl,
            createdAt: new Date().toISOString(),
            addedBy: getUserDisplayName(currentUser?.uid),
            //addedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
          };
          const updatedNotes = [...newEnquiry.notes, noteObject];
          setNewEnquiry((prev) => ({
            ...prev,
            notes: updatedNotes,
          }));
          await handleAddNoteToFirebase(updatedNotes, noteObject);
        } else {
          throw new Error("Failed to upload recording to S3");
        }
      } catch (error) {
        console.error("Stop recording error:", error);
        alert(`Failed to process recording: ${error.message}`);
      } finally {
        setIsUploading(false);
        setAudioBlob(null); // Clear blob after processing
      }
    }
  };

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

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Recording error:", error);
      alert(`Failed to start recording: ${error.message}. Please ensure microphone access is granted.`);
    }
  };


  const handleOpenConflictingEnquiry = async (docId) => {
    try {
      const enquiryRef = doc(db, "enquiries", docId);
      const enquirySnap = await getDoc(enquiryRef);
      if (enquirySnap.exists()) {
        const enquiryData = { id: docId, ...enquirySnap.data() };
        onRequestClose(); // Close current modal
        onNavigateToEnquiry(enquiryData); // Navigate to conflicting enquiry
      } else {
        alert("Failed to load enquiry: Enquiry not found.");
      }
    } catch (error) {
      console.error("Error navigating to enquiry:", error);
      alert(`Failed to load enquiry: ${error.message}`);
    }
  };
  

  const handleAddEnquiry = async () => {
    if (!newEnquiry.name) {
      alert("Please fill in the required field: Name");
      return;
    }
  
    if (!newEnquiry.email && !newEnquiry.phone) {
      alert("Please provide either an email or a phone number.");
      return;
    }
  
    if (newEnquiry.email && !validateEmail(newEnquiry.email)) {
      alert("Please enter a valid email address (e.g., example@domain.com)");
      return;
    }
  
    if (newEnquiry.phone && !validatePhone(newEnquiry.phone)) {
      alert("Please enter a valid 10-digit phone number (e.g., 1234567890)");
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
      const emailQuery = newEnquiry.email ? query(collection(db, "enquiries"), where("email", "==", newEnquiry.email)) : null;
      const phoneQuery = newEnquiry.phone ? query(collection(db, "enquiries"), where("phone", "==", newEnquiry.phone)) : null;
      const queries = [];
      if (emailQuery) queries.push(getDocs(emailQuery));
      if (phoneQuery) queries.push(getDocs(phoneQuery));
      const snapshots = await Promise.all(queries);
  
      let emailConflict = false;
      let phoneConflict = false;
      let conflictDetails = "";
      let conflictingDoc = null;
  
      if (emailQuery) {
        const emailSnapshot = snapshots[0];
        emailConflict = !emailSnapshot.empty;
        if (editingEnquiryId) {
          emailConflict = emailSnapshot.docs.some((doc) => doc.id !== editingEnquiryId);
        }
        if (emailConflict) {
          conflictingDoc = emailSnapshot.docs[0];
          conflictDetails = `Enquiry with email ${newEnquiry.email} exists: <a href="#" data-id="${conflictingDoc.id}" class="text-blue-600 underline">${conflictingDoc.data().name}</a>`;
        }
      }
      if (phoneQuery) {
        const phoneSnapshot = snapshots[phoneQuery ? snapshots.length - 1 : 0];
        phoneConflict = !phoneSnapshot.empty;
        if (editingEnquiryId) {
          phoneConflict = phoneSnapshot.docs.some((doc) => doc.id !== editingEnquiryId);
        }
        if (phoneConflict && !emailConflict) {
          conflictingDoc = phoneSnapshot.docs[0];
          conflictDetails = `Enquiry with phone ${newEnquiry.phone} exists: <a href="#" data-id="${conflictingDoc.id}" class="text-blue-600 underline">${conflictingDoc.data().name}</a>`;
        }
      }
  
      if (emailConflict || phoneConflict) {
        const alertContainer = document.createElement("div");
        alertContainer.innerHTML = conflictDetails;
        alertContainer.className = "p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full";
        document.body.appendChild(alertContainer);
  
        const link = alertContainer.querySelector("a[data-id]");
        if (link && conflictingDoc) {
          link.onclick = async (e) => {
            e.preventDefault();
            const docId = link.getAttribute("data-id");
            await handleOpenConflictingEnquiry(docId);
            alertContainer.remove();
          };
        }
  
        setTimeout(() => {
          if (alertContainer.parentNode) {
            alertContainer.remove();
          }
        }, 5000);
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
        lastModifiedTime: new Date().toISOString(),
        tags: Array.isArray(newEnquiry.tags) ? newEnquiry.tags : [],
        createdBy: getUserDisplayName(currentUser?.uid),
        assignTo: getUserDisplayName(newEnquiry.assignTo || currentUser?.uid),
        history: newEnquiry.history || [],
      };
  
      const historyEntry = {
        action: editingEnquiryId ? `Updated enquiry` : `Created enquiry`,
        performedBy: getUserDisplayName(currentUser?.uid),
        timestamp: new Date().toISOString(),
      };
  
      if (editingEnquiryId && newEnquiry.stage !== selectedEnquiry?.stage) {
        enquiryData.history = [
          ...enquiryData.history,
          {
            action: `Changed stage to ${stageDisplay[newEnquiry.stage]?.name || newEnquiry.stage}`,
            performedBy: getUserDisplayName(currentUser?.uid),
            timestamp: new Date().toISOString(),
          },
        ];
      }
  
      if (newEnquiry.assignTo && newEnquiry.assignTo !== selectedEnquiry?.assignTo) {
        enquiryData.history = [
          ...enquiryData.history,
          {
            action: `Assigned to ${newEnquiry.assignTo}`,
            performedBy: getUserDisplayName(currentUser?.uid),
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
          lastModifiedTime: "",
          lastTouched: "",
        });
        setEditingEnquiryId(null);
        setIsEditing(false);
        onRequestClose();
        alert("Enquiry saved successfully!");
      }
    } catch (error) {
      console.error("Error saving enquiry:", error);
      alert(`Failed to save enquiry: ${error.message}`);
    }
  };


  // const handleAddEnquiry = async () => {
  //   if (!newEnquiry.name) {
  //     alert("Please fill in the required field: Name");
  //     return;
  //   }
  
  //   if (!newEnquiry.email && !newEnquiry.phone) {
  //     alert("Please provide either an email or a phone number.");
  //     return;
  //   }
  
  //   if (newEnquiry.email && !validateEmail(newEnquiry.email)) {
  //     alert("Please enter a valid email address (e.g., example@domain.com)");
  //     return;
  //   }
  
  //   if (newEnquiry.phone && !validatePhone(newEnquiry.phone)) {
  //     alert("Please enter a valid 10-digit phone number (e.g., 1234567890)");
  //     return;
  //   }
  
  //   if (newEnquiry.stage === "closed-lost" && !newEnquiry.lostReason) {
  //     alert("Please select a Lost Reason for Closed Lost status.");
  //     return;
  //   }
  
  //   if (!canCreate && !editingEnquiryId) {
  //     alert("You don't have permission to create enquiries");
  //     return;
  //   }
  
  //   try {
  //     const emailQuery = newEnquiry.email ? query(collection(db, "enquiries"), where("email", "==", newEnquiry.email)) : null;
  //     const phoneQuery = newEnquiry.phone ? query(collection(db, "enquiries"), where("phone", "==", newEnquiry.phone)) : null;
  //     const queries = [];
  //     if (emailQuery) queries.push(getDocs(emailQuery));
  //     if (phoneQuery) queries.push(getDocs(phoneQuery));
  //     const snapshots = await Promise.all(queries);
  
  //     let emailConflict = false;
  //     let phoneConflict = false;
  //     let conflictDetails = "";
  //     let conflictingDoc = null;
  
  //     if (emailQuery) {
  //       const emailSnapshot = snapshots[0];
  //       emailConflict = !emailSnapshot.empty;
  //       if (editingEnquiryId) {
  //         emailConflict = emailSnapshot.docs.some((doc) => doc.id !== editingEnquiryId);
  //       }
  //       if (emailConflict) {
  //         conflictingDoc = emailSnapshot.docs[0];
  //         conflictDetails = `Enquiry with email ${newEnquiry.email} exists: <a href="#" data-id="${conflictingDoc.id}" class="text-blue-600 underline">${conflictingDoc.data().name}</a>`;
  //       }
  //     }
  //     if (phoneQuery) {
  //       const phoneSnapshot = snapshots[phoneQuery ? snapshots.length - 1 : 0];
  //       phoneConflict = !phoneSnapshot.empty;
  //       if (editingEnquiryId) {
  //         phoneConflict = phoneSnapshot.docs.some((doc) => doc.id !== editingEnquiryId);
  //       }
  //       if (phoneConflict && !emailConflict) {
  //         conflictingDoc = phoneSnapshot.docs[0];
  //         conflictDetails = `Enquiry with phone ${newEnquiry.phone} exists: <a href="#" data-id="${conflictingDoc.id}" class="text-blue-600 underline">${conflictingDoc.data().name}</a>`;
  //       }
  //     }

  //     if (emailConflict || phoneConflict) {
  //       // Create a pop-up for the conflict
  //       const alertContainer = document.createElement("div");
  //       alertContainer.innerHTML = conflictDetails;
  //       alertContainer.className = "p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full";
  //       document.body.appendChild(alertContainer);
      
  //       // Define link by selecting the <a> element with data-id attribute
  //       const link = alertContainer.querySelector("a[data-id]");
  //       if (link && conflictingDoc) {
  //         link.onclick = async (e) => {
  //           e.preventDefault();
  //           const docId = link.getAttribute("data-id");
  //           try {
  //             const enquiryRef = doc(db, "enquiries", docId);
  //             const enquirySnap = await getDoc(enquiryRef); // Use getDoc for single document
  //             if (enquirySnap.exists()) {
  //               const enquiryData = { id: docId, ...enquirySnap.data() };
  //               onRequestClose(); // Close current modal
  //               onNavigateToEnquiry(enquiryData); // Navigate to conflicting enquiry
  //             } else {
  //               alert("Failed to load enquiry: Enquiry not found.");
  //             }
  //           } catch (error) {
  //             console.error("Error navigating to enquiry:", error);
  //             alert(`Failed to load enquiry: ${error.message}`);
  //           }
  //           alertContainer.remove(); // Remove pop-up immediately after click
  //         };
  //       }
      
  //       setTimeout(() => {
  //         if (alertContainer.parentNode) {
  //           alertContainer.remove();
  //         }
  //       }, 5000); // Remove after 5 seconds if not clicked
  //       return;
  //     }

  //     // if (emailConflict || phoneConflict) {
  //     //   // Create a pop-up for the conflict
  //     //   const alertContainer = document.createElement("div");
        
  //     //   alertContainer.innerHTML = conflictDetails;
  //     //   alertContainer.className = "p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full";
  //     //   document.body.appendChild(alertContainer);
      
  //     //   // Define link by selecting the <a> element with data-id attribute
  //     //   const link = alertContainer.querySelector("a[data-id]");
  //     //   if (link && conflictingDoc) {
  //     //     link.onclick = async (e) => {
  //     //       e.preventDefault();
  //     //       const docId = link.getAttribute("data-id");
  //     //       try {
  //     //         const enquiryRef = doc(db, "enquiries", docId);
  //     //         const enquirySnap = await getDoc(enquiryRef); // Use getDoc for single document
  //     //         if (enquirySnap.exists()) {
  //     //           const enquiryData = { id: docId, ...enquirySnap.data() };
  //     //           onRequestClose(); // Close current modal
  //     //           onNavigateToEnquiry(enquiryData); // Navigate to conflicting enquiry
  //     //         } else {
  //     //           alert("Failed to load enquiry: Enquiry not found.");
  //     //         }
  //     //       } catch (error) {
  //     //         console.error("Error navigating to enquiry:", error);
  //     //         alert(`Failed to load enquiry: ${error.message}`);
  //     //       }
  //     //       alertContainer.remove(); // Remove pop-up immediately after click
  //     //     };
  //     //   }
      
  //     //   setTimeout(() => {
  //     //     if (alertContainer.parentNode) {
  //     //       alertContainer.remove();
  //     //     }
  //     //   }, 5000); // Remove after 5 seconds if not clicked
  //     //   return;
  //     // }
  
  
  //     const selectedCourse = courses.find((course) => course.name === newEnquiry.course);
  
  //     const enquiryData = {
  //       ...newEnquiry,
  //       stage: editingEnquiryId ? newEnquiry.stage : "pre-qualified",
  //       amount: Number(newEnquiry.fee) || 0,
  //       closingDate: newEnquiry.closingDate || "",
  //       lostReason: newEnquiry.lostReason || "",
  //       createdAt: newEnquiry.createdAt || new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       lastModifiedTime: new Date().toISOString(),
  //       tags: Array.isArray(newEnquiry.tags) ? newEnquiry.tags : [],
  //       createdBy: getUserDisplayName(currentUser?.uid),
  //       owner: getUserDisplayName(newEnquiry.assignTo || newEnquiry.owner || currentUser?.uid),
  //       history: newEnquiry.history || [],
  //     };
  
  //     const historyEntry = {
  //       action: editingEnquiryId ? `Updated enquiry` : `Created enquiry`,
  //       performedBy: getUserDisplayName(currentUser?.uid),
  //       timestamp: new Date().toISOString(),
  //     };
  
  //     if (editingEnquiryId && newEnquiry.stage !== selectedEnquiry?.stage) {
  //       enquiryData.history = [
  //         ...enquiryData.history,
  //         {
  //           action: `Changed stage to ${stageDisplay[newEnquiry.stage]?.name || newEnquiry.stage}`,
  //           performedBy: getUserDisplayName(currentUser?.uid),
  //           timestamp: new Date().toISOString(),
  //         },
  //       ];
  //     }
  
  //     if (newEnquiry.assignTo && newEnquiry.assignTo !== selectedEnquiry?.assignTo) {
  //       enquiryData.history = [
  //         ...enquiryData.history,
  //         {
  //           action: `Changed owner to ${newEnquiry.assignTo}`,
  //           performedBy: getUserDisplayName(currentUser?.uid),
  //           timestamp: new Date().toISOString(),
  //         },
  //       ];
  //     }
  
  //     enquiryData.history = [...enquiryData.history, historyEntry];
  
  //     if (editingEnquiryId) {
  //       if (!canUpdate) {
  //         alert("You don't have permission to update enquiries");
  //         return;
  //       }
  //       const enquiryRef = doc(db, "enquiries", editingEnquiryId);
  //       await updateDoc(enquiryRef, enquiryData);
  //     } else {
  //       const docRef = await addDoc(collection(db, "enquiries"), enquiryData);
  //       setEditingEnquiryId(docRef.id);
  //     }
  
  //     setNewEnquiry((prev) => ({
  //       ...prev,
  //       history: enquiryData.history,
  //     }));
  
  //     if (currentSection < 4 && !isNotesMode) {
  //       setCurrentSection(currentSection + 1);
  //     } else {
  //       setNewEnquiry({
  //         name: "",
  //         email: "",
  //         phone: "",
  //         streetAddress: "",
  //         city: "",
  //         stateRegionProvince: "",
  //         postalZipCode: "",
  //         country: "",
  //         gender: "",
  //         dateOfBirth: "",
  //         studentType: "",
  //         sscPercentage: "",
  //         schoolName: "",
  //         sscPassOutYear: "",
  //         hscPercentage: "",
  //         juniorCollegeName: "",
  //         hscPassOutYear: "",
  //         graduationStream: "",
  //         graduationPercentage: "",
  //         collegeName: "",
  //         graduationPassOutYear: "",
  //         postGraduationStream: "",
  //         postGraduationPercentage: "",
  //         postGraduationCollegeName: "",
  //         postGraduationPassOutYear: "",
  //         branch: "",
  //         course: "",
  //         source: "",
  //         assignTo: "",
  //         notes: [],
  //         tags: [],
  //         fee: "",
  //         degree: "",
  //         currentProfession: "",
  //         workingCompanyName: "",
  //         workingDomain: "",
  //         experienceInYears: "",
  //         guardianName: "",
  //         guardianContact: "",
  //         courseMotivation: "",
  //         stage: "",
  //         closingDate: "",
  //         lostReason: "",
  //         createdAt: "",
  //         createdBy: "",
  //         owner: "",
  //         history: [],
  //         lastModifiedTime: "",
  //         lastTouched: "",
  //       });
  //       setEditingEnquiryId(null);
  //       setIsEditing(false);
  //       onRequestClose();
  //       alert("Enquiry saved successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error saving enquiry:", error);
  //     alert(`Failed to save enquiry: ${error.message}`);
  //   }
  // };

  
  // Then in your conflict handling code:
  // link.onclick = async (e) => {
  //   e.preventDefault();
  //   const docId = link.getAttribute("data-id");
  //   await handleOpenConflictingEnquiry(docId);
  //   alertContainer.remove(); // Remove pop-up immediately after click
  // };

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
      if (!fileKey) {
        throw new Error("Invalid file key: File key is empty or undefined");
      }

      const params = {
        Bucket: bucketName,
        Key: decodeURIComponent(fileKey),
      };

      console.log("Attempting to delete S3 object with params:", {
        bucketName,
        fileKey,
        endpoint: `https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`,
      });

      const response = await s3Client.send(new DeleteObjectCommand(params));
      console.log(`Successfully deleted S3 object: ${fileKey}`, response);
    } catch (error) {
      console.error("S3 Delete Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
        requestId: error.$metadata?.requestId,
        httpStatusCode: error.$metadata?.httpStatusCode,
      });
      let errorMessage = "Failed to delete recording from S3: ";
      if (error.name === "CredentialsError") {
        errorMessage += "Invalid or missing AWS credentials.";
      } else if (error.name === "AccessDenied") {
        errorMessage += "Access denied. Check IAM permissions for s3:DeleteObject.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage += "Network or CORS issue. Verify S3 bucket CORS settings allow DELETE requests from your origin and check network connectivity.";
      } else if (error.code === "NoSuchKey") {
        errorMessage += "The specified file does not exist in the S3 bucket.";
      } else {
        errorMessage += `${error.message} (Request ID: ${error.$metadata?.requestId || "N/A"})`;
      }
      throw new Error(errorMessage);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
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
      const fileKeyMatch = note.audioUrl.match(/amazonaws\.com\/(.+)/);
      if (!fileKeyMatch || !fileKeyMatch[1]) {
        throw new Error("Invalid audio URL: Could not extract file key");
      }
      const fileKey = fileKeyMatch[1];
      await deleteFromS3(fileKey);

      const updatedNotes = newEnquiry.notes.filter((_, i) => i !== index);
      const enquiryRef = doc(db, "enquiries", editingEnquiryId);
      const historyEntry = {
        action: `Deleted office visit note: "${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}"`,
        // performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
        performedBy: getUserDisplayName(currentUser?.uid),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...(newEnquiry.history || []), historyEntry];

      await updateDoc(enquiryRef, {
        notes: updatedNotes,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setNewEnquiry((prev) => ({
        ...prev,
        notes: updatedNotes,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
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
        performedBy: getUserDisplayName(currentUser?.uid),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...(newEnquiry.history || []), historyEntry];
      await updateDoc(enquiryRef, {
        notes: updatedNotes,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setNewEnquiry((prev) => ({
        ...prev,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
      }));

      if (noteObject.type === "call-schedule" && noteObject.callDate && noteObject.callScheduledTime) {
        const callDateTime = new Date(`${noteObject.callDate}T${noteObject.callScheduledTime}`);
        const now = new Date();
        const timeUntilReminder = callDateTime.getTime() - now.getTime();
        if (timeUntilReminder > 0) {
          setTimeout(() => {
            setReminderDetails({
              name: newEnquiry.name || "this lead",
              date: noteObject.callDate,
              time: noteObject.callScheduledTime,
            });
            setShowReminder(true);
            const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
            audio.play().catch((error) => console.error("Error playing buzzer:", error));
          }, timeUntilReminder);
        } else {
          console.warn("Scheduled call is too soon or in the past; reminder not set.");
        }
      }
  
      setNewNote("");
      setNoteType("general-enquiry");
      setCurrentSection(4);
    
    } catch (error) {
      alert(`Failed to add note: ${error.message}`);
    }
  };
  
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert("Please add a note before submitting.");
      return;
    }
  
    if (noteType === "call-schedule") {
      const selectedDate = new Date(callDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        alert("Cannot schedule a call in the past.");
        return;
      }
    }
  
    const noteObject = {
      content: newNote,
      type: noteType,
      callDuration: noteType === "call-log" ? callDuration : null,
      callType: noteType === "call-log" ? callType : null,
      callTime: noteType === "call-log" ? callTime : null,
      callLogDate: noteType === "call-log" ? callLogDate : null,
      callDate: noteType === "call-schedule" ? callDate : null,
      callScheduledTime: noteType === "call-schedule" ? callScheduledTime : null,
      createdAt: new Date().toISOString(),
      addedBy: getUserDisplayName(currentUser?.uid),
    };
  
    const updatedNotes = [...newEnquiry.notes, noteObject];
    setNewEnquiry((prev) => ({
      ...prev,
      notes: updatedNotes,
    }));
    await handleAddNoteToFirebase(updatedNotes, noteObject);
  };

 
  // const handleAddEnquiry = async () => {
  //   if (!newEnquiry.name) {
  //     alert("Please fill in the required field: Name");
  //     return;
  //   }

  //   if (!newEnquiry.email && !newEnquiry.phone) {
  //     alert("Please provide either an email or a phone number.");
  //     return;
  //   }

  //   if (newEnquiry.email && !validateEmail(newEnquiry.email)) {
  //     alert("Please enter a valid email address (e.g., example@domain.com)");
  //     return;
  //   }

  //   if (newEnquiry.phone && !validatePhone(newEnquiry.phone)) {
  //     alert("Please enter a valid 10-digit phone number (e.g., 1234567890)");
  //     return;
  //   }

  //   if (newEnquiry.stage === "closed-lost" && !newEnquiry.lostReason) {
  //     alert("Please select a Lost Reason for Closed Lost status.");
  //     return;
  //   }

  //   if (!canCreate && !editingEnquiryId) {
  //     alert("You don't have permission to create enquiries");
  //     return;
  //   }

  //   try {
  //     const emailQuery = newEnquiry.email ? query(collection(db, "enquiries"), where("email", "==", newEnquiry.email)) : null;
  //     const phoneQuery = newEnquiry.phone ? query(collection(db, "enquiries"), where("phone", "==", newEnquiry.phone)) : null;
  //     const queries = [];
  //     if (emailQuery) queries.push(getDocs(emailQuery));
  //     if (phoneQuery) queries.push(getDocs(phoneQuery));
  //     const snapshots = await Promise.all(queries);

  //     let emailConflict = false;
  //     let phoneConflict = false;
  //     let conflictDetails = "";
  //     let conflictingDoc = null;

  //     if (emailQuery) {
  //       const emailSnapshot = snapshots[0];
  //       emailConflict = !emailSnapshot.empty;
  //       if (editingEnquiryId) {
  //         emailConflict = emailSnapshot.docs.some((doc) => doc.id !== editingEnquiryId);
  //       }
  //       if (emailConflict) {
  //         conflictingDoc = emailSnapshot.docs[0];
  //         conflictDetails = `Enquiry with email ${newEnquiry.email} exists: <a href="#" data-id="${conflictingDoc.id}" class="text-blue-600 underline">${conflictingDoc.data().name}</a>`;
  //       }
  //     }
  //     if (phoneQuery) {
  //       const phoneSnapshot = snapshots[phoneQuery ? snapshots.length - 1 : 0];
  //       phoneConflict = !phoneSnapshot.empty;
  //       if (editingEnquiryId) {
  //         phoneConflict = phoneSnapshot.docs.some((doc) => doc.id !== editingEnquiryId);
  //       }
  //       if (phoneConflict && !emailConflict) {
  //         conflictingDoc = phoneSnapshot.docs[0];
  //         conflictDetails = `Enquiry with phone ${newEnquiry.phone} exists: <a href="#" data-id="${conflictingDoc.id}" class="text-blue-600 underline">${conflictingDoc.data().name}</a>`;
  //       }
  //     }

  //     if (emailConflict || phoneConflict) {
  //       // Create a pop-up for the conflict
  //       const alertContainer = document.createElement("div");
  //       alertContainer.innerHTML = conflictDetails;
  //       alertContainer.className = "p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full";
  //       const link = alertContainer.querySelector("a");
  //       if (link && conflictingDoc) {
  //         link.onclick = async (e) => {
  //           e.preventDefault();
  //           const docId = link.getAttribute("data-id");
  //           try {
  //             const enquiryRef = doc(db, "enquiries", docId);
  //             const enquirySnap = await getDocs(query(collection(db, "enquiries"), where("__name__", "==", docId)));
  //             if (!enquirySnap.empty) {
  //               const enquiryData = { id: docId, ...enquirySnap.docs[0].data() };
  //               onRequestClose(); // Close current modal
  //               onNavigateToEnquiry(enquiryData); // Navigate to conflicting enquiry
  //             } else {
  //               alert("Failed to load enquiry: Enquiry not found.");
  //             }
  //           } catch (error) {
  //             console.error("Error navigating to enquiry:", error);
  //             alert(`Failed to load enquiry: ${error.message}`);
  //           }
  //           alertContainer.remove(); // Remove pop-up immediately after click
  //         };
  //       }
  //       document.body.appendChild(alertContainer);
  //       setTimeout(() => {
  //         if (alertContainer.parentNode) {
  //           alertContainer.remove();
  //         }
  //       }, 5000); // Remove after 5 seconds if not clicked
  //       return;
  //     }

  //     const selectedCourse = courses.find((course) => course.name === newEnquiry.course);

  //     const enquiryData = {
  //       ...newEnquiry,
  //       stage: editingEnquiryId ? newEnquiry.stage : "pre-qualified",
  //       amount: Number(newEnquiry.fee) || 0,
  //       closingDate: newEnquiry.closingDate || "",
  //       lostReason: newEnquiry.lostReason || "",
  //       createdAt: newEnquiry.createdAt || new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       lastModifiedTime: new Date().toISOString(),
  //       tags: Array.isArray(newEnquiry.tags) ? newEnquiry.tags : [],
  //       createdBy: getUserDisplayName(currentUser?.uid),
  //       owner: getUserDisplayName(newEnquiry.assignTo || newEnquiry.owner || currentUser?.uid),
  //       history: newEnquiry.history || [],
  //     };

  //     const historyEntry = {
  //       action: editingEnquiryId ? `Updated enquiry` : `Created enquiry`,
  //       performedBy: getUserDisplayName(currentUser?.uid),
  //       timestamp: new Date().toISOString(),
  //     };

  //     if (editingEnquiryId && newEnquiry.stage !== selectedEnquiry?.stage) {
  //       enquiryData.history = [
  //         ...enquiryData.history,
  //         {
  //           action: `Changed stage to ${stageDisplay[newEnquiry.stage]?.name || newEnquiry.stage}`,
  //           performedBy: getUserDisplayName(currentUser?.uid),
  //           timestamp: new Date().toISOString(),
  //         },
  //       ];
  //     }

  //     if (newEnquiry.assignTo && newEnquiry.assignTo !== selectedEnquiry?.assignTo) {
  //       enquiryData.history = [
  //         ...enquiryData.history,
  //         {
  //           action: `Changed owner to ${newEnquiry.assignTo}`,
  //           performedBy: getUserDisplayName(currentUser?.uid),
  //           timestamp: new Date().toISOString(),
  //         },
  //       ];
  //     }

  //     enquiryData.history = [...enquiryData.history, historyEntry];

  //     if (editingEnquiryId) {
  //       if (!canUpdate) {
  //         alert("You don't have permission to update enquiries");
  //         return;
  //       }
  //       const enquiryRef = doc(db, "enquiries", editingEnquiryId);
  //       await updateDoc(enquiryRef, enquiryData);
  //     } else {
  //       const docRef = await addDoc(collection(db, "enquiries"), enquiryData);
  //       setEditingEnquiryId(docRef.id);
  //     }

  //     setNewEnquiry((prev) => ({
  //       ...prev,
  //       history: enquiryData.history,
  //     }));

  //     if (currentSection < 4 && !isNotesMode) {
  //       setCurrentSection(currentSection + 1);
  //     } else {
  //       setNewEnquiry({
  //         name: "",
  //         email: "",
  //         phone: "",
  //         streetAddress: "",
  //         city: "",
  //         stateRegionProvince: "",
  //         postalZipCode: "",
  //         country: "",
  //         gender: "",
  //         dateOfBirth: "",
  //         studentType: "",
  //         sscPercentage: "",
  //         schoolName: "",
  //         sscPassOutYear: "",
  //         hscPercentage: "",
  //         juniorCollegeName: "",
  //         hscPassOutYear: "",
  //         graduationStream: "",
  //         graduationPercentage: "",
  //         collegeName: "",
  //         graduationPassOutYear: "",
  //         postGraduationStream: "",
  //         postGraduationPercentage: "",
  //         postGraduationCollegeName: "",
  //         postGraduationPassOutYear: "",
  //         branch: "",
  //         course: "",
  //         source: "",
  //         assignTo: "",
  //         notes: [],
  //         tags: [],
  //         fee: "",
  //         degree: "",
  //         currentProfession: "",
  //         workingCompanyName: "",
  //         workingDomain: "",
  //         experienceInYears: "",
  //         guardianName: "",
  //         guardianContact: "",
  //         courseMotivation: "",
  //         stage: "",
  //         closingDate: "",
  //         lostReason: "",
  //         createdAt: "",
  //         createdBy: "",
  //         owner: "",
  //         history: [],
  //         lastModifiedTime: "",
  //         lastTouched: "",
  //         // ... (reset other fields as in original code)
  //       });
  //       setEditingEnquiryId(null);
  //       setIsEditing(false);
  //       onRequestClose();
  //       alert("Enquiry saved successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error saving enquiry:", error);
  //     alert(`Failed to save enquiry: ${error.message}`);
  //   }
  // };

  const handleTagToggle = async (tag) => {
    if (!canUpdate) {
      alert("You don't have permission to update enquiries");
      return;
    }
  
    try {
      const enquiryRef = doc(db, "enquiries", editingEnquiryId);
      const isTagAdded = !newEnquiry.tags.includes(tag);
      const updatedTags = isTagAdded
        ? [...newEnquiry.tags, tag]
        : newEnquiry.tags.filter((t) => t !== tag);
  
      const historyEntry = {
        action: `${isTagAdded ? "Added" : "Removed"} tag: "${tag}"`,
        performedBy: getUserDisplayName(currentUser?.uid),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...(newEnquiry.history || []), historyEntry];
  
      await updateDoc(enquiryRef, {
        tags: updatedTags,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
  
      setNewEnquiry((prev) => ({
        ...prev,
        tags: updatedTags,
        history: updatedHistory,
        lastTouched: new Date().toISOString(),
      }));
    } catch (error) {
      alert(`Failed to update tags: ${error.message}`);
    }
  };

  // const handleTagToggle = async (tag) => {
  //   if (!canUpdate) {
  //     alert("You don't have permission to update enquiries");
  //     return;
  //   }

  //   try {
  //     const enquiryRef = doc(db, "enquiries", editingEnquiryId);
  //     const isTagAdded = !newEnquiry.tags.includes(tag);
  //     const updatedTags = isTagAdded
  //       ? [...newEnquiry.tags, tag]
  //       : newEnquiry.tags.filter((t) => t !== tag);

  //     const historyEntry = {
  //       action: `${isTagAdded ? "Added" : "Removed"} tag: "${tag}"`,
  //       // performedBy: currentUser?.displayName || currentUser?.email || "Unknown User",
  //       performedBy: getUserDisplayName(currentUser?.uid),
  //       timestamp: new Date().toISOString(),
  //     };
  //     const updatedHistory = [...(newEnquiry.history || []), historyEntry];

  //     await updateDoc(enquiryRef, {
  //       tags: updatedTags,
  //       history: updatedHistory,
  //       lastTouched: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     });

  //     setNewEnquiry((prev) => ({
  //       ...prev,
  //       tags: updatedTags,
  //       history: updatedHistory,
  //       lastTouched: new Date().toISOString(),
  //     }));
  //   } catch (error) {
  //     alert(`Failed to update tags: ${error.message}`);
  //   }
  // };



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
    const fetchSalesRoleIds = async () => {
      try {
        const rolesQuery = query(collection(db, 'roles'), where('name', '==', 'Sales'));
        const rolesSnapshot = await getDocs(rolesQuery);
        const roleIds = rolesSnapshot.docs.map(doc => doc.id);
        console.log("Sales role IDs:", roleIds);
        setSalesRoleIds(roleIds);
      } catch (error) {
        console.error('Error fetching Sales role IDs:', error);
        setSalesRoleIds([]);
      } finally {
        setIsLoadingCounselors(false); // Set loading to false after fetching
      }
    };
  
    fetchSalesRoleIds();
  }, []);


  useEffect(() => {
    newEnquiry.notes.forEach((note, index) => {
      if (note.type === "office-visit" && note.audioUrl && !audioStatus[index]) {
        validateAudioUrl(note.audioUrl, index);
      }
    });
  }, [newEnquiry.notes]);
  const currentYear = new Date().getFullYear();

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
      className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white text-sm ${isUploading ? "bg-gray-400 cursor-not-allowed" : isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        } transition-colors`}
    >
      {isUploading ? "Uploading..." : isRecording ? "Stop Visit" : "Start Visit"}
    </button>
  </div>
</div>
        {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
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
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white text-sm ${isUploading ? "bg-gray-400 cursor-not-allowed" : isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                } transition-colors`}
            >
              {isUploading ? "Uploading..." : isRecording ? "Stop Visit" : "Start Visit"}
            </button>
          </div>
        </div> */}
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
      <div className="mb-3 sm:mb-4 sm:col-span-1">
        <div className="mb-4 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Creator Name</label>
          <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.createdBy)}</p>
        </div>
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Assign To</label>
          {isEditing ? (
            <select
              value={newEnquiry.assignTo}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, assignTo: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select counselor</option>
              {isLoadingCounselors ? (
                <option value="" disabled>Loading counselors...</option>
              ) : salesRoleIds.length > 0 && Users && Array.isArray(Users) && Users.length > 0 ? (
                Users
                  .filter((user) => salesRoleIds.includes(user.role))
                  .map((user) => (
                    <option key={user.id} value={user.displayName}>
                      {user.displayName || 'Unknown User'}
                    </option>
                  ))
              ) : (
                <option value="" disabled>No counselors available</option>
              )}
            </select>
          ) : (
            <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.assignTo)}</p>
          )}
        </div>
      </div>
      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">Last Modified Time</label>
        <p className="mt-1 text-xs sm:text-sm text-gray-900">
          {formatDateSafely(newEnquiry.lastModifiedTime, "MMM d, yyyy h:mm a")}
        </p>
      </div>
      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">Last Touched</label>
        <p className="mt-1 text-xs sm:text-sm text-gray-900">
          {formatDateSafely(newEnquiry.lastTouched, "MMM d, yyyy h:mm a")}
        </p>
      </div>
    </div>
  </div>
)}
          {/* {currentSection === 1 && (
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

                <div className="mb-3 sm:mb-4 sm:col-span-1">
                  <div className="mb-4 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Creator Name</label>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.createdBy)}</p>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Owner Name</label>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.owner)}</p>
                  </div>
                </div>



                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Last Modified Time</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">
                    {formatDateSafely(newEnquiry.lastModifiedTime, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Last Touched</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">
                    {formatDateSafely(newEnquiry.lastTouched, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          )} */}

          {currentSection === 2 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">School & HSC Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* SSC Fields (Left Side) */}
                <div className="space-y-4">
                <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700">SSC Percentage</label>
  {isEditing ? (
    <input
      type="number"
      value={newEnquiry.sscPercentage}
      onChange={(e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
          setNewEnquiry({ ...newEnquiry, sscPercentage: value });
        }
      }}
      placeholder="Enter SSC percentage (0-100)"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      min="0"
      max="100"
      step="0.01"
    />
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.sscPercentage)}</p>
  )}
</div>
                  
                  <div>
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
                

<div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              SSC Pass Out Year
            </label>
            {isEditing ? (
              <input
                type="number"
                value={newEnquiry.sscPassOutYear}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 4 && (value === "" || (value >= 1900 && value <= currentYear))) {
                    setNewEnquiry({ ...newEnquiry, sscPassOutYear: value });
                  }
                }}
                placeholder="Enter SSC pass out year (YYYY)"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                min="1900"
                max={currentYear}
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">
                {renderField(newEnquiry.sscPassOutYear)}
              </p>
            )}
          </div>

                </div>

                {/* HSC Fields (Right Side) */}
                <div className="space-y-4">
                <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700">HSC Percentage</label>
  {isEditing ? (
    <input
      type="number"
      value={newEnquiry.hscPercentage}
      onChange={(e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
          setNewEnquiry({ ...newEnquiry, hscPercentage: value });
        }
      }}
      placeholder="Enter HSC percentage (0-100)"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      min="0"
      max="100"
      step="0.01"
    />
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.hscPercentage)}</p>
  )}
</div>
                
                  <div>
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
                  <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              HSC Pass Out Year
            </label>
            {isEditing ? (
              <input
                type="number"
                value={newEnquiry.hscPassOutYear}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 4 && (value === "" || (value >= 1900 && value <= currentYear))) {
                    setNewEnquiry({ ...newEnquiry, hscPassOutYear: value });
                  }
                }}
                placeholder="Enter HSC pass out year (YYYY)"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                min="1900"
                max={currentYear}
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">
                {renderField(newEnquiry.hscPassOutYear)}
              </p>
            )}
          </div>
                  
                 
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-medium mb-2 mt-6">Undergraduate and Post-graduate Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* UG Fields (Left Side) */}
                <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Highest Degree</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.highestDegree}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, highestDegree: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select highest degree</option>
                      <option value="UG">Undergraduate</option>
                      <option value="PG">Postgraduate</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.highestDegree)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">UG Degree</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.degree}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, degree: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select UG degree</option>
                      <option value="BSc">BSc</option>
                      <option value="BCom">BCom</option>
                      <option value="BA">BA</option>
                      <option value="BTech">BTech</option>
                      <option value="BCA">BCA</option>
                      <option value="BCCA">BCCA</option>
                      <option value="B.Ed">B.Ed</option>
                      <option value="MBBS">MBBS</option>
                      <option value="BDS">BDS</option>
                      <option value="B.Pham">B.Pham</option>
                      <option value="LLB">LLB</option>
                      <option value="BBA">BBA</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.degree)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">UG College</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.collegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, collegeName: e.target.value })}
                      placeholder="Enter UG college"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.collegeName)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">UG Branch</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.graduationBranch}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, graduationBranch: e.target.value })}
                      placeholder="Enter UG branch"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.graduationBranch)}</p>
                  )}
                </div>
                <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700">UG Percentage</label>
  {isEditing ? (
    <input
      type="number"
      value={newEnquiry.graduationPercentage}
      onChange={(e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
          setNewEnquiry({ ...newEnquiry, graduationPercentage: value });
        }
      }}
      placeholder="Enter UG percentage (0-100)"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      min="0"
      max="100"
      step="0.01"
    />
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.graduationPercentage)}</p>
  )}
</div>
               
                <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700">UG Pass Out Year</label>
  {isEditing ? (
    <input
      type="number"
      value={newEnquiry.graduationPassOutYear}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 4 && value >= 1900 && value <= new Date().getFullYear()) {
          setNewEnquiry({ ...newEnquiry, graduationPassOutYear: value });
        }
      }}
      placeholder="Enter UG pass out year (YYYY)"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      min="1900"
      max={new Date().getFullYear()}
    />
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.graduationPassOutYear)}</p>
  )}
</div>
           
              </div>
            

                {/* PG Fields (Right Side) */}
                <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Education Break</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.educationBreak || ""}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, educationBreak: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select education break</option>
                      <option value="No Break">No Break</option>
                      <option value="0 to 1 Years">0 to 1 Years</option>
                      <option value="1 - 3 Years">1 - 3 Years</option>
                      <option value="3 - 5 Years">3 - 5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.educationBreak)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">PG Degree</label>
                  {isEditing ? (
                    <select
                      value={newEnquiry.postGraduationDegree}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationDegree: e.target.value })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select PG degree</option>
                      <option value="MSc">MSc</option>
                      <option value="MBA">MBA</option>
                      <option value="MTech">MTech</option>
                      <option value="MCA">MCA</option>
                      <option value="MA">MA</option>
                      <option value="MPhil">MPhil</option>
                      <option value="MDes">MDes</option>
                      <option value="LLM">LLM</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationDegree)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">PG College</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.postGraduationCollegeName}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationCollegeName: e.target.value })}
                      placeholder="Enter PG college"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationCollegeName)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">PG Branch</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newEnquiry.postGraduationBranch}
                      onChange={(e) => setNewEnquiry({ ...newEnquiry, postGraduationBranch: e.target.value })}
                      placeholder="Enter PG branch"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationBranch)}</p>
                  )}
                </div>
                <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700">PG Percentage</label>
  {isEditing ? (
    <input
      type="number"
      value={newEnquiry.postGraduationPercentage}
      onChange={(e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
          setNewEnquiry({ ...newEnquiry, postGraduationPercentage: value });
        }
      }}
      placeholder="Enter PG percentage (0-100)"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      min="0"
      max="100"
      step="0.01"
    />
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationPercentage)}</p>
  )}
</div>
                
                <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700">PG Pass Out Year</label>
  {isEditing ? (
    <input
      type="number"
      value={newEnquiry.postGraduationPassOutYear}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 4 && value >= 1900 && value <= new Date().getFullYear()) {
          setNewEnquiry({ ...newEnquiry, postGraduationPassOutYear: value });
        }
      }}
      placeholder="Enter PG pass out year (YYYY)"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      min="1900"
      max={new Date().getFullYear()}
    />
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.postGraduationPassOutYear)}</p>
  )}
</div>
               
              </div>
            
              </div>

              <h3 className="text-base sm:text-lg font-medium mb-2 mt-6">Professional Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Professional Fields (Left Side) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Current Job Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={newEnquiry.currentJobTitle}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, currentJobTitle: e.target.value })}
                        placeholder="Enter current job title"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.currentJobTitle)}</p>
                    )}
                  </div>
                  <div>
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

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Working Domain</label>
                    {isEditing ? (
                      <select
                        value={newEnquiry.workingDomain || ""}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, workingDomain: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="" disabled>Select working domain</option>
                        <option value="Banking and Finance">Banking and Finance</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Information Technology (IT) & Services">Information Technology (IT) & Services</option>
                        <option value="Healthcare & Pharmaceuticals">Healthcare & Pharmaceuticals</option>
                        <option value="Education & EdTech">Education & EdTech</option>
                        <option value="Retail & E-commerce">Retail & E-commerce</option>
                        <option value="Telecommunications">Telecommunications</option>
                        <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Real Estate & Construction">Real Estate & Construction</option>
                        <option value="Media & Entertainment">Media & Entertainment</option>
                        <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                        <option value="Energy & Utilities">Energy & Utilities</option>
                        <option value="FMCG (Fast-Moving Consumer Goods)">FMCG (Fast-Moving Consumer Goods)</option>
                        <option value="Agriculture & Agritech">Agriculture & Agritech</option>
                        <option value="Legal & Professional Services">Legal & Professional Services</option>
                        <option value="Aerospace & Defense">Aerospace & Defense</option>
                        <option value="Government & Public Sector">Government & Public Sector</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Non-Profit & NGOs">Non-Profit & NGOs</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.workingDomain)}</p>
                    )}
                  </div>
                </div>

                {/* Professional Fields (Right Side) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Experience in Years</label>
                    {isEditing ? (
                      <select
                        value={newEnquiry.experienceInYears}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, experienceInYears: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="0 to 1 Years">0 to 1 Years</option>
                        <option value="1 - 3 Years">1 - 3 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5 - 10 Years">5 - 10 Years</option>
                        <option value="10 - 15 Years">10 - 15 Years</option>
                        <option value="15+ Years">15+ Years</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.experienceInYears)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Current Salary</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={newEnquiry.currentSalary}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, currentSalary: e.target.value })}
                        placeholder="Enter current salary"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.currentSalary)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Work Break</label>
                    {isEditing ? (
                      <select
                        value={newEnquiry.workBreak || ""}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, workBreak: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select work break</option>
                        <option value="No Break">No Break</option>
                        <option value="0 to 1 Years">0 to 1 Years</option>
                        <option value="1 - 3 Years">1 - 3 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.workBreak)}</p>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-medium mb-2 mt-6">Guardian Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Guardian Fields (Left Side) */}
                <div className="space-y-4">
                  <div>
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
                  <div>
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
                </div>

                {/* Guardian Fields (Right Side) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Guardian Relation</label>
                    {isEditing ? (
                      <select
                        value={newEnquiry.guardianRelation}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, guardianRelation: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select relation</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.guardianRelation)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentSection === 3 && (
  <div>
    <h3 className="text-base sm:text-lg font-medium mb-2">Enquiry Details</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-3 sm:space-y-4">
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
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Referred By</label>
          {isEditing ? (
            <input
              type="text"
              value={newEnquiry.referredBy}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, referredBy: e.target.value })}
              placeholder="Enter referrer name"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          ) : (
            <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.referredBy)}</p>
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
      </div>
      <div className="space-y-3 sm:space-y-4">
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
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Learning Objective</label>
          {isEditing ? (
            <select
              value={newEnquiry.learningObjective}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, learningObjective: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select objective</option>
              <option value="none">None</option>
              <option value="job transition">Job Transition</option>
              <option value="career start">Career Start</option>
              <option value="ongoing job-upskill">Ongoing Job - Upskill</option>
              <option value="further education-upskill">Further Education - Upskill</option>
              <option value="pursuing degree-upskill">Pursuing Degree - Upskill</option>
            </select>
          ) : (
            <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.learningObjective)}</p>
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
        
      </div>
    </div>
    {newEnquiry.stage === "closed-lost" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
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
      </div>
    )}
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
          {/* {currentSection === 3 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Enquiry Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
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
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Referred By</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={newEnquiry.referredBy}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, referredBy: e.target.value })}
                        placeholder="Enter referrer name"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.referredBy)}</p>
                    )}
                  </div>

                  <div className="mb-3 sm:mb-4">
  <label className="block text-xs sm:text-sm font-medium text-gray-700">Assign To</label>
  {isEditing ? (
    <select
      value={newEnquiry.assignTo}
      onChange={(e) => setNewEnquiry({ ...newEnquiry, assignTo: e.target.value, owner: e.target.value || newEnquiry.owner })}
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
    >
      <option value="">Select counselor</option>
      {isLoadingCounselors ? (
        <option value="" disabled>Loading counselors...</option>
      ) : salesRoleIds.length > 0 && Users && Array.isArray(Users) && Users.length > 0 ? (
        Users
          .filter((user) => salesRoleIds.includes(user.role))
          .map((user) => (
            <option key={user.id} value={user.displayName}>
              {user.displayName || 'Unknown User'}
            </option>
          ))
      ) : (
        <option value="" disabled>No counselors available</option>
      )}
    </select>
  ) : (
    <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.assignTo)}</p>
  )}
</div>
                 
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Learning Objective</label>
                    {isEditing ? (
                      <select
                        value={newEnquiry.learningObjective}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, learningObjective: e.target.value })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select objective</option>
                        <option value="none">None</option>
                        <option value="job transition">Job Transition</option>
                        <option value="career start">Career Start</option>
                        <option value="ongoing job-upskill">Ongoing Job - Upskill</option>
                        <option value="further education-upskill">Further Education - Upskill</option>
                        <option value="pursuing degree-upskill">Pursuing Degree - Upskill</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(newEnquiry.learningObjective)}</p>
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
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
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
          )} */}
          {currentSection === 4 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
              {(!isNotesMode || (isNotesMode && selectedEnquiry)) && (
                <>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Note Type</label>
                    <select
                      value={noteType || "general-enquiry"}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="general-enquiry">General Enquiry</option>
                      <option value="call-log">Call Log</option>
                      <option value="call-schedule">Call Schedule</option>
                      <option value="office-visit">Office Visit</option>
                    </select>
                  </div>
                  {noteType === "call-log" && (
                    <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Date</label>
                        <input
                          type="date"
                          value={callLogDate}
                          onChange={(e) => setCallLogDate(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Duration (minutes)</label>
                        <input
                          type="number"
                          value={callDuration}
                          onChange={(e) => setCallDuration(e.target.value)}
                          placeholder="Enter call duration"
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Type</label>
                        <select
                          value={callType}
                          onChange={(e) => setCallType(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="incoming">Incoming</option>
                          <option value="outgoing">Outgoing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Time</label>
                        <input
                          type="time"
                          value={callTime}
                          onChange={(e) => setCallTime(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {noteType === "call-schedule" && (
                    <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Date</label>
                        <input
                          type="date"
                          value={callDate}
                          onChange={(e) => setCallDate(e.target.value)}
                          min={getTodayDate()} // Prevent past dates
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Time</label>
                        <input
                          type="time"
                          value={callScheduledTime}
                          onChange={(e) => setCallScheduledTime(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  )}


                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Note</label>
                    <textarea
                      value={newNote || ""}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add your note here..."
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows="4"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mb-3 sm:mb-4">
                    <button
                      onClick={() => {
                        setNewNote("");
                        setNoteType("general-enquiry");
                        setCallDuration("");
                        setCallType("incoming");
                        setCallTime("");
                        setCallDate(getTodayDate()); // Reset to today
                        setCallLogDate(getTodayDate()); // Reset to today
                        setCallScheduledTime("");
                      }}
                      className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Clear
                    </button>

                    <button
                      onClick={handleAddNote}
                      disabled={!canUpdate || !newNote?.trim()}
                      className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      Add Note
                    </button>
                  </div>
                </>
              )}
              <div>
                {newEnquiry.notes && newEnquiry.notes.length > 0 ? (
                  Object.entries(
                    newEnquiry.notes.reduce((acc, note) => {
                      const noteDate = formatDateSafely(note.createdAt, "yyyy-MM-dd");
                      if (!acc[noteDate]) {
                        acc[noteDate] = [];
                      }
                      acc[noteDate].push(note);
                      return acc;
                    }, {})
                  )
                    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                    .map(([date, notes]) => (
                      <div key={date} className="mb-6">
                        <div className="sticky top-0 bg-white py-2 z-10">
                          <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                            {formatDateSafely(date, "MMMM d, yyyy")}
                          </h4>
                        </div>
                        <div className="space-y-3 sm:space-y-4 mt-2">
                          {notes
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((note, index) => (
                              <div key={index} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                                    {formatNoteType(note.type)}
                                    <span className="text-xs text-gray-500 ml-2">
                                      {formatDateSafely(note.createdAt, "h:mm a")}
                                    </span>
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
  by {getUserDisplayName(note.addedBy)}
</p>
                                  {/* <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                                    by {note.addedBy}
                                  </p> */}
                                </div>
                                {note.type === "call-log" && (
                                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                                    <p>Date: {note.callLogDate || "Not specified"}</p>
                                    <p>Duration: {note.callDuration || "Not specified"} minutes</p>
                                    <p>Type: {note.callType || "Not specified"}</p>
                                    <p>Time: {note.callTime || "Not specified"}</p>
                                  </div>
                                )}
                                {note.type === "call-schedule" && (
                                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                                    <p>Date: {note.callDate || "Not specified"}</p>
                                    <p>Time: {note.callScheduledTime || "Not specified"}</p>
                                  </div>
                                )}
                                {note.type === "office-visit" && note.audioUrl && (
  <div className="mt-2">
    {audioStatus[index] === "loading" ? (
      <p className="text-xs sm:text-sm text-gray-500">Loading audio...</p>
    ) : audioError[index] || audioStatus[index] === "invalid" ? (
      <div>
        <p className="text-xs sm:text-sm text-red-600">{audioError[index]}</p>
        <a
          href={note.audioUrl}
          download={`recording-${editingEnquiryId || "new"}-${index}.webm`}
          className="text-xs sm:text-sm text-blue-600 hover:underline"
        >
          Download Audio
        </a>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <audio
          controls
          src={note.audioUrl}
          onError={(e) => handleAudioError(index, e)}
          className="w-full max-w-md"
          ref={(el) => {
            if (el) {
              el.playbackRate = playbackSpeeds[index] || 1;
            }
          }}
        >
          Your browser does not support the audio element.
        </audio>
        <div className="flex items-center gap-2">
          <label className="text-xs sm:text-sm text-gray-700">Playback Speed:</label>
          <select
            value={playbackSpeeds[index] || 1}
            onChange={(e) => {
              const newSpeed = parseFloat(e.target.value);
              setPlaybackSpeeds((prev) => ({ ...prev, [index]: newSpeed }));
              const audioElement = document.querySelector(`audio[src="${note.audioUrl}"]`);
              if (audioElement) {
                audioElement.playbackRate = newSpeed;
              }
            }}
            className="p-1 border border-gray-300 rounded-md text-xs sm:text-sm"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          <a
            href={note.audioUrl}
            download={`recording-${editingEnquiryId || "new"}-${index}.webm`}
            className="text-xs sm:text-sm text-blue-600 hover:underline"
          >
            Download
          </a>
          {canUpdate && audioStatus[index] === "valid" && (
            <button
              onClick={() => deleteRecording(note, index)}
              className="text-xs sm:text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    )}
  </div>
)}
                                {/* {note.type === "office-visit" && note.audioUrl && (
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
                                )} */}
                                <p className="text-xs sm:text-sm text-gray-900 mt-1">{note.content}</p>
                              </div>
                            ))}
                        </div>
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
  {entry.action} by {getUserDisplayName(entry.performedBy)} on {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
</p>
                      {/* <p className="text-sm text-gray-900">
                        {entry.action} by {entry.performedBy} on {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
                      </p> */}
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
      {showReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Call Reminder</h3>
            <p className="mb-4">You have a scheduled call with <strong>{reminderDetails.name}</strong>:</p>
            <p className="mb-4">Date: {reminderDetails.date ? format(new Date(reminderDetails.date), "MMM d, yyyy") : "Not specified"}</p>
            <p className="mb-4">Time: {reminderDetails.time || "Not specified"}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReminder(false);
                  setTimeout(() => {
                    setShowReminder(true);
                    const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
                    audio.play().catch((error) => console.error("Error playing buzzer:", error));
                  }, 2 * 60 * 1000); // Snooze for 2 minutes
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                Snooze
              </button>
              <button
                onClick={() => setShowReminder(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EnquiryModal;