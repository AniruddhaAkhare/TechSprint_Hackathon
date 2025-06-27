import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { db } from "../../../../config/firebase.js";
import { getDocs, collection, query, orderBy, addDoc, updateDoc, doc, arrayUnion, serverTimestamp } from "firebase/firestore";
import Notes from "../Notes.jsx";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { runTransaction } from "firebase/firestore";
import { useCallback } from "react";

const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, callSchedules, handleDeleteSchedule }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const canUpdate = rolePermissions?.Companies?.update || false;
  const canDisplay = rolePermissions?.Companies?.display || false;

  useEffect(() => {
    if (!company?.id || !canDisplay) return;
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, "Companies", company.id, "notes"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        //console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes.");
      }
    };
    fetchNotes();
  }, [company?.id, canDisplay]);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchUserDisplayName = async () => {
      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDisplayName(userData.displayName || user.email || "Unknown User");
        } else {
          setUserDisplayName(user.email || "Unknown User");
        }
      } catch (error) {
        //console.error("Error fetching user displayName:", error);
        toast.error("Failed to fetch user data.");
        setUserDisplayName(user.email || "Unknown User");
      }
    };
    fetchUserDisplayName();
  }, [user?.uid, user?.email]);

  const logActivity = async (action, details) => {
    if (!user?.email) return;
  
    const activityLogRef = doc(db, "activityLogs", "logDocument");
  
    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Company",
      // adminId: adminId || "N/A",
    };
  
    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];
  
        // Ensure logs is an array and contains only valid data
        if (!Array.isArray(logs)) {
          logs = [];
        }
  
        // Append the new log entry
        logs.push(logEntry);
  
        // Trim to the last 1000 entries if necessary
        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }
  
        // Update the document with the new logs array
        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully");
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
    }
  };
    
    // const fetchLogs = useCallback(() => {
    //   if (!isAdmin) return;
    //   const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
    //   const unsubscribe = onSnapshot(
    //     q,
    //     (snapshot) => {
    //       const allLogs = [];
    //       snapshot.docs.forEach((doc) => {
    //         const data = doc.data();
    //         (data.logs || []).forEach((log) => {
    //           allLogs.push({ id: doc.id, ...log });
    //         });
    //       });
    //       allLogs.sort(
    //         (a, b) =>
    //           (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
    //       );
    //       setLogs(allLogs);
    //     },
    //   );
    //   return unsubscribe;
    // }, [isAdmin]);

  const formatDateSafely = (date, format) => {
    try {
      return new Date(date).toLocaleString("en-US", {
        year: format.includes("yyyy") ? "numeric" : undefined,
        month: format.includes("MMMM") ? "long" : "numeric",
        day: format.includes("d") ? "numeric" : undefined,
        hour: format.includes("h") ? "numeric" : undefined,
        minute: format.includes("mm") ? "2-digit" : undefined,
        hour12: format.includes("a"),
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatNoteType = (type) => {
    const noteTypes = {
      general: "General Note",
      meeting: "Meeting Note",
      call: "Call Note",
      "call-schedule": "Call Schedule",
    };
    return noteTypes[type] || "Unknown";
  };

  const handleAddNote = async (noteData) => {
    if (!company?.id || !canUpdate) return;
    try {
      const noteToSave = {
        noteType: noteData.noteType || "general",
        content: noteData.content || "", // Use content from noteData
        createdAt: serverTimestamp(),
        createdBy: userDisplayName,
        ...(noteData.noteType === "call-schedule" && {
          callDate: noteData.callDate,
          callTime: noteData.callTime,
          reminderTime: noteData.reminderTime,
          status: "scheduled",
        }),
      };
      const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteToSave);
      
      const historyEntry = {
        action: `Added ${noteData.noteType} Note`,
        performedBy: userDisplayName,
        timestamp: new Date().toISOString(),
        details: noteData.noteType === "call-schedule" 
          ? `Scheduled call for ${noteData.callDate} ${noteData.callTime}: ${noteData.content}`
          : `Note: ${noteData.content}`,
      };
      await updateDoc(doc(db, "Companies", company.id), {
        history: arrayUnion(historyEntry),
        updatedAt: serverTimestamp(),
      });

      setNotes([{ id: noteRef.id, ...noteToSave }, ...notes]);
      toast.success("Note added successfully!");
      logActivity("Note Added", { companyId: company.id, noteType: noteData.noteType });

      // Schedule reminder for call-schedule
      if (noteData.noteType === "call-schedule") {
        const callDateTime = new Date(`${noteData.callDate}T${noteData.callTime}`);
        const reminderDateTime = new Date(callDateTime.getTime() - parseInt(noteData.reminderTime) * 60000);
        const timeout = reminderDateTime.getTime() - Date.now();
        if (timeout > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Call Reminder", {
                body: `Call scheduled with ${company.name} at ${noteData.callTime}: ${noteData.content}`,
                icon: "/path/to/icon.png",
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification("Call Reminder", {
                    body: `Call scheduled with ${company.name} at ${noteData.callTime}: ${noteData.content}`,
                    icon: "/path/to/icon.png",
                  });
                }
              });
            }
            const reminderAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
            reminderAudio.play().catch((error) => {
              //console.error("Error playing reminder audio:", error);
              toast.error("Failed to play reminder sound.");
            });
            toast.info(`Call Reminder: ${company.name} at ${noteData.callTime}`);
            // logActivity("TRIGGER_CALL_REMINDER", { companyId: company.id, callDate: noteData.callDate, callTime: noteData.callTime });
          }, timeout);
        }
      }
    } catch (error) {
      //console.error("Error adding note:", error);
      toast.error(`Failed to add note: ${error.message}`);
    }
  };

  if (!company || !canDisplay) return null;

  return (
    <Dialog open={isOpen} handler={onRequestClose} className="rounded-lg shadow-lg max-w-4xl">
      <DialogHeader className="text-gray-800 font-semibold">{company.name}</DialogHeader>
      <DialogBody className="text-gray-600 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Domain:</strong> {company.domain || "N/A"}</p>
            <p><strong>Phone:</strong> {company.phone || "N/A"}</p>
            <p><strong>Email:</strong> {company.email || "N/A"}</p>
            <p><strong>City:</strong> {company.city || "N/A"}</p>
          </div>
          <div>
            <p><strong>URL:</strong> {company.url || "N/A"}</p>
            <p><strong>Hiring Period:</strong> {company.fromDate || "N/A"} to {company.toDate || "N/A"}</p>
            <p><strong>Company Type:</strong> {company.companyType || "N/A"}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Call Schedules</h3>
          {callSchedules.length > 0 ? (
            callSchedules.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-md p-4 mb-2 bg-blue-50">
                <p><strong>Purpose:</strong> {schedule.content}</p>
                <p><strong>Call Time:</strong> {schedule.callDate} {schedule.callTime}</p>
                <p><strong>Reminder:</strong> {schedule.reminderTime} minutes before</p>
                <p><strong>Status:</strong> {schedule.status}</p>
                {canUpdate && (
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-800 mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No call schedules available.</p>
          )}
        </div>

        <Notes
          companyData={{ ...company, notes }}
          newNote={newNote}
          setNewNote={setNewNote}
          noteType={noteType}
          setNoteType={setNoteType}
          isEditing={isEditing}
          handleAddNote={handleAddNote}
          formatDateSafely={formatDateSafely}
          formatNoteType={formatNoteType}
          canUpdate={canUpdate}
          toast={toast}
        />
      </DialogBody>
      <DialogFooter className="space-x-4">
        <Button variant="text" color="gray" onClick={onRequestClose}>
          Close
        </Button>
        {canUpdate && (
          <Button
            variant="filled"
            color="blue"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Done" : "Edit Notes"}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default CompanyModal;