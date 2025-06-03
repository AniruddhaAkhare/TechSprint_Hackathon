import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useCheckInReminder } from "../../context/CheckInRemainderContext";
import "./CheckInOut.css";

const CheckInOut = () => {
  const { user } = useAuth();
  const { userStatus, branches } = useCheckInReminder(); 
  const [error, setError] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(null);
  const [liveDuration, setLiveDuration] = useState(null);
  const CHECK_IN_RADIUS = 300; // 100 meters
  const AUTO_CHECKOUT_INTERVAL = 300000; // 5 minutes
  // const GRACE_PERIOD = 2;

  useEffect(() => {
    let timer;
    if (userStatus.checkedIn && userStatus.lastCheckIn) {
      const checkInTime = new Date(userStatus.lastCheckIn);
      if (!isNaN(checkInTime.getTime())) {
        timer = setInterval(() => {
          const now = new Date();
          const durationMs = now - checkInTime;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
          setLiveDuration(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
      }
    } else {
      setLiveDuration(null);
    }
    return () => clearInterval(timer);
  }, [userStatus.checkedIn, userStatus.lastCheckIn]);

  useEffect(() => {
    let locationCheckInterval;
    let outOfRangeCount = 0;

    const checkUserLocation = () => {
      if (!userStatus.checkedIn || !navigator.geolocation) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const branch = branches.find((b) => b.id === userStatus.branchId);
          if (!branch) {
            setError("Checked-in branch not found.");
            return;
          }

          const distance = calculateDistance(
            latitude,
            longitude,
            branch.latitude,
            branch.longitude
          );

          if (distance > CHECK_IN_RADIUS) {
            outOfRangeCount++;
            if (outOfRangeCount >= 1) {
              handleAutoCheckOut();
            }
          } else {
            outOfRangeCount = 0;
          }
        },
        (error) => {
          //console.error("Error checking location:", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 60000,
        }
      );
    };

    if (userStatus.checkedIn) {
      locationCheckInterval = setInterval(
        checkUserLocation,
        AUTO_CHECKOUT_INTERVAL
      );
    }

    return () => clearInterval(locationCheckInterval);
  }, [userStatus.checkedIn, userStatus.branchId, branches]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkProximity = (userLat, userLon) => {
    for (const branch of branches) {
      const distance = calculateDistance(
        userLat,
        userLon,
        branch.latitude,
        branch.longitude
      );
      if (distance <= CHECK_IN_RADIUS) {
        return { branchId: branch.id, branchName: branch.name };
      }
    }
    return null;
  };

  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setError("Geolocation requires a secure context (HTTPS).");
      return;
    }

    setIsFetchingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const proximity = checkProximity(latitude, longitude);
        if (proximity) {
          try {
            const userRef = doc(db, "Users", user.uid);
            const timestamp = new Date().toISOString();
            await updateDoc(userRef, {
              checkedIn: true,
              branchId: proximity.branchId,
              branchName: proximity.branchName,
              active: true,
              lastCheckIn: timestamp,
            });
            setError("");
            // sendCheckInEmail(user.email, proximity.branchName, timestamp);
          } catch (error) {
            //console.error("Error checking in:", error);
            setError("Failed to check in. Please try again.");
          }
        } else {
          setError("You are not within 300 meters of any branch.");
        }
        setIsFetchingLocation(false);
      },
      (error) => {
        setIsFetchingLocation(false);
        let errorMessage = "Unable to fetch your location: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Location access was denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage +=
              "The request timed out. Please try again or check your network.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        setError(errorMessage);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      }
    );
  };

  const handleCheckOut = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User data not found.");
        return;
      }

      const userData = userSnap.data();
      const checkInTime = userData.lastCheckIn
        ? new Date(userData.lastCheckIn)
        : null;
      const checkOutTime = new Date();
      const timestamp = checkOutTime.toISOString();
      let durationHours = 0;

      if (checkInTime && !isNaN(checkInTime.getTime())) {
        const durationMs = checkOutTime - checkInTime;
        durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
      }

      const dateStr = checkOutTime.toISOString().split("T")[0];
      const dailyDurations = userData.dailyDurations || [];
      const existingDayIndex = dailyDurations.findIndex(
        (entry) => entry.date === dateStr
      );

      if (existingDayIndex >= 0) {
        if (!dailyDurations[existingDayIndex].sessions) {
          dailyDurations[existingDayIndex].sessions = [];
        }
        dailyDurations[existingDayIndex].totalDuration = (
          parseFloat(dailyDurations[existingDayIndex].totalDuration || 0) +
          parseFloat(durationHours)
        ).toFixed(2);
        dailyDurations[existingDayIndex].sessions.push({
          checkIn: userData.lastCheckIn,
          checkOut: timestamp,
          duration: parseFloat(durationHours),
        });
      } else {
        dailyDurations.push({
          date: dateStr,
          totalDuration: parseFloat(durationHours).toFixed(2),
          sessions: [
            {
              checkIn: userData.lastCheckIn,
              checkOut: timestamp,
              duration: parseFloat(durationHours),
            },
          ],
        });
      }

      await updateDoc(userRef, {
        checkedIn: false,
        branchId: null,
        branchName: null,
        active: false,
        lastCheckOut: timestamp,
        dailyDurations: dailyDurations,
      });

      setCurrentDuration(durationHours);
      setLiveDuration(null);
      setError("");
      // sendCheckOutEmail(user.email, timestamp, durationHours);
    } catch (error) {
      //console.error("Error checking out:", error);
      setError("Failed to check out. Please try again.");
    }
  };

  const handleAutoCheckOut = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User data not found.");
        return;
      }

      const userData = userSnap.data();
      const checkInTime = userData.lastCheckIn
        ? new Date(userData.lastCheckIn)
        : null;
      const checkOutTime = new Date();
      const timestamp = checkOutTime.toISOString();
      let durationHours = 0;

      if (checkInTime && !isNaN(checkInTime.getTime())) {
        const durationMs = checkOutTime - checkInTime;
        durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
      }

      const dateStr = checkOutTime.toISOString().split("T")[0];
      const dailyDurations = userData.dailyDurations || [];
      const existingDayIndex = dailyDurations.findIndex(
        (entry) => entry.date === dateStr
      );

      if (existingDayIndex >= 0) {
        if (!dailyDurations[existingDayIndex].sessions) {
          dailyDurations[existingDayIndex].sessions = [];
        }
        dailyDurations[existingDayIndex].totalDuration = (
          parseFloat(dailyDurations[existingDayIndex].totalDuration || 0) +
          parseFloat(durationHours)
        ).toFixed(2);
        dailyDurations[existingDayIndex].sessions.push({
          checkIn: userData.lastCheckIn,
          checkOut: timestamp,
          duration: parseFloat(durationHours),
          autoCheckout: true,
        });
      } else {
        dailyDurations.push({
          date: dateStr,
          totalDuration: parseFloat(durationHours).toFixed(2),
          sessions: [
            {
              checkIn: userData.lastCheckIn,
              checkOut: timestamp,
              duration: parseFloat(durationHours),
              autoCheckout: true,
            },
          ],
        });
      }

      await updateDoc(userRef, {
        checkedIn: false,
        branchId: null,
        branchName: null,
        active: false,
        lastCheckOut: timestamp,
        dailyDurations: dailyDurations,
      });

      setCurrentDuration(durationHours);
      setLiveDuration(null);
      setError(
        "You have been automatically checked out as you left the branch location."
      );
      // sendCheckOutEmail(user.email, timestamp, durationHours, true);
    } catch (error) {
      //console.error("Error during auto-checkout:", error);
      setError("Failed to auto-check out. Please try again.");
    }
  };

  return (
    <div className="check-in-out p-4">
      <h3 className="text-xl font-bold mb-4">Check-In/Check-Out</h3>
      {error && <p className="error text-red-500 mb-4">{error}</p>}
      <div className="status mb-4">
        <p>
          Status:{" "}
          <span className={userStatus.active ? "text-green-500" : "text-red-500"}>
            {userStatus.active ? "Active" : "Inactive"}
          </span>
        </p>
        {userStatus.checkedIn && (
          <>
            <p>Checked in at: {userStatus.branchName}</p>
            {liveDuration && <p>Time elapsed: {liveDuration}</p>}
          </>
        )}
        {currentDuration && !userStatus.checkedIn && (
          <p>Last session duration: {currentDuration} hours</p>
        )}
      </div>
      <div className="actions">
        {!userStatus.checkedIn ? (
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isFetchingLocation
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            onClick={handleCheckIn}
            disabled={isFetchingLocation}
          >
            {isFetchingLocation ? "Checking In..." : "Check In"}
          </button>
        ) : (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleCheckOut}
          >
            Check Out
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;



// import React, { useState, useEffect } from "react";
// import { db } from "../../config/firebase";
// import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
// import { useAuth } from "../../context/AuthContext";
// import { useCheckInReminder } from "../../context/CheckInRemainderContext";

// const CheckInOut = () => {
//   const { user } = useAuth();
//   const { userStatus, branches } = useCheckInReminder();
//   const [error, setError] = useState("");
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//   const [currentDuration, setCurrentDuration] = useState(null);
//   const [liveDuration, setLiveDuration] = useState(null);
//   const [sessionActive, setSessionActive] = useState(false);
//   const [showSessionWarning, setShowSessionWarning] = useState(false);
  
//   // Configuration constants
//   const CHECK_IN_RADIUS = 300; // meters
//   const LOCATION_CHECK_INTERVAL = 300000; // 5 minutes
//   const SESSION_WARNING_THRESHOLD = 100; // meters beyond radius to show warning
//   const MAX_LOCATION_AGE = 60000; // 1 minute for cached location

//   // Initialize session state from storage
//   useEffect(() => {
//     const savedSession = localStorage.getItem('userSession');
//     if (savedSession) {
//       const session = JSON.parse(savedSession);
//       if (session.userId === user.uid && session.isActive) {
//         setSessionActive(true);
//       }
//     }
//   }, [user.uid]);

//   // Live duration timer
//   useEffect(() => {
//     let timer;
//     if (userStatus.checkedIn && userStatus.lastCheckIn) {
//       const checkInTime = new Date(userStatus.lastCheckIn);
//       if (!isNaN(checkInTime.getTime())) {
//         timer = setInterval(() => {
//           const now = new Date();
//           const durationMs = now - checkInTime;
//           const hours = Math.floor(durationMs / (1000 * 60 * 60));
//           const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
//           const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
//           setLiveDuration(`${hours}h ${minutes}m ${seconds}s`);
//         }, 1000);
//       }
//     } else {
//       setLiveDuration(null);
//     }
//     return () => clearInterval(timer);
//   }, [userStatus.checkedIn, userStatus.lastCheckIn]);

//   // Location monitoring for active sessions
//   useEffect(() => {
//     let locationCheckInterval;
//     let outOfRangeCount = 0;

//     const checkUserLocation = async () => {
//       if (!userStatus.checkedIn || !navigator.geolocation) return;

//       try {
//         const position = await new Promise((resolve, reject) => {
//           navigator.geolocation.getCurrentPosition(resolve, reject, {
//             enableHighAccuracy: true,
//             maximumAge: MAX_LOCATION_AGE,
//             timeout: 15000
//           });
//         });

//         const { latitude, longitude } = position.coords;
//         const branch = branches.find(b => b.id === userStatus.branchId);
//         if (!branch) {
//           setError("Checked-in branch not found.");
//           return;
//         }

//         const distance = calculateDistance(
//           latitude,
//           longitude,
//           branch.latitude,
//           branch.longitude
//         );

//         // Show warning if approaching boundary
//         if (distance > CHECK_IN_RADIUS && distance <= (CHECK_IN_RADIUS + SESSION_WARNING_THRESHOLD)) {
//           setShowSessionWarning(true);
//         } else {
//           setShowSessionWarning(false);
//         }

//         // Auto-checkout if beyond radius
//         if (distance > CHECK_IN_RADIUS) {
//           outOfRangeCount++;
//           if (outOfRangeCount >= 2) { // Require two consecutive out-of-range readings
//             handleAutoCheckOut();
//           }
//         } else {
//           outOfRangeCount = 0;
//         }

//       } catch (error) {
//         console.error("Location error:", error);
//         // Gracefully handle location errors without auto-checkout
//       }
//     };

//     if (userStatus.checkedIn) {
//       locationCheckInterval = setInterval(checkUserLocation, LOCATION_CHECK_INTERVAL);
//       // Initial check
//       checkUserLocation();
//     }

//     return () => clearInterval(locationCheckInterval);
//   }, [userStatus.checkedIn, userStatus.branchId, branches]);

//   // Calculate distance using Haversine formula
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth radius in meters
//     const φ1 = lat1 * Math.PI / 180;
//     const φ2 = lat2 * Math.PI / 180;
//     const Δφ = (lat2 - lat1) * Math.PI / 180;
//     const Δλ = (lon2 - lon1) * Math.PI / 180;

//     const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//               Math.cos(φ1) * Math.cos(φ2) *
//               Math.sin(Δλ/2) * Math.sin(Δλ/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   };

//   // Check if user is near any branch
//   const checkProximity = (userLat, userLon) => {
//     for (const branch of branches) {
//       const distance = calculateDistance(
//         userLat,
//         userLon,
//         branch.latitude,
//         branch.longitude
//       );
//       if (distance <= CHECK_IN_RADIUS) {
//         return { branchId: branch.id, branchName: branch.name, distance };
//       }
//     }
//     return null;
//   };

//   // Handle manual check-in
//   const handleCheckIn = async () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser.");
//       return;
//     }

//     if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
//       setError("Geolocation requires HTTPS in production.");
//       return;
//     }

//     setIsFetchingLocation(true);
//     setError("");

//     try {
//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject, {
//           enableHighAccuracy: true,
//           timeout: 30000,
//           maximumAge: MAX_LOCATION_AGE
//         });
//       });

//       const { latitude, longitude } = position.coords;
//       const proximity = checkProximity(latitude, longitude);
      
//       if (!proximity) {
//         setError("You must be within 300 meters of a branch to check in.");
//         return;
//       }

//       const userRef = doc(db, "Users", user.uid);
//       const timestamp = new Date().toISOString();
      
//       await updateDoc(userRef, {
//         checkedIn: true,
//         branchId: proximity.branchId,
//         branchName: proximity.branchName,
//         active: true,
//         lastCheckIn: timestamp,
//         lastKnownLocation: { latitude, longitude },
//       });

//       // Start session
//       setSessionActive(true);
//       localStorage.setItem('userSession', JSON.stringify({
//         userId: user.uid,
//         isActive: true,
//         startedAt: timestamp,
//         branchId: proximity.branchId
//       }));

//       setError("");
//     } catch (error) {
//       console.error("Check-in error:", error);
//       setError(getLocationError(error));
//     } finally {
//       setIsFetchingLocation(false);
//     }
//   };

//   // Handle manual check-out
//   const handleCheckOut = async () => {
//     try {
//       const userRef = doc(db, "Users", user.uid);
//       const userSnap = await getDoc(userRef);
      
//       if (!userSnap.exists()) {
//         setError("User data not found.");
//         return;
//       }

//       const userData = userSnap.data();
//       const checkInTime = userData.lastCheckIn ? new Date(userData.lastCheckIn) : null;
//       const checkOutTime = new Date();
//       const timestamp = checkOutTime.toISOString();
//       let durationHours = 0;

//       if (checkInTime && !isNaN(checkInTime.getTime())) {
//         durationHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);
//       }

//       // Update daily durations
//       const dateStr = checkOutTime.toISOString().split("T")[0];
//       const dailyDurations = userData.dailyDurations || [];
//       const existingDayIndex = dailyDurations.findIndex(entry => entry.date === dateStr);

//       const sessionData = {
//         checkIn: userData.lastCheckIn,
//         checkOut: timestamp,
//         duration: parseFloat(durationHours),
//         branchId: userData.branchId,
//         branchName: userData.branchName
//       };

//       if (existingDayIndex >= 0) {
//         dailyDurations[existingDayIndex].totalDuration = (
//           parseFloat(dailyDurations[existingDayIndex].totalDuration || 0) + 
//           parseFloat(durationHours)
//         ).toFixed(2);
//         dailyDurations[existingDayIndex].sessions = [
//           ...(dailyDurations[existingDayIndex].sessions || []),
//           sessionData
//         ];
//       } else {
//         dailyDurations.push({
//           date: dateStr,
//           totalDuration: parseFloat(durationHours).toFixed(2),
//           sessions: [sessionData]
//         });
//       }

//       await updateDoc(userRef, {
//         checkedIn: false,
//         branchId: null,
//         branchName: null,
//         active: false,
//         lastCheckOut: timestamp,
//         dailyDurations: dailyDurations,
//         lastKnownLocation: null
//       });

//       // End session
//       setSessionActive(false);
//       localStorage.removeItem('userSession');
//       setCurrentDuration(durationHours);
//       setLiveDuration(null);
//       setError("");
//     } catch (error) {
//       console.error("Check-out error:", error);
//       setError("Failed to check out. Please try again.");
//     }
//   };

//   // Handle automatic check-out
//   const handleAutoCheckOut = async () => {
//     try {
//       const userRef = doc(db, "Users", user.uid);
//       const userSnap = await getDoc(userRef);
      
//       if (!userSnap.exists()) {
//         setError("User data not found.");
//         return;
//       }

//       const userData = userSnap.data();
//       const checkInTime = userData.lastCheckIn ? new Date(userData.lastCheckIn) : null;
//       const checkOutTime = new Date();
//       const timestamp = checkOutTime.toISOString();
//       let durationHours = 0;

//       if (checkInTime && !isNaN(checkInTime.getTime())) {
//         durationHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);
//       }

//       // Update daily durations with auto-checkout flag
//       const dateStr = checkOutTime.toISOString().split("T")[0];
//       const dailyDurations = userData.dailyDurations || [];
//       const existingDayIndex = dailyDurations.findIndex(entry => entry.date === dateStr);

//       const sessionData = {
//         checkIn: userData.lastCheckIn,
//         checkOut: timestamp,
//         duration: parseFloat(durationHours),
//         branchId: userData.branchId,
//         branchName: userData.branchName,
//         autoCheckout: true
//       };

//       if (existingDayIndex >= 0) {
//         dailyDurations[existingDayIndex].totalDuration = (
//           parseFloat(dailyDurations[existingDayIndex].totalDuration || 0) + 
//           parseFloat(durationHours)
//         ).toFixed(2);
//         dailyDurations[existingDayIndex].sessions = [
//           ...(dailyDurations[existingDayIndex].sessions || []),
//           sessionData
//         ];
//       } else {
//         dailyDurations.push({
//           date: dateStr,
//           totalDuration: parseFloat(durationHours).toFixed(2),
//           sessions: [sessionData]
//         });
//       }

//       await updateDoc(userRef, {
//         checkedIn: false,
//         branchId: null,
//         branchName: null,
//         active: false,
//         lastCheckOut: timestamp,
//         dailyDurations: dailyDurations,
//         lastKnownLocation: null
//       });

//       // End session
//       setSessionActive(false);
//       localStorage.removeItem('userSession');
//       setCurrentDuration(durationHours);
//       setLiveDuration(null);
//       setError("You were automatically checked out for leaving the branch area.");
//     } catch (error) {
//       console.error("Auto-checkout error:", error);
//       setError("Automatic check-out failed. Please check out manually.");
//     }
//   };

//   // Helper function for location error messages
//   const getLocationError = (error) => {
//     switch (error.code) {
//       case error.PERMISSION_DENIED:
//         return "Location access was denied. Please enable permissions.";
//       case error.POSITION_UNAVAILABLE:
//         return "Location information is unavailable.";
//       case error.TIMEOUT:
//         return "Location request timed out. Please try again.";
//       default:
//         return "Unable to determine your location.";
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
//       <h3 className="text-xl font-bold mb-4 text-gray-800">Office Attendance</h3>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
//           <p>{error}</p>
//         </div>
//       )}

//       {showSessionWarning && (
//         <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
//           <p>Warning: You're approaching the boundary of your check-in area.</p>
//         </div>
//       )}

//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <span className="font-medium">Current Status:</span>
//           <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//             userStatus.active 
//               ? "bg-green-100 text-green-800" 
//               : "bg-gray-100 text-gray-800"
//           }`}>
//             {userStatus.active ? "Active" : "Inactive"}
//           </span>
//         </div>

//         {userStatus.checkedIn && (
//           <>
//             <div className="mb-2">
//               <p className="text-gray-600">Branch: <span className="font-medium">{userStatus.branchName}</span></p>
//             </div>
//             {liveDuration && (
//               <div className="mb-2">
//                 <p className="text-gray-600">Session Duration: <span className="font-medium">{liveDuration}</span></p>
//               </div>
//             )}
//           </>
//         )}

//         {currentDuration && !userStatus.checkedIn && (
//           <div className="mb-2">
//             <p className="text-gray-600">Last Session: <span className="font-medium">{currentDuration} hours</span></p>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-center">
//         {!userStatus.checkedIn ? (
//           <button
//             onClick={handleCheckIn}
//             disabled={isFetchingLocation}
//             className={`px-6 py-2 rounded-md font-medium text-white ${
//               isFetchingLocation
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } transition-colors`}
//           >
//             {isFetchingLocation ? (
//               <span className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Checking In...
//               </span>
//             ) : (
//               "Check In"
//             )}
//           </button>
//         ) : (
//           <button
//             onClick={handleCheckOut}
//             className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
//           >
//             Check Out
//           </button>
//         )}
//       </div>

//       {sessionActive && (
//         <div className="mt-4 text-center text-sm text-gray-500">
//           <p>Session is active. Your attendance is being tracked.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckInOut;