import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import courseService from '../../services/courseService';
import {jwtDecode} from 'jwt-decode';
import '../../styles/FacultyCourses.css';

const FacultyCourses: React.FC = () => {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      let decodedToken: any;
        try {

        decodedToken = jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        setErrorMessage('Failed to decode token. Please login again.');
        return;
      }

      const facultyId = decodedToken.userId;

      if (!facultyId) {
        setErrorMessage('Faculty ID not found in token. Please login again.');
        return;
      }


      courseService
        .getFacultyCourseList(facultyId)
        .then((response) => {
          const courses = response.courses || [];
          setCourseList(courses);
        })
        .catch((error) => {
          console.error('Error fetching faculty courses:', error);
          setErrorMessage('Failed to fetch courses. Please try again later.');
        });
    } else {
      setErrorMessage('No token found. Please login.');
    }
  }, []);

  return (
    <div className="faculty-courses-container">
      <Typography variant="h5" gutterBottom>
        Assigned Courses
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {courseList.length > 0 ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Faculty Name</TableCell>
                <TableCell>Faculty Email</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseList.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.courseId.courseName}</TableCell>
                  <TableCell>{course.courseId.description}</TableCell>
                  <TableCell>{course.courseId.semester}</TableCell>
                  <TableCell>{course.facultyId.name}</TableCell>
                  <TableCell>{course.facultyId.email}</TableCell>
                  <TableCell>{new Date(course.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : !errorMessage ? (
        <Typography variant="body1">No courses assigned.</Typography>
      ) : null}
    </div>
  );
};

export default FacultyCourses;
