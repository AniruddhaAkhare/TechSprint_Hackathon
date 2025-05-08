// // // import React from 'react';
// // // import { useEffect, useState } from 'react';
// // // import { getAuth } from 'firebase/auth';
// // // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // // import axios from 'axios';
// // // // require('dotenv').config();

// // // import Sidebar from './pages/home/Sidebar.jsx'
// // // import LoginForm from './pages/home/LoginForm.jsx';
// // // import RegisterForm from './pages/home/RegisterForm.jsx';
// // // import Welcome from './pages/home/Welcome.jsx';

// // // import Dashboard from './pages/components/Dashboard/Dashboard.jsx'

// // // import Batches from './pages/components/CourseDelivery/Batch/Batches.jsx';
// // // import CreateBatch from './pages/components/CourseDelivery/Batch/CreateBatch.jsx';

// // // import Courses from "/src/pages/components/CourseDelivery/Course/Courses.jsx";

// // // import CreateCourses from './pages/components/CourseDelivery/Course/CreateCourses.jsx';
// // // import EditCourse from './pages/components/CourseDelivery/Course/EditCourse.jsx';
// // // import IndividualCourseBatch from './pages/components/CourseDelivery/Course/IndividualCourseBatch.jsx';
// // // import Curriculum from './pages/components/CourseDelivery/Curriculum/Curriculum.jsx';
// // // import CurriculumEditor from './pages/components/CourseDelivery/Curriculum/CurriculumEditor.jsx'
// // // import NotesPage from './pages/components/CourseDelivery/Curriculum/NotesPages.jsx';
// // // import CreateCurriculum from './pages/components/CourseDelivery/Curriculum/CreateCurriculum.jsx';
// // // import SectionMaterials from './pages/components/CourseDelivery/Curriculum/SectionMaterials.jsx';
// // // import AddMaterial from './pages/components/CourseDelivery/Curriculum/AddMaterials.jsx';

// // // import Calendar from './pages/components/CourseDelivery/Session/Calendar.jsx';
// // // import Sessions from './pages/components/CourseDelivery/Session/Sessions.jsx';
// // // import CreateSession from './pages/components/CourseDelivery/Session/CreateSession.jsx';

// // // import Subjects from './pages/components/CourseDelivery/Subjects/Subjects.jsx';
// // // import CreateSubjects from './pages/components/CourseDelivery/Subjects/CreateSubjects.jsx';

// // // import Instructor from './pages/components/Instructors/Instructor.jsx';

// // // import Feedback from './pages/components/CourseDelivery/Curriculum/Feedback.jsx';

// // // import StudentDetails from './pages/components/Students/StudentDetails.jsx';
// // // import AddStudent from './pages/components/Students/AddStudent.jsx';
// // // import EditStudent from './pages/components/Students/EditStudent.jsx';

// // // import AddPerformance from './pages/components/Performance/AddPerformance.jsx';

// // // import MockTestSessions from './pages/components/Performance/Mock/MockTestSessions.jsx';
// // // import CreateMockTest from './pages/components/Performance/Mock/CreateMockTest.jsx';

// // // import CreateExaminationRemarks from './pages/components/Performance/Examination/CreateExaminationRemarks.jsx';

// // // import AttendanceRemarks from './pages/components/Performance/Attendance/AttendanceRemarks.jsx';
// // // import CreateAttendenceRemarks from './pages/components/Performance/Attendance/CreateAttendenceRemarks.jsx';

// // // import CreateFeesRemarks from './pages/components/Performance/Fees/CreateFeesRemarks.jsx';
// // // import FeesRemarks from './pages/components/Performance/Fees/FeesRemarks.jsx';

// // // import Profile from './pages/components/Profile.jsx';

// // // // import Centers from './pages/components/Settings/Centers.jsx';

// // // import InstallmentReport from './reports/InstallmentReport.jsx';

// // // import Invoices from '../src/pages/components/Invoices/Invoices.jsx'
// // // import CreateInvoice from '../src/pages/components/Invoices/CreateInvoice.jsx';
// // // import UpdateInvoice from '../src/pages/components/Invoices/UpdateInvoice.jsx';
// // // import Role from './pages/components/UsersAndRoles.jsx/Roles.jsx'


// // // import Assignments from './pages/components/CourseDelivery/Assignment/Assignment.jsx';
// // // // import CreateAssignment from './pages/components/CourseDelivery/Assignment/CreateAssignment.jsx';

// // // import { onAuthStateChanged } from 'firebase/auth';
// // // import { AuthProvider } from './context/AuthContext';
// // // import IndividualCourseStudnets from './pages/components/CourseDelivery/Course/IndividualCourseStudnets.jsx';
// // // import IndividualCourseCurriculum from './pages/components/CourseDelivery/Course/IndividualCourseCurriculum.jsx';

// // // import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';

// // // import HeaderContent from './apps/Header/HeaderContainer.jsx';
// // // import Navigation from './apps/Navigation/NavigationContainer.jsx';
// // // // import FeeTemplate from './pages/components/FeeTemplate/FeeTemplate.jsx';
// // // import StudentInfo from './StudentInformation/StudentInfo.jsx'

// // // import EditCurriculum from './pages/components/CourseDelivery/Curriculum/EditCurriculum.jsx';
// // // import ZoomSession from './pages/components/CourseDelivery/Session/ZoomSession.jsx';
// // // import AddCourse from './pages/components/Students/AddStudent/AddCourse.jsx'

// // // import FinancePartner from './pages/components/FinancePartner/FinancePartner.jsx';
// // // import AddFinancePartner from './pages/components/FinancePartner/AddFinancePartner.jsx';

// // // import Attendance from './StudentInformation/Attendance.jsx';


// // // import InstituteSetup from './pages/home/InstituteSetup.jsx';
// // // export default function App() {

// // //   const [user, setUser] = useState(null);
// // //   const auth = getAuth();

// // //   useEffect(() => {
// // //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// // //       setUser(currentUser);
// // //     });
// // //     return () => unsubscribe();
// // //   }, [auth]);


// // //   // useEffect(() => {
// // //   //   console.log("Current User in App:", user);
// // //   // }, [user]);


// // //   return (
// // //     <AuthProvider>
// // //       <BrowserRouter>
// // //         <div style={{ display: 'flex' }}>
// // //           {user && <Sidebar />}
// // //           <div style={{ flex: 1, padding: '20px' }}>
// // //             <Routes>

// // //               <Route path="/my-profile/:uid" element={<Profile />} />
// // //               {/* <Route path='/header' element={<HeaderContent />} /> */}
// // //               <Route path='/navigation' element={<Navigation />} />
// // //               <Route path="/login" element={<LoginForm />} />
// // //               <Route path="/register" element={<RegisterForm />} />
// // //               <Route path="/forgetPassword" element={<ForgetPasswordForm />} />
// // //               {/* {user && (
// // //   <> */}

