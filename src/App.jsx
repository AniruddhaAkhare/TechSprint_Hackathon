import React from 'react';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
// require('dotenv').config();

import Sidebar from './pages/home/Sidebar.jsx'
import LoginForm from './pages/home/LoginForm.jsx';
import RegisterForm from './pages/home/RegisterForm.jsx';
import Welcome from './pages/home/Welcome.jsx';

import Dashboard from './pages/components/Dashboard/Dashboard.jsx'

import Batches from './pages/components/CourseDelivery/Batch/Batches.jsx';
import CreateBatch from './pages/components/CourseDelivery/Batch/CreateBatch.jsx';

import Courses from "/src/pages/components/CourseDelivery/Course/Courses.jsx";

import CreateCourses from './pages/components/CourseDelivery/Course/CreateCourses.jsx';
import EditCourse from './pages/components/CourseDelivery/Course/EditCourse.jsx';
import IndividualCourseBatch from './pages/components/CourseDelivery/Course/IndividualCourseBatch.jsx';
import Curriculum from './pages/components/CourseDelivery/Curriculum/Curriculum.jsx';
import CurriculumEditor from './pages/components/CourseDelivery/Curriculum/CurriculumEditor.jsx'
import NotesPage from './pages/components/CourseDelivery/Curriculum/NotesPages.jsx';
import CreateCurriculum from './pages/components/CourseDelivery/Curriculum/CreateCurriculum.jsx';
import SectionMaterials from './pages/components/CourseDelivery/Curriculum/SectionMaterials.jsx';
import AddMaterial from './pages/components/CourseDelivery/Curriculum/AddMaterials.jsx';

import Calendar from './pages/components/CourseDelivery/Session/Calendar.jsx';
import Sessions from './pages/components/CourseDelivery/Session/Sessions.jsx';
import CreateSession from './pages/components/CourseDelivery/Session/CreateSession.jsx';

import Subjects from './pages/components/CourseDelivery/Subjects/Subjects.jsx';
import CreateSubjects from './pages/components/CourseDelivery/Subjects/CreateSubjects.jsx';

import Instructor from './pages/components/Instructors/Instructor.jsx';

import Feedback from './pages/components/CourseDelivery/Curriculum/Feedback.jsx';

import StudentDetails from './pages/components/Students/StudentDetails.jsx';
import AddStudent from './pages/components/Students/AddStudent.jsx';
import EditStudent from './pages/components/Students/EditStudent.jsx';

import AddPerformance from './pages/components/Performance/AddPerformance.jsx';

import MockTestSessions from './pages/components/Performance/Mock/MockTestSessions.jsx';
import CreateMockTest from './pages/components/Performance/Mock/CreateMockTest.jsx';

import CreateExaminationRemarks from './pages/components/Performance/Examination/CreateExaminationRemarks.jsx';

import AttendanceRemarks from './pages/components/Performance/Attendance/AttendanceRemarks.jsx';
import CreateAttendenceRemarks from './pages/components/Performance/Attendance/CreateAttendenceRemarks.jsx';

import CreateFeesRemarks from './pages/components/Performance/Fees/CreateFeesRemarks.jsx';
import FeesRemarks from './pages/components/Performance/Fees/FeesRemarks.jsx';

import Profile from './pages/components/Profile.jsx';

// import Centers from './pages/components/Settings/Centers.jsx';

import InstallmentReport from './reports/InstallmentReport.jsx';

import Invoices from '../src/pages/components/Invoices/Invoices.jsx'
import CreateInvoice from '../src/pages/components/Invoices/CreateInvoice.jsx';
import UpdateInvoice from '../src/pages/components/Invoices/UpdateInvoice.jsx';
import Role from './pages/components/UsersAndRoles.jsx/Roles.jsx'


import Assignments from './pages/components/CourseDelivery/Assignment/Assignment.jsx';
// import CreateAssignment from './pages/components/CourseDelivery/Assignment/CreateAssignment.jsx';

import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './context/AuthContext';
import IndividualCourseStudnets from './pages/components/CourseDelivery/Course/IndividualCourseStudnets.jsx';
import IndividualCourseCurriculum from './pages/components/CourseDelivery/Course/IndividualCourseCurriculum.jsx';

import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';

import HeaderContent from './apps/Header/HeaderContainer.jsx';
import Navigation from './apps/Navigation/NavigationContainer.jsx';
// import FeeTemplate from './pages/components/FeeTemplate/FeeTemplate.jsx';
import StudentInfo from './StudentInformation/StudentInfo.jsx'

