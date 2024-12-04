import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import { Box, Typography, TextField, Button, Link, Alert } from '@mui/material';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  mobile: string;
  roles?: string[];
}

const Signup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
    defaultValues: { roles: ["student"] }
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupFormInputs> = (data) => {
    const signupData = { ...data, roles: ["student"] }; 

    authService.signup(signupData)
      .then(response => {
        setSuccessMessage('User registered successfully');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => {
        setErrorMessage('Signup failed: Server error or invalid data');
      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Box bgcolor="white" padding={3} borderRadius={2} boxShadow={2} maxWidth="400px" width="100%">
        <Typography variant="h4" align="center" gutterBottom>Sign Up</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('name', { required: 'Name is required' })}
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
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } 
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
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <TextField
            label="Mobile"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('mobile', { required: 'Mobile number is required' })}
            error={!!errors.mobile}
            helperText={errors.mobile ? errors.mobile.message : ''}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
        </form>
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
        <Typography variant="body2" sx={{ mt: 2 }}>Already have an account? <Link href="/login">Log In</Link></Typography>
      </Box>
    </Box>
  );
};

export default Signup;
