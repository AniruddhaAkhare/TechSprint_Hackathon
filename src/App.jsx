import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuth } from './context/AuthContext.jsx';
// Home Pages
import Sidebar from './pages/home/Sidebar.jsx';
import LoginForm from './pages/home/LoginForm.jsx';
// import RegisterForm from './pages/home/RegisterForm.jsx';
import Welcome from './pages/home/Welcome.jsx';
import ForgetPasswordForm from './pages/home/ForgetPasswordForm.jsx';
import InstituteSetup from './pages/components/InstituteSetup/InstituteSetup.jsx';
// Components
import Dashboard from './pages/components/Dashboard/Dashboard.jsx';
import TaskCallSchdule from './pages/components/Tasks/TaskCallSchdule.jsx';
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
// import Profile from './pages/components/Profile.jsx';
import InstallmentReport from './pages/components/reports/InstallmentReport.jsx';
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
import LandingPage from './pages/Landing/LandingPage.jsx';
import KanbanBoard from './pages/components/EnquiryManagement/kanbanBoard.jsx';
import Subscribe from './pages/home/Subscribe.jsx';
import QuestionBank from './pages/components/QuestionBank/QuestionBank.jsx';
import QuestionTemplate from './pages/components/QuestionBank/QuestionTemplate.jsx';
import AdminLogs from './pages/components/AdminLogs.jsx';
import CourseAnalyticsDashboard from './pages/components/CourseDelivery/Course/CourseAnalyticsDashboard.jsx';
import InstallmentDashboard from './pages/components/reports/InstallmentDashboard';
import AttendanceDashboard from './StudentInformation/AttendanceDashboard.jsx';
// import EnquiryDashboard from './pages/components/EnquiryManagement/EnquiryDashboard.jsx';
import EnquiryAnalyticsPage from './pages/components/EnquiryManagement/EnquiryAnalyticsPage.jsx';
import EnquiryForms from './pages/components/EnquiryForm/EnquiryForm.jsx';
import SubmitEnquiryForm from './pages/components/EnquiryForm/SubmitEnquiryForm.jsx';
import ViewEnquiries from './pages/components/EnquiryForm/ViewEnquiries.jsx';
import EnquiryFormPage from "./pages/components/EnquiryForm/EnquiryFormPage";
import ProfilePage from './pages/home/ProfilePage.jsx';
import EmployeeAttendance from './pages/components/HRManagement/TimeAndAttendanceTracking/EmployeeAttendance.jsx';
import HolidayCalendar from './pages/components/HRManagement/HolidayCalendar.jsx';
import EmployeePage from './pages/components/HRManagement/TimeAndAttendanceTracking/EmployeePage.jsx';
import HRLeaveApproval from './pages/components/HRManagement/Leave/HRLeaveApproval.jsx';
import LeaveApplication from './pages/components/HRManagement/LeaveApplicationForm.jsx';
import Companies from './pages/components/PlacementManagement/Companies/Companies.jsx';
import JobOpenings from './pages/components/PlacementManagement/JobOpenings/JobOpenings.jsx';
import RecruiterView from './pages/components/PlacementManagement/JobOpenings/RecruiterView.jsx';
import UniqueEnquiryForm from '../formEnquiry/UniqueEnquiryForm.jsx';
import EmployeeProfile from './pages/components/Staff/EmployeeProfile.jsx';
import ActiveStatus from './pages/ActiveStatus.jsx';
import EmployeeRegistrationForm from './pages/home/EmployeeRegistrationForm.jsx';
import AfterEmployeeRegistration from './pages/home/AfterEmployeeRegistration.jsx';
import BulkAddStudents from './pages/components/Students/BulkAddStudents.jsx';
import { CheckInReminderProvider } from './context/CheckInRemainderContext.jsx';
import { ToastContainer } from 'react-toastify';
import AddStaff from './pages/components/Staff/AddStaff.jsx'
import Staff from  './pages/components/Staff/StaffAndUsers.jsx'
import EditStaff from './pages/components/Staff/EditStaff.jsx';
import StaffAndUsers from './pages/components/Staff/StaffAndUsers.jsx';
import EmployeeDashboard from './pages/home/EmployeeDashboard.jsx';
import OperationMain from './pages/components/HRManagement/Operation.jsx';
import Operation from './pages/components/HRManagement/Operation_main.jsx'
import MyShift from './pages/components/HRManagement/myShift.jsx'
import ShiftDisplay from  './pages/components/HRManagement/ShiftManagement.jsx'
import EmployeeManagement from './pages/components/HRManagement/Emanagement.jsx'
import AttendanceManagement from './pages/components/HRManagement/Amanagement.jsx'

