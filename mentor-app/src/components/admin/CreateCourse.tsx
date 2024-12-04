import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import courseService from '../../services/courseService';

interface CourseFormData {
  courseName: string;
  description: string;
  semester: number;
  slotsAvailable: number; 
  location: string;
  timings: string;
}

const CreateCourse: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CourseFormData>();

  const onSubmit: SubmitHandler<CourseFormData> = async (data) => {
    try {
      await courseService.createCourse(data);
      alert('Course created successfully!');
      reset();
    } catch (error) {
      alert('Failed to create course. Please try again.');
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Course Name"
        {...register('courseName', { required: 'Course name is required' })}
        error={!!errors.courseName}
      />
      <TextField
        label="Description"
        {...register('description', { required: 'Description is required' })}
        error={!!errors.description}
      />
      <TextField
        label="Semester"
        type="number"
        {...register('semester', { required: 'Semester is required' })}
        error={!!errors.semester}
      />
      <TextField
        label="Slots Available"
        type="number"
        {...register('slotsAvailable', { required: 'Slots available is required' })} 
        error={!!errors.slotsAvailable}
      />
      <TextField
        label="Location"
        {...register('location', { required: 'Location is required' })}
        error={!!errors.location}
      />
      <TextField
        label="Timings"
        {...register('timings', { required: 'Timings are required' })} 
        error={!!errors.timings}
      />
      <Button type="submit" variant="contained" color="primary">Create Course</Button>
    </Box>
  );
};

export default CreateCourse;
