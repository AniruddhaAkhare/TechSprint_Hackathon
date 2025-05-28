import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const InstituteContext = createContext();

export function InstituteProvider({ children }) {
  const { user } = useAuth();
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  const fetchInstitutes = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(db, "instituteSetup"));
      const instituteData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((inst) => inst.ownerId === user.uid || inst.admins?.includes(user.uid));
      setInstitutes(instituteData);
      if (instituteData.length > 0 && !selectedInstitute) {
        setSelectedInstitute('RDJ9wMXGrIUk221MzDxP');
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [user]);

  return (
    <InstituteContext.Provider
      value={{ institutes, selectedInstitute, setSelectedInstitute }}
    >
      {children}
    </InstituteContext.Provider>
  );
}

export function useInstitute() {
  return useContext(InstituteContext);
}