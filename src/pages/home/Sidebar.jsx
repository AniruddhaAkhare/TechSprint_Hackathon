import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaCalendarAlt,
  FaUsers,
  FaUserGraduate,
  FaQuestionCircle,
  FaMoneyBillAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "./UserProfile";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { user: authUser, rolePermissions } = useAuth();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [instituteLogo, setInstituteLogo] = useState("/img/fireblaze.jpg");
  const [logoError, setLogoError] = useState(null);
  const [trialStatus, setTrialStatus] = useState({ trialActive: false, daysRemaining: 0 });
  const [error, setError] = useState(null);
  const [accordionState, setAccordionState] = useState({
    enquiry: false,
    academic: false,
    finance: false,
    placement: false,
    users: false,
    settings: false,
    hr: false,
  });

  // Permission checks
  const canViewCourses = rolePermissions?.Course?.display || false;
  const canViewInstitute = rolePermissions?.instituteSetup?.display || false;
  const canViewCurriculum = rolePermissions?.curriculums?.display || false;
  const canViewBatches = rolePermissions?.Batch?.display || false;
  const canViewSessions = rolePermissions?.Sessions?.display || false;
  const canViewAttendance = rolePermissions?.attendance?.display || false;
  const canViewAssignments = rolePermissions?.assignments?.display || false;
  const canViewPerformance = rolePermissions?.performance?.display || false;
  const canViewUsers = rolePermissions?.Users?.display || false;
  const canViewStudents = rolePermissions?.student?.display || false;
  const canViewInstructors = rolePermissions?.Instructor?.display || false;
  const canViewRoles = rolePermissions?.roles?.display || false;
  const canViewFees = rolePermissions?.reports?.display || false;
  const canViewQuestionBank = rolePermissions?.questions?.display || false;
  const canViewQuestionTemplate = rolePermissions?.templates?.display || false;
  const canViewInvoices = rolePermissions?.invoice?.display || false;
  const canViewFee = rolePermissions?.fee?.display || false;
  const canViewEnquiry = rolePermissions?.enquiries?.display || false;
  const canViewFinancePartners = rolePermissions?.FinancePartner?.display || false;
  const canViewactivityLogs = rolePermissions?.activityLogs?.display || false;
  const canViewLeaves = rolePermissions?.Leaves?.display || false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "Instructor", currentUser.email);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              f_name: userData.f_name || "",
              l_name: userData.l_name || "",
              initials: `${userData.f_name?.charAt(0) || ""}${userData.l_name?.charAt(0) || ""}`.toUpperCase(),
            });
          } else {
            setUser({ f_name: "User", l_name: "", initials: "U" });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data: " + err.message);
          setUser({ f_name: "User", l_name: "", initials: "U" });
        }

        try {
          const querySnapshot = await getDocs(collection(db, "instituteSetup"));
          if (!querySnapshot.empty) {
            const instituteData = querySnapshot.docs[0].data();
            if (instituteData.logoUrl) setInstituteLogo(instituteData.logoUrl);
          }
        } catch (err) {
          console.error("Error fetching institute logo:", err);
          setLogoError("Failed to fetch institute logo.");
        }

        try {
          const instituteQuery = query(
            collection(db, "instituteSetup"),
            where("superAdminId", "==", currentUser.uid)
          );
          const instituteSnapshot = await getDocs(instituteQuery);

          if (!instituteSnapshot.empty) {
            const instituteData = instituteSnapshot.docs[0].data();
            const trialEndDate = new Date(instituteData.trialEndDate);
            const currentDate = new Date();

            if (isNaN(trialEndDate.getTime())) {
              setTrialStatus({ trialActive: false, daysRemaining: 0 });
              setError("Invalid trialEndDate format.");
              return;
            }

            const timeDiff = trialEndDate - currentDate;
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const isTrialActive = instituteData.trialActive && timeDiff > 0;

            setTrialStatus({
              trialActive: isTrialActive,
              daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            });

            if (!isTrialActive) {
              navigate("/subscribe");
            }
          } else {
            const trialStartDate = new Date();
            const trialEndDate = new Date(trialStartDate);
            trialEndDate.setDate(trialStartDate.getDate() + 7);

            const newInstituteData = {
              instituteName: `${currentUser.email}'s Institute`,
              superAdminId: currentUser.uid,
              trialStartDate: trialStartDate.toISOString(),
              trialEndDate: trialEndDate.toISOString(),
              trialActive: true,
              createdAt: new Date().toISOString(),
            };

            await setDoc(doc(db, "instituteSetup", currentUser.uid), newInstituteData);
            const timeDiff = trialEndDate - new Date();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            setTrialStatus({ trialActive: true, daysRemaining });
          }
        } catch (err) {
          console.error("Error fetching trial status:", err);
          setError("Failed to fetch trial status: " + err.message);
          setTrialStatus({ trialActive: false, daysRemaining: 0 });
        }
      } else {
        setUser(null);
        setTrialStatus({ trialActive: false, daysRemaining: 0 });
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate, authUser]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out: ", err);
    }
  };

  const handleImageError = (e) => {
    setLogoError("Failed to load logo image.");
    e.target.src = "/img/fireblaze.jpg";
  };

  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!authUser) return null;

  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src={instituteLogo}
          alt="Institute Logo"
          className="logo-icon"
          onError={handleImageError}
          onLoad={() => setLogoError(null)}
        />
        <span>Fireblaze</span>
        {logoError && <div style={{ color: "red", fontSize: "12px" }}>{logoError}</div>}
      </div>

      {error && (
        <div className="error-message" style={{ color: "red", padding: "10px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <ul className="nav-list">
        <Link to="/dashboard">
          <li className="nav-item mt-3 mb-3">
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </li>
        </Link>

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("enquiry")}>
          Sales And Marketing
          {accordionState.enquiry ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.enquiry && canViewEnquiry && (
          <Link to="/enquiry" className="nav-link" >
            <li className="nav-item">
              <FaQuestionCircle className="nav-icon" />
              <span>Enquiry Management</span>
            </li>
          </Link>
        )}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("academic")}>
          Academic
          {accordionState.academic ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.academic && (
          <>
            {canViewCourses && (
              <Link to="/courses" className="nav-link">
                <li className="nav-item">
                  <FaBook className="nav-icon" />
                  <span>Course Management</span>
                </li>
              </Link>
            )}
            {canViewCurriculum && (
              <Link to="/curriculum" className="nav-link">
                <li className="nav-item">
                  <FaClipboardList className="nav-icon" />
                  <span>Curriculum Management</span>
                </li>
              </Link>
            )}
            {canViewBatches && (
              <Link to="/batches" className="nav-link">
                <li className="nav-item">
                  <FaCalendarAlt className="nav-icon" />
                  <span>Batch Management</span>
                </li>
              </Link>
            )}
            {canViewSessions && (
              <Link to="/sessions" className="nav-link">
                <li className="nav-item">
                  <FaCalendarAlt className="nav-icon" />
                  <span>Session Management</span>
                </li>
              </Link>
            )}
            {canViewAttendance && (
              <Link to="/attendance" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-clipboard-user nav-icon"></i>
                  <span>Attendance Management</span>
                </li>
              </Link>
            )}
            {canViewAssignments && (
              <Link to="/assignment" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-book nav-icon"></i>
                  <span>Assignment Management</span>
                </li>
              </Link>
            )}
            {canViewQuestionBank && (
              <Link to="/question-bank" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-book nav-icon"></i>
                  <span>Question Bank</span>
                </li>
              </Link>
            )}
            {canViewQuestionTemplate && (
              <Link to="/question-template" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-file-lines nav-icon"></i>
                  <span>Question Template</span>
                </li>
              </Link>
            )}
            {canViewPerformance && (
              <Link to="/addPerformance" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-chart-simple nav-icon"></i>
                  <span>Performance Management</span>
                </li>
              </Link>
            )}
          </>
        )}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("finance")}>
          Finance
          {accordionState.finance ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.finance && (
          <>
            {canViewFee && (
              <Link to="/reports" className="nav-link">
                <li className="nav-item">
                  <FaMoneyBillAlt className="nav-icon" />
                  <span>Fee Management</span>
                </li>
              </Link>
            )}
            {canViewInvoices && (
              <Link to="/invoices" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
                  <span>Invoice Management</span>
                </li>
              </Link>
            )}
            {canViewFinancePartners && (
              <Link to="/financePartners" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-money-check-dollar nav-icon"></i>
                  <span>Finance Partner</span>
                </li>
              </Link>
            )}
          </>
        )}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("placement")}>
          Placement Cell
          {accordionState.placement ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.placement && (
          <>
            {/* Add placement cell items here if needed */}
          </>
        )}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("hr")}>
          Human Resource
          {accordionState.hr ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.hr && (
          <>
            {canViewUsers && (
              <Link to="/employee-attendance" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>CheckIn/CheckOut</span>
                </li>
              </Link>
            )}
            {canViewUsers && (
              <Link to="/holiday-calendar" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>Holiday Calendar</span>
                </li>
              </Link>
            )}
            {canViewLeaves && (
              <Link to="/leave-management" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>Leave Management</span>
                </li>
              </Link>
            )}
          </>
        )}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("users")}>
          Users
          {accordionState.users ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.users && (
          <>
            {canViewUsers && (
              <Link to="/users" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>User Management</span>
                </li>
              </Link>
            )}
            {canViewStudents && (
              <Link to="/studentdetails" className="nav-link">
                <li className="nav-item">
                  <FaUserGraduate className="nav-icon" />
                  <span>Learner Management</span>
                </li>
              </Link>
            )}
            {canViewInstructors && (
              <Link to="/instructor" className="nav-link">
                <li className="nav-item">
                  <FaUserGraduate className="nav-icon" />
                  <span>Staff Management</span>
                </li>
              </Link>
            )}
            {canViewRoles && (
              <Link to="/roles" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-user nav-icon"></i>
                  <span>Roles Management</span>
                </li>
              </Link>
            )}
          </>
        )}

        <li className="nav-section bg-white" onClick={() => toggleAccordion("settings")}>
          Settings
          {accordionState.settings ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.settings && (
          <>
            {canViewInstitute && (
              <Link to="/instituteSetup" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-building-columns nav-icon"></i>
                  <span>Institute Setup</span>
                </li>
              </Link>
            )}
            {canViewactivityLogs && (
              <Link to="/activity-logs" className="nav-link">
                <li className="nav-item">
                  <i className="fa-solid fa-history nav-icon"></i>
                  <span>Activity Logs</span>
                </li>
              </Link>
            )}
          </>
        )}

        {trialStatus.trialActive && (
          <div className="trial-banner">
            <span>Trial expires in {trialStatus.daysRemaining} days</span>
            <Link to="/subscribe" className="choose-plan-link">
              Choose a plan
            </Link>
          </div>
        )}
      </ul>

      <UserProfile
        user={user}
        authUser={authUser}
        handleLogout={handleLogout}
        toggleMenu={toggleMenu}
        showMenu={showMenu}
      />
    </div>
  );
};

