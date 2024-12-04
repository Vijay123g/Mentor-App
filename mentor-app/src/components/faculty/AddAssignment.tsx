import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from '@mui/material';
import courseService from '../../services/courseService';
import assignmentService from '../../services/assignmentService';

const AddAssignment: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [assignmentName, setAssignmentName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | string>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [score, setScore] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const facultyId = localStorage.getItem('userId') || '';
      const response = await courseService.getFacultyCourseList(facultyId);
      setCourses(response.courses);
    };
    fetchCourses();
  }, []);

  const handleAddAssignment = async () => {
    try {
      const facultyId = localStorage.getItem('userId') || '';
      const assignmentData = {
        courseId: selectedCourse,
        facultyId,
        assignmentName,
        expiryDate,
        score,
      };
      await assignmentService.addAssignment(assignmentData);
      alert('Assignment added successfully!');
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Add Assignment</Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label="Course"
            >
              {courses.map(course => (
                <MenuItem key={course.courseId._id} value={course.courseId._id}>
                  {course.courseId.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        <TextField
          label="Assignment Name"
          fullWidth
          value={assignmentName}
          onChange={(e) => setAssignmentName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Expiry Date"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Score"
          type="number"
          fullWidth
          value={score}
          onChange={(e) => setScore(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" onClick={handleAddAssignment}>
          Add Assignment
        </Button>
      </Paper>
    </Container>
  );
};

export default AddAssignment;
