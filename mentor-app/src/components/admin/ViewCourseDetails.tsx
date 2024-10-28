import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import CourseService from '../../services/courseService';

interface NewCourse {
  title: string;
  description: string;
  facultyId: string;
}

const CourseDetails: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<NewCourse>();
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleAddCourse = () => setIsAddingCourse(!isAddingCourse);

  const fetchCourses = async () => {
    try {
      const response = await CourseService.getAssignedCourses();
      setCourseList(response);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses');
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await CourseService.getFacultyDetails();
      setFacultyList(response);
    } catch (error) {
      console.error('Error fetching faculty details:', error);
      setError('Error fetching faculty details');
    }
  };

  const createCourse: SubmitHandler<NewCourse> = async (newCourse) => {
    try {
      await CourseService.createCourse(newCourse);
      fetchCourses();
      reset();
      setIsAddingCourse(false);
      setSuccess('Course created successfully!');
      setError('');
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Error creating course');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFaculties();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Course Details
      </Typography>
      <Button variant="contained" onClick={toggleAddCourse}>
        Add New Course
      </Button>

      {isAddingCourse && (
        <Box sx={{ marginTop: 2 }}>
          <form onSubmit={handleSubmit(createCourse)}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('title', { required: true })}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('description', { required: true })}
            />
            <Select
              label="Faculty"
              variant="outlined"
              fullWidth 
              {...register('facultyId', { required: true })}
            >
              {facultyList.map((faculty: any) => (
                <MenuItem key={faculty.user_id} value={faculty.user_id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Create Course
            </Button>
          </form>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assigned Faculty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseList.map((course: any) => (
              <TableRow key={course.id}>
                <TableCell>{course.course_title}</TableCell>
                <TableCell>{course.course_description}</TableCell>
                <TableCell>{course.faculty_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseDetails;