export default Sidebar;
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Sidebar.css';
// import { FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, collection, getDocs, query, where, setDoc } from 'firebase/firestore';
// import { useAuth } from '../../context/AuthContext';
// const Sidebar = () => {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const db = getFirestore();
//   const { user: authUser, rolePermissions } = useAuth(); // From AuthContext
//   const [user, setUser] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [instituteLogo, setInstituteLogo] = useState('/img/fireblaze.jpg'); // Default logo
//   const [logoError, setLogoError] = useState(null);
//   const [trialStatus, setTrialStatus] = useState({ trialActive: false, daysRemaining: 0 });
//   const [error, setError] = useState(null);

//   // Permission checks from the first Sidebar
//   const canViewCourses = rolePermissions?.Course?.display || false;
//   const canViewInstitute = rolePermissions?.instituteSetup?.display || false;
//   const canViewCurriculum = rolePermissions?.curriculums?.display || false;
//   const canViewBatches = rolePermissions?.Batch?.display || false;
//   const canViewSessions = rolePermissions?.Sessions?.display || false;
//   const canViewAttendance = rolePermissions?.attendance?.display || false;
//   const canViewAssignments = rolePermissions?.assignments?.display || false;
//   const canViewPerformance = rolePermissions?.performance?.display || false;
//   const canViewUsers = rolePermissions?.Users?.display || false;
//   const canViewStudents = rolePermissions?.student?.display || false;
//   const canViewInstructors = rolePermissions?.Instructor?.display || false;
//   const canViewRoles = rolePermissions?.roles?.display || false;
//   const canViewFees = rolePermissions?.reports?.display || false;
//   const canViewQuestionBank = rolePermissions?.questions?.display || false;
//   const canViewQuestionTemplate = rolePermissions?.templates?.display || false;
//   const canViewInvoices = rolePermissions?.invoice?.display || false;
//   const canViewFee = rolePermissions?.fee?.display || false;
//   const canViewEnquiry = rolePermissions?.enquiries?.display || false;
//   const canViewFinancePartners = rolePermissions?.FinancePartner?.display || false;
//   const canViewactivityLogs = rolePermissions?.activityLogs?.display || false;

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         // Fetch user data from "Instructor" collection
//         try {
//           const userDocRef = doc(db, "Instructor", currentUser.email);
//           const userDocSnap = await getDoc(userDocRef);
//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             setUser({
//               f_name: userData.f_name || '',
//               l_name: userData.l_name || '',
//               initials: `${userData.f_name?.charAt(0) || ''}${userData.l_name?.charAt(0) || ''}`.toUpperCase(),
//             });
//           } else {
//             setUser({ f_name: "User", l_name: "", initials: "U" });
//           }
//         } catch (err) {
//           console.error("Error fetching user data:", err);
//           setError("Failed to fetch user data: " + err.message);
//           setUser({ f_name: "User", l_name: "", initials: "U" });
//         }