// // //               <Route path="/dashboard" element={<Dashboard />} />

// // //               <Route path='/instituteSetup' element={<InstituteSetup />} />
// // //               <Route path="/register" element={<RegisterForm />} />

// // //               <Route path="/courses" element={<Courses />} />
// // //               <Route path="/createCourses" element={<CreateCourses />} />
// // //               <Route path="/editCourse/:id" element={<EditCourse />} />
// // //               <Route path="/createCurriculum" element={<CreateCurriculum />} />
// // //               <Route path="/curriculum/:curriculumId" element={<CurriculumEditor />} />
// // //               <Route path="/curriculum/:curriculumId/section/:sectionId" element={<SectionMaterials />} />
// // //               <Route path="/curriculum/:curriculumId/section/:sectionId/add-material" element={<AddMaterial />} />
// // //               <Route path="/courses/:courseId/learners" element={<IndividualCourseStudnets />} />
// // //               <Route path="/courses/:courseId/batches" element={<IndividualCourseBatch />} />

// // //               <Route path='/batches' element={<Batches />} />
// // //               <Route path="/createBatch" element={<CreateBatch />} />

// // //               <Route path='/calendar' element={<Calendar />} />
// // //               <Route path='/sessions' element={<Sessions />} />
// // //               <Route path="/createSession" element={<CreateSession />} />
// // //               <Route path="/instructor" element={<Instructor />} />

// // //               <Route path='/curriculum' element={<Curriculum />} />
// // //               <Route path="/edit-curriculum/:id" element={<EditCurriculum />} />
// // //               {/* <Route path="/notes/:curriculumId/:sectionId" element={<NotesPage />} /> */}


// // //               <Route path="/studentdetails" element={<StudentDetails />} />
// // //               <Route path="/studentdetails/addstudent" element={<AddStudent />} />
// // //               <Route path="/studentdetails/updatestudent/:studentId" element={<EditStudent />} />
// // //               <Route path="/studentdetails/:studentId" element={<StudentInfo />} />

// // //               <Route path="/feedback" element={<Feedback />} />

// // //               <Route path="/addPerformance" element={<AddPerformance />} />

// // //               <Route path="/mocktestsessions" element={<MockTestSessions />} />
// // //               <Route path="/createMockTest" element={<CreateMockTest />} />

// // //               <Route path="/createExaminationremark" element={<CreateExaminationRemarks />} />
// // //               <Route path="/createExaminationRemarks" element={<CreateExaminationRemarks />} />

// // //               <Route path="/attendenceremark" element={<AttendanceRemarks />} />
// // //               <Route path="/createAttendanceRemarks" element={<CreateAttendenceRemarks />} />

// // //               <Route path="/createFeesRemarks" element={<CreateFeesRemarks />} />
// // //               <Route path="/feesremark" element={<FeesRemarks />} />


// // //               <Route path='/reports' element={<InstallmentReport />} />


// // //               {/* <Route path='/centers' element={<Centers />} /> */}

// // //               <Route path='/roles' element={<Role />} />
// // //               {/* <Route path='/fee-template' element={<FeeTemplate />} /> */}
// // //               {/* <Route path='/roles' element={<Role />} /> */}


// // //               <Route path='/invoices' element={<Invoices />} />
// // //               <Route path='/invoices/createInvoice' element={<CreateInvoice />} />
// // //               <Route path='/invoices/updateInvoice/:id' element={<UpdateInvoice />} />



// // //               <Route path='/assignment' element={<Assignments />} />

// // //               {/* <Route path='/fee-template' element={<FeeTemplate />} /> */}
// // //               <Route path='/add-course/:studentId' element={<AddCourse />} />


// // //               <Route path="/financePartners" element={<FinancePartner />} />
// // //               <Route path='/addFinancePartner' element={<AddFinancePartner />} />


// // //               <Route path="/attendance" element={<Attendance />} />


// // //               <Route path='/forgetpassword' element={<ForgetPasswordForm />} />



// // //               <Route path='/zoom' element={<ZoomSession />} />
// // //               {/* </>
// // // )} */}
// // //             </Routes >
// // //           </div >

// // //         </div>

// // //       </BrowserRouter >
// // //     </AuthProvider >
// // //   );
// // // }







// // import React, { useEffect } from 'react';
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import { getAuth } from 'firebase/auth';
// // import { useAuth } from './context/AuthContext'; // Import useAuth

// // // Home Pages
// // import Sidebar from './pages/home/Sidebar.jsx';
// // import LoginForm from './pages/home/LoginForm.jsx';
// // import RegisterForm from './pages/home/RegisterForm.jsx';
// // import Welcome from './pages/home/Welcome.jsx';
// // import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';
// // import InstituteSetup from './pages/home/InstituteSetup.jsx';

