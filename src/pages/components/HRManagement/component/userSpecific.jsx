import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Users, Clock, Check, Pencil } from 'lucide-react';
import { collection, getDocs, query, orderBy, addDoc, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from "../../../../config/firebase";

const ModernScheduleInterface = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftAssignments, setShiftAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const shiftAssignmentsRef = collection(db, 'ShiftAssignments');
  const shiftsCollectionRef = collection(db, 'Shifts');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const q = query(shiftsCollectionRef, orderBy("shiftName", "asc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            shiftName: data.shiftName ? data.shiftName.charAt(0).toUpperCase() + data.shiftName.slice(1).toLowerCase() : "Unknown",
            fromAmPm: data.fromAmPm || 'AM',
            toAmPm: data.toAmPm || 'AM'
          };
        });
        setShifts(list);
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'Users');
        const snapshot = await getDocs(usersCollectionRef);
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchShifts();
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchShiftAssignments = async () => {
      if (!selectedEmployee) {
        setShiftAssignments([]);
        return;
      }

      try {
        const q = query(shiftAssignmentsRef, where('userID', '==', selectedEmployee));
        const snapshot = await getDocs(q);
        const assignments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fromDate: doc.data().fromDate.slice(0, 10),
          toDate: doc.data().toDate.slice(0, 10)
        }));
        setShiftAssignments(assignments);
      } catch (err) {
        console.error('Error fetching shift assignments:', err);
        setShiftAssignments([]);
      }
    };

    fetchShiftAssignments();
  }, [selectedEmployee]);

  useEffect(() => {
    if (shiftAssignments.length > 0 && (!fromDate || !toDate)) {
      const today = new Date().toISOString().slice(0, 10);
      const validAssignments = shiftAssignments.filter(assignment => assignment.toDate >= today);
      if (validAssignments.length > 0) {
        const earliestDate = validAssignments.reduce((min, assignment) => {
          const date = new Date(assignment.fromDate);
          return date < min ? date : min;
        }, new Date(validAssignments[0].fromDate));
        const latestDate = validAssignments.reduce((max, assignment) => {
          const date = new Date(assignment.toDate);
          return date > max ? date : max;
        }, new Date(validAssignments[0].toDate));
        setFromDate(earliestDate.toISOString().slice(0, 10));
        setToDate(latestDate.toISOString().slice(0, 10));
      }
    }
  }, [shiftAssignments, fromDate, toDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes('chintu sarate')) {
      const chintu = users.find(user => 
        (user.displayName && user.displayName.toLowerCase() === 'chintu sarate') ||
        (user.email && user.email.toLowerCase() === 'chintusorate@gmail.com')
      );
      if (chintu) {
        setSelectedEmployee(chintu.id);
        setFromDate(new Date().toISOString().slice(0, 10)); // Set to today
        setToDate('2025-06-02');
      } else {
        const mockChintu = {
          id: 'mock-chintu-id',
          displayName: 'Chintu Sarate',
          email: 'chintusorate@gmail.com'
        };
        setUsers(prev => [...prev, mockChintu]);
        setSelectedEmployee(mockChintu.id);
        setFromDate(new Date().toISOString().slice(0, 10)); // Set to today
        setToDate('2025-06-02');
      }
    }
  };

  const findOverlappingAssignment = async (userID, fromDate, toDate) => {
    try {
      const q = query(shiftAssignmentsRef, where('userID', '==', userID));
      const snapshot = await getDocs(q);
      const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const overlap = assignments.find(assignment => {
        const existingFrom = new Date(assignment.fromDate);
        const existingTo = new Date(assignment.toDate);
        const newFrom = new Date(fromDate);
        const newTo = new Date(toDate);
        
        return (
          userID === assignment.userID &&
          !(newTo < existingFrom || newFrom > existingTo)
        );
      });
      return overlap;
    } catch (err) {
      console.error('Error finding overlapping assignment:', err);
      return null;
    }
  };

  const handleAssignShift = async () => {
    const today = new Date().toISOString().slice(0, 10);
    if (!fromDate || !toDate || !selectedEmployee || !selectedShift || fromDate < today) {
      alert('Please select valid present or future dates, Employee, and Shift before assigning.');
      return;
    }

    const employee = users.find(u => u.id === selectedEmployee);
    if (!employee) {
      alert('Selected employee not found!');
      return;
    }

    try {
      const existingAssignment = await findOverlappingAssignment(selectedEmployee, fromDate, toDate);

      if (existingAssignment) {
        const assignmentRef = doc(db, 'ShiftAssignments', existingAssignment.id);
        await updateDoc(assignmentRef, {
          fromDate,
          toDate,
          employeeName: employee.displayName || employee.email || "Unknown",
          userID: employee.id,
          shiftName: selectedShift.shiftName,
          shiftID: selectedShift.id,
          assignedAt: new Date().toISOString()
        });

        setShiftAssignments(prev =>
          prev.map(assignment =>
            assignment.id === existingAssignment.id
              ? {
                  ...assignment,
                  fromDate,
                  toDate,
                  employeeName: employee.displayName || employee.email || "Unknown",
                  shiftName: selectedShift.shiftName,
                  shiftID: selectedShift.id
                }
              : assignment
          )
        );
        alert('Shift successfully updated!');
      } else {
        const docRef = await addDoc(shiftAssignmentsRef, {
          fromDate,
          toDate,
          employeeName: employee.displayName || employee.email || "Unknown",
          userID: employee.id,
          shiftName: selectedShift.shiftName,
          shiftID: selectedShift.id,
          assignedAt: new Date().toISOString()
        });

        setShiftAssignments(prev => [
          ...prev,
          {
            id: docRef.id,
            fromDate,
            toDate,
            employeeName: employee.displayName || employee.email || "Unknown",
            userID: employee.id,
            shiftName: selectedShift.shiftName,
            shiftID: selectedShift.id
          }
        ]);
        alert('Shift successfully assigned!');
      }

      setFromDate('');
      setToDate('');
      setSelectedEmployee('');
      setSelectedShift(null);
      setSearchQuery('');
    } catch (err) {
      console.error('Error assigning/updating shift:', err);
      alert('Failed to assign/update shift, please try again.');
    }
  };

  const handleEditShift = (assignment) => {
    const shift = shifts.find(s => s.id === assignment.shiftID) || {
      id: assignment.shiftID,
      shiftName: assignment.shiftName,
      fromTime: '00:00',
      toTime: '00:00',
      fromAmPm: 'AM',
      toAmPm: 'AM'
    };
    setEditingAssignment({
      ...assignment,
      shift,
      id: assignment.id
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateShift = async () => {
    const today = new Date().toISOString().slice(0, 10);
    if (
      !editingAssignment?.fromDate ||
      !editingAssignment?.toDate ||
      !editingAssignment?.shift?.id ||
      !editingAssignment?.shift?.shiftName ||
      editingAssignment.fromDate < today
    ) {
      alert('Please fill in all required fields with valid present or future dates.');
      return;
    }

    try {
      const assignmentRef = doc(db, 'ShiftAssignments', editingAssignment.id);
      const docSnap = await getDoc(assignmentRef);
      if (!docSnap.exists()) {
        throw new Error(`Document with ID ${editingAssignment.id} does not exist`);
      }

      await updateDoc(assignmentRef, {
        fromDate: editingAssignment.fromDate,
        toDate: editingAssignment.toDate,
        shiftName: editingAssignment.shift.shiftName,
        shiftID: editingAssignment.shift.id,
        assignedAt: new Date().toISOString()
      });

      setShiftAssignments(prev =>
        prev.map(assignment =>
          assignment.id === editingAssignment.id
            ? {
                ...assignment,
                fromDate: editingAssignment.fromDate,
                toDate: editingAssignment.toDate,
                shiftName: editingAssignment.shift.shiftName,
                shiftID: editingAssignment.shift.id
              }
            : assignment
        )
      );

      alert('Shift successfully updated!');
      setIsEditModalOpen(false);
      setEditingAssignment(null);
    } catch (err) {
      console.error('Error updating shift:', err.message, err);
      alert(`Failed to update shift: ${err.message}. Please try again.`);
    }
  };

  const getWeekDatesFromRange = () => {
    if (!fromDate || !toDate) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d >= today) {
        dates.push(new Date(d));
      }
    }
    console.log('Generated week dates:', dates.map(d => d.toISOString().slice(0, 10)));
    return dates;
  };

  const weekDates = getWeekDatesFromRange();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const formatTimeSlot = (slot) => {
    const [hours] = slot.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${adjustedHours}:00 ${period}`;
  };

  const navigateWeek = (direction) => {
    if (!fromDate || !toDate) return;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    from.setDate(from.getDate() + 7 * direction);
    to.setDate(to.getDate() + 7 * direction);
    const today = new Date().toISOString().slice(0, 10);
    setFromDate(from.toISOString().slice(0, 10) >= today ? from.toISOString().slice(0, 10) : today);
    setToDate(to.toISOString().slice(0, 10));
  };

  const formatDateRange = () => {
    if (!fromDate || !toDate) return 'Select date range';
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${start.getFullYear()}`;
  };

  const getShiftStyles = (shiftName) => {
    if (!shiftName) return { background: 'bg-gray-200', border: 'border-gray-500' };
    const shiftNameLower = shiftName.toLowerCase();
    if (shiftNameLower.includes('morning')) return { background: 'bg-red-200', border: 'border-red-500' };
    if (shiftNameLower.includes('general')) return { background: 'bg-blue-200', border: 'border-blue-500' };
    if (shiftNameLower.includes('evening')) return { background: 'bg-green-200', border: 'border-green-500' };
    if (shiftNameLower.includes('third')) return { background: 'bg-gray-200', border: 'border-gray-500' };
    return { background: 'bg-gray-200', border: 'border-gray-500' };
  };

  const getShiftStyle = (fromTime, toTime, fromAmPm, toAmPm, shiftsForDate, shiftIndex) => {
    const parseTime = (time, period) => {
      if (!time || !period) return 0;
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      if (hours > 12) {
        return hours + (minutes / 60);
      }
      let adjustedHours = hours;
      if (period === 'PM' && hours !== 12) {
        adjustedHours += 12;
      } else if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }
      return adjustedHours + (minutes / 60);
    };

    const startHour = parseTime(fromTime, fromAmPm);
    let endHour = parseTime(toTime, toAmPm);

    if (startHour < 0 || startHour > 24 || endHour < 0 || endHour > 24) {
      console.warn(`Invalid time for shift: ${shiftsForDate[shiftIndex].shiftName}, Start: ${fromTime} ${fromAmPm}, End: ${toTime} ${toAmPm}`);
      endHour = Math.min(endHour, 24);
    }

    let adjustedEndHour = endHour;
    if (endHour < startHour) {
      adjustedEndHour += 24;
    }

    const timelineStart = 0;
    const timelineEnd = 24;
    const clampedStartHour = Math.max(timelineStart, Math.min(startHour, timelineEnd));
    const clampedEndHour = Math.max(timelineStart, Math.min(adjustedEndHour, timelineEnd));

    const start = ((clampedStartHour - timelineStart) / (timelineEnd - timelineStart)) * 100;
    const width = ((clampedEndHour - clampedStartHour) / (timelineEnd - timelineStart)) * 100;

    let hasOverlap = false;
    for (let i = 0; i < shiftIndex; i++) {
      const otherShift = shiftsForDate[i];
      const otherStartHour = parseTime(otherShift.fromTime, otherShift.fromAmPm);
      let otherEndHour = parseTime(otherShift.toTime, otherShift.toAmPm);
      if (otherEndHour < otherStartHour) {
        otherEndHour += 24;
      }
      if (!(adjustedEndHour <= otherStartHour || startHour >= otherEndHour)) {
        hasOverlap = true;
        break;
      }
    }

    const durationHours = adjustedEndHour - startHour;
    const minWidth = Math.max(120, durationHours * 20);

    return {
      left: `${Math.max(0, start)}%`,
      width: `${Math.max(0, width)}%`,
      minWidth: `${minWidth}px`,
      hasOverlap
    };
  };

  const formatTime = (time, period) => {
    if (!time || !period) return 'N/A';
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 'Invalid Time';
    if (hours > 12) {
      const adjustedHours = hours % 12 || 12;
      const newPeriod = hours >= 12 ? 'PM' : 'AM';
      return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${newPeriod}`;
    }
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getShiftsForDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const filteredShifts = shiftAssignments
      .filter(assignment => {
        const fromDateStr = assignment.fromDate.slice(0, 10);
        const toDateStr = assignment.toDate.slice(0, 10);
        return dateStr >= fromDateStr && dateStr <= toDateStr;
      })
      .map(assignment => {
        const shift = shifts.find(s => s.id === assignment.shiftID) || {
          shiftName: assignment.shiftName ?
            assignment.shiftName.charAt(0).toUpperCase() + assignment.shiftName.slice(1).toLowerCase() :
            "Unknown",
          fromTime: '00:00',
          toTime: '00:00',
          fromAmPm: 'AM',
          toAmPm: 'AM'
        };
        return {
          ...assignment,
          shiftName: shift.shiftName,
          fromTime: shift.fromTime,
          toTime: shift.toTime,
          fromAmPm: shift.fromAmPm,
          toAmPm: shift.toAmPm
        };
      });

    filteredShifts.sort((a, b) => {
      const parseTime = (time, period) => {
        if (!time || !period) return 0;
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return 0;
        if (hours > 12) {
          return hours + (minutes / 60);
        }
        let adjustedHours = hours;
        if (period === 'PM' && hours !== 12) {
          adjustedHours += 12;
        } else if (period === 'AM' && hours === 12) {
          adjustedHours = 0;
        }
        return adjustedHours + (minutes / 60);
      };
      const startA = parseTime(a.fromTime, a.fromAmPm);
      const startB = parseTime(b.fromTime, b.fromAmPm);
      return startA - startB;
    });

    return filteredShifts;
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                Schedule Manager
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigateWeek(-1)}
                disabled={!fromDate || !toDate}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                <input
                  type="date"
                  value={fromDate}
                  min={new Date().toISOString().slice(0, 10)} // Restrict to today or future
                  max={toDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-0 bg-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-500 text-sm">to</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-0 bg-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigateWeek(1)}
                disabled={!fromDate || !toDate}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Shift Assign</span>
              </button>
              {isShiftDropdownOpen && (
                <div className="absolute z-50 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl right-0 overflow-hidden">
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {shifts.length > 0 ? (
                      shifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                          onClick={() => {
                            setSelectedShift(shift);
                            setIsShiftDropdownOpen(false);
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{shift.shiftName}</div>
                            <div className="text-xs text-gray-500">
                              {formatTime(shift.fromTime, shift.fromAmPm)} - {formatTime(shift.toTime, shift.toAmPm)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">No shifts available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-end space-x-4 max-w-6xl">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                Select Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white flex items-center"
              >
                <option value="">Choose an employee...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName || user.email || "Unknown User"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Employee
              </label>
              <div className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm flex items-center">
                {selectedEmployee ? (
                  (() => {
                    const selectedUser = users.find(user => user.id === selectedEmployee);
                    if (!selectedUser) {
                      return <span className="text-gray-400">No employee selected</span>;
                    }
                    return (
                      <>
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          {(selectedUser.displayName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{selectedUser.displayName || "Unknown User"}</div>
                          <div className="text-xs text-gray-500">{selectedUser.email || "No email available"}</div>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <span className="text-gray-400">No employee selected</span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <Clock className="w-4 h-4 mr-2 text-gray-500 inline" />
                Shift Name
              </label>
              <div
                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm flex items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
              >
                {selectedShift ? (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{selectedShift.shiftName}</div>
                      <div className="text-xs text-gray-500">{formatTime(selectedShift.fromTime, selectedShift.fromAmPm)} - {formatTime(selectedShift.toTime, selectedShift.toAmPm)}</div>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">Select a shift</span>
                )}
              </div>
            </div>
            <div>
              <button
                onClick={handleAssignShift}
                disabled={!selectedEmployee || !selectedShift}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 h-12 ${
                  selectedEmployee && selectedShift
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Assign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative overflow-x-auto max-h-[600px]">
            <table className="w-full border-collapse table-fixed" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gray-50 sticky top-0 z-20">
                <tr>
                  <th
                    className="border-r border-gray-200 px-4 py-3 text-left sticky left-0 bg-gray-50 z-30 whitespace-nowrap"
                    style={{ minWidth: '100px', width: '100px' }}
                  >
                    <span className="text-sm font-semibold text-gray-700">Date</span>
                  </th>
                  {timeSlots.map((slot) => (
                    <th
                      key={slot}
                      className="border-r border-gray-200 px-4 py-3 text-center sticky top-0 bg-gray-50 z-20"
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      <div className="text-sm font-semibold text-gray-700">
                        {formatTimeSlot(slot)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekDates.length > 0 ? weekDates.map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const dateStr = `${dayNames[date.getDay()]}\n${date.getDate()}`;
                  const shiftsForDate = getShiftsForDate(date);
                  const rowHeight = shiftsForDate.length > 0 ? 60 + (shiftsForDate.length - 1) * 40 : 60;

                  return (
                    <tr key={date.toISOString()} className="hover:bg-gray-50 transition-colors">
                      <td
                        className="border-r border-gray-200 px-4 py-3 text-sm font-medium sticky left-0 bg-white z-10 whitespace-pre-line"
                        style={{ minWidth: '100px', width: '100px' }}
                      >
                        <div className={`flex items-center gap-2 ${isToday ? "text-indigo-600" : "text-gray-900"}`}>
                          <span className="font-semibold">{dateStr}</span>
                          {isToday && <div className="w-2 h-2 bg-indigo-500 rounded-full ml-1"></div>}
                        </div>
                      </td>
                      <td
                        colSpan={timeSlots.length}
                        className="border-r border-gray-200 px-3 py-3 text-xs relative"
                        style={{ position: 'relative', minHeight: `${rowHeight}px` }}
                      >
                        <div className="absolute inset-0 flex flex-col z-0">
                          {shiftsForDate.length > 0 ? shiftsForDate.map((shift, shiftIndex) => {
                            const shiftStyle = getShiftStyle(shift.fromTime, shift.toTime, shift.fromAmPm, shift.toAmPm, shiftsForDate, shiftIndex);
                            const formattedFromTime = formatTime(shift.fromTime, shift.fromAmPm);
                            const formattedToTime = formatTime(shift.toTime, shift.toAmPm);
                            const topPosition = 5 + shiftIndex * 40;
                            const { background, border } = getShiftStyles(shift.shiftName);

                            return (
                              <div
                                key={shift.id}
                                className={`absolute ${background} text-black text-xs rounded p-2 flex justify-between items-center ${border} border-2 z-${shiftIndex + 1} shadow-sm`}
                                style={{
                                  ...shiftStyle,
                                  height: '50px',
                                  top: `${topPosition}px`,
                                  minWidth: shiftStyle.minWidth,
                                  backgroundImage: shiftStyle.hasOverlap ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 5px, transparent 5px, transparent 10px)' : 'none'
                                }}
                                title={`${shift.shiftName}: ${formattedFromTime} - ${formattedToTime} (From: ${shift.fromDate}, To: ${shift.toDate})`}
                              >
                                <div className={`flex-1 ${shiftStyle.hasOverlap ? 'transform rotate-45 origin-left' : ''}`}>
                                  <span className="font-medium">{shift.shiftName || 'Unknown'}</span>
                                  <span className="text-xs block">{`${formattedFromTime} - ${formattedToTime}`}</span>
                                  <span className="text-xs block">{`From: ${shift.fromDate} To: ${shift.toDate}`}</span>
                                </div>
                                <button
                                  onClick={() => handleEditShift(shift)}
                                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full ml-2"
                                  title="Edit Shift"
                                >
                                  <Pencil className="w-4 h-4 text-indigo-600" />
                                </button>
                              </div>
                            );
                          }) : (
                            <div className="text-gray-500 text-xs mt-2">No shifts for this date</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={timeSlots.length + 1} className="text-center py-4 text-gray-500">
                      No present or future dates available. Please select a valid date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Shift</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Shift
                </label>
                <select
                  value={editingAssignment?.shift?.id || ''}
                  onChange={(e) => {
                    const selected = shifts.find(shift => shift.id === e.target.value);
                    setEditingAssignment(prev => ({ ...prev, shift: selected }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a shift...</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shiftName} ({formatTime(shift.fromTime, shift.fromAmPm)} - {formatTime(shift.toTime, shift.toAmPm)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={editingAssignment?.fromDate || ''}
                  min={new Date().toISOString().slice(0, 10)} // Restrict to today or future
                  onChange={(e) => setEditingAssignment(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={editingAssignment?.toDate || ''}
                  min={editingAssignment?.fromDate || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setEditingAssignment(prev => ({ ...prev, toDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateShift}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernScheduleInterface;