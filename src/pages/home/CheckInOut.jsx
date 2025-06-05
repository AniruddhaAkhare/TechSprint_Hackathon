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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(null);
  const [liveDuration, setLiveDuration] = useState(null);
  const CHECK_IN_RADIUS = 300; // 100 meters
  const AUTO_CHECKOUT_INTERVAL = 300000; // 5 minutes

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
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
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

  const handleCheckIn = async () => {
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
            console.error("Check-in error:", error);
            setError(`Failed to check in: ${error.message}`);
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
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User data not found.");
        setIsCheckingOut(false);
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
      console.error("Check-out error:", error);
      setError(`Failed to check out: ${error.message}`);
    }
    setIsCheckingOut(false);
  };

  const handleAutoCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User data not found.");
        setIsCheckingOut(false);
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
      console.error("Auto-checkout error:", error);
      setError(`Failed to auto-check out: ${error.message}`);
    }
    setIsCheckingOut(false);
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
            className={`bg-red-500 text-white px-4 py-2 rounded ${
              isCheckingOut ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
            onClick={handleCheckOut}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Checking Out..." : "Check Out"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;