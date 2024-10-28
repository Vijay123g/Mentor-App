import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert
} from '@mui/material';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    authService.login(data).then((response) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        navigate(response.role === 'Admin' ? '/admin' : response.role === 'Faculty' ? '/faculty' : '/student');
      } else {
        setErrorMessage('Invalid credentials, please try again.');
      }
    }).catch((error) => {
      setErrorMessage('Login failed: ' + error.message);
    });
  };

  return (
    <Box 
      display="flex" 
      height="100vh" 
      alignItems="center" 
      justifyContent="center" 
      bgcolor="#f5f5f5" 
      padding={2}
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        width="100%" 
        maxWidth="300px"
        bgcolor="white" 
        borderRadius={2} 
        boxShadow={2} 
        padding={3}
      >
        <Typography variant="h4" gutterBottom>
          Login! 👋
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please Enter your Credentials.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />

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

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ marginTop: 2 }}
          >
            Log In
          </Button>
        </form>

        {errorMessage && <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>}

        <Typography variant="body2" sx={{ marginTop: 2 }}>
          If you are a student, <Link href="/signup">Sign Up Now</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
