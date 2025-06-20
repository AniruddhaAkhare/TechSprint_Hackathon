import React, { useState } from "react";
import { auth, db } from "../../../../config/firebase";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDocs, collection, doc, setDoc, getDoc } from "firebase/firestore";

export default function RecruiterLogin() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
  
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/recruiter/job-openings`, // ✅ Corrected path
        handleCodeInApp: true, // Must be true
      };
  
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("recruiterEmailForSignIn", email);
      setOtpSent(true);
      toast.success("Sign-in link sent to your email.");
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      toast.error("Failed to send sign-in link: " + error.message);
    }
  };
  
  const handleVerifyEmail = async () => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      toast.error("Invalid sign-in link.");
      return;
    }

    let storedEmail = localStorage.getItem("recruiterEmailForSignIn");
    if (!storedEmail) {
      storedEmail = prompt("Please provide your email for confirmation:");
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        storedEmail,
        window.location.href
      );

      // Validate email exists in Companies.pointsOfContact
      const companiesSnapshot = await getDocs(collection(db, "Companies"));
      let isPOC = false;

      companiesSnapshot.forEach((doc) => {
        const pocs = doc.data().pointsOfContact || [];
        const found = pocs.some(
          (poc) => poc.email.toLowerCase() === storedEmail.toLowerCase()
        );
        if (found) isPOC = true;
      });

      if (!isPOC) {
        await auth.signOut();
        toast.error("You are not authorized to access this page.");
        return;
      }

      // ✅ Optional: Create a minimal user document in Users collection
      const userDocRef = doc(db, "Users", result.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const defaultRole = "sTRunlCqsvQ8PJRyRuPg"; // Recruiter role ID

        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: storedEmail,
          displayName: storedEmail.split("@")[0],
          role: defaultRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      }

      localStorage.removeItem("recruiterEmailForSignIn");

      toast.success("Logged in successfully!");
      navigate("/job-openings");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed: " + error.message);
    }
  };
  React.useEffect(() => {
    // If user clicked the link and it's valid, verify automatically
    if (isSignInWithEmailLink(auth, window.location.href)) {
      handleVerifyEmail();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Recruiter Login
        </h2>
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Send Sign-in Link
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600">
            <p>Check your email for the sign-in link.</p>
          </div>
        )}
      </div>
    </div>
  );
}
