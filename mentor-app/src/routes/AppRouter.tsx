import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import FacultyDashboard from '../components/faculty/FacultyDashboard';
import StudentDashboard from '../components/student/StudentDashboard';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { AdminGuard, FacultyGuard, StudentGuard } from '../guards/RoleGuard';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<AdminGuard requiredRole="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/faculty" element={<FacultyGuard requiredRole="faculty" />}>
          <Route path="dashboard" element={<FacultyDashboard />} />
        </Route>

        <Route path="/student" element={<StudentGuard requiredRole="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