//         // Fetch institute logo
//         try {
//           const querySnapshot = await getDocs(collection(db, "instituteSetup"));
//           if (!querySnapshot.empty) {
//             const instituteData = querySnapshot.docs[0].data();
//             if (instituteData.logoUrl) setInstituteLogo(instituteData.logoUrl);
//           }
//         } catch (err) {
//           console.error("Error fetching institute logo:", err);
//           setLogoError("Failed to fetch institute logo.");
//         }

//         // Fetch trial status
//         try {
//           const instituteQuery = query(
//             collection(db, "instituteSetup"),
//             where("superAdminId", "==", currentUser.uid)
//           );
//           const instituteSnapshot = await getDocs(instituteQuery);

//           if (!instituteSnapshot.empty) {
//             const instituteData = instituteSnapshot.docs[0].data();
//             const trialEndDate = new Date(instituteData.trialEndDate);
//             //  trialEndDate.setHours(23, 59, 59, 999); 
//             const currentDate = new Date();

//             console.log("Parsed trialEndDate:", trialEndDate.toISOString());
//             console.log("Current date:", currentDate.toISOString());

//             if (isNaN(trialEndDate.getTime())) {
//               setTrialStatus({ trialActive: false, daysRemaining: 0 });
//               setError("Invalid trialEndDate format.");
//               return;
//             }

