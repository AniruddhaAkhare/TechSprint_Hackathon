import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaGraduationCap, FaTachometerAlt, FaBook, FaClipboardList, FaCalendarAlt, FaUsers, FaUserGraduate, FaQuestionCircle, FaMoneyBillAlt, FaUser, FaEllipsisV } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, where, setDoc } from 'firebase/firestore';

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  
  const [showMenu, setShowMenu] = useState(false);
  const [trialStatus, setTrialStatus] = useState({ trialActive: false, daysRemaining: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        console.log("Authenticated user:", authUser.email, "UID:", authUser.uid);

        // Fetch user data from the "Instructor" collection
        try {
          const userDocRef = doc(db, "Instructor", authUser.email);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("Fetched user data:", userData);
            setUser({
              f_name: userData.f_name || '',
              l_name: userData.l_name || '',
              initials: `${userData.f_name?.charAt(0) || ''}${userData.l_name?.charAt(0) || ''}`.toUpperCase(),
            });
          } else {
            console.log("No user document found in Firestore for email:", authUser.email);
            setUser({ f_name: "User", l_name: "", initials: "U" });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data: " + error.message);
          setUser({ f_name: "User", l_name: "", initials: "U" });
        }

        // Fetch trial status from the "instituteSetup" collection
        try {
          const instituteQuery = query(
            collection(db, "instituteSetup"),
            where("superAdminId", "==", authUser.uid)
          );
          const instituteSnapshot = await getDocs(instituteQuery);

          if (!instituteSnapshot.empty) {
            const instituteData = instituteSnapshot.docs[0].data();
            console.log("Fetched institute data:", instituteData);

            // Ensure trialEndDate exists and is in a valid format
            if (!instituteData.trialEndDate) {
              console.error("trialEndDate is missing in institute data.");
              setTrialStatus({ trialActive: false, daysRemaining: 0 });
              setError("trialEndDate is missing in institute data.");
              // navigate("/subscribe");
              return;
            }

            const trialEndDate = new Date(instituteData.trialEndDate);
            const currentDate = new Date();
            console.log("Current Date:", currentDate.toISOString());
            console.log("Trial End Date:", trialEndDate.toISOString());

            if (isNaN(trialEndDate.getTime())) {
              console.error("Invalid trialEndDate format:", instituteData.trialEndDate);
              setTrialStatus({ trialActive: false, daysRemaining: 0 });
              setError("Invalid trialEndDate format: " + instituteData.trialEndDate);
              // navigate("/subscribe");
              return;
            }

            const timeDiff = trialEndDate - currentDate;
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            console.log("Days remaining:", daysRemaining);

            const isTrialActive = instituteData.trialActive && daysRemaining > 0;
            console.log("Is trial active?", isTrialActive);

            setTrialStatus({
              trialActive: isTrialActive,
              daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            });

            // Redirect to subscription page if trial is expired
            if (!isTrialActive) {
              console.log("Trial is not active or has expired. Redirecting to /subscribe.");
              // navigate("/subscribe");
            }
          } else {
            console.warn("No institute data found for this user with UID:", authUser.uid);
            // Create a new instituteSetup document with a 7-day trial
            const trialStartDate = new Date();
            const trialEndDate = new Date(trialStartDate);
            trialEndDate.setDate(trialStartDate.getDate() + 7);

            const newInstituteData = {
              instituteName: `${authUser.email}'s Institute`,
              superAdminId: authUser.uid,
              trialStartDate: trialStartDate.toISOString(),
              trialEndDate: trialEndDate.toISOString(),
              trialActive: true,
              createdAt: new Date().toISOString(),
            };

            await setDoc(doc(db, "instituteSetup", authUser.uid), newInstituteData);
            console.log("Created new instituteSetup document:", newInstituteData);

            // Recalculate trial status
            const timeDiff = new Date(trialEndDate) - new Date();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            setTrialStatus({
              trialActive: true,
              daysRemaining,
            });
          }
        } catch (error) {
          console.error("Error fetching trial status:", error);
          setError("Failed to fetch trial status: " + error.message);
          setTrialStatus({ trialActive: false, daysRemaining: 0 });
          // navigate("/subscribe");
        }
      } else {
        console.log("No authenticated user.");
        setUser(null);
        setTrialStatus({ trialActive: false, daysRemaining: 0 });
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const toggleMenu = () => {
    console.log('Toggling menu, current showMenu:', showMenu);
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const handleLogin = () => {
    setShowMenu(false);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/img/fireblaze.jpg" alt="F" className="logo-icon" />
        <span>Fireblaze</span>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <ul className="nav-list">
        <Link to="/dashboard">
          <li className="nav-item">
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </li>
        </Link>

        <Link to="/instituteSetup" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-building-columns nav-icon"></i>
            <span>Institute Setup</span>
          </li>
        </Link>

        <li className="nav-section">Academic</li>
        <Link to="/courses" className="nav-link">
          <li className="nav-item">
            <FaBook className="nav-icon" />
            <span>Course Management</span>
          </li>
        </Link>

        <Link to="/curriculum" className="nav-link">
          <li className="nav-item">
            <FaClipboardList className="nav-icon" />
            <span>Curriculum Management</span>
          </li>
        </Link>

        <Link to="/batches" className="nav-link">
          <li className="nav-item">
            <FaCalendarAlt className="nav-icon" />
            <span>Batch Management</span>
          </li>
        </Link>

        <Link to="/sessions" className="nav-link">
          <li className="nav-item">
            <FaCalendarAlt className="nav-icon" />
            <span>Session Management</span>
          </li>
        </Link>

        <Link to="/attendance" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-clipboard-user nav-icon"></i>
            <span>Attendance Management</span>
          </li>
        </Link>

        <Link to="/assignment" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-book nav-icon"></i>
            <span>Assignment Management</span>
          </li>
        </Link>

        <Link to="/addPerformance" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-chart-simple nav-icon"></i>
            <span>Performance Management</span>
          </li>
        </Link>

        <li className="nav-section">Users</li>
        <Link to='/users' className='nav-link'>
        <li className="nav-item">
          <FaUsers className="nav-icon" />
          <span>User Management</span>
        </li>
        </Link>

        <Link to="/studentdetails" className="nav-link">
          <li className="nav-item">
            <FaUserGraduate className="nav-icon" />
            <span>Learner Management</span>
          </li>
        </Link>

        <Link to="/enquiry" className="nav-link">
        <li className="nav-item">
          <FaQuestionCircle className="nav-icon" />
          <span>Enquiry Management</span>
        </li>
        </Link>

        <Link to="/instructor" className="nav-link">
          <li className="nav-item">
            <FaUserGraduate className="nav-icon" />
            <span>Staff Management</span>
          </li>
        </Link>

        <Link to="/roles" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-user nav-icon"></i>
            <span>Roles Management</span>
          </li>
        </Link>

        <li className="nav-section">Finance</li>
        <Link to="/reports" className="nav-link">
          <li className="nav-item">
            <FaMoneyBillAlt className="nav-icon" />
            <span>Fee Management</span>
          </li>
        </Link>

        <Link to="/invoices" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-money-bill-trend-up nav-icon"></i>
            <span>Invoice Management</span>
          </li>
        </Link>

        <Link to="/financePartners" className="nav-link">
          <li className="nav-item">
            <i className="fa-solid fa-money-check-dollar nav-icon"></i>
            <span>Finance Partner</span>
          </li>
        </Link>

        {/* Trial Banner - Displayed above Admin Profile */}
        {trialStatus.trialActive ? (
          <div className="trial-banner">
            <span>Trial expires in {trialStatus.daysRemaining} days</span>
            <Link to="/subscribe" className="choose-plan-link">
              Choose a plan
            </Link>
          </div>
        ) : (
          <div className="trial-banner trial-banner-debug">
            <span>Debug: Trial banner not visible. Trial Active: {trialStatus.trialActive.toString()}, Days Remaining: {trialStatus.daysRemaining}</span>
          </div>
        )}

        <div className="admin-profile" onClick={toggleMenu}>
          <FaUser className="nav-icon" />
          <span>{user ? `${user.f_name} ${user.l_name}` : "Admin Profile"}</span>
          <span className="admin-initials">{user ? user.initials : "AD"}</span>
          <FaEllipsisV className="menu-icon" />

          <div className={`dropdown-menu ${showMenu ? "show-dropdown" : ""}`}>
            <Link to="/settings" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
              Settings
            </Link>
            {user ? (
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            ) : (
              <Link to="/login" className="dropdown-item nav-link" onClick={() => setShowMenu(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;