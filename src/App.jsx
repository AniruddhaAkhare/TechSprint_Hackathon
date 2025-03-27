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
              <Route path="/notes/:curriculumId/:sectionId" element={<NotesPage />} />


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
