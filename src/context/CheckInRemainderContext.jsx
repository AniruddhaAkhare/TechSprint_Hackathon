import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
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
    lastCheckOut: null,
    dailyDurations: [],
  });
  const CHECK_IN_RADIUS = 100;
  const CHECK_IN_REMINDER_INTERVAL = 300000;

  useEffect(() => {
    if (!user) return;

    // Real-time listener for user status
    const userRef = doc(db, "Users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          setUserStatus(doc.data());
        } else {
          // Initialize default user status if document doesn't exist
          setUserStatus({
            checkedIn: false,
            branchId: null,
            branchName: null,
            active: false,
            lastCheckIn: null,
            lastCheckOut: null,
            dailyDurations: [],
          });
        }
      },
      (error) => {
        console.error("Error listening to user status:", error);
        toast.error("Failed to load user status.");
      }
    );

    // Fetch branches
    const fetchBranches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!querySnapshot.empty) {
          const instituteId = "RDJ9wMXGrIUk221MzDxP";
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
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches.");
      }
    };

    fetchBranches();

    return () => unsubscribe();
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
          // Silent error handling to avoid spamming user
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        }
      );
    };

    // const calculateDistance = (lat1, lon1, lat2, lon2) => {
    //   const R = 6371e3;
    //   const φ1 = (lat1 * Math.PI) / 180;
    //   const φ2 = (lat2 * Math.PI) / 180;
    //   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    //   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    //   const a =
    //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //   return R * c;
    // };


    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) {
        console.error("Invalid coordinates:", { lat1, lon1, lat2, lon2 });
        return Infinity; // Prevent invalid calculations
      }
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