import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export const CheckInReminderContext = createContext();

export const CheckInReminderProvider = ({ children }) => {
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [userStatus, setUserStatus] = useState({
    checkedIn: false,
    branchId: null,
    branchName: null,
    active: false,
    lastCheckIn: null,
  });
  const CHECK_IN_RADIUS = 100;
  const CHECK_IN_REMINDER_INTERVAL = 60000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserStatus({
              checkedIn: userData.checkedIn || false,
              branchId: userData.branchId || null,
              branchName: userData.branchName || null,
              active: userData.active || false,
              lastCheckIn: userData.lastCheckIn || null,
            });
          }

          const querySnapshot = await getDocs(collection(db, "instituteSetup"));
          if (!querySnapshot.empty) {
            const instituteId = querySnapshot.docs[0].id;
            const branchesSnapshot = await getDocs(
              collection(db, "instituteSetup", instituteId, "Center")
            );
            const branchList = branchesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setBranches(
              branchList.filter(
                (branch) => branch.isActive && branch.latitude && branch.longitude
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data for reminders:", error);
        toast.error("Failed to load check-in data.");
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let reminderInterval;

    const checkInReminder = () => {
      if (!user || userStatus.checkedIn || !navigator.geolocation) {
        return;
      }

      if (
        window.location.protocol !== "https:" &&
        window.location.hostname !== "localhost"
      ) {
        console.warn("Geolocation requires HTTPS.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const proximity = checkProximity(latitude, longitude);
          if (proximity) {
            toast.info(
              `You are at ${proximity.branchName}. Please check in to start your session.`,
              {
                autoClose: 10000,
                position: "top-right",
              }
            );
          }
        },
        (error) => {
          console.error("Error checking location for reminder:", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 60000,
        }
      );
    };

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

    if (user && !userStatus.checkedIn) {
      checkInReminder();
      reminderInterval = setInterval(checkInReminder, CHECK_IN_REMINDER_INTERVAL);
    }

    return () => clearInterval(reminderInterval);
  }, [user, userStatus.checkedIn, branches]);

  return (
    <CheckInReminderContext.Provider value={{ userStatus, branches }}>
      {children}
    </CheckInReminderContext.Provider>
  );
};

export const useCheckInReminder = () => useContext(CheckInReminderContext);