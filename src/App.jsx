import React from 'react';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import ClassesTaught from './pages/ClassesTaught.jsx';
import SuperAdmin from './pages/SuperAdmin.jsx';
import SuperAdminMain from './pages/SuperAdminMain.jsx';
import Courses from './pages/Courses.jsx';
import Batches from './pages/Batches.jsx';
import CreateCourse from './pages/components/CreateCourses.jsx';
import CreateBatch from './pages/components/CreateBatch.jsx';
import CurriculumEditor from './pages/CurriculumEditor.jsx';
import CreateCurriculum from './pages/CreateCurriculum.jsx';
import ClassRec from './pages/ClassRec.jsx';
import Instructor from './pages/Instructor.jsx';
import ScheduleUI from './pages/ScheduleUI.jsx';
import CreateSession from './pages/CreateSession.jsx';
import Attendence from './pages/Attendence.jsx';
import Curriculum from './pages/Curriculum.jsx';
import CurriculumDetails from './pages/CurriculumDetails.jsx';
import AddInstructors from './pages/AddInstructors.jsx';
import AdminsInstructors from './pages/AdminsInstructor.jsx';
import Feedback from './pages/Feedback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LoginForm from './pages/LoginForm.jsx';
import RegisterForm from './pages/RegisterForm.jsx';
import StudentDetails from './pages/StudentDetails.jsx';
import AddStudent from './pages/components/AddStudent.jsx';
import Profile from './pages/components/Profile.jsx';
import EditStudent from './pages/components/EditStudent.jsx';
import StudentInfo from './pages/components/StudentInfo.jsx';
import EducationalDetails from './pages/components/StudentInformation/EducationalDetails.jsx';
import Invoices from './pages/components/Invoices.jsx';
import CreateInvoice from './pages/components/InvoicesDetails/CreateInvoice.jsx';
import UpdateInvoice from './pages/components/InvoicesDetails/UpdateInvoice.jsx';
import Welcome from './pages/Welcome.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './context/AuthContext';

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
            <Route path="/studentdetails" element={<StudentDetails />} />
            <Route path="/studentdetails/addstudent" element={<AddStudent />} />
            <Route path="/studentdetails/updatestudent/:studentId" element={<EditStudent />} />
            <Route path="/studentdetails/studentinfo/:studentId" element={<StudentInfo />} />
            <Route path="/educationaldetails" element={<EducationalDetails />} />
            <Route path="/studentdetails/invoices" element={<Invoices />} />
            <Route path="/studentdetails/invoices/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoices/update-invoice/:invoiceId" element={<UpdateInvoice />} />
            <Route path="/" element={user ? <Profile /> : <Welcome />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/superAdminMain" element={<SuperAdminMain />} />
            <Route path="/superadmin" element={<SuperAdmin />} />
            <Route path="/classesTaught" element={<ClassesTaught />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/createCourse" element={<CreateCourse />} />
            <Route path="/createBatch" element={<CreateBatch />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/scheduleUI" element={<ScheduleUI />} />
            <Route path="/createSession" element={<CreateSession />} />
            <Route path="/attendence" element={<Attendence />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/curriculum/:curriculumId" element={<CurriculumDetails />} />
            <Route path="/createCurriculum" element={<CreateCurriculum />} />
            <Route path="/addInstructors" element={<AddInstructors />} />
            <Route path="/curriculumEditor" element={<CurriculumEditor />} />
            <Route path="/classRec" element={<ClassRec />} />
            <Route path="/adminInstructor" element={<AdminsInstructors />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
