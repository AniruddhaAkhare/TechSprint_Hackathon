import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useCheckInReminder } from "../../context/CheckInRemainderContext";
import { Card, Typography, Button, Alert, Spinner } from "@material-tailwind/react";
import { ClockIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const CheckInOut = () => {
  const { user } = useAuth();
  const { userStatus, branches } = useCheckInReminder();
  const [error, setError] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(null);
  const [liveDuration, setLiveDuration] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [localCheckedIn, setLocalCheckedIn] = useState(false);
  const [dailyDurations, setDailyDurations] = useState([]); // Store all sessions

  // Configuration constants
  const CHECK_IN_RADIUS = 1500;
  const SESSION_WARNING_THRESHOLD = 100;
  const LOCATION_CHECK_INTERVAL = 300000;
  const MAX_LOCATION_AGE = 10000;

  // Fetch user data including dailyDurations on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setDailyDurations(userData.dailyDurations || []);
        }
      } catch (error) {
        setError("Failed to fetch today's sessions.");
      }
    };
    fetchUserData();
  }, [user.uid]);

  // Initialize session state from local storage
  useEffect(() => {
    const savedSession = localStorage.getItem("userSession");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session.userId === user.uid && session.isActive) {
        setSessionActive(true);
        setLocalCheckedIn(true);
      }
    }
  }, [user.uid]);

  // Live duration timer
  useEffect(() => {
    let timer;
    if (userStatus.checkedIn && userStatus.lastCheckIn) {
      const checkInTime = new Date(userStatus.lastCheckIn);
      if (!isNaN(checkInTime.getTime())) {
        timer = setInterval(() => {
          const now = new Date();
          const durationMs = now - checkInTime;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
          setLiveDuration(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
      }
    } else {
      setLiveDuration(null);
    }
    return () => clearInterval(timer);
  }, [userStatus.checkedIn, userStatus.lastCheckIn]);

  // Location monitoring for active sessions
  useEffect(() => {
    let locationCheckInterval;
    let outOfRangeCount = 0;

    const checkUserLocation = async () => {
      if (!userStatus.checkedIn || !navigator.geolocation) return;

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: MAX_LOCATION_AGE,
            timeout: 15000,
          });
        });

        const { latitude, longitude } = position.coords;
        const branch = branches.find((b) => b.id === userStatus.branchId);
        if (!branch) {
          setError("Checked-in branch not found.");
          return;
        }

        const distance = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);

        if (distance > CHECK_IN_RADIUS && distance <= CHECK_IN_RADIUS + SESSION_WARNING_THRESHOLD) {
          setShowSessionWarning(true);
        } else {
          setShowSessionWarning(false);
        }

        if (distance > CHECK_IN_RADIUS) {
          outOfRangeCount++;
          if (outOfRangeCount >= 2) {
            handleAutoCheckOut();
          }
        } else {
          outOfRangeCount = 0;
        }
      } catch (error) {
        setError(getLocationError(error));
      }
    };

    if (userStatus.checkedIn) {
      locationCheckInterval = setInterval(checkUserLocation, LOCATION_CHECK_INTERVAL);
      checkUserLocation();
    }

    return () => clearInterval(locationCheckInterval);
  }, [userStatus.checkedIn, userStatus.branchId, branches]);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = parseFloat(lat1) * Math.PI / 180;
    const φ2 = parseFloat(lat2) * Math.PI / 180;
    const Δφ = (parseFloat(lat2) - parseFloat(lat1)) * Math.PI / 180;
    const Δλ = (parseFloat(lon2) - parseFloat(lon1)) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Check if user is near any branch
  const checkProximity = (userLat, userLon) => {
    if (!branches || branches.length === 0) {
      setError("No branches available. Please try again later.");
      return { closest: null };
    }
    let closestBranch = null;
    let minDistance = Infinity;

    for (const branch of branches) {
      const distance = calculateDistance(userLat, userLon, branch.latitude, branch.longitude);
      if (distance <= CHECK_IN_RADIUS) {
        return { branchId: branch.id, branchName: branch.name, distance };
      }
      if (distance < minDistance) {
        minDistance = distance;
        closestBranch = { branchId: branch.id, branchName: branch.name, distance };
      }
    }
    return { closest: closestBranch };
  };

  // Handle manual check-in
  const handleCheckIn = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      setError("Geolocation requires HTTPS in production.");
      return;
    }

    if (!branches || branches.length === 0) {
      setError("No branches available. Please try again later.");
      return;
    }

    setIsFetchingLocation(true);
    setError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: MAX_LOCATION_AGE,
        });
      });

      const { latitude, longitude } = position.coords;
      const proximity = checkProximity(latitude, longitude);

      if (proximity.branchId) {
        const userRef = doc(db, "Users", user.uid);
        const timestamp = new Date().toISOString();

        await updateDoc(userRef, {
          checkedIn: true,
          branchId: proximity.branchId,
          branchName: proximity.branchName,
          active: true,
          lastCheckIn: timestamp,
          lastKnownLocation: { latitude, longitude },
        });

        setSessionActive(true);
        setLocalCheckedIn(true);
        localStorage.setItem(
          "userSession",
          JSON.stringify({
            userId: user.uid,
            isActive: true,
            startedAt: timestamp,
            branchId: proximity.branchId,
          })
        );

        // Refresh dailyDurations after check-in
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setDailyDurations(userSnap.data().dailyDurations || []);
        }

        setError("");
      } else {
        setError(
          `You must be within ${CHECK_IN_RADIUS} meters of a branch to check in. Closest branch: ${
            proximity.closest?.branchName || "Unknown"
          } (${proximity.closest?.distance.toFixed(2) || "N/A"} meters).`
        );
      }
    } catch (error) {
      setError(getLocationError(error));
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Handle manual check-out
  const handleCheckOut = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User data not found.");
        return;
      }

      const userData = userSnap.data();
      const checkInTime = userData.lastCheckIn ? new Date(userData.lastCheckIn) : null;
      const checkOutTime = new Date();
      const timestamp = checkOutTime.toISOString();
      let durationHours = 0;

      if (checkInTime && !isNaN(checkInTime.getTime())) {
        durationHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);
      }

      const dateStr = checkOutTime.toISOString().split("T")[0];
      const dailyDurations = userData.dailyDurations || [];
      const existingDayIndex = dailyDurations.findIndex((entry) => entry.date === dateStr);

      const sessionData = {
        checkIn: userData.lastCheckIn,
        checkOut: timestamp,
        duration: parseFloat(durationHours),
        branchId: userData.branchId,
        branchName: userData.branchName,
      };

      if (existingDayIndex >= 0) {
        dailyDurations[existingDayIndex].totalDuration = (
          parseFloat(dailyDurations[existingDayIndex].totalDuration || 0) +
          parseFloat(durationHours)
        ).toFixed(2);
        dailyDurations[existingDayIndex].sessions = [
          ...(dailyDurations[existingDayIndex].sessions || []),
          sessionData,
        ];
      } else {
        dailyDurations.push({
          date: dateStr,
          totalDuration: parseFloat(durationHours).toFixed(2),
          sessions: [sessionData],
        });
      }

      await updateDoc(userRef, {
        checkedIn: false,
        branchId: null,
        branchName: null,
        active: false,
        lastCheckOut: timestamp,
        dailyDurations: dailyDurations,
        lastKnownLocation: null,
      });

      setSessionActive(false);
      setLocalCheckedIn(false);
      localStorage.removeItem("userSession");
      setCurrentDuration(durationHours);
      setLiveDuration(null);
      setDailyDurations(dailyDurations); // Update local state
      setError("");
    } catch (error) {
      setError("Failed to check out. Please try again.");
    }
  };

  // Handle automatic check-out
  const handleAutoCheckOut = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User data not found.");
        return;
      }

      const userData = userSnap.data();
      const checkInTime = userData.lastCheckIn ? new Date(userData.lastCheckIn) : null;
      const checkOutTime = new Date();
      const timestamp = checkOutTime.toISOString();
      let durationHours = 0;

      if (checkInTime && !isNaN(checkInTime.getTime())) {
        durationHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);
      }

      const dateStr = checkOutTime.toISOString().split("T")[0];
      const dailyDurations = userData.dailyDurations || [];
      const existingDayIndex = dailyDurations.findIndex((entry) => entry.date === dateStr);

      const sessionData = {
        checkIn: userData.lastCheckIn,
        checkOut: timestamp,
        duration: parseFloat(durationHours),
        branchId: userData.branchId,
        branchName: userData.branchName,
        autoCheckout: true,
      };

      if (existingDayIndex >= 0) {
        dailyDurations[existingDayIndex].totalDuration = (
          parseFloat(dailyDurations[existingDayIndex].totalDuration || 0) +
          parseFloat(durationHours)
        ).toFixed(2);
        dailyDurations[existingDayIndex].sessions = [
          ...(dailyDurations[existingDayIndex].sessions || []),
          sessionData,
        ];
      } else {
        dailyDurations.push({
          date: dateStr,
          totalDuration: parseFloat(durationHours).toFixed(2),
          sessions: [sessionData],
        });
      }

      await updateDoc(userRef, {
        checkedIn: false,
        branchId: null,
        branchName: null,
        active: false,
        lastCheckOut: timestamp,
        dailyDurations: dailyDurations,
        lastKnownLocation: null,
      });

      setSessionActive(false);
      setLocalCheckedIn(false);
      localStorage.removeItem("userSession");
      setCurrentDuration(durationHours);
      setLiveDuration(null);
      setDailyDurations(dailyDurations); // Update local state
      setError("You were automatically checked out for leaving the branch area.");
    } catch (error) {
      setError("Automatic check-out failed. Please check out manually.");
    }
  };

  // Helper function for location error messages
  const getLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access was denied. Please enable location permissions.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "Unable to determine your location.";
    }
  };

  // Get today's total duration
  const today = new Date().toISOString().split("T")[0];
  const todayTotalDuration = dailyDurations.find((entry) => entry.date === today)?.totalDuration || "0.00";

  return (
    <Card className="p-6 max-w-md mx-auto shadow-lg">
      <Typography variant="h4" className="text-gray-900 font-bold mb-4">
        Office Attendance
      </Typography>

      {error && (
        <Alert
          color="red"
          icon={<ExclamationTriangleIcon className="h-5 w-5" />}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {showSessionWarning && (
        <Alert
          color="yellow"
          icon={<ExclamationTriangleIcon className="h-5 w-5" />}
          className="mb-4"
        >
          Warning: You're approaching the boundary of your check-in area.
        </Alert>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <Typography variant="small" className="font-medium text-gray-700">
            Current Status:
          </Typography>
          <Typography
            variant="small"
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              userStatus.active || localCheckedIn
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {userStatus.active || localCheckedIn ? "Active" : "Inactive"}
          </Typography>
        </div>

        {(userStatus.checkedIn || localCheckedIn) && (
          <>
            <Typography variant="small" className="text-gray-600">
              Branch: <span className="font-medium">{userStatus.branchName || "Fireblaze MS Nagpur"}</span>
            </Typography>
            {liveDuration && (
              <Typography variant="small" className="text-gray-600">
                Session Duration: <span className="font-medium">{liveDuration}</span>
              </Typography>
            )}
          </>
        )}

        {currentDuration && !(userStatus.checkedIn || localCheckedIn) && (
          <Typography variant="small" className="text-gray-600">
            Last Session: <span className="font-medium">{currentDuration} hours</span>
          </Typography>
        )}
      </div>

      <div className="flex justify-center mb-6">
        {!(userStatus.checkedIn || localCheckedIn) ? (
          <Button
            color="blue"
            onClick={handleCheckIn}
            disabled={isFetchingLocation}
            className="flex items-center gap-2"
          >
            {isFetchingLocation ? (
              <>
                <Spinner className="h-4 w-4" />
                Checking In...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Check In
              </>
            )}
          </Button>
        ) : (
          <Button
            color="red"
            onClick={handleCheckOut}
            className="flex items-center gap-2"
          >
            <ClockIcon className="h-5 w-5" />
            Check Out
          </Button>
        )}
      </div>

      {sessionActive && (
        <Typography variant="small" className="mb-4 text-center text-gray-500">
          Session is active. Your attendance is being tracked.
        </Typography>
      )}

      {/* Today's Sessions Total Duration */}
      <Typography variant="h5" className="text-gray-900 font-bold mb-2">
        Today's Sessions
      </Typography>
      <Typography variant="small" className="text-gray-600">
        Total Duration: <span className="font-medium">{todayTotalDuration} hours</span>
      </Typography>
    </Card>
  );
};

export default CheckInOut;