import EditCurriculum from './pages/components/CourseDelivery/Curriculum/EditCurriculum.jsx';
import ZoomSession from './pages/components/CourseDelivery/Session/ZoomSession.jsx';
import AddCourse from './pages/components/Students/AddStudent/AddCourse.jsx'

import FinancePartner from './pages/components/FinancePartner/FinancePartner.jsx';
import AddFinancePartner from './pages/components/FinancePartner/AddFinancePartner.jsx';

import Attendance from './StudentInformation/Attendance.jsx';


import InstituteSetup from './pages/home/InstituteSetup.jsx';
export default function App() {

  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);


  // useEffect(() => {
  //   console.log("Current User in App:", user);
  // }, [user]);


  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex' }}>
          {user && <Sidebar />}
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>

              <Route path="/my-profile/:uid" element={<Profile />} />
              {/* <Route path='/header' element={<HeaderContent />} /> */}
              <Route path='/navigation' element={<Navigation />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgetPassword" element={<ForgetPasswordForm />} />
              {/* {user && (
  <> */}

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path='/instituteSetup' element={<InstituteSetup />} />
              <Route path="/register" element={<RegisterForm />} />

              <Route path="/courses" element={<Courses />} />
              <Route path="/createCourses" element={<CreateCourses />} />
              <Route path="/editCourse/:id" element={<EditCourse />} />
              <Route path="/createCurriculum" element={<CreateCurriculum />} />
              <Route path="/curriculum/:curriculumId" element={<CurriculumEditor />} />
              <Route path="/curriculum/:curriculumId/section/:sectionId" element={<SectionMaterials />} />
              <Route path="/curriculum/:curriculumId/section/:sectionId/add-material" element={<AddMaterial />} />
              <Route path="/courses/:courseId/learners" element={<IndividualCourseStudnets />} />
              <Route path="/courses/:courseId/batches" element={<IndividualCourseBatch />} />

              <Route path='/batches' element={<Batches />} />
              <Route path="/createBatch" element={<CreateBatch />} />

              <Route path='/calendar' element={<Calendar />} />
              <Route path='/sessions' element={<Sessions />} />
              <Route path="/createSession" element={<CreateSession />} />
              <Route path="/instructor" element={<Instructor />} />

              <Route path='/curriculum' element={<Curriculum />} />
              <Route path="/edit-curriculum/:id" element={<EditCurriculum />} />
              {/* <Route path="/notes/:curriculumId/:sectionId" element={<NotesPage />} /> */}


              <Route path="/studentdetails" element={<StudentDetails />} />
              <Route path="/studentdetails/addstudent" element={<AddStudent />} />
              <Route path="/studentdetails/updatestudent/:studentId" element={<EditStudent />} />
              <Route path="/studentdetails/:studentId" element={<StudentInfo />} />

              <Route path="/feedback" element={<Feedback />} />

              <Route path="/addPerformance" element={<AddPerformance />} />

              <Route path="/mocktestsessions" element={<MockTestSessions />} />
              <Route path="/createMockTest" element={<CreateMockTest />} />

              <Route path="/createExaminationremark" element={<CreateExaminationRemarks />} />
              <Route path="/createExaminationRemarks" element={<CreateExaminationRemarks />} />

              <Route path="/attendenceremark" element={<AttendanceRemarks />} />
              <Route path="/createAttendanceRemarks" element={<CreateAttendenceRemarks />} />

              <Route path="/createFeesRemarks" element={<CreateFeesRemarks />} />
              <Route path="/feesremark" element={<FeesRemarks />} />


              <Route path='/reports' element={<InstallmentReport />} />


              {/* <Route path='/centers' element={<Centers />} /> */}

              <Route path='/roles' element={<Role />} />
              {/* <Route path='/fee-template' element={<FeeTemplate />} /> */}
              {/* <Route path='/roles' element={<Role />} /> */}


              <Route path='/invoices' element={<Invoices />} />
              <Route path='/invoices/createInvoice' element={<CreateInvoice />} />
              <Route path='/invoices/updateInvoice/:id' element={<UpdateInvoice />} />



              <Route path='/assignment' element={<Assignments />} />

              {/* <Route path='/fee-template' element={<FeeTemplate />} /> */}
              <Route path='/add-course/:studentId' element={<AddCourse />} />


              <Route path="/financePartners" element={<FinancePartner />} />
              <Route path='/addFinancePartner' element={<AddFinancePartner />} />


              <Route path="/attendance" element={<Attendance />} />


              <Route path='/forgetpassword' element={<ForgetPasswordForm />} />



              <Route path='/zoom' element={<ZoomSession />} />
              {/* </>
)} */}
            </Routes >
          </div >

        </div>

      </BrowserRouter >
    </AuthProvider >
  );
}







