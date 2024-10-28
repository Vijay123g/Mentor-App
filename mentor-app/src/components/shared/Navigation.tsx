import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/navigation.css';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';

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
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
            MentorApp
          </Typography>
          {dashboardTitle && (
            <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
              {dashboardTitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* <IconButton color="inherit">
            <SearchIcon />
          </IconButton> */}
          {/* <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton> */}
          {isAuthenticated ? (
            <Button onClick={logout} variant="contained" color="secondary" sx={{ color: 'black' }}>
              Logout
            </Button>
          ) : (
            <>
              <Button component={Link} to="/login" variant="text" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/signup" variant="text" color="inherit">
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
