import React, { useEffect, useState } from 'react';
import authService from '../../services/AuthService';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import courseService from 'services/courseService';
import { useNavigate } from 'react-router-dom'; 

const DefaultAdminComponent: React.FC = () => {
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountsAndCourses = async () => {
      try {
        const faculty = await authService.getFacultyCount();
        const student = await authService.getStudentCount();
        const assignedCourses = await courseService.getAssignedCourses();

        setFacultyCount(faculty);
        setStudentCount(student);
        setCourses(assignedCourses);
        setCourseCount(assignedCourses.length);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchCountsAndCourses();
  }, []);

  return (
    <Grid container spacing={3} sx={{ marginTop: '20px' }}>
      {/* Faculty Card */}
      <Grid item xs={12} sm={4}>
        <Card onClick={() => navigate('/viewFaculty')} style={{ cursor: 'pointer' }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">Total Faculty</Typography>
            <Typography variant="h4" color="primary">{facultyCount}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Students Card */}
      <Grid item xs={12} sm={4}>
        <Card onClick={() => navigate('/viewStudents')} style={{ cursor: 'pointer' }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">Total Students</Typography>
            <Typography variant="h4" color="primary">{studentCount}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Courses Card */}
      <Grid item xs={12} sm={4}>
        <Card onClick={() => navigate('/viewCourses')} style={{ cursor: 'pointer' }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">Total Courses</Typography>
            <Typography variant="h4" color="primary">{courseCount}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {}
      <Grid item xs={12}>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Assigned Courses
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Course Name</Typography></TableCell>
                <TableCell><Typography variant="h6">Semester</Typography></TableCell>
                <TableCell><Typography variant="h6">Description</Typography></TableCell>
                <TableCell><Typography variant="h6">Faculty Name</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.courseId.courseName}</TableCell>
                  <TableCell>{course.courseId.semester}</TableCell>
                  <TableCell>{course.courseId.description}</TableCell>
                  <TableCell>{course.facultyId.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default DefaultAdminComponent;