// // // Components
// // import Dashboard from './pages/components/Dashboard/Dashboard.jsx';
// // import Roles from './pages/components/UsersAndRoles/Roles';
// // import Batches from './pages/components/CourseDelivery/Batch/Batches.jsx';
// // import CreateBatch from './pages/components/CourseDelivery/Batch/CreateBatch.jsx';
// // import Courses from './pages/components/CourseDelivery/Course/Courses.jsx';
// // import CreateCourses from './pages/components/CourseDelivery/Course/CreateCourses.jsx';
// // import EditCourse from './pages/components/CourseDelivery/Course/EditCourse.jsx';
// // import IndividualCourseBatch from './pages/components/CourseDelivery/Course/IndividualCourseBatch.jsx';
// // import IndividualCourseStudnets from './pages/components/CourseDelivery/Course/IndividualCourseStudnets.jsx';
// // import Curriculum from './pages/components/CourseDelivery/Curriculum/Curriculum.jsx';
// // import CurriculumEditor from './pages/components/CourseDelivery/Curriculum/CurriculumEditor.jsx';
// // import NotesPage from './pages/components/CourseDelivery/Curriculum/NotesPages.jsx';
// // import CreateCurriculum from './pages/components/CourseDelivery/Curriculum/CreateCurriculum.jsx';
// // import SectionMaterials from './pages/components/CourseDelivery/Curriculum/SectionMaterials.jsx';
// // import AddMaterial from './pages/components/CourseDelivery/Curriculum/AddMaterials.jsx';
// // import EditCurriculum from './pages/components/CourseDelivery/Curriculum/EditCurriculum.jsx';
// // import Calendar from './pages/components/CourseDelivery/Session/Calendar.jsx';
// // import Sessions from './pages/components/CourseDelivery/Session/Sessions.jsx';
// // import CreateSession from './pages/components/CourseDelivery/Session/CreateSession.jsx';
// // import ZoomSession from './pages/components/CourseDelivery/Session/ZoomSession.jsx';
// // import Subjects from './pages/components/CourseDelivery/Subjects/Subjects.jsx';
// // import CreateSubjects from './pages/components/CourseDelivery/Subjects/CreateSubjects.jsx';
// // import Instructor from './pages/components/Instructors/Instructor.jsx';
// // import Feedback from './pages/components/CourseDelivery/Curriculum/Feedback.jsx';
// // import StudentDetails from './pages/components/Students/StudentDetails.jsx';
// // import AddStudent from './pages/components/Students/AddStudent.jsx';
// // import EditStudent from './pages/components/Students/EditStudent.jsx';
// // import AddPerformance from './pages/components/Performance/AddPerformance.jsx';
// // import MockTestSessions from './pages/components/Performance/Mock/MockTestSessions.jsx';
// // import CreateMockTest from './pages/components/Performance/Mock/CreateMockTest.jsx';
// // import CreateExaminationRemarks from './pages/components/Performance/Examination/CreateExaminationRemarks.jsx';
// // import AttendanceRemarks from './pages/components/Performance/Attendance/AttendanceRemarks.jsx';
// // import CreateAttendenceRemarks from './pages/components/Performance/Attendance/CreateAttendenceRemarks.jsx';
// // import CreateFeesRemarks from './pages/components/Performance/Fees/CreateFeesRemarks.jsx';
// // import FeesRemarks from './pages/components/Performance/Fees/FeesRemarks.jsx';
// // import Profile from './pages/components/Profile.jsx';
// // import InstallmentReport from './reports/InstallmentReport.jsx';
// // import Invoices from './pages/components/Invoices/Invoices.jsx';
// // import CreateInvoice from './pages/components/Invoices/CreateInvoice.jsx';
// // import UpdateInvoice from './pages/components/Invoices/UpdateInvoice.jsx';
// // import Role from './pages/components/UsersAndRoles/Roles.jsx';
// // import Assignments from './pages/components/CourseDelivery/Assignment/Assignment.jsx';
// // import StudentInfo from './StudentInformation/StudentInfo.jsx';
// // import AddCourse from './pages/components/Students/AddStudent/AddCourse.jsx';
// // import FinancePartner from './pages/components/FinancePartner/FinancePartner.jsx';
// // import AddFinancePartner from './pages/components/FinancePartner/AddFinancePartner.jsx';
// // import Attendance from './StudentInformation/Attendance.jsx';
// // import User from './pages/components/UsersAndRoles/User.jsx';
// // import LandingPage from './pages/Landing/LandingPage.jsx';
// // import KanbanBoard from "./pages/components/EnquiryManagement/kanbanBoard.jsx"
// // import Subscribe from "./pages/home/Subscribe.jsx";
// // import QuestionBank from './pages/components/QuestionBank/QuestionBank.jsx';
// // import QuestionTemplate from './pages/components/QuestionBank/QuestionTemplate.jsx';
// // export default function App() {
// //   const { user, rolePermissions, loading } = useAuth(); 
// //   const auth = getAuth();

// //   const ProtectedRoute = ({ children, permissionSection, action = 'display' }) => {
// //     if (loading) return <div className="text-center p-4">Loading...</div>;
// //     if (!user) return <Navigate to="/login" />;
// //     if (permissionSection && rolePermissions[permissionSection]?.[action] !== true) {
// //       return <div className="p-4 text-red-600">Access Denied: Insufficient Permissions</div>;
// //     }
// //     return children;
// //   };

// //   const handleLogout = () => {
// //     auth.signOut();
// //   };

// //   return (
// //     <BrowserRouter>
// //       {loading ? (
// //         <div className="text-center p-4">Loading...</div>
// //       ) : (
// //         <div style={{ display: 'flex' }}>
// //           {user && <Sidebar />}
// //           <div style={{ flex: 1, padding: '20px' }}>
// //             {/* {user && (
// //               <div className="flex justify-end mb-4">
// //                 <button
// //                   onClick={handleLogout}
// //                   className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>
// //             )} */}
// //             <Routes>
// //               {/* Public Routes */}
// //               <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
// //               <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
// //               <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
// //               <Route path="/forgetPassword" element={!user ? <ForgetPasswordForm /> : <Navigate to="/dashboard" />} />
// //               <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// //               <Route path="/roles" element={<ProtectedRoute permissionSection="roles"><Roles /></ProtectedRoute>} />
// //               <Route path='/subscribe' element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
// //               {/* Protected Routes */}


// //               <Route
// //                 path="/landing"
// //                 element={<ProtectedRoute><LandingPage /></ProtectedRoute>}
// //               />


// //               <Route path="/instituteSetup" element={<ProtectedRoute permissionSection="instituteSetup"><InstituteSetup /></ProtectedRoute>} />
// //               <Route
// //                 path="/dashboard"
// //                 element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/my-profile/:uid"
// //                 element={<ProtectedRoute><Profile /></ProtectedRoute>}
// //               />

// //               {/* Course Delivery Routes */}
// //               <Route
// //                 path="/courses"
// //                 element={<ProtectedRoute permissionSection="Course"><Courses /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createCourses"
// //                 element={<ProtectedRoute permissionSection="Course" action="create"><CreateCourses /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/editCourse/:id"
// //                 element={<ProtectedRoute permissionSection="Course" action="update"><EditCourse /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/courses/:courseId/learners"
// //                 element={<ProtectedRoute permissionSection="Course"><IndividualCourseStudnets /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/courses/:courseId/batches"
// //                 element={<ProtectedRoute permissionSection="Course"><IndividualCourseBatch /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/batches"
// //                 element={<ProtectedRoute permissionSection="Batch"><Batches /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createBatch"
// //                 element={<ProtectedRoute permissionSection="Batch" action="create"><CreateBatch /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/curriculum"
// //                 element={<ProtectedRoute permissionSection="curriculums"><Curriculum /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createCurriculum"
// //                 element={<ProtectedRoute permissionSection="curriculums" action="create"><CreateCurriculum /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/curriculum/:curriculumId"
// //                 element={<ProtectedRoute permissionSection="curriculums" action="update"><CurriculumEditor /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/curriculum/:curriculumId/section/:sectionId"
// //                 element={<ProtectedRoute permissionSection="curriculums"><SectionMaterials /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/curriculum/:curriculumId/section/:sectionId/add-material"
// //                 element={<ProtectedRoute permissionSection="curriculums" action="create"><AddMaterial /></ProtectedRoute>}
// //               />

              
// //               <Route
// //                 path="/edit-curriculum/:id"
// //                 element={<ProtectedRoute permissionSection="curriculums" action="update"><EditCurriculum /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/calendar"
// //                 element={<ProtectedRoute permissionSection="Sessions"><Calendar /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/sessions"
// //                 element={<ProtectedRoute permissionSection="Sessions"><Sessions /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createSession"
// //                 element={<ProtectedRoute permissionSection="Sessions" action="create"><CreateSession /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/zoom"
// //                 element={<ProtectedRoute permissionSection="Sessions"><ZoomSession /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/subjects"
// //                 element={<ProtectedRoute permissionSection="Sessions"><Subjects /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createSubjects"
// //                 element={<ProtectedRoute permissionSection="Sessions" action="create"><CreateSubjects /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/assignment"
// //                 element={<ProtectedRoute permissionSection="assignments"><Assignments /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/feedback"
// //                 element={<ProtectedRoute permissionSection="feedback"><Feedback /></ProtectedRoute>}
// //               />