export default function App() {
  const { user, rolePermissions, loading } = useAuth();
  const auth = getAuth();

  const ProtectedRoute = ({ children, permissionSection, action = 'display' }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen p-4 fixed inset-0 left-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      );
    }
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
        
            <div className="flex justify-center items-center h-screen p-4 fixed inset-0 left-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
      ) : (
        <>
          {user && <ActiveStatus />}
          <CheckInReminderProvider>
          <div style={{ display: 'flex' }}>
            {user && <Sidebar />}
            <div style={{ flex: 1, padding: '20px' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={user ? <Navigate to="/my-profile" /> : <LandingPage />} />
                <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/my-profile" />} />
                <Route path="/registration-welcome" element={<AfterEmployeeRegistration/>} />
                <Route path="/employee-registration" element={!user ? <EmployeeRegistrationForm /> : <Navigate to="/my-profile" />} />


                
                <Route path="/" element={<ProtectedRoute permissionSection="Users"><StaffAndUsers /></ProtectedRoute>} />

                <Route path="/forgetPassword" element={!user ? <ForgetPasswordForm /> : <Navigate to="/my-profile" />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                {/* <Route path="/tasks" element={<ProtectedRoute><TaskCallSchdule /></ProtectedRoute>} /> */}
                <Route path="/roles" element={<ProtectedRoute permissionSection="roles"><Roles /></ProtectedRoute>} />
                <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />

                {/* Protected Routes */}
                <Route path="/instituteSetup" element={<ProtectedRoute permissionSection="instituteSetup"><InstituteSetup /></ProtectedRoute>} />
                <Route path="/my-profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/tasks" element={<TaskCallSchdule />}/>
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
                <Route path="/addstaff" element={<ProtectedRoute permissionSection="Users"><AddStaff /></ProtectedRoute>} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/editstaff/:staffId" element={<ProtectedRoute permissionSection="Users"><EditStaff /></ProtectedRoute>} />


              {/* Enquiry */}
              <Route path="/enquiries/:formId" element={<ProtectedRoute permissionSection="enquiries"><ViewEnquiries /></ProtectedRoute>} />
              {/* <Route path="/enquiry/:formId" element={<ProtectedRoute permissionSection="enquiries"><SubmitEnquiryForm /></ProtectedRoute>} /> */}
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

                {/* Enquiry Routes */}
                <Route path="/enquiry/:formId" element={<ProtectedRoute permissionSection="enquiries"><SubmitEnquiryForm /></ProtectedRoute>} />
                <Route path="/enquiry" element={<ProtectedRoute permissionSection="enquiries"><KanbanBoard /></ProtectedRoute>} />
                <Route path="/enquiry-analytics" element={<ProtectedRoute permissionSection="enquiries"><EnquiryAnalyticsPage /></ProtectedRoute>} />
                <Route path="/addFormForEnquiry" element={<ProtectedRoute permissionSection="enquiries"><EnquiryForms /></ProtectedRoute>} />
                <Route path="/enquiry/:id" element={<EnquiryFormPage />} />
                <Route path='/:formId' element={<UniqueEnquiryForm/>}/>


                {/* Student Routes */}
                <Route path="/studentdetails" element={<ProtectedRoute permissionSection="student"><StudentDetails /></ProtectedRoute>} />
                <Route path="/studentdetails/bulkadd" element={<ProtectedRoute permissionSection="student"><BulkAddStudents /></ProtectedRoute>} />
                <Route path="/question-bank" element={<ProtectedRoute permissionSection="questions"><QuestionBank /></ProtectedRoute>} />
                <Route path="/question-template" element={<ProtectedRoute permissionSection="templates"><QuestionTemplate /></ProtectedRoute>} />
                <Route path="/studentdetails/addstudent" element={<ProtectedRoute permissionSection="student" action="create"><AddStudent /></ProtectedRoute>} />
                <Route path="/studentdetails/updatestudent/:studentId" element={<ProtectedRoute permissionSection="student" action="update"><EditStudent /></ProtectedRoute>} />
                <Route path="/studentdetails/:studentId" element={<ProtectedRoute permissionSection="student"><StudentInfo /></ProtectedRoute>} />
                <Route path="/add-course/:studentId" element={<ProtectedRoute permissionSection="enrollments"><AddCourse /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute permissionSection="attendance"><Attendance /></ProtectedRoute>} />
                <Route path="/attendance-dashboard" element={<ProtectedRoute permissionSection="attendance"><AttendanceDashboard /></ProtectedRoute>} />

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
                <Route path="/activity-logs" element={<ProtectedRoute permissionSection="activityLogs"><AdminLogs /></ProtectedRoute>} />

                {/* HR */}
                <Route path="/employee-attendance" element={<ProtectedRoute permissionSection="Users"><EmployeeAttendance /></ProtectedRoute>} />
                <Route path="/holiday-calendar" element={<HolidayCalendar />} />
                <Route path="/employee-attendance/:email" element={<EmployeePage />} />
                <Route path="/leave-management" element={<HRLeaveApproval />} />
                <Route path="/leave-application" element={<LeaveApplication />} />
                <Route path="/myShift" element={<MyShift  />} />                                                    
                <Route path="/operations-dashboard" element={<OperationMain/>} />
                <Route path="/shiftAll" element={<ShiftDisplay />} />
                <Route path="/operations" element={<Operation/>} />
                <Route path="/employee-profile/:employeeId" element={<EmployeeProfile />} />
                 <Route path="/employeeManagemnet" element={<EmployeeManagement />} />
                    <Route path="/attendanceManagemnet" element={<AttendanceManagement/>} />
                {/* <Route path="/Shift-Mapping" element={<ShiftManager/>} />
                <Route path="/Manage-ShiftsEmployee" element={< EmployeeManager />} />
                <Route path="/User-specific Operations" element={<UserSpecific />} /> */}
               

                {/* <Route path="/add-employee" element={<AddEmployee/>}/> */}

                 {/* Employee Dashboard  */}
                   {/* <Route path="/employeeDashbard" element={<EmployeeDashboard />} /> */}

                {/* Placement */}
                <Route path="/companies" element={<Companies />} />
                <Route path="/job-openings" element={<JobOpenings />} />
                <Route path="/recruiter-view/:id" element={<RecruiterView />} />
              </Routes>
            </div>
          </div>
          <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
          </CheckInReminderProvider>
        </>
      )}
    </BrowserRouter>
  );
}