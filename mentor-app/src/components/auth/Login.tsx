import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import { Box, Typography, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from '@mui/material';

interface LoginFormInputs {
  email: string;
  password: string;
  otp: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [isOtp, setIsOtp] = useState(false); 
  const [otpSent, setOtpSent] = useState(false); 
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    if (isOtp) {
      authService.verifyOtp({ email: data.email, otp: data.otp }).then((response) => {
        if (response.token) {
          handlePostLogin(response.token);
        } else {
          setErrorMessage('Invalid OTP.');
        }
      }).catch((error: Error) => {
        setErrorMessage('OTP verification failed: ' + error.message);
      });
    } else {
      authService.login(data).then((response) => {
        if (response.token) {
          handlePostLogin(response.token);
        } else {
          setErrorMessage('Invalid credentials, please try again.');
        }
      }).catch((error: Error) => {
        setErrorMessage('Login failed: ' + error.message);
      });
    }
  };


  const handlePostLogin = (token: string) => {
    localStorage.setItem('token', token);
    const decodedToken = decodeJWT(token);
    localStorage.setItem('userId', decodedToken.userId);
  
    if (decodedToken.roles) {
      const rolesArray = Array.isArray(decodedToken.roles)
        ? decodedToken.roles
        : decodedToken.roles.split(',');
      handleRoleSelection(rolesArray);
    } else {
      setErrorMessage('No roles found in token.');
    }
  };
  
  const decodeJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  const handleRoleSelection = (rolesArray: string[]) => {
    if (rolesArray.length > 1) {
      setRoles(rolesArray);
      setShowRoleDialog(true);
    } else if (rolesArray.length === 1) {
      localStorage.setItem('role', rolesArray[0]);
      navigateToDashboard(rolesArray[0]);
    } else {
      setErrorMessage('No roles found for the user.');
    }
  };

  const navigateToDashboard = (role: string) => {
    const redirectPath = role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student';
    navigate(redirectPath);
  };

  const handleRoleSelectionAction = () => {
    if (selectedRole) {
      localStorage.setItem('role', selectedRole);
      setShowRoleDialog(false);
      navigateToDashboard(selectedRole);
    }
  };

  const handleOtpRequest = () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    if (email) {
      authService.generateOtp({ email }).then(() => { 
        setOtpSent(true);
      }).catch((error: Error) => {
        setErrorMessage('OTP request failed: ' + error.message);
      });
    }
  };
  
  const toggleLoginMode = () => {
    setIsOtp(!isOtp); 
    setOtpSent(false);
  };

  return (
    <Box display="flex" height="100vh" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth="300px" bgcolor="white" borderRadius={2} boxShadow={2} padding={3}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          {isOtp ? (
            <>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('otp', { required: 'OTP is required' })}
                error={!!errors.otp}
                helperText={errors.otp ? errors.otp.message : ''}
              />
              <Button
                onClick={handleOtpRequest}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={otpSent}
              >
                {otpSent ? 'OTP Sent' : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {isOtp ? 'Verify OTP' : 'Log In'}
          </Button>
          <Button
            onClick={toggleLoginMode}
            color="secondary"
            sx={{ mt: 2 }}
          >
            {isOtp ? 'Login with Email and Password' : 'Login with OTP'}
          </Button>
        </form>
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

        <Dialog open={showRoleDialog} onClose={() => setShowRoleDialog(false)}>
          <DialogTitle>Select Role</DialogTitle>
          <DialogContent>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              fullWidth
            >
              {roles.map((role, index) => (
                <MenuItem key={index} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRoleSelectionAction} color="primary" variant="contained" disabled={!selectedRole}>
              Go to Dashboard
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="body2" sx={{ mt: 2 }}>
  Don't have an account? <Link to="/signup">Sign Up</Link>
</Typography>
      </Box>
    </Box>
  );
};

export default Login;
