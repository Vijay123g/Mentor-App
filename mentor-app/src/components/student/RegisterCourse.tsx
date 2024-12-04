import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import registrationService from '../../services/registrationService';
import { Card, CardContent, Button, Grid, Typography, Box } from '@mui/material';

const RegisterCourse: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<{ facultyCourseId: string; registrationId: number }[]>([]);

  useEffect(() => {
    const studentId = localStorage.getItem('userId') || '';

    courseService.getDetailedFacultyCourseList()
      .then(response => {
        if (response.assignments && Array.isArray(response.assignments)) {
          setCoursesList(response.assignments);
        } else {
          console.error('Unexpected response structure:', response);
        }
      })
      .catch(error => console.error('Error fetching courses:', error));

    registrationService.getDetailedRegistrationsByStudent(studentId)
      .then(response => {
        const registrations = response.registrations.map((registration: any) => ({
          facultyCourseId: registration.facultyCourseId,
          registrationId: registration.registrationId,
        }));
        setRegisteredCourses(registrations);
      })
      .catch(error => console.error('Error fetching detailed registrations:', error));
  }, []);

  const registerForCourse = (facultyCourseId: string) => {
    const studentId = localStorage.getItem('userId');
    const currentDate = new Date().toISOString().split('T')[0];

    if (!studentId || !facultyCourseId) {
      console.error('Missing required data:', { studentId, facultyCourseId });
      alert('Cannot register for course. Missing required information.');
      return;
    }

    registrationService
      .registerCourse(studentId, facultyCourseId, currentDate)
      .then((response) => {
        alert('Successfully registered!');
        setRegisteredCourses([...registeredCourses, { facultyCourseId, registrationId: response.registrationId }]);
      })
      .catch((error) => {
        console.error('Error registering for course:', error);
        alert(error.response?.data?.error || 'Failed to register for the course.');
      });
  };

  const dropCourse = (facultyCourseId: string) => {
    const registration = registeredCourses.find((reg) => reg.facultyCourseId === facultyCourseId);

    if (registration) {
      registrationService
        .dropCourse(registration.registrationId)
        .then(() => {
          alert('Successfully dropped course!');
          setRegisteredCourses(registeredCourses.filter(reg => reg.facultyCourseId !== facultyCourseId));
        })
        .catch(error => {
          console.error('Error dropping course:', error);
          alert('An unexpected error occurred while dropping the course.');
        });
    } else {
      alert('Unable to find registration for this course.');
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Available Courses</Typography>
      <Grid container spacing={3}>
        {coursesList.length > 0 ? (
          coursesList.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>{course.courseId.courseName}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">Instructor: {course.facultyId.name}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">Semester: {course.courseId.semester}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">Slots Available: {course.courseId.slotsAvailable}</Typography>
                  <Typography variant="body2" color="textSecondary">{course.courseId.description}</Typography>

                  <Box mt={2}>
                    {registeredCourses.some((reg) => reg.facultyCourseId === course._id) ? (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => dropCourse(course._id)}
                      >
                        Drop Course
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => registerForCourse(course._id)}
                      >
                        Register
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No available courses at the moment.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default RegisterCourse;