// //               {/* Instructor Routes */}
// //               <Route
// //                 path="/instructor"
// //                 element={<ProtectedRoute permissionSection="Instructor"><Instructor /></ProtectedRoute>}
// //               />

// //               {/* Enquiry  */}
// //               <Route
// //                 path='/enquiry'
// //                 element={
// //                    <ProtectedRoute
// //                      permissionSection="enquiries"
// //                    >
// //                     <KanbanBoard />
// //                    </ProtectedRoute>
// //                 }
// //               />
// //               {/* Student Routes */}
// //               <Route
// //                 path="/studentdetails"
// //                 element={<ProtectedRoute permissionSection="student"><StudentDetails /></ProtectedRoute>}
// //               />
              
// //               <Route
// //                 path="/question-bank"
// //                 element={<ProtectedRoute permissionSection="questions"><QuestionBank /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/question-template"
// //                 element={<ProtectedRoute permissionSection="templates"><QuestionTemplate /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/studentdetails/addstudent"
// //                 element={<ProtectedRoute permissionSection="student" action="create"><AddStudent /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/studentdetails/updatestudent/:studentId"
// //                 element={<ProtectedRoute permissionSection="student" action="update"><EditStudent /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/studentdetails/:studentId"
// //                 element={<ProtectedRoute permissionSection="student"><StudentInfo /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/add-course/:studentId"
// //                 element={<ProtectedRoute permissionSection="student" action="update"><AddCourse /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/attendance"
// //                 element={<ProtectedRoute permissionSection="attendance"><Attendance /></ProtectedRoute>}
// //               />

// //               {/* Performance Routes */}
// //               <Route
// //                 path="/addPerformance"
// //                 element={<ProtectedRoute permissionSection="performance"><AddPerformance /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/mocktestsessions"
// //                 element={<ProtectedRoute permissionSection="mockTests"><MockTestSessions /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createMockTest"
// //                 element={<ProtectedRoute permissionSection="mockTests" action="create"><CreateMockTest /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createExaminationRemarks"
// //                 element={<ProtectedRoute permissionSection="examination"><CreateExaminationRemarks /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/attendenceremark"
// //                 element={<ProtectedRoute permissionSection="attendance"><AttendanceRemarks /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createAttendanceRemarks"
// //                 element={<ProtectedRoute permissionSection="attendance" action="create"><CreateAttendenceRemarks /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/feesremark"
// //                 element={<ProtectedRoute permissionSection="fee"><FeesRemarks /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/createFeesRemarks"
// //                 element={<ProtectedRoute permissionSection="fee" action="create"><CreateFeesRemarks /></ProtectedRoute>}
// //               />

// //               {/* Finance and Invoices */}
// //               <Route
// //                 path="/financePartners"
// //                 element={<ProtectedRoute permissionSection="FinancePartner"><FinancePartner /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/addFinancePartner"
// //                 element={<ProtectedRoute permissionSection="FinancePartner" action="create"><AddFinancePartner /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/invoices"
// //                 element={<ProtectedRoute permissionSection="invoice"><Invoices /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/invoices/createInvoice"
// //                 element={<ProtectedRoute permissionSection="invoice" action="create"><CreateInvoice /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/invoices/updateInvoice/:id"
// //                 element={<ProtectedRoute permissionSection="invoice" action="update"><UpdateInvoice /></ProtectedRoute>}
// //               />

// //               {/* Reports */}
// //               <Route
// //                 path="/reports"
// //                 element={<ProtectedRoute permissionSection="fee"><InstallmentReport /></ProtectedRoute>}
// //               />

// //               {/* Roles */}
// //               <Route
// //                 path="/roles"
// //                 element={<ProtectedRoute permissionSection="roles"><Role /></ProtectedRoute>}
// //               />
// //               <Route
// //                 path="/users"
// //                 element={<ProtectedRoute permissionSection="Users"><User /></ProtectedRoute>}
// //               />
// //             </Routes>
// //           </div>
// //         </div>
// //       )}
// //     </BrowserRouter>
// //   );
// // }


// import React, { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { getAuth } from 'firebase/auth';
// import { useAuth } from './context/AuthContext';

// // Home Pages
// import Sidebar from './pages/home/Sidebar.jsx';
// import LoginForm from './pages/home/LoginForm.jsx';
// import RegisterForm from './pages/home/RegisterForm.jsx';
// import Welcome from './pages/home/Welcome.jsx';
// import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';
// import InstituteSetup from './pages/home/InstituteSetup.jsx';

// // Components
// import Dashboard from './pages/components/Dashboard/Dashboard.jsx';
// import Roles from './pages/components/UsersAndRoles/Roles';
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
// import Role from './pages/components/UsersAndRoles/Roles.jsx';
// import Assignments from './pages/components/CourseDelivery/Assignment/Assignment.jsx';
// import StudentInfo from './StudentInformation/StudentInfo.jsx';
// import AddCourse from './pages/components/Students/AddStudent/AddCourse.jsx';
// import FinancePartner from './pages/components/FinancePartner/FinancePartner.jsx';
// import AddFinancePartner from './pages/components/FinancePartner/AddFinancePartner.jsx';
// import Attendance from './StudentInformation/Attendance.jsx';
// import User from './pages/components/UsersAndRoles/User.jsx';
// import LandingPage from './pages/Landing/LandingPage.jsx';
// import KanbanBoard from './pages/components/EnquiryManagement/KanbanBoard.jsx';
// import Subscribe from './pages/home/Subscribe.jsx';
// import QuestionBank from './pages/components/QuestionBank/QuestionBank.jsx';
// import QuestionTemplate from './pages/components/QuestionBank/QuestionTemplate.jsx';
// import AdminLogs from './pages/components/AdminLogs.jsx';
// import CourseAnalyticsDashboard from './pages/components/CourseDelivery/Course/CourseAnalyticsDashboard.jsx'
// import InstallmentDashboard from './reports/InstallmentDashboard.jsx';
// import AttendanceDashboard from './StudentInformation/AttendanceDashboard.jsx'
// import EnquiryDashboard from './pages/components/EnquiryManagement/EnquiryDashboard.jsx';
// import EnquiryAnalyticsPage from './pages/components/EnquiryManagement/EnquiryAnalyticsPage.jsx';

// export default function App() {
//   const { user, rolePermissions, loading } = useAuth();
//   const auth = getAuth();

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
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
//               <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
//               <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
//               <Route path="/forgetPassword" element={!user ? <ForgetPasswordForm /> : <Navigate to="/dashboard" />} />
//               <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//               <Route path="/roles" element={<ProtectedRoute permissionSection="roles"><Roles /></ProtectedRoute>} />
//               <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />

