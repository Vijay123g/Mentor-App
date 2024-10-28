import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import registrationService from '../../services/registrationService';
import { Card, CardContent, Button, Grid, Typography, Box } from '@mui/material';

const RegisterCourse: React.FC = () => {
    const [coursesList, setCoursesList] = useState<any[]>([]);
    const [registeredCourses, setRegisteredCourses] = useState<number[]>([]);

    useEffect(() => {
        const studentId = localStorage.getItem('userId') || '';
        courseService.getCourses()
            .then(response => setCoursesList(response))
            .catch(error => console.error('Error fetching courses:', error));

        registrationService.getDetailedRegistrationsByStudent(studentId)
            .then(response => {
                const registeredIds = response.registrations.map((registration: any) => registration.course_id);
                setRegisteredCourses(registeredIds);
            })
            .catch(error => console.error('Error fetching detailed registrations:', error));
    }, []);

    const registerForCourse = (courseId: number) => {
        const studentId = localStorage.getItem('userId') || '';
        registrationService.registerCourse(studentId, courseId)
            .then(() => {
                alert('Successfully registered!');
                setRegisteredCourses([...registeredCourses, courseId]);
            })
            .catch(error => console.error('Error registering for course:', error));
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Available Courses</Typography>
            <Grid container spacing={3}>
                {coursesList.map(course => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">{course.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                                <Typography variant="subtitle1" gutterBottom>Faculty: {course.name}</Typography>
                                <Box mt={2}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => registerForCourse(course.id)} 
                                        disabled={registeredCourses.includes(course.id)}
                                    >
                                        {registeredCourses.includes(course.id) ? 'Registered' : 'Register'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default RegisterCourse;