// import React, { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { getAuth } from 'firebase/auth';
// import { useAuth } from './context/AuthContext'; // Import useAuth

// // Home Pages
// import Sidebar from './pages/home/Sidebar.jsx';
// import LoginForm from './pages/home/LoginForm.jsx';
// import RegisterForm from './pages/home/RegisterForm.jsx';
// import Welcome from './pages/home/Welcome.jsx';
// import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';
// import InstituteSetup from './pages/home/InstituteSetup.jsx';

// // Components
// import Dashboard from './pages/components/Dashboard/Dashboard.jsx';
// import Batches from './pages/components/CourseDelivery/Batch/Batches.jsx';
// import CreateBatch from './pages/components/CourseDelivery/Batch/CreateBatch.jsx';
// import Courses from './pages/components/CourseDelivery/Course/Courses.jsx';
// import CreateCourses from './pages/components/CourseDelivery/Course/CreateCourses.jsx';
// import EditCourse from './pages/components/CourseDelivery/Course/EditCourse.jsx';
// import IndividualCourseBatch from './pages/components/CourseDelivery/Course/IndividualCourseBatch.jsx';
// import IndividualCourseStudnets from './pages/components/CourseDelivery/Course/IndividualCourseStudnets.jsx';
// import Curriculum from './pages/components/CourseDelivery/Curriculum/Curriculum.jsx';
// import CurriculumEditor from './pages/components/CourseDelivery/Curriculum/CurriculumEditor.jsx';
// import NotesPage from './pages/components/CourseDelivery/Curriculum/NotesPages.jsx';
// import CreateCurriculum from './pages/components/CourseDelivery/Curriculum/CreateCurriculum.jsx';
// import SectionMaterials from './pages/components/CourseDelivery/Curriculum/SectionMaterials.jsx';
// import AddMaterial from './pages/components/CourseDelivery/Curriculum/AddMaterials.jsx';
// import EditCurriculum from './pages/components/CourseDelivery/Curriculum/EditCurriculum.jsx';
// import Calendar from './pages/components/CourseDelivery/Session/Calendar.jsx';
// import Sessions from './pages/components/CourseDelivery/Session/Sessions.jsx';
// import CreateSession from './pages/components/CourseDelivery/Session/CreateSession.jsx';
// import ZoomSession from './pages/components/CourseDelivery/Session/ZoomSession.jsx';
// import Subjects from './pages/components/CourseDelivery/Subjects/Subjects.jsx';
// import CreateSubjects from './pages/components/CourseDelivery/Subjects/CreateSubjects.jsx';
// import Instructor from './pages/components/Instructors/Instructor.jsx';
// import Feedback from './pages/components/CourseDelivery/Curriculum/Feedback.jsx';
// import StudentDetails from './pages/components/Students/StudentDetails.jsx';
// import AddStudent from './pages/components/Students/AddStudent.jsx';
// import EditStudent from './pages/components/Students/EditStudent.jsx';
// import AddPerformance from './pages/components/Performance/AddPerformance.jsx';
// import MockTestSessions from './pages/components/Performance/Mock/MockTestSessions.jsx';
// import CreateMockTest from './pages/components/Performance/Mock/CreateMockTest.jsx';
// import CreateExaminationRemarks from './pages/components/Performance/Examination/CreateExaminationRemarks.jsx';
// import AttendanceRemarks from './pages/components/Performance/Attendance/AttendanceRemarks.jsx';
// import CreateAttendenceRemarks from './pages/components/Performance/Attendance/CreateAttendenceRemarks.jsx';
// import CreateFeesRemarks from './pages/components/Performance/Fees/CreateFeesRemarks.jsx';
// import FeesRemarks from './pages/components/Performance/Fees/FeesRemarks.jsx';
// import Profile from './pages/components/Profile.jsx';
// import InstallmentReport from './reports/InstallmentReport.jsx';
// import Invoices from './pages/components/Invoices/Invoices.jsx';
// import CreateInvoice from './pages/components/Invoices/CreateInvoice.jsx';
// import UpdateInvoice from './pages/components/Invoices/UpdateInvoice.jsx';
// import Role from './pages/components/UsersAndRoles.jsx/Roles.jsx';
// import Assignments from './pages/components/CourseDelivery/Assignment/Assignment.jsx';
// import StudentInfo from './StudentInformation/StudentInfo.jsx';
// import AddCourse from './pages/components/Students/AddStudent/AddCourse.jsx';
// import FinancePartner from './pages/components/FinancePartner/FinancePartner.jsx';
// import AddFinancePartner from './pages/components/FinancePartner/AddFinancePartner.jsx';
// import Attendance from './StudentInformation/Attendance.jsx';