//               {/* Protected Routes */}
//               <Route path="/instituteSetup" element={<ProtectedRoute permissionSection="instituteSetup"><InstituteSetup /></ProtectedRoute>} />
//               <Route path="/my-profile/:uid" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

//               {/* Course Delivery Routes */}
//               <Route path="/courses" element={<ProtectedRoute permissionSection="Course"><Courses /></ProtectedRoute>} />
//               <Route path="/createCourses" element={<ProtectedRoute permissionSection="Course" action="create"><CreateCourses /></ProtectedRoute>} />
//               <Route path="/editCourse/:id" element={<ProtectedRoute permissionSection="Course" action="update"><EditCourse /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/learners" element={<ProtectedRoute permissionSection="Course"><IndividualCourseStudnets /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/batches" element={<ProtectedRoute permissionSection="Course"><IndividualCourseBatch /></ProtectedRoute>} />
//               <Route path="/course-analytics-dashboard" element={<ProtectedRoute permissionSection="Course"><CourseAnalyticsDashboard /></ProtectedRoute>} />

              
//               {/* Batch Routes */}
//               <Route path="/batches" element={<ProtectedRoute permissionSection="Batch"><Batches /></ProtectedRoute>} />
//               <Route path="/createBatch" element={<ProtectedRoute permissionSection="Batch" action="create"><CreateBatch /></ProtectedRoute>} />
//               <Route path="/batches/:batchId/add-material" element={<ProtectedRoute permissionSection="Batch" action="create"><AddMaterial /></ProtectedRoute>} />

//               {/* Curriculum Routes */}
//               <Route path="/curriculum" element={<ProtectedRoute permissionSection="curriculums"><Curriculum /></ProtectedRoute>} />
//               {/* <Route path="/createCurriculum" element={<ProtectedRoute permissionSection="curriculums" action="create"><CreateCurriculum /></ProtectedRoute>} /> */}
//               <Route path="/curriculum/:curriculumId" element={<ProtectedRoute permissionSection="curriculums" action="update"><CurriculumEditor /></ProtectedRoute>} />
//               <Route path="/curriculum/:curriculumId/section/:sectionId" element={<ProtectedRoute permissionSection="curriculums"><SectionMaterials /></ProtectedRoute>} />
//               <Route path="/curriculum/:curriculumId/section/:sectionId/add-material" element={<ProtectedRoute permissionSection="curriculums" action="create"><AddMaterial /></ProtectedRoute>} />
//               <Route path="/curriculum/:curriculumId/section/:sectionId/session/:sessionId/add-material" element={<ProtectedRoute permissionSection="curriculums" action="create"><AddMaterial /></ProtectedRoute>} />
//               <Route path="/edit-curriculum/:id" element={<ProtectedRoute permissionSection="curriculums" action="update"><EditCurriculum /></ProtectedRoute>} />

//               {/* Session Routes */}
//               <Route path="/calendar" element={<ProtectedRoute permissionSection="Sessions"><Calendar /></ProtectedRoute>} />
//               <Route path="/sessions" element={<ProtectedRoute permissionSection="Sessions"><Sessions /></ProtectedRoute>} />
//               <Route path="/createSession" element={<ProtectedRoute permissionSection="Sessions" action="create"><CreateSession /></ProtectedRoute>} />
//               <Route path="/zoom" element={<ProtectedRoute permissionSection="Sessions"><ZoomSession /></ProtectedRoute>} />
//               <Route path="/subjects" element={<ProtectedRoute permissionSection="Sessions"><Subjects /></ProtectedRoute>} />
//               <Route path="/createSubjects" element={<ProtectedRoute permissionSection="Sessions" action="create"><CreateSubjects /></ProtectedRoute>} />
//               <Route path="/assignment" element={<ProtectedRoute permissionSection="assignments"><Assignments /></ProtectedRoute>} />
//               <Route path="/feedback" element={<ProtectedRoute permissionSection="feedback"><Feedback /></ProtectedRoute>} />

//               {/* Instructor Routes */}
//               <Route path="/instructor" element={<ProtectedRoute permissionSection="Instructor"><Instructor /></ProtectedRoute>} />

//               {/* Enquiry */}
//               <Route path="/enquiry" element={<ProtectedRoute permissionSection="enquiries"><KanbanBoard /></ProtectedRoute>} />
//               {/* <Route path="/enquiry" element={<ProtectedRoute permissionSection="enquiries"><EnquiryDashboard /></ProtectedRoute>} /> */}
//               <Route path="/enquiry-analytics" element={<ProtectedRoute permissionSection="enquiries"><EnquiryAnalyticsPage /></ProtectedRoute>} />



//               {/* Student Routes */}
//               <Route path="/studentdetails" element={<ProtectedRoute permissionSection="student"><StudentDetails /></ProtectedRoute>} />
//               <Route path="/question-bank" element={<ProtectedRoute permissionSection="questions"><QuestionBank /></ProtectedRoute>} />
//               <Route path="/question-template" element={<ProtectedRoute permissionSection="templates"><QuestionTemplate /></ProtectedRoute>} />
//               <Route path="/studentdetails/addstudent" element={<ProtectedRoute permissionSection="student" action="create"><AddStudent /></ProtectedRoute>} />
//               <Route path="/studentdetails/updatestudent/:studentId" element={<ProtectedRoute permissionSection="student" action="update"><EditStudent /></ProtectedRoute>} />
//               <Route path="/studentdetails/:studentId" element={<ProtectedRoute permissionSection="student"><StudentInfo /></ProtectedRoute>} />
//               <Route path="/add-course/:studentId" element={<ProtectedRoute permissionSection="enrollments"><AddCourse /></ProtectedRoute>} />
//               <Route path="/attendance" element={<ProtectedRoute permissionSection="attendance"><Attendance /></ProtectedRoute>} />
//               <Route path="/attendance-dashboard" element={<ProtectedRoute permissionSection="attendance"><AttendanceDashboard /></ProtectedRoute>} />



//               {/* Performance Routes */}
//               <Route path="/addPerformance" element={<ProtectedRoute permissionSection="performance"><AddPerformance /></ProtectedRoute>} />
//               <Route path="/mocktestsessions" element={<ProtectedRoute permissionSection="mockTests"><MockTestSessions /></ProtectedRoute>} />
//               <Route path="/createMockTest" element={<ProtectedRoute permissionSection="mockTests" action="create"><CreateMockTest /></ProtectedRoute>} />
//               <Route path="/createExaminationRemarks" element={<ProtectedRoute permissionSection="examination"><CreateExaminationRemarks /></ProtectedRoute>} />
//               <Route path="/attendenceremark" element={<ProtectedRoute permissionSection="attendance"><AttendanceRemarks /></ProtectedRoute>} />
//               <Route path="/createAttendanceRemarks" element={<ProtectedRoute permissionSection="attendance" action="create"><CreateAttendenceRemarks /></ProtectedRoute>} />
//               <Route path="/feesremark" element={<ProtectedRoute permissionSection="fee"><FeesRemarks /></ProtectedRoute>} />
//               <Route path="/createFeesRemarks" element={<ProtectedRoute permissionSection="fee" action="create"><CreateFeesRemarks /></ProtectedRoute>} />