//             const timeDiff = trialEndDate - currentDate;
//             const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//             const isTrialActive = instituteData.trialActive && timeDiff > 0;
//             console.log("Time difference in ms:", timeDiff);
//             console.log("Days remaining:", daysRemaining);


//             setTrialStatus({
//               trialActive: isTrialActive,
//               daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
//             });

//             if (!isTrialActive) {
//               console.log("Trail ends")
//               navigate("/subscribe");
//             }
//           } else {
//             // Create new instituteSetup document with 7-day trial
//             const trialStartDate = new Date();
//             const trialEndDate = new Date(trialStartDate);
//             trialEndDate.setDate(trialStartDate.getDate() + 7);

//             const newInstituteData = {
//               instituteName: `${currentUser.email}'s Institute`,
//               superAdminId: currentUser.uid,
//               trialStartDate: trialStartDate.toISOString(),
//               trialEndDate: trialEndDate.toISOString(),
//               trialActive: true,
//               createdAt: new Date().toISOString(),
//             };

//             await setDoc(doc(db, "instituteSetup", currentUser.uid), newInstituteData);
//             const timeDiff = trialEndDate - new Date();
//             const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//             setTrialStatus({ trialActive: true, daysRemaining });
//           }
//         } catch (err) {
//           console.error("Error fetching trial status:", err);
//           setError("Failed to fetch trial status: " + err.message);
//           setTrialStatus({ trialActive: false, daysRemaining: 0 });
//         }
//       } else {
//         setUser(null);
//         setTrialStatus({ trialActive: false, daysRemaining: 0 });
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, db, navigate, authUser]);

//   const toggleMenu = () => setShowMenu(!showMenu);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setShowMenu(false);
//       navigate('/login');
//     } catch (err) {
//       console.error('Error logging out: ', err);
//     }
//   };

//   const handleImageError = (e) => {
//     setLogoError("Failed to load logo image.");
//     e.target.src = '/img/fireblaze.jpg';
//   };

//   if (!authUser) return null;

//   return (
//     <div className="sidebar">
//       <div className="logo">
//         <img
//           src={instituteLogo}
//           alt="Institute Logo"
//           className="logo-icon"
//           onError={handleImageError}
//           onLoad={() => setLogoError(null)}
//         />
//         <span>Fireblaze</span>
//         {logoError && <div style={{ color: 'red', fontSize: '12px' }}>{logoError}</div>}
//       </div>

//       {error && (
//         <div className="error-message" style={{ color: 'red', padding: '10px', fontSize: '14px' }}>
//           {error}
//         </div>
//       )}

//       <ul className="nav-list">
//         <Link to="/dashboard">
//           <li className="nav-item">
//             <FaTachometerAlt className="nav-icon" />
//             <span>Dashboard</span>
//           </li>
//         </Link>


//         <li className="nav-section">Enquiry Management</li>
//         {canViewEnquiry && (
//           <Link to="/enquiry" className="nav-link">
//             <li className="nav-item">
//               <FaQuestionCircle className="nav-icon" />
//               <span>Enquiry Management</span>
//             </li>
//           </Link>
//         )}
//         <li className="nav-section">Academic</li>
//         {canViewCourses && (
//           <Link to="/courses" className="nav-link">
//             <li className="nav-item">
//               <FaBook className="nav-icon" />
//               <span>Course Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewCurriculum && (
//           <Link to="/curriculum" className="nav-link">
//             <li className="nav-item">
//               <FaClipboardList className="nav-icon" />
//               <span>Curriculum Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewBatches && (
//           <Link to="/batches" className="nav-link">
//             <li className="nav-item">
//               <FaCalendarAlt className="nav-icon" />
//               <span>Batch Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewSessions && (
//           <Link to="/sessions" className="nav-link">
//             <li className="nav-item">
//               <FaCalendarAlt className="nav-icon" />
//               <span>Session Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewAttendance && (
//           <Link to="/attendance" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-clipboard-user nav-icon"></i>
//               <span>Attendance Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewAssignments && (
//           <Link to="/assignment" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-book nav-icon"></i>
//               <span>Assignment Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewQuestionBank && (
//           <Link to="/question-bank" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-book nav-icon"></i>
//               <span>Question Bank</span>
//             </li>
//           </Link>
//         )}
//         {canViewQuestionTemplate && (
//           <Link to="/question-template" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-file-lines nav-icon"></i>
//               <span>Question Template</span>
//             </li>
//           </Link>
//         )}
//         {canViewPerformance && (
//           <Link to="/addPerformance" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-chart-simple nav-icon"></i>
//               <span>Performance Management</span>
//             </li>
//           </Link>
//         )}

