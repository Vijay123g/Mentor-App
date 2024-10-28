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

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  role: string;
}

const Signup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
    defaultValues: { role: 'Student' }
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupFormInputs> = (data) => {
    data.role = 'Student';
    authService.signup(data).then(response => {
      if (response) {
        setSuccessMessage('You have successfully signed up!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    }).catch(() => {
      setErrorMessage('Signup failed: Server error or invalid data');
    });
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      bgcolor="#f5f5f5"
    >
      <Box 
        bgcolor="white" 
        padding={3} 
        borderRadius={2} 
        boxShadow={2} 
        maxWidth="400px" 
        width="100%"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up! 👋
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Create your account by filling in the details below.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', { 
              required: 'Email is required', 
              pattern: { 
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 
                message: 'Invalid email address'
              } 
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
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
            Sign Up
          </Button>
        </form>

        {errorMessage && <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ marginTop: 2 }}>{successMessage}</Alert>}

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Already have an account? <Link href="/login">Log In</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