//               {/* Finance and Invoices */}
//               <Route path="/financePartners" element={<ProtectedRoute permissionSection="FinancePartner"><FinancePartner /></ProtectedRoute>} />
//               <Route path="/addFinancePartner" element={<ProtectedRoute permissionSection="FinancePartner" action="create"><AddFinancePartner /></ProtectedRoute>} />
//               <Route path="/invoices" element={<ProtectedRoute permissionSection="invoice"><Invoices /></ProtectedRoute>} />
//               <Route path="/invoices/createInvoice" element={<ProtectedRoute permissionSection="invoice" action="create"><CreateInvoice /></ProtectedRoute>} />
//               <Route path="/invoices/updateInvoice/:id" element={<ProtectedRoute permissionSection="invoice" action="update"><UpdateInvoice /></ProtectedRoute>} />

//               {/* Reports */}
//               <Route path="/reports" element={<ProtectedRoute permissionSection="fee"><InstallmentReport /></ProtectedRoute>} />
//               <Route path="/reports-dashboard" element={<ProtectedRoute permissionSection="fee"><InstallmentDashboard /></ProtectedRoute>} />


//               {/* Roles */}
//               <Route
//                 path="/roles"
//                 element={<ProtectedRoute permissionSection="roles"><Role /></ProtectedRoute>}
//               />
//               <Route
//                 path="/users"
//                 element={<ProtectedRoute permissionSection="Users"><User /></ProtectedRoute>}
//               />
//               <Route
//                 path="/activity-logs"
//                 element={<ProtectedRoute permissionSection="activityLogs"><AdminLogs /></ProtectedRoute>}
//               />
//             </Routes>
//           </div>
//         </div>
//       )}
//     </BrowserRouter>
//   );
// }



import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuth } from './context/AuthContext.jsx';
// Home Pages
import Sidebar from './pages/home/Sidebar.jsx';
import LoginForm from './pages/home/LoginForm.jsx';
import RegisterForm from './pages/home/RegisterForm.jsx';
import Welcome from './pages/home/Welcome.jsx';
import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';
import InstituteSetup from './pages/components/InstituteSetup/InstituteSetup.jsx';
// Components
import Dashboard from './pages/components/Dashboard/Dashboard.jsx';
import Roles from './pages/components/UsersAndRoles/Roles';
import Batches from './pages/components/CourseDelivery/Batch/Batches.jsx';
import CreateBatch from './pages/components/CourseDelivery/Batch/CreateBatch.jsx';
import Courses from './pages/components/CourseDelivery/Course/Courses.jsx';
import CreateCourses from './pages/components/CourseDelivery/Course/CreateCourses.jsx';
import EditCourse from './pages/components/CourseDelivery/Course/EditCourse.jsx';
import IndividualCourseBatch from './pages/components/CourseDelivery/Course/IndividualCourseBatch.jsx';
import IndividualCourseStudnets from './pages/components/CourseDelivery/Course/IndividualCourseStudnets.jsx';
import Curriculum from './pages/components/CourseDelivery/Curriculum/Curriculum.jsx';
import CurriculumEditor from './pages/components/CourseDelivery/Curriculum/CurriculumEditor.jsx';
import NotesPage from './pages/components/CourseDelivery/Curriculum/NotesPages.jsx';
import CreateCurriculum from './pages/components/CourseDelivery/Curriculum/CreateCurriculum.jsx';
import SectionMaterials from './pages/components/CourseDelivery/Curriculum/SectionMaterials.jsx';
import AddMaterial from './pages/components/CourseDelivery/Curriculum/AddMaterials.jsx';
import EditCurriculum from './pages/components/CourseDelivery/Curriculum/EditCurriculum.jsx';
// import Calendar from './pages/components/CourseDelivery/Session/Calendar.jsx';
import Sessions from './pages/components/CourseDelivery/Session/Sessions.jsx';
import CreateSession from './pages/components/CourseDelivery/Session/CreateSession.jsx';
// import ZoomSession from './pages/components/CourseDelivery/Session/ZoomSession.jsx';
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
import InstallmentReport from './reports/InstallmentReport.jsx';
import Invoices from './pages/components/Invoices/Invoices.jsx';
import CreateInvoice from './pages/components/Invoices/CreateInvoice.jsx';
import UpdateInvoice from './pages/components/Invoices/UpdateInvoice.jsx';
import Role from './pages/components/UsersAndRoles/Roles.jsx';
import Assignments from './pages/components/CourseDelivery/Assignment/Assignment.jsx';
import StudentInfo from './StudentInformation/StudentInfo.jsx';
import AddCourse from './pages/components/Students/AddStudent/AddCourse.jsx';
import FinancePartner from './pages/components/FinancePartner/FinancePartner.jsx';
import AddFinancePartner from './pages/components/FinancePartner/AddFinancePartner.jsx';
import Attendance from './StudentInformation/Attendance.jsx';
import User from './pages/components/UsersAndRoles/User.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import KanbanBoard from './pages/components/EnquiryManagement/kanbanBoard.jsx';
import Subscribe from './pages/home/Subscribe.jsx';
import QuestionBank from './pages/components/QuestionBank/QuestionBank.jsx';
import QuestionTemplate from './pages/components/QuestionBank/QuestionTemplate.jsx';
import AdminLogs from './pages/components/AdminLogs.jsx';
import CourseAnalyticsDashboard from './pages/components/CourseDelivery/Course/CourseAnalyticsDashboard.jsx'
import InstallmentDashboard from './reports/InstallmentDashboard.jsx';
import AttendanceDashboard from './StudentInformation/AttendanceDashboard.jsx'
import EnquiryDashboard from './pages/components/EnquiryManagement/EnquiryDashboard.jsx';
import EnquiryAnalyticsPage from './pages/components/EnquiryManagement/EnquiryAnalyticsPage.jsx';
import EnquiryForms from './pages/components/EnquiryForm/EnquiryForm.jsx';
import SubmitEnquiryForm from './pages/components/EnquiryForm/SubmitEnquiryForm.jsx';
// import SubmitEnquiryForm from './pages/components/EnquiryForm/SubmitEnquiryForm.jsx';
import EnquiryFormPage from "./pages/components/EnquiryForm/EnquiryFormPage";
import ProfilePage from './pages/home/ProfilePage.jsx';
import EmployeeAttendance from './pages/components/HRManagement/TimeAndAttendanceTracking/EmployeeAttendance.jsx';
import HolidayCalendar from './pages/components/HRManagement/HolidayCalendar.jsx';
import EmployeePage from './pages/components/HRManagement/TimeAndAttendanceTracking/Employeepage.jsx';
import HRLeaveApproval from './pages/components/HRManagement/Leave/HRLeaveApproval.jsx';
import LeaveApplication from './pages/components/HRManagement/Leave/LeaveApplication.jsx';
import Companies from './pages/components/PlacementManagement/Companies/Companies.jsx';
import JobOpenings from './pages/components/PlacementManagement/JobOpenings/JobOpenings.jsx';
import RecruiterView from './pages/components/PlacementManagement/JobOpenings/RecruiterView.jsx';
<<<<<<< HEAD
import UniqueEnquiryForm from '../formEnquiry/UniqueEnquiryForm.jsx';
=======
import EmployeeProfile from './pages/components/HRManagement/EmployeeDirectory/EmployeeProfile.jsx';
import ActiveStatus from './pages/ActiveStatus.jsx';
import EmployeeRegistrationForm from './pages/home/EmployeeRegistrationForm.jsx';
import AfterEmployeeRegistration from './pages/home/AfterEmployeeRegistration.jsx';
>>>>>>> 0952d598347a5c1917fcfc3dc560df59f23fb5cf