//         <li className="nav-section">Finance</li>
//         {canViewFee && (
//           <Link to="/reports" className="nav-link">
//             <li className="nav-item">
//               <FaMoneyBillAlt className="nav-icon" />
//               <span>Fee Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewInvoices && (
//           <Link to="/invoices" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
//               <span>Invoice Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewFinancePartners && (
//           <Link to="/financePartners" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-money-check-dollar nav-icon"></i>
//               <span>Finance Partner</span>
//             </li>
//           </Link>
//         )}

//         <li className="nav-section">Placement Cell</li>

//         <li className="nav-section">Users</li>
//         {canViewUsers && (
//           <Link to="/users" className="nav-link">
//             <li className="nav-item">
//               <FaUsers className="nav-icon" />
//               <span>User Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewStudents && (
//           <Link to="/studentdetails" className="nav-link">
//             <li className="nav-item">
//               <FaUserGraduate className="nav-icon" />
//               <span>Learner Management</span>
//             </li>
//           </Link>
//         )}

//         {canViewInstructors && (
//           <Link to="/instructor" className="nav-link">
//             <li className="nav-item">
//               <FaUserGraduate className="nav-icon" />
//               <span>Staff Management</span>
//             </li>
//           </Link>
//         )}
//         {canViewRoles && (
//           <Link to="/roles" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-user nav-icon"></i>
//               <span>Roles Management</span>
//             </li>
//           </Link>
//         )}


//         <li className="nav-section">Settings</li>
//         {canViewInstitute && (
//           <Link to="/instituteSetup" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-building-columns nav-icon"></i>
//               <span>Institute Setup</span>
//             </li>
//           </Link>
//         )}
//         {canViewactivityLogs && (
//           <Link to="/activity-logs" className="nav-link">
//             <li className="nav-item">
//               <i className="fa-solid fa-history nav-icon"></i>
//               <span>Activity Logs</span>
//             </li>
//           </Link>
//         )}

//         {/* Trial Banner */}
//         {trialStatus.trialActive && (
//           <div className="trial-banner">
//             <span>Trial expires in {trialStatus.daysRemaining} days</span>
//             <Link to="/subscribe" className="choose-plan-link">
//               Choose a plan
//             </Link>
//           </div>
//         )}

//         <div className="admin-profile" onClick={toggleMenu}>
//           <FaUser className="nav-icon" />
//           <span>{user ? `${user.f_name} ${user.l_name}` : authUser?.displayName || "Admin Profile"}</span>
//           <span className="admin-initials">{user ? user.initials : authUser?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || "AD"}</span>
//           <FaEllipsisV className="menu-icon" />
//           <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
//             <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
//               Settings
//             </Link>
//             <div className="dropdown-item" onClick={handleLogout}>
//               Logout
//             </div>
//           </div>
//         </div>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;



// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Sidebar.css';
// import {
//   FaTachometerAlt,
//   FaBook,
//   FaClipboardList,
//   FaCalendarAlt,
//   FaUsers,
//   FaUserGraduate,
//   FaQuestionCircle,
//   FaMoneyBillAlt,
//   FaUser,
//   FaEllipsisV,
//   FaBars,
// } from 'react-icons/fa';
// import {
//   Accordion,
//   AccordionHeader,
//   AccordionBody,
//   List,
//   ListItem,
//   ListItemPrefix,
//   Typography,
// } from '@material-tailwind/react';
// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, collection, getDocs, query, where, setDoc } from 'firebase/firestore';
// import { useAuth } from '../../context/AuthContext';
// import { ChevronDownIcon } from '@heroicons/react/24/solid';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const db = getFirestore();
//   const { user: authUser, rolePermissions } = useAuth();
//   const [user, setUser] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [instituteLogo, setInstituteLogo] = useState('/img/fireblaze.jpg');
//   const [logoError, setLogoError] = useState(null);
//   const [trialStatus, setTrialStatus] = useState({ trialActive: false, daysRemaining: 0 });
//   const [error, setError] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
//   const [openAccordions, setOpenAccordions] = useState({
//     enquiry: false,
//     academic: false,
//     finance: false,
//     placement: false,
//     users: false,
//     settings: false,
//   });

