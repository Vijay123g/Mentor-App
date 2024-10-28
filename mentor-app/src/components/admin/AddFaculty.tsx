import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import authService from "../../services/AuthService";
import { AxiosError } from 'axios';

const AddFaculty: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSubmit = async (data: any) => {
    const formData = { ...data, role: 'Faculty' };
    setErrorMessage(null);

    try {
        await authService.createFaculty(data);
        alert('Faculty added successfully!');
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response) {
            setErrorMessage(error.response.status === 422 
                ? 'Failed to add faculty. Please check the input.'
                : 'Something went wrong. Please try again later.');
        } else {
            setErrorMessage('Something went wrong. Please try again later.');
        }
    }
  };

  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined;
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, backgroundColor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>Add Faculty</Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            fullWidth 
            label="Name" 
            {...register('name', { required: 'Name is required' })} 
            error={!!errors.name} 
            helperText={(errors.name as any)?.message}
            sx={{ mb: 2 }} 
          />
          <TextField 
            fullWidth 
            label="Email" 
            {...register('email', { 
              required: 'Email is required', 
              pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' }
            })} 
            error={!!errors.email} 
            helperText={(errors.email as any)?.message} 
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} 
            error={!!errors.password} 
            helperText={(errors.password as any)?.message} 
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Faculty
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddFaculty;