export default function App() {
  const { user, rolePermissions, loading } = useAuth();
  const auth = getAuth();

  const ProtectedRoute = ({ children, permissionSection, action = 'display' }) => {
    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (permissionSection && rolePermissions[permissionSection]?.[action] !== true) {
      return <div className="p-4 text-red-600">Access Denied: Insufficient Permissions</div>;
    }
    return children;
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <BrowserRouter>
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <>
          {user && <ActiveStatus />}
          <div style={{ display: 'flex' }}>
            {user && <Sidebar />}
            <div style={{ flex: 1, padding: '20px' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
                <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
                <Route path="/registration-welcome" element={<AfterEmployeeRegistration/>} />
                <Route path="/employee-registration" element={!user ? <EmployeeRegistrationForm /> : <Navigate to="/dashboard" />} />

                
                <Route path="/forgetPassword" element={!user ? <ForgetPasswordForm /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/roles" element={<ProtectedRoute permissionSection="roles"><Roles /></ProtectedRoute>} />
                <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />

                {/* Protected Routes */}
                <Route path="/instituteSetup" element={<ProtectedRoute permissionSection="instituteSetup"><InstituteSetup /></ProtectedRoute>} />
                <Route path="/my-profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                {/* Course Delivery Routes */}
                <Route path="/courses" element={<ProtectedRoute permissionSection="Course"><Courses /></ProtectedRoute>} />
                <Route path="/createCourses" element={<ProtectedRoute permissionSection="Course" action="create"><CreateCourses /></ProtectedRoute>} />
                <Route path="/editCourse/:id" element={<ProtectedRoute permissionSection="Course" action="update"><EditCourse /></ProtectedRoute>} />
                <Route path="/courses/:courseId/learners" element={<ProtectedRoute permissionSection="Course"><IndividualCourseStudnets /></ProtectedRoute>} />
                <Route path="/courses/:courseId/batches" element={<ProtectedRoute permissionSection="Course"><IndividualCourseBatch /></ProtectedRoute>} />
                <Route path="/course-analytics-dashboard" element={<ProtectedRoute permissionSection="Course"><CourseAnalyticsDashboard /></ProtectedRoute>} />

                {/* Batch Routes */}
                <Route path="/batches" element={<ProtectedRoute permissionSection="Batch"><Batches /></ProtectedRoute>} />
                <Route path="/createBatch" element={<ProtectedRoute permissionSection="Batch" action="create"><CreateBatch /></ProtectedRoute>} />
                <Route path="/batches/:batchId/add-material" element={<ProtectedRoute permissionSection="Batch" action="create"><AddMaterial /></ProtectedRoute>} />

                {/* Curriculum Routes */}
                <Route path="/curriculum" element={<ProtectedRoute permissionSection="curriculums"><Curriculum /></ProtectedRoute>} />
                <Route path="/createCurriculum" element={<ProtectedRoute permissionSection="curriculums" action="create"><CreateCurriculum /></ProtectedRoute>} />
                <Route path="/curriculum/:curriculumId" element={<ProtectedRoute permissionSection="curriculums" action="update"><CurriculumEditor /></ProtectedRoute>} />
                <Route path="/curriculum/:curriculumId/section/:sectionId" element={<ProtectedRoute permissionSection="curriculums"><SectionMaterials /></ProtectedRoute>} />
                <Route path="/curriculum/:curriculumId/section/:sectionId/add-material" element={<ProtectedRoute permissionSection="curriculums" action="create"><AddMaterial /></ProtectedRoute>} />
                <Route path="/curriculum/:curriculumId/section/:sectionId/session/:sessionId/add-material" element={<ProtectedRoute permissionSection="curriculums" action="create"><AddMaterial /></ProtectedRoute>} />
                <Route path="/edit-curriculum/:id" element={<ProtectedRoute permissionSection="curriculums" action="update"><EditCurriculum /></ProtectedRoute>} />

                {/* Session Routes */}
                <Route path="/sessions" element={<ProtectedRoute permissionSection="Sessions"><Sessions /></ProtectedRoute>} />
                <Route path="/createSession" element={<ProtectedRoute permissionSection="Sessions" action="create"><CreateSession /></ProtectedRoute>} />
                <Route path="/subjects" element={<ProtectedRoute permissionSection="Sessions"><Subjects /></ProtectedRoute>} />
                <Route path="/createSubjects" element={<ProtectedRoute permissionSection="Sessions" action="create"><CreateSubjects /></ProtectedRoute>} />
                <Route path="/assignment" element={<ProtectedRoute permissionSection="assignments"><Assignments /></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute permissionSection="feedback"><Feedback /></ProtectedRoute>} />

                {/* Instructor Routes */}
                <Route path="/instructor" element={<ProtectedRoute permissionSection="Instructor"><Instructor /></ProtectedRoute>} />

<<<<<<< HEAD
              {/* Enquiry */}
              <Route path="/enquiry/:formId" element={<ProtectedRoute permissionSection="enquiries"><SubmitEnquiryForm /></ProtectedRoute>} />
              {/* <Route path="/enquiry-form/:formId" element={<ProtectedRoute permissionSection="enquiries"><SubmitEnquiryForm /></ProtectedRoute>} /> */}
              <Route path="/enquiry" element={<ProtectedRoute permissionSection="enquiries"><KanbanBoard /></ProtectedRoute>} />
              {/* <Route path="/enquiry" element={<ProtectedRoute permissionSection="enquiries"><EnquiryDashboard /></ProtectedRoute>} /> */}
              <Route path="/enquiry-analytics" element={<ProtectedRoute permissionSection="enquiries"><EnquiryAnalyticsPage /></ProtectedRoute>} />
              <Route path="/addFormForEnquiry" element={<ProtectedRoute permissionSection="enquiries"><EnquiryForms /></ProtectedRoute>} />
              <Route path="/enquiry/:id" element={<EnquiryFormPage />} />
              <Route path='/:formId' element={<UniqueEnquiryForm/>}/>
              
              {/* Student Routes */}
              <Route path="/studentdetails" element={<ProtectedRoute permissionSection="student"><StudentDetails /></ProtectedRoute>} />
              <Route path="/question-bank" element={<ProtectedRoute permissionSection="questions"><QuestionBank /></ProtectedRoute>} />
              <Route path="/question-template" element={<ProtectedRoute permissionSection="templates"><QuestionTemplate /></ProtectedRoute>} />
              <Route path="/studentdetails/addstudent" element={<ProtectedRoute permissionSection="student" action="create"><AddStudent /></ProtectedRoute>} />
              <Route path="/studentdetails/updatestudent/:studentId" element={<ProtectedRoute permissionSection="student" action="update"><EditStudent /></ProtectedRoute>} />
              <Route path="/studentdetails/:studentId" element={<ProtectedRoute permissionSection="student"><StudentInfo /></ProtectedRoute>} />
              <Route path="/add-course/:studentId" element={<ProtectedRoute permissionSection="enrollments"><AddCourse /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute permissionSection="attendance"><Attendance /></ProtectedRoute>} />
              <Route path="/attendance-dashboard" element={<ProtectedRoute permissionSection="attendance"><AttendanceDashboard /></ProtectedRoute>} />
=======
                {/* Enquiry Routes */}
                <Route path="/enquiry/:formId" element={<ProtectedRoute permissionSection="enquiries"><SubmitEnquiryForm /></ProtectedRoute>} />
                <Route path="/enquiry" element={<ProtectedRoute permissionSection="enquiries"><KanbanBoard /></ProtectedRoute>} />
                <Route path="/enquiry-analytics" element={<ProtectedRoute permissionSection="enquiries"><EnquiryAnalyticsPage /></ProtectedRoute>} />
                <Route path="/addFormForEnquiry" element={<ProtectedRoute permissionSection="enquiries"><EnquiryForms /></ProtectedRoute>} />
                <Route path="/enquiry/:id" element={<EnquiryFormPage />} />

                {/* Student Routes */}
                <Route path="/studentdetails" element={<ProtectedRoute permissionSection="student"><StudentDetails /></ProtectedRoute>} />
                <Route path="/question-bank" element={<ProtectedRoute permissionSection="questions"><QuestionBank /></ProtectedRoute>} />
                <Route path="/question-template" element={<ProtectedRoute permissionSection="templates"><QuestionTemplate /></ProtectedRoute>} />
                <Route path="/studentdetails/addstudent" element={<ProtectedRoute permissionSection="student" action="create"><AddStudent /></ProtectedRoute>} />
                <Route path="/studentdetails/updatestudent/:studentId" element={<ProtectedRoute permissionSection="student" action="update"><EditStudent /></ProtectedRoute>} />
                <Route path="/studentdetails/:studentId" element={<ProtectedRoute permissionSection="student"><StudentInfo /></ProtectedRoute>} />
                <Route path="/add-course/:studentId" element={<ProtectedRoute permissionSection="enrollments"><AddCourse /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute permissionSection="attendance"><Attendance /></ProtectedRoute>} />
                <Route path="/attendance-dashboard" element={<ProtectedRoute permissionSection="attendance"><AttendanceDashboard /></ProtectedRoute>} />
>>>>>>> 0952d598347a5c1917fcfc3dc560df59f23fb5cf

                {/* Performance Routes */}
                <Route path="/addPerformance" element={<ProtectedRoute permissionSection="performance"><AddPerformance /></ProtectedRoute>} />
                <Route path="/mocktestsessions" element={<ProtectedRoute permissionSection="mockTests"><MockTestSessions /></ProtectedRoute>} />
                <Route path="/createMockTest" element={<ProtectedRoute permissionSection="mockTests" action="create"><CreateMockTest /></ProtectedRoute>} />
                <Route path="/createExaminationRemarks" element={<ProtectedRoute permissionSection="examination"><CreateExaminationRemarks /></ProtectedRoute>} />
                <Route path="/attendenceremark" element={<ProtectedRoute permissionSection="attendance"><AttendanceRemarks /></ProtectedRoute>} />
                <Route path="/createAttendanceRemarks" element={<ProtectedRoute permissionSection="attendance" action="create"><CreateAttendenceRemarks /></ProtectedRoute>} />
                <Route path="/feesremark" element={<ProtectedRoute permissionSection="fee"><FeesRemarks /></ProtectedRoute>} />
                <Route path="/createFeesRemarks" element={<ProtectedRoute permissionSection="fee" action="create"><CreateFeesRemarks /></ProtectedRoute>} />

                {/* Finance and Invoices */}
                <Route path="/financePartners" element={<ProtectedRoute permissionSection="FinancePartner"><FinancePartner /></ProtectedRoute>} />
                <Route path="/addFinancePartner" element={<ProtectedRoute permissionSection="FinancePartner" action="create"><AddFinancePartner /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute permissionSection="invoice"><Invoices /></ProtectedRoute>} />
                <Route path="/invoices/createInvoice" element={<ProtectedRoute permissionSection="invoice" action="create"><CreateInvoice /></ProtectedRoute>} />
                <Route path="/invoices/updateInvoice/:id" element={<ProtectedRoute permissionSection="invoice" action="update"><UpdateInvoice /></ProtectedRoute>} />

                {/* Reports */}
                <Route path="/reports" element={<ProtectedRoute permissionSection="fee"><InstallmentReport /></ProtectedRoute>} />
                <Route path="/reports-dashboard" element={<ProtectedRoute permissionSection="fee"><InstallmentDashboard /></ProtectedRoute>} />

                {/* Roles */}
                <Route path="/roles" element={<ProtectedRoute permissionSection="roles"><Role /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute permissionSection="Users"><User /></ProtectedRoute>} />
                <Route path="/activity-logs" element={<ProtectedRoute permissionSection="activityLogs"><AdminLogs /></ProtectedRoute>} />

                {/* HR */}
                <Route path="/employee-attendance" element={<ProtectedRoute permissionSection="Users"><EmployeeAttendance /></ProtectedRoute>} />
                <Route path="/holiday-calendar" element={<HolidayCalendar />} />
                <Route path="/employee-attendance/:email" element={<EmployeePage />} />
                <Route path="/leave-management" element={<HRLeaveApproval />} />
                <Route path="/leave-application" element={<LeaveApplication />} />
                <Route path="/employee-profile/:employeeId" element={<EmployeeProfile />} />

                {/* Placement */}
                <Route path="/companies" element={<Companies />} />
                <Route path="/job-openings" element={<JobOpenings />} />
                <Route path="/recruiter-view/:id" element={<RecruiterView />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </BrowserRouter>
  );
}