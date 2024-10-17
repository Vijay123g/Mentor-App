import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/navigation.css';
const Navigation: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [dashboardTitle, setDashboardTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setDashboardTitle(`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Link to="/" className="app-name">MentorApp</Link>
        {dashboardTitle && <span className="dashboard-title">{dashboardTitle}</span>}
      </div>
      <div className="toolbar-right">
        {isAuthenticated && userRole === 'Admin' && <Link to="/admin/dashboard">Admin</Link>}
        {isAuthenticated && userRole === 'Faculty' && <Link to="/faculty/dashboard">Faculty</Link>}
        {isAuthenticated && userRole === 'Student' && <Link to="/student/dashboard">Student</Link>}
        <span className="icons">
          <i className="material-icons">search</i>
          <i className="material-icons">notifications</i>
          <i className="material-icons">account_circle</i>
        </span>
        {isAuthenticated ? (
          <button onClick={logout}>
            <i className="material-icons">logout</i>
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;
