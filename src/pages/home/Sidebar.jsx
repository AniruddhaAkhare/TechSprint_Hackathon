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
    home:false,
    analytics:false, 
    learners:false,
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
  const canViewQuestionBank = rolePermissions?.questions?.display || false;
  const canViewQuestionTemplate = rolePermissions?.templates?.display || false;
  const canViewInvoices = rolePermissions?.invoice?.display || false;
  const canViewFee = rolePermissions?.fee?.display || false;
  const canViewEnquiry = rolePermissions?.enquiries?.display || false;
  const canViewFinancePartners = rolePermissions?.FinancePartner?.display || false;
  const canViewactivityLogs = rolePermissions?.activityLogs?.display || false;
  const canViewLeaves = rolePermissions?.Leaves?.display || false;
  const canViewCompanies = rolePermissions?.Companies?.display || false;
  const canViewJobOpenings = rolePermissions?.JobOpenings?.display || false;
  const canViewEnquiryForms = rolePermissions?.enquiryForms?.display || false;
  const canViewHolidays = rolePermissions?.Holidays?.display || false;
  const canViewLearners = rolePermissions?.student?.display || false;



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "Users", currentUser.email);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              name: userData.displayname || "",
              // initials: `${userData.f_name?.charAt(0) || ""}${userData.l_name?.charAt(0) || ""}`.toUpperCase(),
            });
          } else {
            setUser({ name: "User"});
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data: " + err.message);
          setUser({name: "User"});
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
    <div className="sidebar fixed">
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
        <Link to="/my-profile">
          <li className="nav-item mt-3 mb-3">
            <FaTachometerAlt className="nav-icon" />
            <span>Home</span>
          </li>
        </Link>


        {/* <ul className="nav-list"> */}
        <Link to="/tasks">
          <li className="nav-item mt-3 mb-3">
            <FaTachometerAlt className="nav-icon" />
            <span>Tasks</span>
          </li>
        </Link>
        


        {/* <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("home")}>
          Home
          {accordionState.home ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li> */}
        {/* {accordionState.home &&
        <>
          
        </>
        } */}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("enquiry")}>
          Sales And Marketing
          {accordionState.enquiry ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.enquiry &&
        <>
        {canViewEnquiry && (
          <Link to="/enquiry" className="nav-link" >
            <li className="nav-item">
              <FaQuestionCircle className="nav-icon" />
              <span>Enquiry Management</span>
            </li>
          </Link>
        )}
        {canViewEnquiryForms && (
          <Link to="/addFormForEnquiry" className="nav-link" >
            <li className="nav-item">
              <FaQuestionCircle className="nav-icon" />
              <span>Enquiry Form</span>
            </li>
          </Link>
        )}

        </>
        }
        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("academic")}>
          Academics
          {accordionState.academic ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.academic &&(
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

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("learners")}>
          Learners
          {accordionState.learners ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.learners && (
          <>
            {canViewLearners && (
              <Link to="/studentdetails" className="nav-link">
                <li className="nav-item">
                  <FaMoneyBillAlt className="nav-icon" />
                  <span>Learners</span>
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
            {canViewCompanies && (
              <Link to="/companies" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>Companies</span>
                </li>
              </Link>
            )}
            {canViewJobOpenings && (
              <Link to="/job-openings" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>Job Openings</span>
                </li>
              </Link>
            )}
          </>
        )}

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("hr")}>
          Human Resource
          {accordionState.hr ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.hr && (
          <>
          {canViewInstructors && (
              <Link to="/instructor" className="nav-link">
                <li className="nav-item">
                  <FaUserGraduate className="nav-icon" />
                  <span>Staff Management</span>
                </li>
              </Link>
            )}
            {canViewUsers && (
              <Link to="/employee-attendance" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>CheckIn/CheckOut</span>
                </li>
              </Link>
            )}
            {canViewHolidays && (
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

        <li className="nav-section mt-3 mb-3 bg-white" onClick={() => toggleAccordion("analytics")}>
            Analytics          
          {accordionState.analytics ? <FaChevronUp className="accordion-icon" /> : <FaChevronDown className="accordion-icon" />}
        </li>
        {accordionState.analytics && (
          <>
            <Link to="/dashboard" className="nav-link" >
          <li className="nav-item">
            <FaQuestionCircle className="nav-icon" />
            <span>Organisational Dashboard</span>
          </li>
        </Link>
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
            {canViewUsers && (
              <Link to="/users" className="nav-link">
                <li className="nav-item">
                  <FaUsers className="nav-icon" />
                  <span>User Management</span>
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