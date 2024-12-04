import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginComponent from './components/auth/Login';
import SignupComponent from './components/auth/Signup';
import AdminDashboard from './components/admin/AdminDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import { AdminGuard, FacultyGuard, StudentGuard } from './guards/RoleGuard';
import AddFaculty from './components/admin/AddFaculty';
import AssignCourses from './components/admin/AssignCourses';
import CourseDetails from './components/admin/ViewCourseDetails';
import ViewFacultyDetails from './components/admin/ViewFacultyDetails';
import FacultyCourses from './components/faculty/ViewAssignedCourses';
import AddQuestions from './components/faculty/AddQuestions';
import ValidateAnswers from './components/faculty/ValidateAnswers';
import Navigation from './components/shared/Navigation';
import ViewQuestions from './components/faculty/ViewQuestions';
import RegisterCourse from './components/student/RegisterCourse';
import AttemptExam from './components/student/AttemptExam';
import ViewResults from './components/student/ViewResults';
import HomeDashboard from './components/student/HomeDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignupComponent />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminGuard requiredRole="admin" />}>
          <Route element={<NavigationLayout />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="add-faculty" element={<AddFaculty />} />
            <Route path="assign-courses" element={<AssignCourses />} />
            <Route path="view-faculty" element={<ViewFacultyDetails />} />
            <Route path="view-courses" element={<CourseDetails />} />
          </Route>
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty/*" element={<FacultyGuard requiredRole="faculty" />}>
          <Route element={<NavigationLayout />}>
            <Route path="" element={<FacultyDashboard />} />
            <Route path="viewAssignedCourses" element={<FacultyCourses />} />
            <Route path="addQuestions" element={<AddQuestions />} />
            <Route path="validateAnswers" element={<ValidateAnswers />} />
            <Route path="viewQuestions" element={<ViewQuestions />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route path="/student/*" element={<StudentGuard requiredRole="student" />}>
          <Route element={<NavigationLayout />}>
            <Route path="" element={<StudentDashboard />} />
            <Route path="home" element={<HomeDashboard />} />
            <Route path="register-course" element={<RegisterCourse />} />
            <Route path="attempt-exam" element={<AttemptExam/>} />
            <Route path="view-results" element={<ViewResults />} />
          </Route>
        </Route>

      
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

const NavigationLayout: React.FC = () => (
  <>
    <Navigation />
    <div className="dashboard-content">
      <Outlet />
    </div>
  </>
);

export default App;