// export default function App() {
//   const { user, rolePermissions, loading } = useAuth(); // Use context instead of local state
//   const auth = getAuth();

//   // Protected Route Component
//   const ProtectedRoute = ({ children, permissionSection, action = 'display' }) => {
//     if (loading) return <div className="text-center p-4">Loading...</div>;
//     if (!user) return <Navigate to="/login" />;
//     if (permissionSection && rolePermissions[permissionSection]?.[action] !== true) {
//       return <div className="p-4 text-red-600">Access Denied: Insufficient Permissions</div>;
//     }
//     return children;
//   };

//   const handleLogout = () => {
//     auth.signOut();
//   };

//   return (
//     <BrowserRouter>
//       {loading ? (
//         <div className="text-center p-4">Loading...</div>
//       ) : (
//         <div style={{ display: 'flex' }}>
//           {user && <Sidebar />}
//           <div style={{ flex: 1, padding: '20px' }}>
//             {user && (
//               <div className="flex justify-end mb-4">
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />
//               <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
//               <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
//               <Route path="/forgetPassword" element={!user ? <ForgetPasswordForm /> : <Navigate to="/dashboard" />} />
//               <Route path="/instituteSetup" element={<InstituteSetup />} />

//               {/* Protected Routes */}
//               <Route
//                 path="/dashboard"
//                 element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
//               />
//               <Route
//                 path="/my-profile/:uid"
//                 element={<ProtectedRoute><Profile /></ProtectedRoute>}
//               />

//               {/* Course Delivery Routes */}
//               <Route
//                 path="/courses"
//                 element={<ProtectedRoute permissionSection="courses"><Courses /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createCourses"
//                 element={<ProtectedRoute permissionSection="courses" action="create"><CreateCourses /></ProtectedRoute>}
//               />
//               <Route
//                 path="/editCourse/:id"
//                 element={<ProtectedRoute permissionSection="courses" action="update"><EditCourse /></ProtectedRoute>}
//               />
//               <Route
//                 path="/courses/:courseId/learners"
//                 element={<ProtectedRoute permissionSection="courses"><IndividualCourseStudnets /></ProtectedRoute>}
//               />
//               <Route
//                 path="/courses/:courseId/batches"
//                 element={<ProtectedRoute permissionSection="courses"><IndividualCourseBatch /></ProtectedRoute>}
//               />
//               <Route
//                 path="/batches"
//                 element={<ProtectedRoute permissionSection="batches"><Batches /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createBatch"
//                 element={<ProtectedRoute permissionSection="batches" action="create"><CreateBatch /></ProtectedRoute>}
//               />
//               <Route
//                 path="/curriculum"
//                 element={<ProtectedRoute permissionSection="curriculum"><Curriculum /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createCurriculum"
//                 element={<ProtectedRoute permissionSection="curriculum" action="create"><CreateCurriculum /></ProtectedRoute>}
//               />
//               <Route
//                 path="/curriculum/:curriculumId"
//                 element={<ProtectedRoute permissionSection="curriculum"><CurriculumEditor /></ProtectedRoute>}
//               />
//               <Route
//                 path="/curriculum/:curriculumId/section/:sectionId"
//                 element={<ProtectedRoute permissionSection="curriculum"><SectionMaterials /></ProtectedRoute>}
//               />
//               <Route
//                 path="/curriculum/:curriculumId/section/:sectionId/add-material"
//                 element={<ProtectedRoute permissionSection="curriculum" action="create"><AddMaterial /></ProtectedRoute>}
//               />
//               <Route
//                 path="/edit-curriculum/:id"
//                 element={<ProtectedRoute permissionSection="curriculum" action="update"><EditCurriculum /></ProtectedRoute>}
//               />
//               <Route
//                 path="/calendar"
//                 element={<ProtectedRoute permissionSection="sessions"><Calendar /></ProtectedRoute>}
//               />
//               <Route
//                 path="/sessions"
//                 element={<ProtectedRoute permissionSection="sessions"><Sessions /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createSession"
//                 element={<ProtectedRoute permissionSection="sessions" action="create"><CreateSession /></ProtectedRoute>}
//               />
//               <Route
//                 path="/zoom"
//                 element={<ProtectedRoute permissionSection="sessions"><ZoomSession /></ProtectedRoute>}
//               />
//               <Route
//                 path="/subjects"
//                 element={<ProtectedRoute permissionSection="subjects"><Subjects /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createSubjects"
//                 element={<ProtectedRoute permissionSection="subjects" action="create"><CreateSubjects /></ProtectedRoute>}
//               />
//               <Route
//                 path="/assignment"
//                 element={<ProtectedRoute permissionSection="assignments"><Assignments /></ProtectedRoute>}
//               />
//               <Route
//                 path="/feedback"
//                 element={<ProtectedRoute permissionSection="feedback"><Feedback /></ProtectedRoute>}
//               />

