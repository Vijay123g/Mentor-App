import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import courseService from '../../services/courseService';

const CourseDetails: React.FC = () => {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const courses = await courseService.getCourses();
      setCourseList(courses);
    } catch (error) {
      setError('Error fetching courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Course Details</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Timings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseList.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.location}</TableCell>
                <TableCell>{course.timings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseDetails;
