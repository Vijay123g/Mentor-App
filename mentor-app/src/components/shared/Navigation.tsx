import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/navigation.css';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
      <div className="header">
        <div> <SearchIcon /></div>
        <div> <NotificationsIcon /></div>
        <div> <AccountCircleIcon /></div>
     
     
     
    </div>
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
