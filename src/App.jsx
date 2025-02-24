import React from 'react';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Sidebar from './pages/home/Sidebar.jsx'
import LoginForm from './pages/home/LoginForm.jsx';
import RegisterForm from './pages/home/RegisterForm.jsx';
import Welcome from './pages/home/Welcome.jsx';

import Dashboard from './pages/components/Dashboard/Dashboard.jsx'

import Batches from './pages/components/CourseDelivery/Batch/Batches.jsx';
import CreateBatch from './pages/components/CourseDelivery/Batch/CreateBatch.jsx';

import Courses from './pages/components/CourseDelivery/Course/Courses.jsx';
import CreateCourses from './pages/components/CourseDelivery/Course/CreateCourses.jsx';
import EditCourse from './pages/components/CourseDelivery/Course/EditCourse.jsx';
import IndividualCourseBatch from './pages/components/CourseDelivery/Course/IndividualCourseBatch.jsx';
import Curriculum from './pages/components/CourseDelivery/Curriculum/Curriculum.jsx';

import Sessions from './pages/components/CourseDelivery/Session/Sessions.jsx';
import CreateSession from './pages/components/CourseDelivery/Session/CreateSession.jsx';

import Subjects from './pages/components/CourseDelivery/Subjects/Subjects.jsx';
import CreateSubjects from './pages/components/CourseDelivery/Subjects/CreateSubjects.jsx';

import Instructor from './pages/components/Instructors/Instructor.jsx';

import Feedback from './pages/components/CourseDelivery/Feedback/Feedback.jsx';

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


import Centers from './pages/components/Settings/Centers.jsx'

import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './context/AuthContext';
import IndividualCourseStudnets from './pages/components/CourseDelivery/Course/IndividualCourseStudnets.jsx';
import IndividualCourseCurriculum from './pages/components/CourseDelivery/Course/IndividualCourseCurriculum.jsx';

export default function App() {

  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex' }}>
          {user && <Sidebar />}
          <Routes>

            <Route path="/" element={user ? <Profile /> : <Welcome />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route path="/courses" element={<Courses />} />
            {/* <Route path="/create-course" element={<CreateCourses />} /> */}
            <Route path="/createCourses" element={<CreateCourses />} />
            <Route path="/editCourse/:id" element={<EditCourse />} />
            {/* <Route path="/courses/:courseId/curriculum" element={<Curriculum />} />
            <Route path="/editCourse/:id" element={<EditCourse />} /> */}
            <Route path="/courses/:id/curriculum" element={<IndividualCourseCurriculum />} />
            <Route path="/courses/:id/learners" element={<IndividualCourseStudnets />} />
            <Route path="/courses/:id/batches" element={<IndividualCourseBatch />} />

            <Route path='/batches' element={<Batches />} />
            <Route path="/createBatch" element={<CreateBatch />} />

            <Route path='/sessions' element={<Sessions />} />
            <Route path="/createSession" element={<CreateSession />} />

            <Route path="/instructor" element={<Instructor />} />

            <Route path='/curriculum' element={<Curriculum />} />
            <Route path="/createCurriculum" element={<CreateSubjects />} />

            <Route path="/studentdetails" element={<StudentDetails />} />
            <Route path="/studentdetails/addstudent" element={<AddStudent />} />
            <Route path="/studentdetails/updatestudent/:studentId" element={<EditStudent />} />

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

            <Route path='/centers' element={<Centers />} />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