//               {/* Instructor Routes */}
//               <Route
//                 path="/instructor"
//                 element={<ProtectedRoute permissionSection="instructors"><Instructor /></ProtectedRoute>}
//               />

//               {/* Student Routes */}
//               <Route
//                 path="/studentdetails"
//                 element={<ProtectedRoute permissionSection="students"><StudentDetails /></ProtectedRoute>}
//               />
//               <Route
//                 path="/studentdetails/addstudent"
//                 element={<ProtectedRoute permissionSection="students" action="create"><AddStudent /></ProtectedRoute>}
//               />
//               <Route
//                 path="/studentdetails/updatestudent/:studentId"
//                 element={<ProtectedRoute permissionSection="students" action="update"><EditStudent /></ProtectedRoute>}
//               />
//               <Route
//                 path="/studentdetails/:studentId"
//                 element={<ProtectedRoute permissionSection="students"><StudentInfo /></ProtectedRoute>}
//               />
//               <Route
//                 path="/add-course/:studentId"
//                 element={<ProtectedRoute permissionSection="students" action="update"><AddCourse /></ProtectedRoute>}
//               />
//               <Route
//                 path="/attendance"
//                 element={<ProtectedRoute permissionSection="attendance"><Attendance /></ProtectedRoute>}
//               />

//               {/* Performance Routes */}
//               <Route
//                 path="/addPerformance"
//                 element={<ProtectedRoute permissionSection="performance"><AddPerformance /></ProtectedRoute>}
//               />
//               <Route
//                 path="/mocktestsessions"
//                 element={<ProtectedRoute permissionSection="mockTests"><MockTestSessions /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createMockTest"
//                 element={<ProtectedRoute permissionSection="mockTests" action="create"><CreateMockTest /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createExaminationRemarks"
//                 element={<ProtectedRoute permissionSection="examination"><CreateExaminationRemarks /></ProtectedRoute>}
//               />
//               <Route
//                 path="/attendenceremark"
//                 element={<ProtectedRoute permissionSection="attendance"><AttendanceRemarks /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createAttendanceRemarks"
//                 element={<ProtectedRoute permissionSection="attendance" action="create"><CreateAttendenceRemarks /></ProtectedRoute>}
//               />
//               <Route
//                 path="/feesremark"
//                 element={<ProtectedRoute permissionSection="fees"><FeesRemarks /></ProtectedRoute>}
//               />
//               <Route
//                 path="/createFeesRemarks"
//                 element={<ProtectedRoute permissionSection="fees" action="create"><CreateFeesRemarks /></ProtectedRoute>}
//               />

//               {/* Finance and Invoices */}
//               <Route
//                 path="/financePartners"
//                 element={<ProtectedRoute permissionSection="financePartners"><FinancePartner /></ProtectedRoute>}
//               />
//               <Route
//                 path="/addFinancePartner"
//                 element={<ProtectedRoute permissionSection="financePartners" action="create"><AddFinancePartner /></ProtectedRoute>}
//               />
//               <Route
//                 path="/invoices"
//                 element={<ProtectedRoute permissionSection="invoices"><Invoices /></ProtectedRoute>}
//               />
//               <Route
//                 path="/invoices/createInvoice"
//                 element={<ProtectedRoute permissionSection="invoices" action="create"><CreateInvoice /></ProtectedRoute>}
//               />
//               <Route
//                 path="/invoices/updateInvoice/:id"
//                 element={<ProtectedRoute permissionSection="invoices" action="update"><UpdateInvoice /></ProtectedRoute>}
//               />

//               {/* Reports */}
//               <Route
//                 path="/reports"
//                 element={<ProtectedRoute permissionSection="reports"><InstallmentReport /></ProtectedRoute>}
//               />

//               {/* Roles */}
//               <Route
//                 path="/roles"
//                 element={<ProtectedRoute permissionSection="roles"><Role /></ProtectedRoute>}
//               />
//             </Routes>
//           </div>
//         </div>
//       )}
//     </BrowserRouter>
//   );
// }