//   // Permission checks
//   const canViewCourses = rolePermissions?.Course?.display || false;
//   const canViewInstitute = rolePermissions?.instituteSetup?.display || false;
//   const canViewCurriculum = rolePermissions?.curriculums?.display || false;
//   const canViewBatches = rolePermissions?.Batch?.display || false;
//   const canViewSessions = rolePermissions?.Sessions?.display || false;
//   const canViewAttendance = rolePermissions?.attendance?.display || false;
//   const canViewAssignments = rolePermissions?.assignments?.display || false;
//   const canViewPerformance = rolePermissions?.performance?.display || false;
//   const canViewUsers = rolePermissions?.Users?.display || false;
//   const canViewStudents = rolePermissions?.student?.display || false;
//   const canViewInstructors = rolePermissions?.Instructor?.display || false;
//   const canViewRoles = rolePermissions?.roles?.display || false;
//   const canViewFees = rolePermissions?.reports?.display || false;
//   const canViewQuestionBank = rolePermissions?.questions?.display || false;
//   const canViewQuestionTemplate = rolePermissions?.templates?.display || false;
//   const canViewInvoices = rolePermissions?.invoice?.display || false;
//   const canViewFee = rolePermissions?.fee?.display || false;
//   const canViewEnquiry = rolePermissions?.enquiries?.display || false;
//   const canViewFinancePartners = rolePermissions?.FinancePartner?.display || false;
//   const canViewActivityLogs = rolePermissions?.activityLogs?.display || false;

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         try {
//           const userDocRef = doc(db, "Instructor", currentUser.email);
//           const userDocSnap = await getDoc(userDocRef);
//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             setUser({
//               f_name: userData.f_name || '',
//               l_name: userData.l_name || '',
//               initials: `${userData.f_name?.charAt(0) || ''}${userData.l_name?.charAt(0) || ''}`.toUpperCase(),
//             });
//           } else {
//             setUser({ f_name: "User", l_name: "", initials: "U" });
//           }
//         } catch (err) {
//           console.error("Error fetching user data:", err);
//           setError("Failed to fetch user data: " + err.message);
//           setUser({ f_name: "User", l_name: "", initials: "U" });
//         }

//         try {
//           const querySnapshot = await getDocs(collection(db, "instituteSetup"));
//           if (!querySnapshot.empty) {
//             const instituteData = querySnapshot.docs[0].data();
//             if (instituteData.logoUrl) setInstituteLogo(instituteData.logoUrl);
//           }
//         } catch (err) {
//           console.error("Error fetching institute logo:", err);
//           setLogoError("Failed to fetch institute logo.");
//         }

//         try {
//           const instituteQuery = query(
//             collection(db, "instituteSetup"),
//             where("superAdminId", "==", currentUser.uid)
//           );
//           const instituteSnapshot = await getDocs(instituteQuery);

//           if (!instituteSnapshot.empty) {
//             const instituteData = instituteSnapshot.docs[0].data();
//             const trialEndDate = new Date(instituteData.trialEndDate);
//             const currentDate = new Date();

//             if (isNaN(trialEndDate.getTime())) {
//               setTrialStatus({ trialActive: false, daysRemaining: 0 });
//               setError("Invalid trialEndDate format.");
//               return;
//             }

//             const timeDiff = trialEndDate - currentDate;
//             const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//             const isTrialActive = instituteData.trialActive && timeDiff > 0;

//             setTrialStatus({
//               trialActive: isTrialActive,
//               daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
//             });

//             if (!isTrialActive) {
//               navigate("/subscribe");
//             }
//           } else {
//             const trialStartDate = new Date();
//             const trialEndDate = new Date(trialStartDate);
//             trialEndDate.setDate(trialStartDate.getDate() + 7);

//             const newInstituteData = {
//               instituteName: `${currentUser.email}'s Institute`,
//               superAdminId: currentUser.uid,
//               trialStartDate: trialStartDate.toISOString(),
//               trialEndDate: trialEndDate.toISOString(),
//               trialActive: true,
//               createdAt: new Date().toISOString(),
//             };

//             await setDoc(doc(db, "instituteSetup", currentUser.uid), newInstituteData);
//             const timeDiff = trialEndDate - new Date();
//             const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//             setTrialStatus({ trialActive: true, daysRemaining });
//           }
//         } catch (err) {
//           console.error("Error fetching trial status:", err);
//           setError("Failed to fetch trial status: " + err.message);
//           setTrialStatus({ trialActive: false, daysRemaining: 0 });
//         }
//       } else {
//         setUser(null);
//         setTrialStatus({ trialActive: false, daysRemaining: 0 });
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, db, navigate, authUser]);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const handleAccordionToggle = (section) => {
//     setOpenAccordions((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const toggleMenu = () => setShowMenu(!showMenu);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setShowMenu(false);
//       setIsSidebarOpen(false);
//       navigate('/login');
//     } catch (err) {
//       console.error('Error logging out: ', err);
//     }
//   };

//   const handleImageError = (e) => {
//     setLogoError("Failed to load logo image.");
//     e.target.src = '/img/fireblaze.jpg';
//   };

//   if (!authUser) return null;

//   return (
//     <>
//       {/* Hamburger Button (Visible on mobile) */}
//       <button
//         className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white text-gray-900 rounded-md shadow-md border border-gray-300"
//         onClick={toggleSidebar}
//         aria-label="Toggle sidebar"
//       >
//         <FaBars className="h-6 w-6" />
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-900 p-4 shadow-md overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 md:w-64`}
//       >
//         <div className="logo mb-4 flex items-center">
//           <img
//             src={instituteLogo}
//             alt="Institute Logo"
//             className="logo-icon h-10 w-10 rounded-full object-cover"
//             onError={handleImageError}
//             onLoad={() => setLogoError(null)}
//           />
//           <span className="ml-2 text-xl font-semibold text-gray-900">Fireblaze</span>
//           {logoError && <div className="text-red-600 text-xs ml-2">{logoError}</div>}
//         </div>

//         {error && (
//           <div className="error-message text-red-600 text-sm p-2">
//             {error}
//           </div>
//         )}

//         <List>
//           {/* Dashboard */}
//           <ListItem onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }}>
//             <ListItemPrefix>
//               <FaTachometerAlt className="h-5 w-5 text-gray-700" />
//             </ListItemPrefix>
//             Dashboard
//           </ListItem>

//           {/* Enquiry Management */}
//           <Accordion open={openAccordions.enquiry}>
//             <ListItem className="p-0" selected={openAccordions.enquiry}>
//               <AccordionHeader
//                 onClick={() => handleAccordionToggle('enquiry')}
//                 className="border-b-0 p-3 text-gray-900"
//               >
//                 <Typography className="mr-auto font-normal">Enquiry Management</Typography>
//                 <ChevronDownIcon
//                   className={`h-5 w-5 transition-transform text-gray-700 ${openAccordions.enquiry ? 'rotate-180' : ''}`}
//                 />
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0 text-gray-900">
//                 {canViewEnquiry && (
//                   <ListItem onClick={() => { navigate('/enquiry'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaQuestionCircle className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Enquiry Management
//                   </ListItem>
//                 )}
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Academic */}
//           <Accordion open={openAccordions.academic}>
//             <ListItem className="p-0" selected={openAccordions.academic}>
//               <AccordionHeader
//                 onClick={() => handleAccordionToggle('academic')}
//                 className="border-b-0 p-3 text-gray-900"
//               >
//                 <Typography className="mr-auto font-normal">Academic</Typography>
//                 <ChevronDownIcon
//                   className={`h-5 w-5 transition-transform text-gray-700 ${openAccordions.academic ? 'rotate-180' : ''}`}
//                 />
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0 text-gray-900">
//                 {canViewCourses && (
//                   <ListItem onClick={() => { navigate('/courses'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaBook className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Course Management
//                   </ListItem>
//                 )}
//                 {canViewCurriculum && (
//                   <ListItem onClick={() => { navigate('/curriculum'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaClipboardList className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Curriculum Management
//                   </ListItem>
//                 )}
//                 {canViewBatches && (
//                   <ListItem onClick={() => { navigate('/batches'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaCalendarAlt className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Batch Management
//                   </ListItem>
//                 )}
//                 {canViewSessions && (
//                   <ListItem onClick={() => { navigate('/sessions'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaCalendarAlt className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Session Management
//                   </ListItem>
//                 )}
//                 {canViewAttendance && (
//                   <ListItem onClick={() => { navigate('/attendance'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-clipboard-user h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Attendance Management
//                   </ListItem>
//                 )}
//                 {canViewAssignments && (
//                   <ListItem onClick={() => { navigate('/assignment'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-book h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Assignment Management
//                   </ListItem>
//                 )}
//                 {canViewQuestionBank && (
//                   <ListItem onClick={() => { navigate('/question-bank'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-book h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Question Bank
//                   </ListItem>
//                 )}
//                 {canViewQuestionTemplate && (
//                   <ListItem onClick={() => { navigate('/question-template'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-file-lines h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Question Template
//                   </ListItem>
//                 )}
//                 {canViewPerformance && (
//                   <ListItem onClick={() => { navigate('/addPerformance'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-chart-simple h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Performance Management
//                   </ListItem>
//                 )}
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Finance */}
//           <Accordion open={openAccordions.finance}>
//             <ListItem className="p-0" selected={openAccordions.finance}>
//               <AccordionHeader
//                 onClick={() => handleAccordionToggle('finance')}
//                 className="border-b-0 p-3 text-gray-900"
//               >
//                 <Typography className="mr-auto font-normal">Finance</Typography>
//                 <ChevronDownIcon
//                   className={`h-5 w-5 transition-transform text-gray-700 ${openAccordions.finance ? 'rotate-180' : ''}`}
//                 />
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0 text-gray-900">
//                 {canViewFee && (
//                   <ListItem onClick={() => { navigate('/reports'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaMoneyBillAlt className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Fee Management
//                   </ListItem>
//                 )}
//                 {canViewInvoices && (
//                   <ListItem onClick={() => { navigate('/invoices'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-money-bill-trend-up h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Invoice Management
//                   </ListItem>
//                 )}
//                 {canViewFinancePartners && (
//                   <ListItem onClick={() => { navigate('/financePartners'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-money-check-dollar h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Finance Partner
//                   </ListItem>
//                 )}
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Placement Cell */}
//           <Accordion open={openAccordions.placement}>
//             <ListItem className="p-0" selected={openAccordions.placement}>
//               <AccordionHeader
//                 onClick={() => handleAccordionToggle('placement')}
//                 className="border-b-0 p-3 text-gray-900"
//               >
//                 <Typography className="mr-auto font-normal">Placement Cell</Typography>
//                 <ChevronDownIcon
//                   className={`h-5 w-5 transition-transform text-gray-700 ${openAccordions.placement ? 'rotate-180' : ''}`}
//                 />
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0 text-gray-900">
//                 {/* Add placement-related links here if applicable */}
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Users */}
//           <Accordion open={openAccordions.users}>
//             <ListItem className="p-0" selected={openAccordions.users}>
//               <AccordionHeader
//                 onClick={() => handleAccordionToggle('users')}
//                 className="border-b-0 p-3 text-gray-900"
//               >
//                 <Typography className="mr-auto font-normal">Users</Typography>
//                 <ChevronDownIcon
//                   className={`h-5 w-5 transition-transform text-gray-700 ${openAccordions.users ? 'rotate-180' : ''}`}
//                 />
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0 text-gray-900">
//                 {canViewUsers && (
//                   <ListItem onClick={() => { navigate('/users'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaUsers className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     User Management
//                   </ListItem>
//                 )}
//                 {canViewStudents && (
//                   <ListItem onClick={() => { navigate('/studentdetails'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaUserGraduate className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Learner Management
//                   </ListItem>
//                 )}
//                 {canViewInstructors && (
//                   <ListItem onClick={() => { navigate('/instructor'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <FaUserGraduate className="h-5 w-5 text-gray-700" />
//                     </ListItemPrefix>
//                     Staff Management
//                   </ListItem>
//                 )}
//                 {canViewRoles && (
//                   <ListItem onClick={() => { navigate('/roles'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-user h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Roles Management
//                   </ListItem>
//                 )}
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Settings */}
//           <Accordion open={openAccordions.settings}>
//             <ListItem className="p-0" selected={openAccordions.settings}>
//               <AccordionHeader
//                 onClick={() => handleAccordionToggle('settings')}
//                 className="border-b-0 p-3 text-gray-900"
//               >
//                 <Typography className="mr-auto font-normal">Settings</Typography>
//                 <ChevronDownIcon
//                   className={`h-5 w-5 transition-transform text-gray-700 ${openAccordions.settings ? 'rotate-180' : ''}`}
//                 />
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0 text-gray-900">
//                 {canViewInstitute && (
//                   <ListItem onClick={() => { navigate('/instituteSetup'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-building-columns h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Institute Setup
//                   </ListItem>
//                 )}
//                 {canViewActivityLogs && (
//                   <ListItem onClick={() => { navigate('/activity-logs'); setIsSidebarOpen(false); }}>
//                     <ListItemPrefix>
//                       <i className="fa-solid fa-history h-5 w-5 text-gray-700"></i>
//                     </ListItemPrefix>
//                     Activity Logs
//                   </ListItem>
//                 )}
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Trial Banner */}
//           {trialStatus.trialActive && (
//             <div className="trial-banner my-4 p-2 bg-blue-100 text-blue-900 rounded">
//               <span className="text-sm">Trial expires in {trialStatus.daysRemaining} days</span>
//               <Link
//                 to="/subscribe"
//                 className="choose-plan-link text-sm underline ml-2 text-blue-700"
//                 onClick={() => setIsSidebarOpen(false)}
//               >
//                 Choose a plan
//               </Link>
//             </div>
//           )}

//           {/* Admin Profile */}
//           <div className="admin-profile mt-4 p-2 bg-gray-100 rounded-lg flex items-center" onClick={toggleMenu}>
//             <FaUser className="nav-icon h-5 w-5 text-gray-700" />
//             <span className="ml-2 text-gray-900">
//               {user ? `${user.f_name} ${user.l_name}` : authUser?.displayName || "Admin Profile"}
//             </span>
//             <span className="admin-initials ml-auto bg-blue-500 text-white">
//               {user ? user.initials : authUser?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || "AD"}
//             </span>
//             <FaEllipsisV className="menu-icon h-5 w-5 ml-2 text-gray-700" />
//             <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
//               <Link
//                 to="/settings"
//                 className="dropdown-item nav-link text-gray-900"
//                 onClick={() => { setShowMenu(false); setIsSidebarOpen(false); }}
//               >
//                 Settings
//               </Link>
//               <div
//                 className="dropdown-item text-gray-900"
//                 onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
//               >
//                 Logout
//               </div>
//             </div>
//           </div>
//         </List>
//       </div>

//       {/* Overlay for mobile when sidebar is open */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={toggleSidebar}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;




