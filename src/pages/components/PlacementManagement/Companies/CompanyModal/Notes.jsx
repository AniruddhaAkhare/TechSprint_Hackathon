

import React, { useState } from "react";
import { db } from '../../../../../config/firebase.js';
import { addDoc, collection, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { format } from "date-fns";

const Notes = ({
  companyData,
  newNote,
  setNewNote,
  setNoteType,
  noteType,
  isEditing,
  handleAddNote,
  formatDateSafely,
  formatNoteType,
  canUpdate,
  userDisplayName,
}) => {
  const [callTime, setCallTime] = useState(''); // Changed from callScheduledTime to setCallTime
  const [reminderTime, setReminderTime] = useState('15');
  const reminderAudio = new Audio('https://www.soundjay.com/buttons/beep-01.mp3');

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

    const [callDate, setCallDate] = useState(getTodayDate()); // Initialize with today's date


  const handleAddNoteWithSchedule = async () => {
    if (!canUpdate) {
      toast.error('You do not have permission to add notes.');
      return;
    }

    if (!newNote?.trim()) {
      toast.error('Note content is required.');
      return;
    }

    if (noteType === 'call-schedule' && (!callDate || !callTime)) {
      toast.error('Please provide both call date and time for Call Schedule.');
      return;
    }

    if (noteType === 'call-schedule') {
      const selectedDateTime = new Date(`${callDate}T${callTime}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selectedDateTime().getTime())) {
        toast.error('Invalid call date or time.');
        return;
      }
      if (selectedDateTime() < today) {
        toast.error('Cannot schedule a call in the past.');
        return;
      }
    }

    try {
      const companyRef = doc(db, 'Companies', companyData.id);
      const noteData = {
        noteType: noteType,
        content: newNote,
        createdAt: serverTimestamp(),
        createdBy: userDisplayName || 'Unknown User',
      };

      if (noteType === 'call-schedule') {
        noteData.callDate = callDate;
        noteData.callTime = callTime; // Standardized to callScheduledTime
        noteData.reminderTime = reminderTime;
        noteData.status = 'scheduled';
      }

      const noteRef = await addDoc(collection(db, 'Companies', companyData.id, 'notes'), noteData);

      const historyEntry = {
        action: noteType === 'call-schedule' ? 'Added Call Schedule' : 'Added Note',
        performedBy: userDisplayName || 'Unknown User',
        timestamp: new Date().toISOString(),
        details: noteType === 'call-schedule'
          ? `Scheduled call for ${callDate} ${callTime}: ${newNote}`
          : `Added ${noteType} note: ${newNote}`,
      };

      await updateDoc(companyRef, {
        history: arrayUnion(historyEntry),
        updatedAt: serverTimestamp(),
      });

      // Update UI
      handleAddNote({ id: noteRef.id, ...noteData });

      // Schedule notification
      if (noteType === 'call-schedule') {
        const callDateTime = new Date(`${callDate}T${callTime}`);
        const reminderDateTime = new Date(callDateTime.getTime() - parseInt(reminderTime) * 60000);
        const timeout = reminderDateTime.getTime() - Date.now();
        if (timeout > 0) {
          setTimeout(async () => {
            try {
              const hasPermission = Notification.permission === 'granted' || (await Notification.requestPermission()) === 'granted';
              if (hasPermission) {
                new Notification('Call Reminder', {
                  body: `Call scheduled with ${companyData.name} at ${callTime}: ${newNote}`,
                  icon: '/path/to/icon.png',
                });
              } else {
                toast.warn('Notification permission not granted for call reminder.');
              }
              await reminderAudio.play();
              logActivity('Call remainder triggered', {
                companyId: companyData.id,
                callDate,
                callTime,
                purpose: newNote,
              });
              // Update status
              await updateDoc(doc(db, 'Companies', companyData.id, 'notes', noteRef.id), {
                status: 'notified',
                updatedAt: serverTimestamp(),
              });
            } catch (error) {
              console.error('Error in notification callback:', error);
              toast.error(`Failed to trigger reminder: ${error.message}`);
            }
          }, timeout);
        } else {
          console.warn('Reminder time is in the past or invalid, skipping notification.');
        }
      }

      setNewNote('');
      setNoteType('general');
      setCallDate(getTodayDate());
      setCallTime('');
      setReminderTime('15');
      toast.success('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(`Failed to add note: ${error.message}`);
    }
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
      {isEditing && (
        <>
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Note Type</label>
            <select
              value={noteType}
              onChange={(e) => {
                setNoteType(e.target.value);
                if (e.target.value !== 'call-schedule') {
                  setCallDate(getTodayDate());
                  setCallTime('');
                  setReminderTime('15');
                } else {
                  setCallDate(getTodayDate());
                }
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="general">General Note</option>
              <option value="meeting">Meeting Note</option>
              <option value="call">Call Note</option>
              <option value="call-schedule">Call Schedule</option>
            </select>
          </div>
          {noteType === 'call-schedule' && (
            <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Date</label>
                <input
                  type="date"
                  value={callDate}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                      toast.error('Cannot schedule a call in the past.');
                      return;
                    }
                    setCallDate(e.target.value);
                  }}
                  min={getTodayDate()}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
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
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Reminder (minutes before)</label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>
          )}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add your note here..."
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows="4"
            />
          </div>
          <div className="flex justify-end gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => {
                setNewNote('');
                setNoteType('general');
                setCallDate(getTodayDate());
                setCallTime('');
                setReminderTime('15');
              }}
              className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
            >
              Clear
            </button>
            <button
              onClick={handleAddNoteWithSchedule}
              disabled={
                !canUpdate ||
                !newNote?.trim() ||
                (noteType === 'call-schedule' && (!callDate || !callTime))
              }
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm ${
                !canUpdate ||
                !newNote?.trim() ||
                (noteType === 'call-schedule' && (!callDate || !callTime))
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Save Note
            </button>
          </div>
        </>
      )}
      <div>
        {companyData.notes && companyData.notes.length > 0 ? (
          Object.entries(
            companyData.notes.reduce((acc, note) => {
              const noteDate = formatDateSafely(note.createdAt, 'yyyy-MM-dd');
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
                    {formatDateSafely(date, 'MMMM d, yyyy')}
                  </h4>
                </div>
                <div className="space-y-3 sm:space-y-4 mt-2">
                  {notes
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((note, index) => (
                      <div key={note.id || index} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">
                            {formatNoteType(note.noteType)}
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDateSafely(note.createdAt, 'h:mm a')}
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                            by {note.createdBy || 'Unknown'}
                          </p>
                        </div>
                        {note.noteType === 'call-schedule' && (
                          <div className="text-xs sm:text-sm text-gray-600 mb-2">
                            <p>Date: {note.callDate || 'Not specified'}</p>
                            <p>Time: {note.callTime || 'Not specified'}</p>
                          </div>
                        )}
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
  );
};

export default Notes;