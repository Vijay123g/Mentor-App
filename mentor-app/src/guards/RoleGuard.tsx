  import React from 'react';
  import { Navigate, Outlet } from 'react-router-dom';

  interface RoleGuardProps {
    requiredRole: string;
  }

  export const AdminGuard: React.FC<RoleGuardProps> = ({ requiredRole }) => {
    const role = localStorage.getItem('role');
    return role === requiredRole ? <Outlet /> : <Navigate to="/login" />;
  };

  export const FacultyGuard: React.FC<RoleGuardProps> = ({ requiredRole }) => {
    const role = localStorage.getItem('role');
    return role === requiredRole ? <Outlet /> : <Navigate to="/login" />;
  };

  export const StudentGuard: React.FC<RoleGuardProps> = ({ requiredRole }) => {
    const role = localStorage.getItem('role');
    return role === requiredRole ? <Outlet /> : <Navigate to="/login" />;
  };
