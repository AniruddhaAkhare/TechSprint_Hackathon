import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [instituteLogo, setInstituteLogo] = useState("/img/fireblaze.jpg");
  const [logoError, setLogoError] = useState(null);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [accordionState, setAccordionState] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Permission Checks
  const canViewSection = (section) => rolePermissions?.[section]?.display || false;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "Users", currentUser.email);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setCurrentUser({
              name: userDocSnap.data().displayname || "",
            });
          } else {
            setCurrentUser({ name: "User" });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data: " + err.message);
          setCurrentUser({ name: "User" });
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
          if (instituteSnapshot.empty) {
            const trialStartDate = new Date();
            const trialEndDate = new Date(trialStartDate);
            trialEndDate.setDate(trialStartDate.getDate() + 7);
            await setDoc(doc(db, "instituteSetup", currentUser.uid), {
              instituteName: `${currentUser.email}'s Institute`,
              superAdminId: currentUser.uid,
              trialStartDate: trialStartDate.toISOString(),
              trialEndDate: trialEndDate.toISOString(),
              trialActive: true,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error("Error setting trial status:", err);
          setError("Failed to set trial status: " + err.message);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out: " + err.message);
    }
  };

  const handleImageError = (e) => {
    setLogoError("Failed to load logo image.");
    e.target.src = "https://placehold.co/100x100/A0B2C3/FFFFFF?text=Logo";
  };

  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderNavItem = (to, icon, label, condition = true) => {
    if (!condition) return null;
    return (
      <Link to={to} className="block">
        <li
          className={`flex items-center py-2 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md ${isCollapsed || isMobile ? "justify-center" : ""
            }`}
        >
          <i className={`${icon} text-base`}></i>
          {!isCollapsed && !isMobile && <span className="ml-3 text-sm">{label}</span>}
        </li>
      </Link>
    );
  };

  const renderSection = (title, sectionKey, children) => {
    if (!children.some((child) => child)) return null;

    return (
      <>
        <li
          className={`flex items-center justify-between py-3 px-4 my-1 bg-gray-100 rounded-md font-semibold text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors duration-200 ${isCollapsed || isMobile ? "justify-center" : ""
            }`}
          onClick={() => toggleAccordion(sectionKey)}
        >
          {!isCollapsed && !isMobile && <span>{title}</span>}
          <div className={`${isCollapsed || isMobile ? "hidden" : "block"}`}>
            {accordionState[sectionKey] ? (
              <i className="fas fa-chevron-up text-sm"></i>
            ) : (
              <i className="fas fa-chevron-down text-sm"></i>
            )}
          </div>
        </li>
        {accordionState[sectionKey] && (
          <div className={`${isCollapsed || isMobile ? "hidden" : "block"}`}>{children}</div>
        )}
      </>
    );
  };

  if (!user) return null;

  return (
    <div
      className={`fixed h-full bg-white transition-all duration-300 ease-in-out shadow-lg z-50 flex flex-col rounded-lg ${isCollapsed || isMobile ? "w-20" : "w-[20vw]"
        }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-200 ${isCollapsed || isMobile ? "px-2 py-4" : "px-4 py-4"
          }`}
      >
        {!isCollapsed && !isMobile && (
          <div className="flex items-center space-x-2">
            <img
              src={instituteLogo}
              alt="Institute Logo"
              className="w-8 h-8 rounded-full object-cover"
              onError={handleImageError}
              onLoad={() => setLogoError(null)}
            />
            <span className="text-xl font-semibold text-gray-800">Fireblaze</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        >
          {isCollapsed || isMobile ? (
            <i className="fas fa-bars text-xl"></i>
          ) : (
            <i className="fas fa-times text-xl"></i>
          )}
        </button>
      </div>

      {/* Error Messages */}
      {logoError && (
        <div className="text-red-500 text-xs p-2 text-center">{logoError}</div>
      )}
      {error && (
        <div className="text-red-500 text-sm p-2 text-center">{error}</div>
      )}

      {/* Navigation List */}
      <ul
        className="flex-grow overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For IE and Edge
        }}
      >
        {/* Hide scrollbar for WebKit browsers */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none; /* Hide scrollbar */
          }
        `}</style>

        {renderNavItem("/my-profile", "fa fa-home", "Home")}
        {renderSection("Sales And Marketing", "enquiry", [
          renderNavItem("/enquiry", "fa-solid fa-circle-question", "Enquiry Management", canViewSection("enquiries")),
          renderNavItem("/addFormForEnquiry", "fa-brands fa-wpforms", "Enquiry Form", canViewSection("enquiryForms")),
        ])}
        {renderSection("Academics", "academic", [
          renderNavItem("/courses", "fa-solid fa-book", "Course Management", canViewSection("Course")),
          renderNavItem("/curriculum", "fa-solid fa-clipboard-list", "Curriculum Management", canViewSection("curriculums")),
          renderNavItem("/batches", "fa-solid fa-calendar-week", "Batch Management", canViewSection("Batch")),
          renderNavItem("/sessions", "fa-solid fa-calendar", "Session Management", canViewSection("Sessions")),
          renderNavItem("/attendance", "fa-solid fa-clipboard-user", "Attendance Management", canViewSection("attendance")),
          renderNavItem("/assignment", "fa-solid fa-book", "Assignment Management", canViewSection("assignments")),
          renderNavItem("/question-bank", "fa-solid fa-book", "Question Bank", canViewSection("questions")),
          renderNavItem("/question-template", "fa-solid fa-file-lines", "Question Template", canViewSection("templates")),
          renderNavItem("/addPerformance", "fa-solid fa-chart-simple", "Performance Management", canViewSection("performance")),
        ])}
        {renderSection("Learners", "learners", [
          renderNavItem("/studentdetails", "fa-solid fa-user-graduate", "Learners", canViewSection("student")),
        ])}
        {renderSection("Finance", "finance", [
          renderNavItem("/reports", "fa-solid fa-money-bill", "Fee Management", canViewSection("fee")),
          renderNavItem("/invoices", "fa-solid fa-money-bill-trend-up", "Invoice Management", canViewSection("invoice")),
          renderNavItem("/financePartners", "fa-solid fa-money-check-dollar", "Finance Partner", canViewSection("FinancePartner")),
        ])}
        {renderSection("Placement Cell", "placement", [
          renderNavItem("/companies", "fa-solid fa-building", "Companies", canViewSection("Companies")),
          renderNavItem("/job-openings", "fa-solid fa-envelope-open", "Job Openings", canViewSection("JobOpenings")),
        ])}
        {renderSection("Human Resource", "hr", [
          renderNavItem("/operations-dashboard", "fa-solid fa-gears", "Operation"),
          renderNavItem("/operations", "fa-solid fa-database", "My Data"),
        ])}
        {renderSection("Analytics", "analytics", [
          renderNavItem("/dashboard", "fa-solid fa-table-columns", "Organisational Dashboard"),
          renderNavItem("/course-analytics-dashboard", "fa-solid fa-building-columns", "Course Dashboard", canViewSection("Course")),
          renderNavItem("/enquiry-analytics", "fa-solid fa-building-columns", "Enquiry Dashboard", canViewSection("enquiries")),
          renderNavItem("/attendance-dashboard", "fa-solid fa-building-columns", "Attendance Dashboard", canViewSection("attendance")),
          renderNavItem("/reports-dashboard", "fa-solid fa-building-columns", "Fees Dashboard", canViewSection("enrollments")),
        ])}
        {renderSection("Settings", "settings", [
          renderNavItem("/instituteSetup", "fa-solid fa-building-columns", "Institute Setup", canViewSection("instituteSetup")),
          renderNavItem("/roles", "fa-solid fa-user", "Roles Management", canViewSection("roles")),
          renderNavItem("/activity-logs", "fa-solid fa-history", "Activity Logs", canViewSection("activityLogs")),
        ])}
      </ul>

      {/* User Profile */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          {!isCollapsed || !isMobile ? 
            <div className="flex-grow">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          :" "}
          <button onClick={toggleMenu} className="focus:outline-none">
            {showMenu ? (
              <i className="fas fa-chevron-up"></i>
            ) : (
              <i className="fas fa-chevron-down"></i>
            )}
          </button>
        </div>
        {showMenu && (
          <div className="mt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;